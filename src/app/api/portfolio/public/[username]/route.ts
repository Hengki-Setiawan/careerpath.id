import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params
        const supabase = await createClient()

        // Find user by username (using full_name as username for now)
        // In production, you'd have a dedicated username field
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, full_name, avatar_url, bio, city, university, major')
            .ilike('full_name', username.replace(/-/g, ' '))
            .single()

        if (userError || !user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        // Fetch user skills
        const { data: skills } = await supabase
            .from('user_skills')
            .select(`
                proficiency_level,
                skills (name, category)
            `)
            .eq('user_id', user.id)
            .limit(12)

        // Fetch user projects
        const { data: projects } = await supabase
            .from('portfolio_projects')
            .select('id, title, description, image_url, project_url, technologies')
            .eq('user_id', user.id)
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .limit(6)

        // Fetch certificates
        const { data: certificates } = await supabase
            .from('certificates')
            .select('id, title, issuer, issue_date, image_url')
            .eq('user_id', user.id)
            .order('issue_date', { ascending: false })
            .limit(6)

        // Fetch career goals with match percentage
        const { data: careers } = await supabase
            .from('user_careers')
            .select(`
                match_percentage,
                careers (title)
            `)
            .eq('user_id', user.id)
            .order('match_percentage', { ascending: false })
            .limit(3)

        // Transform data
        const transformedSkills = skills?.map((s: any) => ({
            name: s.skills?.name || 'Unknown',
            proficiency_level: s.proficiency_level,
            category: s.skills?.category || 'Other'
        })) || []

        const transformedCareers = careers?.map((c: any) => ({
            title: c.careers?.title || 'Unknown',
            match_percentage: c.match_percentage || 0
        })) || []

        return NextResponse.json({
            success: true,
            portfolio: {
                user,
                skills: transformedSkills,
                projects: projects || [],
                certificates: certificates || [],
                careers: transformedCareers
            }
        })

    } catch (error) {
        console.error('Error fetching public portfolio:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch portfolio' },
            { status: 500 }
        )
    }
}
