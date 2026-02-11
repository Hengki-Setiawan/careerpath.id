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

        const { messages, context } = await request.json()

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages required' }, { status: 400 })
        }

        // Get user profile for personalization
        const { data: profile } = await supabase
            .from('users')
            .select('full_name, university, major, semester')
            .eq('id', user.id)
            .single()

        // Build context-aware system prompt
        let systemPrompt = SYSTEM_PROMPTS.careerMentor

        if (profile) {
            systemPrompt += `\n\nKonteks User:
- Nama: ${profile.full_name || 'User'}
- Universitas: ${profile.university || 'Tidak diketahui'}
- Jurusan: ${profile.major || 'Tidak diketahui'}
- Semester: ${profile.semester || 'Tidak diketahui'}

Personalisasi jawabanmu berdasarkan konteks ini.`
        }

        // Add career context if provided
        if (context?.career) {
            systemPrompt += `\n\nUser sedang fokus pada karier: ${context.career}`
        }

        if (context?.skills) {
            systemPrompt += `\nSkill yang sudah dimiliki: ${context.skills.join(', ')}`
        }

        // Make streaming response
        const stream = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: { role: string; content: string }) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content
                }))
            ],
            stream: true,
            max_tokens: 1024,
            temperature: 0.7,
        })

        // Create readable stream
        const encoder = new TextEncoder()
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || ''
                        if (content) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                        }
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                    controller.close()
                } catch (error) {
                    controller.error(error)
                }
            }
        })

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        })
    } catch (error) {
        console.error('AI Chat Error:', error)
        return NextResponse.json(
            { error: 'Failed to get AI response' },
            { status: 500 }
        )
    }
}
