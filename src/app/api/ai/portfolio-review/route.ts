import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch portfolio data
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, university, major, career_target, bio')
            .eq('id', user.id)
            .single()

        const { data: skills } = await supabase
            .from('user_skills')
            .select('skill:skills(name, category), current_level')
            .eq('user_id', user.id)
            .order('current_level', { ascending: false })
            .limit(20)

        const { data: certs } = await supabase
            .from('certificates')
            .select('name, issuer')
            .eq('user_id', user.id)

        const { data: courses } = await supabase
            .from('user_courses')
            .select('course:courses(title)')
            .eq('user_id', user.id)
            .eq('progress', 100)

        const skillCount = skills?.length || 0
        const certCount = certs?.length || 0
        const courseCount = courses?.length || 0
        const hasBio = !!profile?.bio
        const hasTarget = !!profile?.career_target

        const skillsList = skills?.map((s: Record<string, unknown>) => {
            const skill = s.skill as { name: string } | null
            return `${skill?.name || 'Unknown'} (Lv${s.current_level})`
        }).join(', ') || 'Belum ada'

        const groqApiKey = process.env.GROQ_API_KEY
        if (!groqApiKey) {
            return NextResponse.json({ success: false, error: 'AI service not configured' }, { status: 503 })
        }

        const prompt = `Kamu adalah portfolio reviewer profesional. Review portfolio digital berikut dan berikan feedback:

PROFIL:
- Nama: ${profile?.full_name || 'N/A'}
- Universitas: ${profile?.university || 'N/A'}
- Jurusan: ${profile?.major || 'N/A'}
- Target Karir: ${profile?.career_target || 'Belum diset'}
- Bio: ${profile?.bio || 'Belum ada'}

DATA PORTFOLIO:
- Total Skills: ${skillCount}
- Skills: ${skillsList}
- Sertifikat: ${certCount} buah
- Courses Selesai: ${courseCount} buah
- Memiliki Bio: ${hasBio ? 'Ya' : 'Tidak'}
- Target Karir Set: ${hasTarget ? 'Ya' : 'Tidak'}

Berikan respons dalam format JSON:
{
  "score": 65,
  "grade": "B",
  "strengths": ["3-4 kekuatan portfolio"],
  "weaknesses": ["3-4 kelemahan yang harus diperbaiki"],
  "action_items": [
    { "task": "Tugas spesifik", "impact": "high|medium|low", "est_time": "30 menit" }
  ],
  "completeness": {
    "bio": { "status": "done|missing", "tip": "Saran" },
    "skills": { "status": "done|missing", "count": ${skillCount}, "tip": "Saran" },
    "projects": { "status": "done|missing", "tip": "Saran" },
    "certificates": { "status": "done|missing", "count": ${certCount}, "tip": "Saran" },
    "career_target": { "status": "done|missing", "tip": "Saran" }
  },
  "benchmark_tip": "Perbandingan dengan portfolio ideal untuk target karir (1 kalimat)",
  "overall_tip": "Satu tips utama paling berdampak"
}

Score 0-100 berdasarkan kelengkapan. Semua dalam bahasa Indonesia.`

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a professional portfolio reviewer. Always respond with valid JSON only.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 1500
            })
        })

        if (!groqRes.ok) {
            return NextResponse.json({ success: false, error: 'AI service error' }, { status: 502 })
        }

        const groqData = await groqRes.json()
        const content = groqData.choices?.[0]?.message?.content || '{}'

        let review
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            review = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content)
        } catch {
            review = { raw_response: content }
        }

        return NextResponse.json({ success: true, review })
    } catch (error) {
        console.error('Portfolio review error:', error)
        return NextResponse.json({ success: false, error: 'Failed to review portfolio' }, { status: 500 })
    }
}
