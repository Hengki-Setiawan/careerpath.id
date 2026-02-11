'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Target, TrendingUp, Book, Briefcase, Sparkles, ChevronRight,
    Flame, Trophy, Calendar, Heart, Zap, ArrowUp, Star, Filter,
    MoreHorizontal, CheckCircle2, Clock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { User as UserType } from '@/lib/database.types'

// Components
import { motion } from 'framer-motion'

// Utils
function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return { text: 'Selamat Pagi', emoji: '🌅' }
    if (hour < 18) return { text: 'Selamat Siang', emoji: '☀️' }
    return { text: 'Selamat Malam', emoji: '🌙' }
}

export default function DashboardPage() {
    const greeting = getGreeting()
    const [user, setUser] = useState<UserType | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Mock Data (Replace with real API calls later)
    const stats = {
        level: user?.current_level || 1,
        xp: user?.total_xp || 0,
        nextLevelXp: 100 * Math.pow((user?.current_level || 1) + 1, 2), // Example formula
        streak: user?.current_streak || 0,
        coursesCompleted: 2,
        activeApplications: 5
    }

    const progressPercent = Math.min((stats.xp / stats.nextLevelXp) * 100, 100)

    useEffect(() => {
        const loadUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Fetch profile with new gamification columns
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    setUser(profile as UserType)
                }
            }
            setIsLoading(false)
        }
        loadUser()
    }, [])

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span>{greeting.emoji}</span>
                        {greeting.text}, {user?.full_name?.split(' ')[0] || 'User'}!
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Siap untuk meningkatkan kariermu hari ini?
                    </p>
                </div>

                {/* Streak Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-full">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
                    <span className="font-bold text-orange-700">{stats.streak} Hari Streak!</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Level Card (Main) */}
                <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-indigo-100 font-medium mb-1">Current Level</p>
                                <h2 className="text-3xl font-bold flex items-center gap-2">
                                    Level {stats.level}
                                    <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                                </h2>
                            </div>
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm font-medium">
                                {stats.xp} XP Total
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-indigo-100">
                                <span>Progress ke Level {stats.level + 1}</span>
                                <span>{Math.floor(stats.xp)} / {Math.floor(stats.nextLevelXp)} XP</span>
                            </div>
                            <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full shadow-[0_0_10px_rgba(103,232,249,0.5)]"
                                />
                            </div>
                            <p className="text-xs text-indigo-200 mt-2">
                                💡 Tip: Selesaikan 1 course lagi untuk dapat +500 XP!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-rows-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Courses Selesai</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Lamaran Aktif</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeApplications}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Columns */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Recommended Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-gray-900">Rekomendasi Untukmu</h3>
                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Lihat Semua</button>
                    </div>

                    <div className="space-y-4">
                        {/* Action Card 1 */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-colors group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                                    <Book className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Lanjutkan Belajar: UI Design Basics</h4>
                                            <p className="text-sm text-gray-500 mt-1">Bab 3: Typography & Color Theory</p>
                                        </div>
                                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">
                                            +50 XP
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-3 text-sm">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[65%] rounded-full" />
                                        </div>
                                        <span className="font-medium text-gray-700">65%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Card 2 */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 transition-colors group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">Lowongan Baru: Junior Frontend Dev</h4>
                                            <p className="text-sm text-gray-500 mt-1">Gojek - Jakarta (Remote)</p>
                                        </div>
                                        <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> 95% Match
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">React</span>
                                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">TypeScript</span>
                                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">Tailwind</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI & Wellness */}
                <div className="space-y-6">
                    {/* Mood Tracker Mini */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-rose-500" />
                                Mood Hari Ini
                            </h3>
                        </div>
                        <div className="flex justify-between gap-2">
                            {['😖', '😕', '😐', '🙂', '😄'].map((emoji, i) => (
                                <button key={i} className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-rose-50 hover:scale-110 transition-all text-xl flex items-center justify-center">
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* AI Assistant Teaser */}
                    <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                <Sparkles className="w-6 h-6 text-indigo-300" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Butuh saran karier?</h3>
                            <p className="text-indigo-200 text-sm mb-4">
                                AI Assistant siap membantumu mereview CV atau latihan interview.
                            </p>
                            <button className="w-full py-2.5 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm">
                                Chat Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
