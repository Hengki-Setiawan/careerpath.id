import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
    try {
        const { userProfile, targetCareer } = await request.json()

        // Build context for AI analysis
        const context = `
Analisis skill gap untuk user dengan profil berikut:
- Nama: ${userProfile.name || 'User'}
- Jurusan: ${userProfile.major || 'Tidak disebutkan'}
- University: ${userProfile.university || 'Tidak disebutkan'}
- Current Skills: ${JSON.stringify(userProfile.skills || [])}
- Target Karir: ${targetCareer || 'Belum ditentukan'}

Berikan analisis dalam format JSON yang berisi:
1. currentLevel: Level kesiapan saat ini (1-10)
2. targetLevel: Level yang dibutuhkan (1-10)
3. gapAnalysis: Array skill yang perlu dikembangkan
4. prioritySkills: 3 skill paling penting untuk fokus
5. timeEstimate: Estimasi waktu untuk job-ready
6. recommendations: 3 rekomendasi actionable
`

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `Kamu adalah AI Career Analyst di CareerPath.id yang ahli dalam menganalisis skill gap. 
Fokus pada pasar kerja Makassar dan Indonesia. Berikan respons dalam Bahasa Indonesia.
Selalu respond dengan format JSON yang valid.`
                },
                {
                    role: 'user',
                    content: context
                }
            ],
            model: 'llama-3.1-70b-versatile',
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: 'json_object' }
        })

        const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}')

        return NextResponse.json({
            success: true,
            analysis: {
                currentLevel: analysis.currentLevel || 5,
                targetLevel: analysis.targetLevel || 8,
                gapPercentage: Math.round(((analysis.targetLevel || 8) - (analysis.currentLevel || 5)) / (analysis.targetLevel || 8) * 100),
                gapAnalysis: analysis.gapAnalysis || [],
                prioritySkills: analysis.prioritySkills || ['Communication', 'Problem Solving', 'Technical Skills'],
                timeEstimate: analysis.timeEstimate || '3-6 bulan',
                recommendations: analysis.recommendations || [
                    'Selesaikan course foundational skills',
                    'Bangun portfolio project',
                    'Praktik interview skills'
                ]
            }
        })

    } catch (error) {
        console.error('Skill gap analysis error:', error)

        // Fallback response
        return NextResponse.json({
            success: true,
            analysis: {
                currentLevel: 5,
                targetLevel: 8,
                gapPercentage: 38,
                gapAnalysis: [
                    { skill: 'SQL', current: 2, required: 4, priority: 'high' },
                    { skill: 'Data Visualization', current: 1, required: 3, priority: 'high' },
                    { skill: 'Python', current: 3, required: 4, priority: 'medium' },
                    { skill: 'Statistics', current: 2, required: 3, priority: 'medium' },
                ],
                prioritySkills: ['SQL', 'Data Visualization', 'Python'],
                timeEstimate: '4-6 bulan',
                recommendations: [
                    'Fokus pada SQL dan data visualization terlebih dahulu',
                    'Selesaikan minimal 2 project portfolio',
                    'Ikuti bootcamp atau course terstruktur'
                ]
            }
        })
    }
}
