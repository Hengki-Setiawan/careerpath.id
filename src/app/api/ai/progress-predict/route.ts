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

        // Fetch user's current skills
        const { data: userSkills } = await supabase
            .from('user_skills')
            .select(`
                proficiency_level,
                progress_percentage,
                skills (name)
            `)
            .eq('user_id', user.id)

        // Fetch user's target career
        const { data: targetCareer } = await supabase
            .from('user_careers')
            .select(`
                match_percentage,
                careers (title, description)
            `)
            .eq('user_id', user.id)
            .eq('is_primary', true)
            .single()

        // Fetch learning progress (completed courses)
        const { data: completedCourses } = await supabase
            .from('user_courses')
            .select('completed_at')
            .eq('user_id', user.id)
            .eq('status', 'completed')

        // Calculate learning pace
        const coursesCompleted = completedCourses?.length || 0
        const avgProgressPerSkill = (userSkills?.reduce((acc, s) => acc + (s.progress_percentage || 0), 0) || 0) / (userSkills?.length || 1)

        // Build AI prompt
        const prompt = `Kamu adalah AI Career Advisor. Analisis data berikut dan prediksi kapan user akan siap untuk karir impiannya.

DATA USER:
- Target Karir: ${(targetCareer?.careers as any)?.title || 'Belum ditentukan'}
- Current Match: ${targetCareer?.match_percentage || 0}%
- Total Skills: ${userSkills?.length || 0}
- Average Skill Progress: ${avgProgressPerSkill.toFixed(1)}%
- Courses Completed: ${coursesCompleted}

TUGAS:
1. Perkirakan berapa BULAN lagi user akan mencapai 80% career readiness
2. Berikan 3 rekomendasi spesifik untuk mempercepat progres
3. Berikan motivasi singkat

FORMAT RESPONSE (JSON):
{
    "estimatedMonths": number,
    "confidenceScore": number (0-100),
    "currentReadiness": number (0-100),
    "recommendations": ["string", "string", "string"],
    "motivationalMessage": "string"
}`

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Kamu adalah AI Career Advisor yang membantu mahasiswa Indonesia. Selalu response dalam format JSON yang valid.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 500
        })

        const responseText = completion.choices[0]?.message?.content || '{}'

        // Parse JSON from response
        let prediction
        try {
            // Extract JSON from possible markdown code blocks
            const jsonMatch = responseText.match(/\{[\s\S]*\}/)
            prediction = jsonMatch ? JSON.parse(jsonMatch[0]) : {
                estimatedMonths: 6,
                confidenceScore: 70,
                currentReadiness: targetCareer?.match_percentage || 30,
                recommendations: [
                    'Selesaikan kursus yang sedang berjalan',
                    'Tambah 2-3 proyek portfolio',
                    'Latih soft skills melalui komunitas'
                ],
                motivationalMessage: 'Kamu sudah di jalur yang benar! Tetap konsisten.'
            }
        } catch {
            prediction = {
                estimatedMonths: 6,
                confidenceScore: 70,
                currentReadiness: targetCareer?.match_percentage || 30,
                recommendations: [
                    'Selesaikan kursus yang sedang berjalan',
                    'Tambah 2-3 proyek portfolio',
                    'Latih soft skills melalui komunitas'
                ],
                motivationalMessage: 'Kamu sudah di jalur yang benar! Tetap konsisten.'
            }
        }

        return NextResponse.json({
            success: true,
            prediction: {
                ...prediction,
                targetCareer: (targetCareer?.careers as any)?.title || 'Belum ditentukan',
                generatedAt: new Date().toISOString()
            }
        })

    } catch (error) {
        console.error('Error generating progress prediction:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate prediction' },
            { status: 500 }
        )
    }
}
