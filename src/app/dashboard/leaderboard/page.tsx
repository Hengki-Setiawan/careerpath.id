'use client'

import { useState, useEffect } from 'react'
import { Trophy, Medal, Star, TrendingUp, Crown, Flame, Loader2, Sparkles, Filter, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface LeaderboardEntry {
    rank: number
    user_id: string
    full_name: string
    avatar_url: string | null
    total_xp: number
    level: number
    badges: number
}

function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-md" />
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-300 fill-gray-200 drop-shadow-md" />
    if (rank === 3) return <Medal className="w-8 h-8 text-amber-600 fill-amber-500 drop-shadow-md" />
    return <span className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-400">#{rank}</span>
}

function getRankStyle(rank: number) {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-md transform scale-[1.01] z-10'
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
    return 'bg-white border-gray-100 hover:bg-gray-50'
}

function getLevelTitle(level: number): string {
    if (level >= 50) return 'Legendary'
    if (level >= 30) return 'Master'
    if (level >= 20) return 'Expert'
    if (level >= 10) return 'Advanced'
    if (level >= 5) return 'Rising Star'
    return 'Novice'
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState<'all' | 'month' | 'week'>('all')

    useEffect(() => {
        fetchLeaderboard()
    }, [timeRange])

    const fetchLeaderboard = async () => {
        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)) // Mock delay
            // Mock data with more entries for visual effect
            const mockData = Array.from({ length: 20 }, (_, i) => ({
                rank: i + 1,
                user_id: `${i + 1}`,
                full_name: i === 0 ? 'Andi Pratama' : i === 1 ? 'Sari Dewi' : i === 2 ? 'Budi Santoso' : `User ${i + 1}`,
                avatar_url: null,
                total_xp: 15000 - (i * 450),
                level: Math.max(1, 30 - i),
                badges: Math.max(1, 15 - i)
            }))
            setLeaderboard(mockData)
        } catch {
            // handle error
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 transform rotate-3">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
                        <p className="text-gray-500 font-medium">Top Learner & Contributor Minggu Ini</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
                    {(['all', 'month', 'week'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${timeRange === range
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {range === 'all' ? 'All Time' : range === 'month' ? 'Bulanan' : 'Mingguan'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top 3 Podium */}
            {!loading && leaderboard.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-12 px-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

                    {/* 2nd Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-xl flex flex-col items-center relative z-10 order-2 md:order-1"
                    >
                        <div className="absolute -top-6">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-2xl">🥈</div>
                        </div>
                        <div className="mt-6 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full mb-3 mx-auto border-4 border-gray-50 overflow-hidden">
                                <span className="w-full h-full flex items-center justify-center text-3xl">👤</span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{leaderboard[1].full_name}</h3>
                            <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600 inline-block mb-3">
                                Level {leaderboard[1].level}
                            </div>
                            <p className="text-gray-400 text-sm mb-1">Total XP</p>
                            <p className="text-2xl font-black text-gray-800">{leaderboard[1].total_xp.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    {/* 1st Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-b from-yellow-50 to-white rounded-3xl p-8 border-2 border-yellow-200 shadow-2xl shadow-yellow-500/10 flex flex-col items-center relative z-20 order-1 md:order-2 transform md:-translate-y-8"
                    >
                        <div className="absolute -top-8 animate-bounce">
                            <Crown className="w-16 h-16 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
                        </div>
                        <div className="mt-8 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full mb-4 mx-auto border-4 border-white shadow-lg overflow-hidden relative">
                                <div className="absolute inset-0 bg-yellow-400/20 blur-xl"></div>
                                <span className="w-full h-full flex items-center justify-center text-4xl relative z-10">👑</span>
                            </div>
                            <h3 className="font-black text-gray-900 text-xl mb-1">{leaderboard[0].full_name}</h3>
                            <div className="px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold inline-block mb-4 shadow-sm border border-yellow-200">
                                {getLevelTitle(leaderboard[0].level)} • Lvl {leaderboard[0].level}
                            </div>
                            <div className="bg-yellow-50 px-6 py-3 rounded-2xl border border-yellow-100">
                                <p className="text-yellow-600 text-xs font-bold uppercase tracking-wider mb-1">Champion XP</p>
                                <p className="text-3xl font-black text-yellow-600">{leaderboard[0].total_xp.toLocaleString()}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3rd Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl p-6 border-2 border-amber-50 shadow-xl flex flex-col items-center relative z-10 order-3 md:order-3"
                    >
                        <div className="absolute -top-6">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg text-2xl">🥉</div>
                        </div>
                        <div className="mt-6 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full mb-3 mx-auto border-4 border-white overflow-hidden">
                                <span className="w-full h-full flex items-center justify-center text-3xl">👤</span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{leaderboard[2].full_name}</h3>
                            <div className="px-3 py-1 bg-amber-50 rounded-full text-xs font-bold text-amber-700 inline-block mb-3">
                                Level {leaderboard[2].level}
                            </div>
                            <p className="text-gray-400 text-sm mb-1">Total XP</p>
                            <p className="text-2xl font-black text-gray-800">{leaderboard[2].total_xp.toLocaleString()}</p>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                        <h2 className="font-bold text-gray-900">Global Rankings</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari user..."
                            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-violet-100 focus:border-violet-400 outline-none w-64 transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-violet-600 mb-4" />
                        <p className="text-gray-500 font-medium">Memuat data leaderboard...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {leaderboard.slice(3).map((entry, idx) => (
                            <motion.div
                                key={entry.user_id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`flex items-center gap-4 px-6 py-4 transition-all hover:bg-gray-50 group cursor-pointer`}
                            >
                                <div className="w-12 flex justify-center font-black text-gray-400 text-lg group-hover:text-violet-600 transition-colors">
                                    {entry.rank}
                                </div>

                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                                    {entry.avatar_url ? <img src={entry.avatar_url} alt="" className="w-full h-full rounded-full" /> : '👤'}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-bold text-gray-900 truncate group-hover:text-violet-700 transition-colors">{entry.full_name}</h3>
                                        {entry.rank <= 10 && <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Lvl {entry.level}</span>
                                        <span>•</span>
                                        <span className={entry.level >= 20 ? 'text-violet-600' : ''}>{getLevelTitle(entry.level)}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                            {entry.badges} Badges
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-black text-gray-900 text-lg group-hover:text-violet-600 transition-colors">
                                        {entry.total_xp.toLocaleString()}
                                    </p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">XP Points</p>
                                </div>

                                <div className="w-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sticky User Stat Bottom Bar (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-lg">👤</div>
                        <div>
                            <p className="font-bold text-gray-900">Anda</p>
                            <p className="text-xs text-gray-500">Rank #42 • 1,250 XP</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
