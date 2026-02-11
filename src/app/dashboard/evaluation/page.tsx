'use client'

import { useState, useEffect } from 'react'
import {
    Calendar, TrendingUp, Target, Zap, Trophy, ChartBar,
    Sparkles, CheckCircle, AlertCircle, ArrowUp, ArrowDown, Loader2,
    BookOpen, Briefcase, Brain, Award, Star
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface EvaluationData {
    // Skills Progress
    skillsAdded: number
    skillsImproved: number
    totalXP: number
    xpChange: number

    // Learning
    coursesStarted: number
    coursesCompleted: number
    learningHours: number

    // Jobs
    jobsApplied: number
    matchScore: number

    // Wellness
    wellnessCheckins: number
    avgAnxietyScore: number
    anxietyTrend: 'improving' | 'stable' | 'worsening'

    // Targets
    targetsSet: number
    targetsAchieved: number
}

// Mock data - in production would fetch from aggregated API
const generateMockData = (): EvaluationData => ({
    skillsAdded: 4,
    skillsImproved: 7,
    totalXP: 2500,
    xpChange: 850,
    coursesStarted: 3,
    coursesCompleted: 2,
    learningHours: 24,
    jobsApplied: 5,
    matchScore: 78,
    wellnessCheckins: 4,
    avgAnxietyScore: 6,
    anxietyTrend: 'improving',
    targetsSet: 3,
    targetsAchieved: 2
})

const MONTHS_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export default function EvaluationPage() {
    const [data, setData] = useState<EvaluationData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })

    useEffect(() => {
        // Simulate data loading
        setIsLoading(true)
        setTimeout(() => {
            setData(generateMockData())
            setIsLoading(false)
        }, 800)
    }, [selectedMonth])

    const currentMonth = new Date(selectedMonth + '-01')
    const monthName = MONTHS_ID[currentMonth.getMonth()]
    const year = currentMonth.getFullYear()

    // Calculate overall score (0-100)
    const calculateOverallScore = () => {
        if (!data) return 0

        const skillScore = Math.min((data.skillsAdded + data.skillsImproved) * 10, 30)
        const learningScore = Math.min(data.learningHours * 1.5, 25)
        const jobScore = Math.min(data.jobsApplied * 3, 15)
        const wellnessScore = data.anxietyTrend === 'improving' ? 15 : data.anxietyTrend === 'stable' ? 10 : 5
        const targetScore = data.targetsSet > 0 ? (data.targetsAchieved / data.targetsSet) * 15 : 0

        return Math.round(skillScore + learningScore + jobScore + wellnessScore + targetScore)
    }

    const overallScore = calculateOverallScore()
    const getScoreGrade = (score: number) => {
        if (score >= 90) return { grade: 'S', color: 'text-purple-600', bg: 'bg-purple-100' }
        if (score >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' }
        if (score >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' }
        if (score >= 60) return { grade: 'C', color: 'text-amber-600', bg: 'bg-amber-100' }
        return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        )
    }

    if (!data) return null

    const scoreInfo = getScoreGrade(overallScore)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-7 h-7 text-indigo-600" />
                        Evaluasi Bulanan
                    </h1>
                    <p className="text-gray-500 mt-1">Review progress dan pencapaianmu</p>
                </div>

                {/* Month Selector */}
                <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-indigo-500 outline-none"
                />
            </div>

            {/* Overall Score Card */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <p className="text-white/80 mb-1">Evaluasi {monthName} {year}</p>
                        <h2 className="text-3xl font-bold mb-4">Laporan Progress Bulanan</h2>
                        <p className="text-white/80 max-w-md">
                            Berikut adalah ringkasan pencapaian dan progressmu selama bulan {monthName}.
                        </p>
                    </div>

                    {/* Score Circle */}
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl font-bold">{overallScore}</div>
                                <div className="text-sm text-white/80">Skor</div>
                            </div>
                        </div>
                        <div className={`w-20 h-20 rounded-2xl ${scoreInfo.bg} flex items-center justify-center`}>
                            <span className={`text-4xl font-bold ${scoreInfo.color}`}>{scoreInfo.grade}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Skills */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Skills</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Skill baru</span>
                            <span className="font-bold text-gray-900">+{data.skillsAdded}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Skill improved</span>
                            <span className="font-bold text-gray-900">{data.skillsImproved}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">XP diperoleh</span>
                            <span className="font-bold text-green-600 flex items-center gap-1">
                                <ArrowUp className="w-3.5 h-3.5" />
                                {data.xpChange}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Learning */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Learning</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Kursus dimulai</span>
                            <span className="font-bold text-gray-900">{data.coursesStarted}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Kursus selesai</span>
                            <span className="font-bold text-gray-900">{data.coursesCompleted}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Jam belajar</span>
                            <span className="font-bold text-purple-600">{data.learningHours} jam</span>
                        </div>
                    </div>
                </div>

                {/* Jobs */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Karier</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Lamaran dikirim</span>
                            <span className="font-bold text-gray-900">{data.jobsApplied}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Avg match score</span>
                            <span className="font-bold text-amber-600">{data.matchScore}%</span>
                        </div>
                    </div>
                </div>

                {/* Wellness */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-pink-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Wellness</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Check-in</span>
                            <span className="font-bold text-gray-900">{data.wellnessCheckins}x</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Avg anxiety</span>
                            <span className="font-bold text-gray-900">{data.avgAnxietyScore}/21</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Trend</span>
                            <span className={`font-bold flex items-center gap-1 ${data.anxietyTrend === 'improving' ? 'text-green-600' :
                                    data.anxietyTrend === 'stable' ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                {data.anxietyTrend === 'improving' ? (
                                    <><ArrowDown className="w-3.5 h-3.5" /> Membaik</>
                                ) : data.anxietyTrend === 'stable' ? (
                                    <>Stabil</>
                                ) : (
                                    <><ArrowUp className="w-3.5 h-3.5" /> Perlu perhatian</>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Targets Review */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Target Bulanan
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Target dibuat</span>
                            <span className="font-bold text-gray-900">{data.targetsSet}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-green-700">Tercapai</span>
                            <span className="font-bold text-green-700">{data.targetsAchieved}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-700">Completion Rate</span>
                            <span className="font-bold text-amber-700">
                                {data.targetsSet > 0 ? Math.round((data.targetsAchieved / data.targetsSet) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    AI Insights & Rekomendasi
                </h3>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-white rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Progress Skill Bagus! 🎉</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Kamu menambahkan {data.skillsAdded} skill baru bulan ini. Pertahankan momentum dengan fokus pada skill yang paling relevan dengan karier targetmu.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-white rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Tingkatkan Aktivitas Lamar Kerja</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                {data.jobsApplied} lamaran bulan ini masih bisa ditingkatkan. Coba targetkan 10 lamaran per bulan untuk hasil optimal.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-white rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center shrink-0">
                            <Brain className="w-4 h-4 text-pink-600" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Kesehatan Mental {data.anxietyTrend === 'improving' ? 'Membaik' : 'Perlu Perhatian'}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                {data.anxietyTrend === 'improving'
                                    ? 'Trend kecemasanmu membaik! Terus jaga keseimbangan antara belajar dan istirahat.'
                                    : 'Jangan lupa istirahat dan lakukan wellness check-in rutin. Kesehatanmu adalah prioritas.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Badge Bulan Ini
                </h3>

                <div className="flex gap-4 flex-wrap">
                    {data.skillsAdded >= 3 && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-100">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Skill Hunter</p>
                                <p className="text-xs text-gray-500">+3 skills bulan ini</p>
                            </div>
                        </div>
                    )}

                    {data.coursesCompleted >= 1 && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-xl border border-purple-100">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Lifelong Learner</p>
                                <p className="text-xs text-gray-500">Selesaikan kursus</p>
                            </div>
                        </div>
                    )}

                    {data.wellnessCheckins >= 4 && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-pink-50 rounded-xl border border-pink-100">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-pink-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Mindful</p>
                                <p className="text-xs text-gray-500">4x wellness check-in</p>
                            </div>
                        </div>
                    )}

                    {overallScore >= 80 && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Top Performer</p>
                                <p className="text-xs text-gray-500">Score A atau lebih</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
