import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Check admin role
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const targetTable = formData.get('table') as string

        if (!file || !targetTable) {
            return NextResponse.json({
                success: false,
                error: 'File and target table are required'
            }, { status: 400 })
        }

        // Validate target table
        const allowedTables = ['courses', 'skills', 'careers', 'jobs']
        if (!allowedTables.includes(targetTable)) {
            return NextResponse.json({
                success: false,
                error: `Invalid table. Allowed: ${allowedTables.join(', ')}`
            }, { status: 400 })
        }

        // Read CSV file
        const text = await file.text()
        const lines = text.trim().split('\n')

        if (lines.length < 2) {
            return NextResponse.json({
                success: false,
                error: 'CSV must have header row + at least 1 data row'
            }, { status: 400 })
        }

        // Parse CSV
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase())
        const rows: Record<string, string>[] = []
        const errors: string[] = []

        for (let i = 1; i < lines.length; i++) {
            try {
                const values = parseCSVLine(lines[i])
                const row: Record<string, string> = {}
                headers.forEach((header, idx) => {
                    row[header] = values[idx]?.trim().replace(/"/g, '') || ''
                })
                rows.push(row)
            } catch (e) {
                errors.push(`Row ${i + 1}: Parse error`)
            }
        }

        if (rows.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No valid rows found in CSV'
            }, { status: 400 })
        }

        // Map CSV data to table schema
        const mappedRows = rows.map(row => mapToSchema(row, targetTable))

        // Insert into Supabase
        const { data: inserted, error: insertError } = await supabase
            .from(targetTable)
            .insert(mappedRows)
            .select()

        if (insertError) {
            return NextResponse.json({
                success: false,
                error: `Database insert error: ${insertError.message}`,
                details: insertError
            }, { status: 500 })
        }

        // Log the admin action
        await supabase.from('admin_audit_logs').insert({
            admin_id: user.id,
            action: 'bulk_upload',
            target_type: targetTable,
            details: {
                filename: file.name,
                rowsUploaded: inserted?.length || rows.length,
                parseErrors: errors.length
            }
        })

        return NextResponse.json({
            success: true,
            message: `Successfully uploaded ${inserted?.length || rows.length} rows to ${targetTable}`,
            totalRows: lines.length - 1,
            insertedRows: inserted?.length || rows.length,
            parseErrors: errors,
            data: inserted?.slice(0, 5) // Preview first 5 rows
        })

    } catch (error) {
        console.error('Bulk upload error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to process bulk upload' },
            { status: 500 }
        )
    }
}

// Simple CSV line parser (handles quoted fields)
function parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
            inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
            result.push(current)
            current = ''
        } else {
            current += char
        }
    }
    result.push(current)
    return result
}

// Map generic CSV row to table-specific schema
function mapToSchema(row: Record<string, string>, table: string): Record<string, unknown> {
    switch (table) {
        case 'courses':
            return {
                title: row.title || row.name || '',
                description: row.description || '',
                provider: row.provider || row.source || 'Unknown',
                url: row.url || row.link || '',
                duration_hours: parseFloat(row.duration_hours || row.duration || '0') || null,
                difficulty_level: row.difficulty_level || row.difficulty || 'beginner',
                is_free: row.is_free === 'true' || row.price === '0' || row.is_free === '1',
                skills_taught: row.skills ? row.skills.split(';').map((s: string) => s.trim()) : []
            }
        case 'skills':
            return {
                name: row.name || row.title || '',
                category: row.category || 'General',
                description: row.description || ''
            }
        case 'careers':
            return {
                title: row.title || row.name || '',
                description: row.description || '',
                industry: row.industry || row.category || 'General',
                salary_min: parseInt(row.salary_min || '0') || null,
                salary_max: parseInt(row.salary_max || '0') || null,
                demand_level: row.demand_level || 'medium'
            }
        case 'jobs':
            return {
                title: row.title || row.position || '',
                company: row.company || '',
                location: row.location || 'Remote',
                description: row.description || '',
                salary_min: parseInt(row.salary_min || '0') || null,
                salary_max: parseInt(row.salary_max || '0') || null,
                job_type: row.job_type || row.type || 'full-time',
                experience_level: row.experience_level || 'entry',
                is_active: true
            }
        default:
            return row
    }
}
