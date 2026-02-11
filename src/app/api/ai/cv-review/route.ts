import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { targetRole } = await request.json()

        // Fetch user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, university, major, status, career_target')
            .eq('id', user.id)
            .single()

        // Fetch user skills
        const { data: skills } = await supabase
            .from('user_skills')
            .select('skill:skills(name, category), current_level')
            .eq('user_id', user.id)
            .order('current_level', { ascending: false })
            .limit(20)

        // Fetch completed courses
        const { data: courses } = await supabase
            .from('user_courses')
            .select('course:courses(title, provider)')
            .eq('user_id', user.id)
            .eq('progress', 100)
            .limit(10)

        // Fetch certificates
        const { data: certs } = await supabase
            .from('certificates')
            .select('name, issuer')
            .eq('user_id', user.id)
            .limit(10)

        const role = targetRole || profile?.career_target || 'posisi yang ditargetkan'
        const skillsList = skills?.map((s: Record<string, unknown>) => {
            const skill = s.skill as { name: string } | null
            return skill?.name || 'Unknown'
        }).join(', ') || 'Belum ada data'
        const coursesList = courses?.map((c: Record<string, unknown>) => {
            const course = c.course as { title: string } | null
            return course?.title || 'Unknown'
        }).join(', ') || 'Belum ada'
        const certsList = certs?.map(c => `${c.name} (${c.issuer})`).join(', ') || 'Belum ada'

        const groqApiKey = process.env.GROQ_API_KEY
        if (!groqApiKey) {
            return NextResponse.json({ success: false, error: 'AI service not configured' }, { status: 503 })
        }

        const prompt = `Kamu adalah CV/Resume expert Indonesia. Review dan berikan panduan CV berdasarkan profil berikut:

TARGET ROLE: ${role}
NAMA: ${profile?.full_name || 'Kandidat'}
UNIVERSITAS: ${profile?.university || 'N/A'}
JURUSAN: ${profile?.major || 'N/A'}
STATUS: ${profile?.status || 'Pencari kerja'}
SKILLS: ${skillsList}
COURSES SELESAI: ${coursesList}
SERTIFIKAT: ${certsList}

Berikan respons dalam format JSON:
{
  "cv_score": 75,
  "summary_suggestion": "Contoh professional summary yang strong (2-3 kalimat)",
  "sections_tips": [
    { "section": "Header", "tip": "Tips spesifik", "priority": "high|medium|low" },
    { "section": "Summary", "tip": "...", "priority": "..." },
    { "section": "Skills", "tip": "...", "priority": "..." },
    { "section": "Experience", "tip": "...", "priority": "..." },
    { "section": "Education", "tip": "...", "priority": "..." },
    { "section": "Projects", "tip": "...", "priority": "..." }
  ],
  "keywords_to_add": ["keyword ATS-friendly", "..."],
  "common_mistakes": ["Kesalahan umum yang harus dihindari"],
  "action_verbs": ["Kata kerja aktif untuk bullet points"],
  "overall_tip": "Satu tips utama yang paling penting"
}

Score berdasarkan kelengkapan data yang ada. Semua dalam bahasa Indonesia.`

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a professional CV/Resume expert. Always respond with valid JSON only.' },
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

        return NextResponse.json({
            success: true,
            review,
            target_role: role
        })

    } catch (error) {
        console.error('CV review error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate CV review' },
            { status: 500 }
        )
    }
}
