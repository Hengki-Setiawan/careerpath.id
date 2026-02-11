'use client'

import { useState, useEffect } from 'react'
import {
    BookOpen, Play, Clock, Star, ChevronRight, Search, Filter,
    Sparkles, Trophy, TrendingUp, ExternalLink, CheckCircle, Loader2,
    Zap, Award, Flame
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

interface Course {
    id: string
    title: string
    description: string
    provider: string
    url: string
    thumbnail_url: string | null
    duration_hours: number
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    is_free: boolean
    price: number
    rating: number
    is_featured: boolean
    skill: {
        id: string
        name: string
        category: string
    } | null
}

interface UserCourse {
    course_id: string
    progress_percentage: number
    started_at: string
    completed_at: string | null
}

const DIFFICULTY_COLORS = {
    Beginner: 'bg-green-50 text-green-700 border-green-200',
    Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
    Advanced: 'bg-red-50 text-red-700 border-red-200'
}

const PROVIDERS = ['Semua', 'YouTube', 'Coursera', 'Dicoding', 'Udemy', 'freeCodeCamp']

export default function LearningPage() {
    const [courses, setCourses] = useState<Course[]>([])
    const [userProgress, setUserProgress] = useState<UserCourse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Semua')
    const [selectedProvider, setSelectedProvider] = useState('Semua')
    const [showFreeOnly, setShowFreeOnly] = useState(false)

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        const supabase = createClient()

        // Fetch courses with skill info
        const { data: coursesData, error } = await supabase
            .from('courses')
            .select(`
        *,
        skill:skills(id, name, category)
      `)
            .eq('is_active', true)
            .order('is_featured', { ascending: false })
            .order('rating', { ascending: false })

        if (!error && coursesData) {
            setCourses(coursesData)
        }

        // Fetch user progress
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: progressData } = await supabase
                .from('user_courses')
                .select('*')
                .eq('user_id', user.id)

            if (progressData) {
                setUserProgress(progressData)
            }
        }

        setIsLoading(false)
    }

    const getCourseProgress = (courseId: string) => {
        return userProgress.find(p => p.course_id === courseId)
    }

    const startCourse = async (courseId: string, courseUrl: string) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // Check if already started
            const existing = getCourseProgress(courseId)
            if (!existing) {
                await supabase.from('user_courses').insert({
                    user_id: user.id,
                    course_id: courseId,
                    progress_percentage: 0,
                    started_at: new Date().toISOString()
                })

                setUserProgress([...userProgress, {
                    course_id: courseId,
                    progress_percentage: 0,
                    started_at: new Date().toISOString(),
                    completed_at: null
                }])
            }
        }

        // Open course in new tab
        window.open(courseUrl, '_blank')
    }

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.skill?.name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesDifficulty = selectedDifficulty === 'Semua' || course.difficulty === selectedDifficulty
        const matchesProvider = selectedProvider === 'Semua' || course.provider === selectedProvider
        const matchesFree = !showFreeOnly || course.is_free

        return matchesSearch && matchesDifficulty && matchesProvider && matchesFree
    })

    // Featured courses
    const featuredCourses = courses.filter(c => c.is_featured).slice(0, 3)

    // In-progress courses
    const inProgressCourses = courses.filter(c => {
        const progress = getCourseProgress(c.id)
        return progress && !progress.completed_at
    })

    // Stats
    const completedCount = userProgress.filter(p => p.completed_at).length
    const inProgressCount = userProgress.filter(p => !p.completed_at).length
    const totalHoursCompleted = inProgressCourses.reduce((acc, c) => {
        const progress = getCourseProgress(c.id)
        return acc + (c.duration_hours * (progress?.progress_percentage || 0) / 100)
    }, 0)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-7 h-7 text-indigo-600" />
                        Learning Center
                    </h1>
                    <p className="text-gray-500 mt-1">Kembangkan skill dengan kurikulum standard industri.</p>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-3">
                    <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-green-700 leading-none">{completedCount}</p>
                            <p className="text-xs text-green-600 font-medium">Selesai</p>
                        </div>
                    </div>
                    <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                            <Flame className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-amber-700 leading-none">{inProgressCount}</p>
                            <p className="text-xs text-amber-600 font-medium">Sedang Belajar</p>
                        </div>
                    </div>
                    <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-indigo-700 leading-none">{Math.round(totalHoursCompleted)}h</p>
                            <p className="text-xs text-indigo-600 font-medium">Jam Belajar</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gamification Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                                <Trophy className="w-5 h-5 text-yellow-300" />
                            </div>
                            <span className="font-bold text-indigo-100 tracking-wide text-sm uppercase">Weekly Challenge</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">
                            Kuis Kompetensi Digital
                        </h2>
                        <p className="text-indigo-100 max-w-xl text-lg leading-relaxed">
                            Uji pemahamanmu, raih <span className="font-bold text-amber-300">500 XP</span>, dan dapatkan badge eksklusif "Fast Learner" untuk profilmu!
                        </p>
                    </div>
                    <Link
                        href="/dashboard/learning/quiz"
                        className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2 shrink-0 group"
                    >
                        Mulai Tantangan
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* In Progress Section */}
            {inProgressCourses.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Lanjutkan Belajar</h2>
                        <div className="h-px flex-1 bg-gray-100"></div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {inProgressCourses.map((course, idx) => {
                            const progress = getCourseProgress(course.id)
                            return (
                                <motion.button
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => startCourse(course.id, course.url)}
                                    className="bg-white rounded-2xl p-5 text-left border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl" />

                                    <div className="flex items-start justify-between mb-3">
                                        <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                                            {course.skill?.name || 'Course'}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            {Math.round(course.duration_hours * (1 - (progress?.progress_percentage || 0) / 100))}h left
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {course.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <span>{course.provider}</span>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-gray-700">{progress?.progress_percentage || 0}% Completed</span>
                                            <span className="text-indigo-600">Resume</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${progress?.progress_percentage || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* Featured Courses */}
            {featuredCourses.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-bold text-gray-900">Rekomendasi Spesial</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {featuredCourses.map((course, idx) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col"
                            >
                                <div className="h-40 bg-gray-100 relative group-hover:scale-105 transition-transform duration-500">
                                    {/* Placeholder Gradient if no image */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BookOpen className="w-12 h-12 text-white/40" />
                                    </div>
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-indigo-700 shadow-sm">
                                        Featured
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${DIFFICULTY_COLORS[course.difficulty]}`}>
                                            {course.difficulty}
                                        </span>
                                        <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-gray-50 text-gray-600 border border-gray-100">
                                            {course.provider}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                                            <Star className="w-4 h-4 fill-current" />
                                            {course.rating}
                                        </div>
                                        <button
                                            onClick={() => startCourse(course.id, course.url)}
                                            className="flex items-center gap-1.5 text-indigo-600 font-semibold text-sm hover:underline"
                                        >
                                            Lihat Detail <ExternalLink className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Filter & Search Bar */}
            <div className="sticky top-20 z-20 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari kursus, skill, atau topik..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:border-indigo-500 outline-none cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <option value="Semua">Semua Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>

                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:border-indigo-500 outline-none cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            {PROVIDERS.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => setShowFreeOnly(!showFreeOnly)}
                            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2 ${showFreeOnly
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {showFreeOnly ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-400" />}
                            Gratis
                        </button>
                    </div>
                </div>
            </div>

            {/* All Courses Lists */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Jelajahi Kursus ({filteredCourses.length})</h2>
                </div>

                {filteredCourses.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Tidak ada kursus ditemukan</h3>
                        <p className="text-gray-500">Coba ubah kata kunci atau filter pencarianmu.</p>
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedDifficulty('Semua')
                                setSelectedProvider('Semua')
                            }}
                            className="mt-4 text-indigo-600 font-medium hover:underline"
                        >
                            Reset semua filter
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-4">
                        <AnimatePresence>
                            {filteredCourses.map((course, idx) => {
                                const progress = getCourseProgress(course.id)
                                const isStarted = !!progress
                                const isCompleted = progress?.completed_at

                                return (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        layout
                                        className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all group flex flex-col md:flex-row gap-6 items-start md:items-center"
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
                                            <BookOpen className="w-8 h-8 text-gray-400" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                                    {course.title}
                                                </h3>
                                                {isCompleted && (
                                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Award className="w-4 h-4" />
                                                    {course.provider}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {course.duration_hours} jam
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${DIFFICULTY_COLORS[course.difficulty]}`}>
                                                    {course.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                                            {isStarted && !isCompleted && (
                                                <div className="flex-1 md:w-32">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span>Progress</span>
                                                        <span className="font-bold">{progress?.progress_percentage}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-indigo-600 rounded-full"
                                                            style={{ width: `${progress?.progress_percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => startCourse(course.id, course.url)}
                                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap shrink-0 ${isStarted
                                                        ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                                    }`}
                                            >
                                                {isStarted ? 'Lanjutkan' : 'Mulai Belajar'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}
