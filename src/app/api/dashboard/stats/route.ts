import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const userId = user.id

        // Fetch all dashboard stats in parallel
        const [
            userSkillsResult,
            userCoursesResult,
            completedCoursesResult,
            jobApplicationsResult,
            moodResult,
            xpResult,
            notificationsResult,
            achievementsResult
        ] = await Promise.all([
            // User skills count
            supabase.from('user_skills').select('id', { count: 'exact', head: true }).eq('user_id', userId),
            // Enrolled courses
            supabase.from('user_courses').select('id', { count: 'exact', head: true }).eq('user_id', userId),
            // Completed courses
            supabase.from('user_courses').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'completed'),
            // Job applications
            supabase.from('job_applications').select('id', { count: 'exact', head: true }).eq('user_id', userId),
            // Latest mood
            supabase.from('mood_entries').select('mood_level, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(1),
            // User XP and level
            supabase.from('users').select('total_xp, level').eq('id', userId).single(),
            // Unread notifications
            supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('is_read', false),
            // Achievements
            supabase.from('user_achievements').select('id', { count: 'exact', head: true }).eq('user_id', userId)
        ])

        // Calculate career readiness (based on skills)
        const { data: userCareers } = await supabase
            .from('user_careers')
            .select('career_id, careers(title)')
            .eq('user_id', userId)
            .eq('is_primary', true)
            .limit(1)

        let careerReadiness = 0
        let targetCareer = 'Belum dipilih'

        if (userCareers && userCareers.length > 0) {
            targetCareer = (userCareers[0] as any).careers?.title || 'Unknown'
            // Simple readiness calculation
            const skillCount = userSkillsResult.count || 0
            const coursesDone = completedCoursesResult.count || 0
            careerReadiness = Math.min(Math.round((skillCount * 10 + coursesDone * 15)), 100)
        }

        return NextResponse.json({
            success: true,
            stats: {
                skills: userSkillsResult.count || 0,
                enrolledCourses: userCoursesResult.count || 0,
                completedCourses: completedCoursesResult.count || 0,
                applications: jobApplicationsResult.count || 0,
                latestMood: moodResult.data?.[0]?.mood_level || null,
                totalXp: xpResult.data?.total_xp || 0,
                level: xpResult.data?.level || 1,
                unreadNotifications: notificationsResult.count || 0,
                achievements: achievementsResult.count || 0,
                careerReadiness,
                targetCareer
            }
        })

    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stats' },
            { status: 500 }
        )
    }
}
