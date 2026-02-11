import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { jobTitle, company, jobDescription, userSkills } = await request.json()

        if (!jobTitle) {
            return NextResponse.json({ success: false, error: 'Job title is required' }, { status: 400 })
        }

        // Fetch user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, university, major, status')
            .eq('id', user.id)
            .single()

        // Fetch user skills
        const { data: skills } = await supabase
            .from('user_skills')
            .select('skill:skills(name), current_level')
            .eq('user_id', user.id)
            .order('current_level', { ascending: false })
            .limit(15)

        const skillsList = skills?.map((s: Record<string, unknown>) => {
            const skill = s.skill as { name: string } | null
            return `${skill?.name || 'Unknown'} (Level ${s.current_level}/5)`
        }).join(', ') || userSkills || 'Belum ada data skill'

        const groqApiKey = process.env.GROQ_API_KEY
        if (!groqApiKey) {
            return NextResponse.json({ success: false, error: 'AI service not configured' }, { status: 503 })
        }

        const prompt = `Kamu adalah career coach profesional Indonesia. Buatkan panduan persiapan interview untuk posisi berikut:

POSISI: ${jobTitle}
${company ? `PERUSAHAAN: ${company}` : ''}
${jobDescription ? `DESKRIPSI PEKERJAAN: ${jobDescription}` : ''}

PROFIL KANDIDAT:
- Nama: ${profile?.full_name || 'Kandidat'}
- Background: ${profile?.university || 'N/A'} - ${profile?.major || 'N/A'}
- Status: ${profile?.status || 'Pencari kerja'}
- Skills: ${skillsList}

Berikan respons dalam format JSON dengan struktur:
{
  "company_research": {
    "tips": ["3-4 tips riset perusahaan yang specific"],
    "key_questions": ["2-3 pertanyaan yang perlu dijawab tentang perusahaan"]
  },
  "common_questions": [
    {
      "question": "Pertanyaan interview",
      "strategy": "Strategi menjawab berdasarkan profil kandidat",
      "sample_answer": "Contoh jawaban singkat tapi efektif"
    }
  ],
  "technical_prep": {
    "topics": ["Topik teknis yang perlu dikuasai"],
    "practice_tasks": ["Tugas latihan yang bisa dilakukan"]  
  },
  "soft_skills_tips": ["3-4 tips untuk soft skill saat interview"],
  "day_of_checklist": ["5-6 item checklist hari H interview"],
  "confidence_boost": "Pesan motivasi personal berdasarkan skill yang dimiliki"
}

Berikan minimal 5 common questions. Semua dalam bahasa Indonesia.`

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a professional career coach. Always respond with valid JSON only.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        })

        if (!groqRes.ok) {
            return NextResponse.json({ success: false, error: 'AI service error' }, { status: 502 })
        }

        const groqData = await groqRes.json()
        const content = groqData.choices?.[0]?.message?.content || '{}'

        let preparation
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            preparation = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content)
        } catch {
            preparation = {
                raw_response: content,
                error: 'Failed to parse structured response'
            }
        }

        return NextResponse.json({
            success: true,
            preparation,
            job_title: jobTitle,
            company: company || null
        })

    } catch (error) {
        console.error('Interview prep error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate interview preparation' },
            { status: 500 }
        )
    }
}
