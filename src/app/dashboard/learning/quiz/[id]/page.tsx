'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ChevronLeft,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    Trophy,
    ArrowRight
} from 'lucide-react'

export default function QuizDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [quiz, setQuiz] = useState<any>(null)
    const [questions, setQuestions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [timeLeft, setTimeLeft] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [results, setResults] = useState<any>(null)

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const res = await fetch(`/api/gamification/quizzes/${params.id}`)
                const data = await res.json()
                if (data.success) {
                    setQuiz(data.quiz)
                    setQuestions(data.quiz.questions)
                    setTimeLeft(data.quiz.time_limit_minutes * 60)
                } else {
                    // Handle error (e.g., redirect)
                }
            } catch (error) {
                console.error('Failed to load quiz', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadQuiz()
    }, [params.id])

    // Timer
    useEffect(() => {
        if (!isLoading && !results && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        handleSubmit() // Auto-submit
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [isLoading, results, timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleOptionSelect = (optionIndex: number) => {
        const currentQ = questions[currentQuestionIndex]
        setAnswers(prev => ({
            ...prev,
            [currentQ.id]: optionIndex
        }))
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/gamification/quizzes/${params.id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            })
            const data = await res.json()
            if (data.success) {
                setResults(data.results)
            }
        } catch (error) {
            console.error('Failed to submit quiz', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
        )
    }

    if (results) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden text-center p-8 md:p-12">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${results.isPassed ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                        {results.isPassed ? (
                            <Trophy className="w-10 h-10 text-green-600" />
                        ) : (
                            <XCircle className="w-10 h-10 text-red-600" />
                        )}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {results.isPassed ? 'Selamat! Kamu Lulus 🎉' : 'Belum Lulus, Coba Lagi!'}
                    </h2>
                    <p className="text-gray-500 mb-8">
                        {results.isPassed
                            ? `Kamu berhasil mendapatkan +${results.earnedXp} XP`
                            : 'Jangan menyerah, pelajari materi lagi dan ulangi kuis.'}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-sm text-gray-500">Score</p>
                            <p className={`text-2xl font-bold ${results.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                                {results.score}%
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-sm text-gray-500">Benar</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {results.correctCount}/{results.totalQuestions}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <p className="text-sm text-gray-500">XP</p>
                            <p className="text-2xl font-bold text-violet-600">
                                {results.earnedXp}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/dashboard/learning/quiz"
                            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Kembali ke List
                        </Link>
                        {!results.isPassed && (
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors"
                            >
                                Coba Lagi
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const currentQuestion = questions[currentQuestionIndex]
    const isLastQuestion = currentQuestionIndex === questions.length - 1
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard/learning/quiz" className="p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-500">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-2 text-orange-600 font-bold bg-orange-50 px-4 py-2 rounded-lg">
                    <Clock className="w-5 h-5" />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-violet-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
                <span className="text-sm font-medium text-violet-600 mb-2 block">
                    Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
                    {currentQuestion.question_text}
                </h2>

                <div className="space-y-3">
                    {currentQuestion.options.map((option: string, idx: number) => {
                        const isSelected = answers[currentQuestion.id] === idx
                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                                        ? 'border-violet-600 bg-violet-50 text-violet-700'
                                        : 'border-gray-100 hover:border-gray-300 text-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-violet-600 bg-violet-600' : 'border-gray-300'
                                        }`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
                <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-3 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900"
                >
                    Sebelumnya
                </button>

                {isLastQuestion ? (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-violet-500/25"
                    >
                        {isSubmitting ? (
                            <>Loading...</>
                        ) : (
                            <>Selesai & Submit</>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 flex items-center gap-2"
                    >
                        Selanjutnya
                        <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}
