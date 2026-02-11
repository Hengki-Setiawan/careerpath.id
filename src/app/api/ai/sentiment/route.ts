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

        // Fetch user's recent mood entries (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: moodEntries } = await supabase
            .from('mood_entries')
            .select('mood_level, energy_level, stress_level, notes, created_at')
            .eq('user_id', user.id)
            .gte('created_at', thirtyDaysAgo.toISOString())
            .order('created_at', { ascending: true })

        if (!moodEntries || moodEntries.length < 3) {
            return NextResponse.json({
                success: true,
                analysis: {
                    hasEnoughData: false,
                    message: 'Butuh minimal 3 entri mood untuk analisis yang akurat.',
                    recommendation: 'Lanjutkan tracking mood harianmu untuk mendapatkan insight yang lebih baik.'
                }
            })
        }

        // Prepare data for AI analysis
        const moodSummary = moodEntries.map(e => ({
            date: new Date(e.created_at).toLocaleDateString('id-ID'),
            mood: e.mood_level,
            energy: e.energy_level,
            stress: e.stress_level,
            notes: e.notes || '-'
        }))

        const avgMood = moodEntries.reduce((acc, e) => acc + (e.mood_level || 0), 0) / moodEntries.length
        const avgStress = moodEntries.reduce((acc, e) => acc + (e.stress_level || 0), 0) / moodEntries.length
        const avgEnergy = moodEntries.reduce((acc, e) => acc + (e.energy_level || 0), 0) / moodEntries.length

        // Build AI prompt
        const prompt = `Kamu adalah AI Mental Wellness Advisor. Analisis data mood berikut dan berikan insight mendalam.

DATA MOOD (30 hari terakhir):
${JSON.stringify(moodSummary, null, 2)}

STATISTIK:
- Rata-rata Mood: ${avgMood.toFixed(1)}/5
- Rata-rata Stress: ${avgStress.toFixed(1)}/5
- Rata-rata Energy: ${avgEnergy.toFixed(1)}/5
- Total Entries: ${moodEntries.length}

TUGAS:
1. Identifikasi POLA atau TREND dalam data mood
2. Deteksi potensi WARNING SIGNS (jika ada)
3. Berikan 3 REKOMENDASI spesifik untuk meningkatkan kesejahteraan
4. Buat RINGKASAN singkat tentang kondisi mental user

FORMAT RESPONSE (JSON):
{
    "overallSentiment": "positive" | "neutral" | "concerning",
    "trendDirection": "improving" | "stable" | "declining",
    "patterns": ["string"],
    "warningSigns": ["string"] atau [],
    "recommendations": ["string", "string", "string"],
    "summary": "string",
    "wellnessScore": number (0-100)
}`

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Kamu adalah AI Mental Wellness Advisor yang empati. Response dalam format JSON valid. Gunakan bahasa Indonesia yang supportive.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.6,
            max_tokens: 800
        })

        const responseText = completion.choices[0]?.message?.content || '{}'

        // Parse JSON from response
        let analysis
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/)
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null
        } catch {
            analysis = null
        }

        // Fallback if parsing fails
        if (!analysis) {
            analysis = {
                overallSentiment: avgMood >= 3.5 ? 'positive' : avgMood >= 2.5 ? 'neutral' : 'concerning',
                trendDirection: 'stable',
                patterns: ['Tracking mood secara konsisten'],
                warningSigns: avgStress >= 4 ? ['Level stress tinggi terdeteksi'] : [],
                recommendations: [
                    'Lanjutkan tracking mood harianmu',
                    'Coba teknik relaksasi jika stress meningkat',
                    'Jangan ragu konsultasi dengan profesional jika butuh'
                ],
                summary: `Berdasarkan ${moodEntries.length} entri mood, kondisimu tampak stabil.`,
                wellnessScore: Math.round(avgMood * 20)
            }
        }

        return NextResponse.json({
            success: true,
            analysis: {
                hasEnoughData: true,
                ...analysis,
                stats: {
                    avgMood: avgMood.toFixed(1),
                    avgStress: avgStress.toFixed(1),
                    avgEnergy: avgEnergy.toFixed(1),
                    totalEntries: moodEntries.length
                },
                generatedAt: new Date().toISOString()
            }
        })

    } catch (error) {
        console.error('Error analyzing sentiment:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to analyze mood data' },
            { status: 500 }
        )
    }
}
