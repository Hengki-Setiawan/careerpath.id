import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { jobTitle, company, jobDescription } = await request.json()

        if (!jobTitle || !company) {
            return NextResponse.json({ success: false, error: 'Job title and company required' }, { status: 400 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, university, major, status')
            .eq('id', user.id)
            .single()

        const { data: skills } = await supabase
            .from('user_skills')
            .select('skill:skills(name), current_level')
            .eq('user_id', user.id)
            .order('current_level', { ascending: false })
            .limit(10)

        const skillsList = skills?.map((s: Record<string, unknown>) => {
            const skill = s.skill as { name: string } | null
            return skill?.name || 'Unknown'
        }).join(', ') || 'Belum ada data'

        const groqApiKey = process.env.GROQ_API_KEY
        if (!groqApiKey) {
            return NextResponse.json({ success: false, error: 'AI service not configured' }, { status: 503 })
        }

        const prompt = `Kamu adalah career coach profesional Indonesia. Buatkan surat lamaran (cover letter) untuk posisi berikut:

POSISI: ${jobTitle}
PERUSAHAAN: ${company}
${jobDescription ? `DESKRIPSI: ${jobDescription}` : ''}

PROFIL PELAMAR:
- Nama: ${profile?.full_name || 'Kandidat'}
- Pendidikan: ${profile?.university || 'N/A'} - ${profile?.major || 'N/A'}
- Status: ${profile?.status || 'Pencari kerja'}
- Skills: ${skillsList}

Berikan respons dalam format JSON:
{
  "subject": "Subject email lamaran",
  "greeting": "Salam pembuka",
  "opening_paragraph": "Paragraf pembuka yang menarik perhatian (2-3 kalimat)",
  "body_paragraph": "Paragraf utama yang menghubungkan skill & pengalaman dengan kebutuhan posisi (3-4 kalimat)",
  "closing_paragraph": "Paragraf penutup yang menunjukkan antusiasme (2-3 kalimat)",
  "sign_off": "Penutup formal",
  "full_letter": "Surat lamaran lengkap dalam format siap kirim",
  "tips": ["3 tips untuk memperkuat lamaran ini"]
}

Gunakan bahasa Indonesia formal namun tetap personal dan engaging. Sesuaikan dengan budaya kerja Indonesia.`

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

        let coverLetter
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            coverLetter = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content)
        } catch {
            coverLetter = { full_letter: content }
        }

        return NextResponse.json({
            success: true,
            cover_letter: coverLetter,
            job_title: jobTitle,
            company
        })
    } catch (error) {
        console.error('Cover letter error:', error)
        return NextResponse.json({ success: false, error: 'Failed to generate cover letter' }, { status: 500 })
    }
}
