import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const format = searchParams.get('format') || 'json'
        const university = searchParams.get('university')

        // Gather data
        let query = supabaseAdmin
            .from('profiles')
            .select('full_name, university, major, status, career_target, total_xp, created_at, onboarding_completed')

        if (university) {
            query = query.eq('university', university)
        }

        const { data: profiles } = await query

        if (format === 'csv') {
            // Generate CSV report
            const headers = ['Nama', 'Universitas', 'Jurusan', 'Status', 'Target Karir', 'Total XP', 'Onboarding', 'Terdaftar']
            const rows = (profiles || []).map(p => [
                p.full_name || '',
                p.university || '',
                p.major || '',
                p.status || '',
                p.career_target || '',
                p.total_xp || 0,
                p.onboarding_completed ? 'Ya' : 'Tidak',
                p.created_at ? new Date(p.created_at).toLocaleDateString('id-ID') : ''
            ])

            const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n')

            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="careerpath-report-${Date.now()}.csv"`
                }
            })
        }

        // JSON report
        const totalStudents = profiles?.length || 0
        const activeUsers = profiles?.filter(p => p.onboarding_completed).length || 0
        const avgXp = totalStudents > 0
            ? Math.round((profiles || []).reduce((sum, p) => sum + (p.total_xp || 0), 0) / totalStudents)
            : 0

        return NextResponse.json({
            success: true,
            report: {
                generated_at: new Date().toISOString(),
                university: university || 'Semua',
                total_students: totalStudents,
                active_users: activeUsers,
                onboarding_rate: totalStudents > 0 ? Math.round((activeUsers / totalStudents) * 100) : 0,
                avg_xp: avgXp,
                data: profiles || []
            }
        })
    } catch (error) {
        console.error('B2B report error:', error)
        return NextResponse.json({ success: false, error: 'Failed to generate report' }, { status: 500 })
    }
}
