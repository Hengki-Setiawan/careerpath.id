import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')?.trim()

        if (!query || query.length < 2) {
            return NextResponse.json({
                success: false,
                error: 'Search query must be at least 2 characters'
            }, { status: 400 })
        }

        const searchTerm = `%${query}%`

        // Search across multiple tables in parallel
        const [
            careersResult,
            coursesResult,
            jobsResult,
            skillsResult
        ] = await Promise.all([
            supabase
                .from('careers')
                .select('id, title, description, industry')
                .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
                .limit(5),
            supabase
                .from('courses')
                .select('id, title, description, provider')
                .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
                .limit(5),
            supabase
                .from('jobs')
                .select('id, title, company, location')
                .or(`title.ilike.${searchTerm},company.ilike.${searchTerm}`)
                .limit(5),
            supabase
                .from('skills')
                .select('id, name, category')
                .or(`name.ilike.${searchTerm},category.ilike.${searchTerm}`)
                .limit(5)
        ])

        // Format results
        const results = [
            ...(careersResult.data || []).map(c => ({
                type: 'career' as const,
                id: c.id,
                title: c.title,
                subtitle: c.industry || '',
                href: '/dashboard/careers'
            })),
            ...(coursesResult.data || []).map(c => ({
                type: 'course' as const,
                id: c.id,
                title: c.title,
                subtitle: c.provider || '',
                href: '/dashboard/learning'
            })),
            ...(jobsResult.data || []).map(j => ({
                type: 'job' as const,
                id: j.id,
                title: j.title,
                subtitle: j.company || '',
                href: '/dashboard/jobs'
            })),
            ...(skillsResult.data || []).map(s => ({
                type: 'skill' as const,
                id: s.id,
                title: s.name,
                subtitle: s.category || '',
                href: '/dashboard/skills'
            }))
        ]

        return NextResponse.json({
            success: true,
            query,
            results,
            totalResults: results.length
        })

    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { success: false, error: 'Search failed' },
            { status: 500 }
        )
    }
}
