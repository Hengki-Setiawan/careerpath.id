import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch all user data
        const [
            profileResult,
            skillsResult,
            careersResult,
            coursesResult,
            certificatesResult,
            applicationsResult,
            moodResult,
            targetsResult
        ] = await Promise.all([
            // Profile
            supabase.from('users').select('*').eq('id', user.id).single(),
            // Skills
            supabase.from('user_skills').select(`
                proficiency_level, progress_percentage, updated_at,
                skills (name, category)
            `).eq('user_id', user.id),
            // Careers
            supabase.from('user_careers').select(`
                match_percentage, is_primary,
                careers (title, description)
            `).eq('user_id', user.id),
            // Courses
            supabase.from('user_courses').select(`
                status, progress_percentage, started_at, completed_at,
                courses (title, provider)
            `).eq('user_id', user.id),
            // Certificates
            supabase.from('certificates').select('*').eq('user_id', user.id),
            // Job Applications
            supabase.from('job_applications').select(`
                status, applied_at, notes,
                jobs (title, company, location)
            `).eq('user_id', user.id),
            // Mood Entries
            supabase.from('mood_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
            // Monthly Targets
            supabase.from('monthly_targets').select('*').eq('user_id', user.id)
        ])

        const exportData = {
            exportInfo: {
                exportedAt: new Date().toISOString(),
                userId: user.id,
                email: user.email,
                format: 'JSON',
                version: '1.0'
            },
            profile: profileResult.data,
            skills: skillsResult.data?.map(s => ({
                name: (s.skills as any)?.name,
                category: (s.skills as any)?.category,
                proficiency: s.proficiency_level,
                progress: s.progress_percentage,
                updatedAt: s.updated_at
            })),
            careers: careersResult.data?.map(c => ({
                title: (c.careers as any)?.title,
                description: (c.careers as any)?.description,
                matchPercentage: c.match_percentage,
                isPrimary: c.is_primary
            })),
            learningHistory: coursesResult.data?.map(c => ({
                courseTitle: (c.courses as any)?.title,
                provider: (c.courses as any)?.provider,
                status: c.status,
                progress: c.progress_percentage,
                startedAt: c.started_at,
                completedAt: c.completed_at
            })),
            certificates: certificatesResult.data,
            jobApplications: applicationsResult.data?.map(a => ({
                jobTitle: (a.jobs as any)?.title,
                company: (a.jobs as any)?.company,
                location: (a.jobs as any)?.location,
                status: a.status,
                appliedAt: a.applied_at,
                notes: a.notes
            })),
            wellnessData: {
                moodEntries: moodResult.data
            },
            goals: {
                monthlyTargets: targetsResult.data
            }
        }

        // Return as downloadable JSON
        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="careerpath-data-${user.id.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.json"`
            }
        })

    } catch (error) {
        console.error('Error exporting user data:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to export data' },
            { status: 500 }
        )
    }
}
