'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Book,
    Brain,
    CheckCircle,
    Clock,
    Lock,
    Play,
    Star,
    Trophy,
    Loader2
} from 'lucide-react'

interface Quiz {
    id: string
    title: string
    description: string
    xp_reward: number
    time_limit_minutes: number
    min_pass_score: number
    is_active: boolean
    course_id: string
    courses?: {
        title: string
        thumbnail_url: string
    }
    attempt?: {
        score: number
        is_passed: boolean
        earned_xp: number
    } | null
}

export default function QuizListPage() {
    const router = useRouter()
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadQuizzes() {
            try {
                const res = await fetch('/api/gamification/quizzes')
                const data = await res.json()
                if (data.success) {
                    setQuizzes(data.quizzes)
                }
            } catch (error) {
                console.error('Failed to load quizzes', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadQuizzes()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Brain className="w-8 h-8 text-violet-600" />
                        Kuis & Tantangan
                    </h1>
                    <p className="text-gray-500 mt-1">Uji pemahamanmu dan raih XP untuk naik level!</p>
                </div>

                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-violet-500/25">
                    <Trophy className="w-6 h-6 text-yellow-300" />
                    <div>
                        <p className="text-xs text-white/80 uppercase font-bold tracking-wider">Total XP Kamu</p>
                        <p className="text-xl font-bold">1,250 XP</p> {/* TODO: Fetch real user XP */}
                    </div>
                </div>
            </div>

            {/* Quiz Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Belum ada kuis tersedia</h3>
                        <p className="text-gray-500">Cek lagi nanti untuk tantangan baru!</p>
                    </div>
                ) : (
                    quizzes.map((quiz) => {
                        const isCompleted = quiz.attempt?.is_passed

                        return (
                            <div
                                key={quiz.id}
                                className={`group bg-white rounded-2xl border transition-all hover:shadow-lg relative overflow-hidden ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                                    }`}
                            >
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    {isCompleted ? (
                                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Selesai
                                        </div>
                                    ) : (
                                        <div className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-violet-700" />
                                            {quiz.xp_reward} XP
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                                            {quiz.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">
                                            {quiz.description}
                                        </p>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {quiz.time_limit_minutes} Menit
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Book className="w-4 h-4" />
                                            {quiz.courses?.title || 'Umum'}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        href={`/dashboard/learning/quiz/${quiz.id}`}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${isCompleted
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-gray-900 text-white hover:bg-violet-600'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Lihat Hasil
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 fill-current" />
                                                Mulai Kuis
                                            </>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
