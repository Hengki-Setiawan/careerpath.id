import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import groq, { SYSTEM_PROMPTS } from '@/lib/groq'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { gad7_score, mood, notes } = await request.json()

        // 1. Analyze with AI
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPTS.mentalHealthSupport },
                {
                    role: 'user',
                    content: `Analisis hasil tes GAD-7 user ini:
                    - Skor: ${gad7_score} / 21
                    - Mood saat ini: ${mood}
                    - Catatan tambahan: ${notes}
                    
                    Berikan output JSON dengan format:
                    {
                        "recommendation": "saran empati yang personal dalam 2-3 kalimat",
                        "anxietyLevel": "minimal/mild/moderate/severe",
                        "needsFollowUp": boolean (true jika skor >= 10 atau kondisi mengkhawatirkan),
                        "suggestedActivities": ["aktivitas1", "aktivitas2"]
                    }`
                }
            ],
            temperature: 0.6,
            response_format: { type: 'json_object' }
        })

        const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}')

        // 2. Save to database
        const { error } = await supabase.from('mental_health_logs').insert({
            user_id: user.id,
            gad7_score,
            mood,
            notes,
            ai_analysis: analysis // Assuming you added this JSONB column, if not it will ignore or error depending on setup. 
            // Ideally we should add this column, but for now we'll stick to existing schema or just return analysis effectively.
            // Let's assume standard logging first.
        })

        if (error) throw error

        return NextResponse.json({
            success: true,
            analysis: {
                score: gad7_score,
                ...analysis
            }
        })

    } catch (error) {
        console.error('Wellness check error:', error)
        return NextResponse.json(
            { error: 'Failed to process wellness check' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '5')

        const { data: logs, error } = await supabase
            .from('mental_health_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error

        return NextResponse.json({ logs })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
    }
}
