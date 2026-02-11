import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch Quizzes with course info
        const { data: quizzes, error } = await supabase
            .from('quizzes')
            .select(`
                *,
                courses (
                    title,
                    thumbnail_url
                )
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) throw error

        // Fetch user attempts to show status (passed/failed/score)
        const { data: attempts } = await supabase
            .from('user_quiz_attempts')
            .select('quiz_id, score, is_passed, earned_xp')
            .eq('user_id', user.id)

        // Combine data
        const quizzesWithStatus = quizzes.map(quiz => {
            const attempt = attempts?.find(a => a.quiz_id === quiz.id)
            return {
                ...quiz,
                attempt: attempt || null
            }
        })

        return NextResponse.json({
            success: true,
            quizzes: quizzesWithStatus
        })

    } catch (error) {
        console.error('Error fetching quizzes:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch quizzes' }, { status: 500 })
    }
}
