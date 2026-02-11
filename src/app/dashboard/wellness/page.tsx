'use client'

import { useState, useEffect } from 'react'
import {
    Brain, Heart, Sparkles, ChevronRight, ChevronLeft, Loader2,
    AlertTriangle, CheckCircle, Calendar, TrendingDown, TrendingUp,
    Clock, Phone, MessageCircle, History, Leaf
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

// GAD-7 Questions (Standard anxiety screening)
const GAD7_QUESTIONS = [
    {
        id: 1,
        question: "Merasa gelisah, cemas, atau tegang?",
        shortLabel: "Gelisah"
    },
    {
        id: 2,
        question: "Tidak bisa menghentikan atau mengendalikan rasa khawatir?",
        shortLabel: "Khawatir"
    },
    {
        id: 3,
        question: "Terlalu mengkhawatirkan berbagai hal?",
        shortLabel: "Overthinking"
    },
    {
        id: 4,
        question: "Kesulitan untuk rileks atau santai?",
        shortLabel: "Sulit santai"
    },
    {
        id: 5,
        question: "Merasa sangat gelisah sehingga sulit untuk duduk diam?",
        shortLabel: "Tidak tenang"
    },
    {
        id: 6,
        question: "Mudah merasa kesal atau mudah tersinggung?",
        shortLabel: "Sensitif"
    },
    {
        id: 7,
        question: "Merasa takut seolah-olah sesuatu yang buruk akan terjadi?",
        shortLabel: "Takut"
    }
]

// Answer options
const ANSWER_OPTIONS = [
    { value: 0, label: "Tidak pernah", emoji: "🌿", color: "bg-teal-50 border-teal-200 text-teal-700" },
    { value: 1, label: "Beberapa hari", emoji: "🌤️", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
    { value: 2, label: "Lebih dari setengah waktu", emoji: "☁️", color: "bg-amber-50 border-amber-200 text-amber-700" },
    { value: 3, label: "Hampir setiap hari", emoji: "⛈️", color: "bg-rose-50 border-rose-200 text-rose-700" },
]

interface HistoryLog {
    id: string
    gad7_score: number
    mood: string
    created_at: string
}

interface AnalysisResult {
    score: number
    anxietyLevel: string
    recommendation: string
    needsFollowUp: boolean
}

export default function WellnessPage() {
    const [step, setStep] = useState<'intro' | 'questionnaire' | 'result' | 'history'>('intro')
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<number[]>(Array(7).fill(-1))
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [history, setHistory] = useState<HistoryLog[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)

    // Calculate current score
    const answeredCount = answers.filter(a => a >= 0).length
    const progress = (answeredCount / 7) * 100

    // Handle answer selection
    const handleAnswer = (value: number) => {
        const newAnswers = [...answers]
        newAnswers[currentQuestion] = value
        setAnswers(newAnswers)

        // Auto-advance to next question after short delay
        if (currentQuestion < 6) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1)
            }, 300)
        }
    }

    // Submit results
    const handleSubmit = async () => {
        if (answeredCount < 7) return

        setIsSubmitting(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        try {
            const totalScore = answers.reduce((sum, a) => sum + a, 0)
            let anxietyLevel = 'minimal'
            if (totalScore >= 15) anxietyLevel = 'severe'
            else if (totalScore >= 10) anxietyLevel = 'moderate'
            else if (totalScore >= 5) anxietyLevel = 'mild'

            // Mock recommendation logic (replace with real AI if available)
            const recommendation = totalScore < 5
                ? "Kondisi mental kamu sangat baik! Pertahankan rutinitas positifmu."
                : totalScore < 10
                    ? "Kamu mungkin mengalami sedikit stres ringan. Coba teknik relaksasi sederhana."
                    : "Tingkat kecemasanmu cukup tinggi. Disarankan untuk berkonsultasi dengan profesional."

            const simulatedResult: AnalysisResult = {
                score: totalScore,
                anxietyLevel,
                recommendation,
                needsFollowUp: totalScore >= 10
            }

            if (user) {
                await supabase.from('wellness_logs').insert({
                    user_id: user.id,
                    gad7_score: totalScore,
                    mood: totalScore <= 4 ? 'Good' : totalScore <= 9 ? 'Neutral' : totalScore <= 14 ? 'Bad' : 'Very Bad',
                    notes: `GAD-7 Assessment completed with score ${totalScore}`,
                })
            }

            setResult(simulatedResult)
            setStep('result')

        } catch (error) {
            console.error('Failed to submit:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Load history
    const loadHistory = async () => {
        setIsLoadingHistory(true)
        const supabase = createClient()
        try {
            const { data } = await supabase
                .from('wellness_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10)

            if (data) {
                setHistory(data)
            }
        } catch (error) {
            console.error('Failed to load history:', error)
        } finally {
            setIsLoadingHistory(false)
        }
    }

    useEffect(() => {
        if (step === 'history') {
            loadHistory()
        }
    }, [step])

    // Reset questionnaire
    const resetQuestionnaire = () => {
        setAnswers(Array(7).fill(-1))
        setCurrentQuestion(0)
        setResult(null)
        setStep('intro')
    }

    // Get score bg color - Calming palette
    const getScoreBg = (score: number) => {
        if (score <= 4) return 'from-teal-400 to-cyan-500 shadow-teal-200'
        if (score <= 9) return 'from-cyan-400 to-blue-500 shadow-cyan-200'
        if (score <= 14) return 'from-amber-400 to-orange-500 shadow-amber-200'
        return 'from-rose-400 to-pink-500 shadow-rose-200'
    }

    const getAnxietyLabel = (level: string) => {
        const labels: Record<string, string> = {
            'minimal': 'Minimal',
            'mild': 'Ringan',
            'moderate': 'Sedang',
            'severe': 'Berat'
        }
        return labels[level] || level
    }

    return (
        <div className="max-w-3xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 text-white">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Wellness Check</h1>
                        <p className="text-gray-500 text-sm">Deteksi dini kecemasan dengan GAD-7</p>
                    </div>
                </div>

                <button
                    onClick={() => setStep(step === 'history' ? 'intro' : 'history')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
                >
                    <History className="w-4 h-4" />
                    <span className="text-sm font-medium">{step === 'history' ? 'Kembali' : 'Riwayat'}</span>
                </button>
            </div>

            <AnimatePresence mode="wait">
                {/* STEP: Intro */}
                {step === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 border border-teal-100 relative overflow-hidden">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="text-center mb-8 relative z-10">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-teal-100">
                                    <Brain className="w-12 h-12 text-teal-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                    Bagaimana Perasaanmu?
                                </h2>
                                <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                                    Luangkan 2 menit untuk mengecek kesehatan mentalmu.
                                    Semuanya rahasia dan aman.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 mb-8 relative z-10">
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                                    <Clock className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                                    <p className="font-bold text-gray-800">2 Menit</p>
                                    <p className="text-xs text-gray-500">Waktu tes singkat</p>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                                    <CheckCircle className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                                    <p className="font-bold text-gray-800">Validasi Medis</p>
                                    <p className="text-xs text-gray-500">Standar GAD-7</p>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                                    <Heart className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                                    <p className="font-bold text-gray-800">Rahasia</p>
                                    <p className="text-xs text-gray-500">Privasi terjaga</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('questionnaire')}
                                className="w-full relative z-10 flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] transition-all"
                            >
                                Mulai Cek Sekarang
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP: Questionnaire */}
                {step === 'questionnaire' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Progress Bar */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                            <div className="flex items-center justify-between text-sm mb-2 font-medium">
                                <span className="text-gray-500">Pertanyaan {currentQuestion + 1} dari 7</span>
                                <span className="text-teal-600">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "easeOut" }}
                                />
                            </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                            <div className="text-center mb-8">
                                <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold mb-4 tracking-wide uppercase">
                                    Dalam 2 Minggu Terakhir
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900 leading-snug">
                                    {GAD7_QUESTIONS[currentQuestion].question}
                                </h2>
                            </div>

                            {/* Answer Options */}
                            <div className="space-y-3">
                                {ANSWER_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleAnswer(option.value)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${answers[currentQuestion] === option.value
                                            ? option.color + ' border-current shadow-md scale-[1.01]'
                                            : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <span className="text-2xl filter drop-shadow-sm">{option.emoji}</span>
                                        <span className="font-medium text-lg">{option.label}</span>
                                        {answers[currentQuestion] === option.value && (
                                            <motion.div layoutId="check" className="ml-auto text-current">
                                                <CheckCircle className="w-6 h-6 fill-current text-white" />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                                <button
                                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                    disabled={currentQuestion === 0}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Kembali
                                </button>

                                {currentQuestion < 6 ? (
                                    <button
                                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                        disabled={answers[currentQuestion] < 0}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-all"
                                    >
                                        Lanjut
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={answeredCount < 7 || isSubmitting}
                                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                Lihat Hasil
                                                <Sparkles className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP: Result */}
                {step === 'result' && result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Score Card */}
                        <div className={`bg-gradient-to-br ${getScoreBg(result.score)} rounded-3xl p-10 text-white relative overflow-hidden shadow-xl`}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10 text-center">
                                <p className="text-white/90 font-medium mb-4 uppercase tracking-wider text-sm">Skor Kesehatan Mental Kamu</p>
                                <div className="text-8xl font-black mb-2 tracking-tighter drop-shadow-sm">{result.score}</div>
                                <div className="text-xl font-medium mb-6 opacity-80">dari 21</div>

                                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
                                    {result.anxietyLevel === 'minimal' || result.anxietyLevel === 'mild' ? (
                                        <TrendingDown className="w-5 h-5" />
                                    ) : (
                                        <TrendingUp className="w-5 h-5" />
                                    )}
                                    <span className="font-bold text-lg">
                                        Kecemasan {getAnxietyLabel(result.anxietyLevel)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Interpretation */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                <Sparkles className="w-5 h-5 text-teal-500" />
                                Apa artinya ini?
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {result.recommendation}
                            </p>
                        </div>

                        {/* Alert for high scores */}
                        {result.needsFollowUp && (
                            <div className="bg-red-50 rounded-2xl border border-red-100 p-6 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">
                                        Rekomendasi Tindakan
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Hasil menunjukkan tingkat kecemasan yang perlu perhatian.
                                        Pertimbangkan untuk konsultasi dengan profesional.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <a
                                            href="tel:119"
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                                        >
                                            <Phone className="w-4 h-4" />
                                            Hotline 119
                                        </a>
                                        <Link
                                            href="/dashboard/consultation"
                                            className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Konsultasi Ahli
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={resetQuestionnaire}
                                className="flex-1 py-4 px-6 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                            >
                                Cek Ulang
                            </button>
                            <Link
                                href="/dashboard"
                                className="flex-1 py-4 px-6 bg-gray-900 text-white rounded-xl font-bold text-center hover:bg-black transition-all shadow-lg"
                            >
                                Ke Dashboard
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* STEP: History */}
                {step === 'history' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-teal-500" />
                                Riwayat Perjalanan Mentalmu
                            </h2>

                            {isLoadingHistory ? (
                                <div className="text-center py-12">
                                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-2" />
                                    <p className="text-gray-500">Memuat data...</p>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">Belum ada riwayat check-in</p>
                                    <button
                                        onClick={() => setStep('intro')}
                                        className="mt-4 text-teal-600 font-bold hover:underline"
                                    >
                                        Mulai Tes Pertama →
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {history.map((log) => (
                                        <div
                                            key={log.id}
                                            className="flex items-center gap-5 p-4 bg-white border border-gray-100 rounded-2xl hover:border-teal-200 transition-colors group"
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm ${log.gad7_score <= 4 ? 'bg-teal-50 text-teal-600' :
                                                    log.gad7_score <= 9 ? 'bg-cyan-50 text-cyan-600' :
                                                        log.gad7_score <= 14 ? 'bg-amber-50 text-amber-600' :
                                                            'bg-rose-50 text-rose-600'
                                                }`}>
                                                {log.gad7_score}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-gray-900">
                                                    {log.gad7_score <= 4 ? 'Kecemasan Minimal' :
                                                        log.gad7_score <= 9 ? 'Kecemasan Ringan' :
                                                            log.gad7_score <= 14 ? 'Kecemasan Sedang' : 'Kecemasan Berat'}
                                                </div>
                                                <div className="text-sm text-gray-500 font-medium mt-0.5">
                                                    {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
