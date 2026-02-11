import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch user's target career
        const { data: targetCareer } = await supabase
            .from('user_careers')
            .select(`
                match_percentage,
                careers (id, title, description)
            `)
            .eq('user_id', user.id)
            .eq('is_primary', true)
            .single()

        // Fetch user's current skills
        const { data: userSkills } = await supabase
            .from('user_skills')
            .select(`
                proficiency_level,
                progress_percentage,
                skills (id, name, category)
            `)
            .eq('user_id', user.id)

        // Fetch career required skills
        const careerId = (targetCareer?.careers as any)?.id
        let requiredSkills: any[] = []
        if (careerId) {
            const { data: careerSkills } = await supabase
                .from('career_skills')
                .select(`
                    importance_level,
                    skills (id, name, category)
                `)
                .eq('career_id', careerId)
            requiredSkills = careerSkills || []
        }

        // Find skill gaps
        const userSkillNames = userSkills?.map((s: any) => s.skills?.name?.toLowerCase()) || []
        const gapSkills = requiredSkills.filter((rs: any) =>
            !userSkillNames.includes(rs.skills?.name?.toLowerCase())
        )

        // Fetch available courses
        const { data: courses } = await supabase
            .from('courses')
            .select('id, title, description, provider, duration_hours, difficulty_level, skills_taught')
            .limit(50)

        // Build AI prompt for recommendations
        const prompt = `Kamu adalah AI Learning Advisor. Rekomendasikan course terbaik berdasarkan skill gap user.

TARGET KARIR: ${(targetCareer?.careers as any)?.title || 'Belum ditentukan'}

SKILL YANG DIMILIKI:
${userSkills?.map((s: any) => `- ${s.skills?.name} (Level: ${s.proficiency_level})`).join('\n') || 'Belum ada skill'}

SKILL YANG DIBUTUHKAN (GAP):
${gapSkills.map((s: any) => `- ${s.skills?.name} (Importance: ${s.importance_level})`).join('\n') || 'Tidak ada gap'}

AVAILABLE COURSES:
${courses?.slice(0, 15).map(c => `- ${c.title} (${c.provider}, ${c.difficulty_level}): ${c.skills_taught?.join(', ') || 'General'}`).join('\n')}

TUGAS:
1. Pilih 5 course yang PALING RELEVAN untuk menutup skill gap
2. Berikan REASONING singkat untuk setiap rekomendasi
3. Prioritaskan berdasarkan importance level skill

FORMAT RESPONSE (JSON):
{
    "recommendations": [
        {
            "courseTitle": "string",
            "reason": "string",
            "priority": "high" | "medium" | "low",
            "skillsToGain": ["string"]
        }
    ],
    "learningPath": "string (deskripsi singkat urutan belajar yang disarankan)"
}`

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Kamu adalah AI Learning Advisor. Response dalam format JSON valid. Bahasa Indonesia.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_tokens: 800
        })

        const responseText = completion.choices[0]?.message?.content || '{}'

        let aiRecommendations
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/)
            aiRecommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : null
        } catch {
            aiRecommendations = null
        }

        // Match AI recommendations with actual course data
        const enrichedRecommendations = aiRecommendations?.recommendations?.map((rec: any) => {
            const matchedCourse = courses?.find(c =>
                c.title.toLowerCase().includes(rec.courseTitle.toLowerCase()) ||
                rec.courseTitle.toLowerCase().includes(c.title.toLowerCase())
            )
            return {
                ...rec,
                course: matchedCourse || null
            }
        }) || []

        // Fallback recommendations if AI fails
        if (enrichedRecommendations.length === 0) {
            const fallbackCourses = courses?.slice(0, 5).map(c => ({
                courseTitle: c.title,
                reason: 'Recommended based on your career path',
                priority: 'medium',
                skillsToGain: c.skills_taught || [],
                course: c
            })) || []

            return NextResponse.json({
                success: true,
                recommendations: fallbackCourses,
                learningPath: 'Mulai dari course dengan difficulty level beginner, lalu tingkatkan secara bertahap.',
                skillGaps: gapSkills.map((s: any) => s.skills?.name),
                targetCareer: (targetCareer?.careers as any)?.title || 'Belum ditentukan'
            })
        }

        return NextResponse.json({
            success: true,
            recommendations: enrichedRecommendations,
            learningPath: aiRecommendations?.learningPath || 'Ikuti urutan rekomendasi untuk hasil optimal.',
            skillGaps: gapSkills.map((s: any) => s.skills?.name),
            targetCareer: (targetCareer?.careers as any)?.title || 'Belum ditentukan',
            generatedAt: new Date().toISOString()
        })

    } catch (error) {
        console.error('Error generating learning recommendations:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate recommendations' },
            { status: 500 }
        )
    }
}
