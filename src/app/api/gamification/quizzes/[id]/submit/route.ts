import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: quizId } = await params
        const { answers } = await request.json() // Expect { [questionId]: optionIndex }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Fetch Quiz and Questions with correct answers
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', quizId)
            .single()

        if (quizError || !quiz) {
            return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 })
        }

        const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('id, correct_option_index')
            .eq('quiz_id', quizId)

        if (questionsError) throw questionsError

        // 2. Calculate Score
        let correctCount = 0
        const totalQuestions = questions.length

        questions.forEach(q => {
            if (answers[q.id] === q.correct_option_index) {
                correctCount++
            }
        })

        const score = Math.round((correctCount / totalQuestions) * 100)
        const isPassed = score >= quiz.min_pass_score

        // 3. Award XP if passed (and maybe check if already passed before to avoid farming?)
        // For now, let's allow farming or just simple check.
        // Better: Check if user already passed this quiz.

        let xpAwarded = 0
        if (isPassed) {
            const { data: existingPass } = await supabase
                .from('user_quiz_attempts')
                .select('id')
                .eq('user_id', user.id)
                .eq('quiz_id', quizId)
                .eq('is_passed', true)
                .maybeSingle()

            if (!existingPass) {
                xpAwarded = quiz.xp_reward
                // Call DB function to add XP
                await supabase.rpc('add_xp', {
                    user_id: user.id,
                    xp_amount: xpAwarded
                })
            }
        }

        // 4. Record Attempt
        const { error: attemptError } = await supabase
            .from('user_quiz_attempts')
            .insert({
                user_id: user.id,
                quiz_id: quizId,
                score,
                is_passed: isPassed,
                earned_xp: xpAwarded,
                answers: answers // Store user answers for review
            })

        if (attemptError) throw attemptError

        return NextResponse.json({
            success: true,
            results: {
                score,
                isPassed,
                earnedXp: xpAwarded,
                correctCount,
                totalQuestions
            }
        })

    } catch (error) {
        console.error('Error submitting quiz:', error)
        return NextResponse.json({ success: false, error: 'Failed to submit quiz' }, { status: 500 })
    }
}
