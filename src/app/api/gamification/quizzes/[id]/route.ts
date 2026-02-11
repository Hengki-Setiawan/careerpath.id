import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: quizId } = await params
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch Quiz Details
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', quizId)
            .single()

        if (quizError || !quiz) {
            return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 })
        }

        // Fetch Questions (exclude correct_option_index for security if possible, but mapped)
        // Actually Supabase select might not support excluding easily without listing all others.
        // So we select all and filter in JS.
        const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('id, question_text, options')
            .eq('quiz_id', quizId)

        if (questionsError) throw questionsError

        return NextResponse.json({
            success: true,
            quiz: {
                ...quiz,
                questions
            }
        })

    } catch (error) {
        console.error('Error fetching quiz:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch quiz' }, { status: 500 })
    }
}
