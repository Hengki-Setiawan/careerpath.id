import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
        }

        // Fetch analytics data
        const [
            usersResult,
            coursesResult,
            userCoursesResult,
            jobsResult,
            applicationsResult,
            moodResult,
            userCareersResult,
            userSkillsResult
        ] = await Promise.all([
            // Total users
            supabase.from('users').select('id, created_at', { count: 'exact' }),
            // Total courses
            supabase.from('courses').select('id', { count: 'exact' }),
            // Completed courses
            supabase.from('user_courses').select('id', { count: 'exact' }).eq('status', 'completed'),
            // Total jobs
            supabase.from('jobs').select('id', { count: 'exact' }),
            // Job applications
            supabase.from('job_applications').select('id', { count: 'exact' }),
            // Mood entries for average
            supabase.from('mood_entries').select('mood_level'),
            // User careers for top careers
            supabase.from('user_careers').select('careers(title)'),
            // User skills for top skills
            supabase.from('user_skills').select('skills(name)')
        ])

        // Calculate active users (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const { count: activeUsersCount } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
            .gte('updated_at', thirtyDaysAgo.toISOString())

        // Calculate average mood score
        const avgMood = moodResult.data?.length
            ? moodResult.data.reduce((acc, m) => acc + (m.mood_level || 0), 0) / moodResult.data.length
            : 0

        // Count top careers
        const careerCounts: Record<string, number> = {}
        userCareersResult.data?.forEach((uc: any) => {
            const title = uc.careers?.title
            if (title) {
                careerCounts[title] = (careerCounts[title] || 0) + 1
            }
        })
        const topCareers = Object.entries(careerCounts)
            .map(([title, count]) => ({ title, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        // Count top skills
        const skillCounts: Record<string, number> = {}
        userSkillsResult.data?.forEach((us: any) => {
            const name = us.skills?.name
            if (name) {
                skillCounts[name] = (skillCounts[name] || 0) + 1
            }
        })
        const topSkills = Object.entries(skillCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        return NextResponse.json({
            success: true,
            data: {
                totalUsers: usersResult.count || 0,
                activeUsers: activeUsersCount || 0,
                totalCourses: coursesResult.count || 0,
                completedCourses: userCoursesResult.count || 0,
                totalJobs: jobsResult.count || 0,
                applications: applicationsResult.count || 0,
                avgMoodScore: Number(avgMood.toFixed(1)),
                topCareers,
                topSkills,
                generatedAt: new Date().toISOString()
            }
        })

    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
