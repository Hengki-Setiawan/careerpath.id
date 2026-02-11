import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Get user skills to personalize challenge
        const { data: skills } = await supabase
            .from('user_skills')
            .select('skill:skills(name), current_level')
            .eq('user_id', user.id)
            .order('current_level', { ascending: false })
            .limit(5)

        const topSkill = skills?.[0] as Record<string, unknown> | undefined
        const skillObj = topSkill?.skill as { name: string } | null
        const focusSkill = skillObj?.name || 'Career Development'
        const skillLevel = (topSkill?.current_level as number) || 1

        // Get user's XP
        const { data: profile } = await supabase
            .from('profiles')
            .select('total_xp')
            .eq('id', user.id)
            .single()

        const groqApiKey = process.env.GROQ_API_KEY
        if (!groqApiKey) {
            // Fallback to static challenge
            return NextResponse.json({
                success: true,
                challenge: {
                    title: `${focusSkill} Sprint Week`,
                    description: `Fokus meningkatkan skill ${focusSkill} minggu ini`,
                    tasks: [
                        { task: `Selesaikan 1 course ${focusSkill}`, xp: 100, done: false },
                        { task: 'Update portfolio dengan project baru', xp: 75, done: false },
                        { task: 'Bantu 2 orang di community forum', xp: 50, done: false },
                        { task: 'Apply ke 3 lowongan kerja', xp: 75, done: false }
                    ],
                    total_xp: 300,
                    badge: `${focusSkill} Warrior`,
                    expires_in_days: 7
                }
            })
        }

        const prompt = `Buat weekly challenge gaming-style untuk user CareerPath.id:
- Top skill: ${focusSkill} (Level ${skillLevel}/5)
- Current XP: ${profile?.total_xp || 0}

Format JSON:
{
  "title": "Judul challenge yang catchy dan fun",
  "description": "Deskripsi singkat kenapa challenge ini cocok (1 kalimat)",
  "tasks": [
    { "task": "Tugas spesifik 1", "xp": 100 },
    { "task": "Tugas spesifik 2", "xp": 75 },
    { "task": "Tugas spesifik 3", "xp": 50 },
    { "task": "Tugas spesifik 4", "xp": 75 }
  ],
  "total_xp": 300,
  "badge": "Nama badge yang didapat",
  "motivation": "Kata motivasi kenapa challenge ini worth it (1 kalimat)"
}

Buat 4 tasks yang achievable dalam 1 minggu. Bahasa Indonesia.`

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a gamification expert. Respond with valid JSON only.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 500
            })
        })

        if (!groqRes.ok) {
            return NextResponse.json({ success: false, error: 'AI service error' }, { status: 502 })
        }

        const groqData = await groqRes.json()
        const content = groqData.choices?.[0]?.message?.content || '{}'

        let challenge
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            challenge = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content)
            challenge.expires_in_days = 7
        } catch {
            challenge = { title: `${focusSkill} Sprint`, tasks: [], raw: content }
        }

        return NextResponse.json({ success: true, challenge })
    } catch (error) {
        console.error('Challenge error:', error)
        return NextResponse.json({ success: false, error: 'Failed to generate challenge' }, { status: 500 })
    }
}
