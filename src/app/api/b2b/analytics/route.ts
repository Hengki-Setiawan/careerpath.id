import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const university = searchParams.get('university')

        // Total users by university
        let usersQuery = supabaseAdmin
            .from('profiles')
            .select('university, major, status, career_target, total_xp, onboarding_completed, created_at')

        if (university) {
            usersQuery = usersQuery.eq('university', university)
        }

        const { data: profiles } = await usersQuery

        if (!profiles || profiles.length === 0) {
            return NextResponse.json({
                success: true,
                analytics: {
                    total_students: 0,
                    active_users: 0,
                    onboarding_rate: 0,
                    top_careers: [],
                    skill_gaps: [],
                    departments: [],
                    employability_score: 0,
                    recommendations: []
                }
            })
        }

        // Calculate analytics
        const totalStudents = profiles.length
        const onboardingCompleted = profiles.filter(p => p.onboarding_completed).length
        const onboardingRate = Math.round((onboardingCompleted / totalStudents) * 100)

        // Top career targets
        const careerCounts: Record<string, number> = {}
        profiles.forEach(p => {
            if (p.career_target) {
                careerCounts[p.career_target] = (careerCounts[p.career_target] || 0) + 1
            }
        })
        const topCareers = Object.entries(careerCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([career, count]) => ({ career, count, percentage: Math.round((count / totalStudents) * 100) }))

        // Department breakdown
        const deptCounts: Record<string, number> = {}
        profiles.forEach(p => {
            if (p.major) {
                deptCounts[p.major] = (deptCounts[p.major] || 0) + 1
            }
        })
        const departments = Object.entries(deptCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([major, count]) => ({ major, count }))

        // Get aggregate skill data
        const { data: skillStats } = await supabaseAdmin
            .from('user_skills')
            .select('skill:skills(name, category), current_level')

        const skillGaps: Record<string, { total: number; count: number }> = {}
        skillStats?.forEach((s: Record<string, unknown>) => {
            const skill = s.skill as { name: string; category: string } | null
            if (skill?.name) {
                if (!skillGaps[skill.name]) skillGaps[skill.name] = { total: 0, count: 0 }
                skillGaps[skill.name].total += (s.current_level as number) || 0
                skillGaps[skill.name].count += 1
            }
        })

        const topSkillGaps = Object.entries(skillGaps)
            .map(([name, data]) => ({
                skill: name,
                avg_level: Math.round((data.total / data.count) * 10) / 10,
                gap: Math.round((5 - data.total / data.count) * 10) / 10,
                students: data.count
            }))
            .sort((a, b) => b.gap - a.gap)
            .slice(0, 10)

        // Employability score
        const avgXp = profiles.reduce((sum, p) => sum + (p.total_xp || 0), 0) / totalStudents
        const employabilityScore = Math.min(Math.round((avgXp / 500) * 100), 100)

        // AI-style recommendations
        const recommendations = []
        if (topSkillGaps.length > 0) {
            recommendations.push(`${Math.round(topSkillGaps[0].gap * 20)}% mahasiswa perlu meningkatkan skill ${topSkillGaps[0].skill}`)
        }
        if (onboardingRate < 80) {
            recommendations.push(`Onboarding rate ${onboardingRate}% — dorong mahasiswa menyelesaikan assessment awal`)
        }
        if (topCareers.length > 0) {
            recommendations.push(`Karir paling diminati: ${topCareers[0].career} (${topCareers[0].percentage}%) — pertimbangkan workshop terkait`)
        }
        recommendations.push(`Rata-rata XP: ${Math.round(avgXp)} — target optimal: 500+ XP untuk job-ready`)

        return NextResponse.json({
            success: true,
            analytics: {
                total_students: totalStudents,
                active_users: onboardingCompleted,
                onboarding_rate: onboardingRate,
                top_careers: topCareers,
                skill_gaps: topSkillGaps,
                departments,
                employability_score: employabilityScore,
                avg_xp: Math.round(avgXp),
                recommendations
            },
            university: university || 'Semua Universitas'
        })
    } catch (error) {
        console.error('B2B analytics error:', error)
        return NextResponse.json({ success: false, error: 'Failed to generate analytics' }, { status: 500 })
    }
}
