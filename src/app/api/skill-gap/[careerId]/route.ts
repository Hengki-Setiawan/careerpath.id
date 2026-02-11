import { NextRequest, NextResponse } from 'next/server'
import groq, { SYSTEM_PROMPTS } from '@/lib/groq'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ careerId: string }> }
) {
    try {
        const { careerId } = await params
        const { userSkills, careerTitle } = await request.json()

        // Use Groq to analyze skill gap
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPTS.skillRecommendation },
                {
                    role: 'user',
                    content: `Analisis skill gap untuk karier "${careerTitle}".
          
          Skill yang dimiliki user (beserta level):
          ${JSON.stringify(userSkills)}
          
          Berikan rekomendasi spesifik apa yang harus dipelajari selanjutnya untuk mencapai level profesional di bidang ini.`
                }
            ],
            temperature: 0.5,
            response_format: { type: 'json_object' }
        })

        const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}')

        return NextResponse.json({
            success: true,
            analysis: analysis
        })

    } catch (error) {
        console.error('Skill gap analysis error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze skill gap' },
            { status: 500 }
        )
    }
}
