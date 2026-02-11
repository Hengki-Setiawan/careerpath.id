'use client'

import { useState, useEffect } from 'react'
import {
    TrendingUp, Star, Trophy, Zap, Target, ChevronRight, Plus,
    BookOpen, Clock, Award, Sparkles, BarChart3, CheckCircle, Loader2,
    Search, Filter, ArrowRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

interface Skill {
    id: string
    name: string
    category: 'Hard Skill' | 'Soft Skill'
    description: string
    icon_name: string
}

interface UserSkill {
    id: string
    skill_id: string
    proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
    progress_percentage: number
    hours_practiced: number
    skill: Skill
}

const PROFICIENCY_COLORS = {
    Beginner: 'bg-blue-50 text-blue-700 border-blue-200',
    Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
    Advanced: 'bg-purple-50 text-purple-700 border-purple-200',
    Expert: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const PROFICIENCY_XP = {
    Beginner: 100,
    Intermediate: 300,
    Advanced: 600,
    Expert: 1000,
}

// XP Thresholds for levels
const XP_LEVELS = [
    { level: 1, name: 'Newbie', minXP: 0, maxXP: 500 },
    { level: 2, name: 'Learner', minXP: 500, maxXP: 1500 },
    { level: 3, name: 'Rising Star', minXP: 1500, maxXP: 3500 },
    { level: 4, name: 'Skilled', minXP: 3500, maxXP: 7000 },
    { level: 5, name: 'Pro', minXP: 7000, maxXP: 12000 },
    { level: 6, name: 'Expert', minXP: 12000, maxXP: 20000 },
    { level: 7, name: 'Master', minXP: 20000, maxXP: 35000 },
    { level: 8, name: 'Grandmaster', minXP: 35000, maxXP: Infinity },
]

export default function SkillsPage() {
    const [userSkills, setUserSkills] = useState<UserSkill[]>([])
    const [allSkills, setAllSkills] = useState<Skill[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            // Fetch user's skills
            const { data: userSkillsData } = await supabase
                .from('user_skills')
                .select(`
          *,
          skill:skills(*)
        `)
                .eq('user_id', user.id)

            if (userSkillsData) {
                setUserSkills(userSkillsData)
            }
        }

        // Fetch all available skills
        const { data: skillsData } = await supabase
            .from('skills')
            .select('*')
            .eq('is_active', true)
            .order('category')
            .order('name')

        if (skillsData) {
            setAllSkills(skillsData)
        }

        setIsLoading(false)
    }

    const addSkill = async (skillId: string, level: string) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { error } = await supabase
            .from('user_skills')
            .insert({
                user_id: user.id,
                skill_id: skillId,
                proficiency_level: level,
                progress_percentage: level === 'Beginner' ? 25 : level === 'Intermediate' ? 50 : level === 'Advanced' ? 75 : 100,
                hours_practiced: 0
            })

        if (!error) {
            await fetchData()
            setShowAddModal(false)
        }
    }

    const updateSkillProgress = async (userSkillId: string, newProgress: number) => {
        const supabase = createClient()

        // Determine new proficiency level based on progress
        let newLevel = 'Beginner'
        if (newProgress >= 100) newLevel = 'Expert'
        else if (newProgress >= 75) newLevel = 'Advanced'
        else if (newProgress >= 50) newLevel = 'Intermediate'

        await supabase
            .from('user_skills')
            .update({
                progress_percentage: Math.min(newProgress, 100),
                proficiency_level: newLevel
            })
            .eq('id', userSkillId)

        await fetchData()
    }

    // Calculate total XP
    const totalXP = userSkills.reduce((acc, us) => {
        return acc + (PROFICIENCY_XP[us.proficiency_level] || 0)
    }, 0)

    // Get current level
    const currentLevel = XP_LEVELS.find(l => totalXP >= l.minXP && totalXP < l.maxXP) || XP_LEVELS[0]
    const nextLevel = XP_LEVELS.find(l => l.level === currentLevel.level + 1)
    const progressToNextLevel = nextLevel
        ? ((totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
        : 100

    // Skills not yet added
    const availableSkills = allSkills.filter(s => !userSkills.find(us => us.skill_id === s.id))

    // Filter skills
    const filteredUserSkills = userSkills.filter(us => {
        const matchesCategory = selectedCategory === 'all' || us.skill.category === selectedCategory
        const matchesSearch = us.skill.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Stats
    const hardSkillsCount = userSkills.filter(us => us.skill.category === 'Hard Skill').length
    const softSkillsCount = userSkills.filter(us => us.skill.category === 'Soft Skill').length
    const expertSkillsCount = userSkills.filter(us => us.proficiency_level === 'Expert').length

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header with XP - Enhanced Design */}
            <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/2" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                                <Trophy className="w-12 h-12 text-yellow-300 drop-shadow-md" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg border-2 border-indigo-600">
                                Lvl {currentLevel.level}
                            </div>
                        </div>
                        <div>
                            <p className="text-indigo-100 font-medium tracking-wide mb-1">Current Rank</p>
                            <h1 className="text-4xl font-black tracking-tight">{currentLevel.name}</h1>
                            <div className="flex items-center gap-3 mt-2 text-sm text-indigo-50">
                                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                                    <Target className="w-4 h-4" /> {userSkills.length} Skills
                                </span>
                                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                                    <Award className="w-4 h-4" /> {expertSkillsCount} Mastered
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* XP Progress */}
                    <div className="lg:w-96 bg-black/20 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="flex items-center gap-2">
                                <div className="p-1 bg-amber-500/20 rounded-lg">
                                    <Zap className="w-4 h-4 text-amber-300" />
                                </div>
                                <span className="font-bold text-lg">{totalXP.toLocaleString()} XP</span>
                            </span>
                            {nextLevel && (
                                <span className="text-indigo-100 text-xs font-medium">
                                    Next: {nextLevel.name}
                                </span>
                            )}
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToNextLevel}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-amber-300 to-orange-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                            />
                        </div>
                        {nextLevel && (
                            <p className="text-right text-xs text-indigo-200">
                                Need {(nextLevel.minXP - totalXP).toLocaleString()} XP to level up
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Radar */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-2">
                                <BarChart3 className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{hardSkillsCount}</span>
                            <span className="text-xs text-gray-500">Hard Skills</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center mb-2">
                                <Sparkles className="w-5 h-5 text-pink-600" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{softSkillsCount}</span>
                            <span className="text-xs text-gray-500">Soft Skills</span>
                        </div>
                    </div>

                    {/* Skill Radar Chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Target className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900">Skill Map</h2>
                                <p className="text-xs text-gray-500">Distribusi kemampuanmu</p>
                            </div>
                        </div>

                        {userSkills.length > 0 ? (
                            <div className="h-64 -ml-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={userSkills.slice(0, 6).map(us => ({
                                        skill: us.skill.name.length > 10 ? us.skill.name.substring(0, 10) + '..' : us.skill.name,
                                        fullName: us.skill.name,
                                        value: us.progress_percentage,
                                        level: us.proficiency_level
                                    }))}>
                                        <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                                        <PolarAngleAxis
                                            dataKey="skill"
                                            tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
                                        />
                                        <PolarRadiusAxis
                                            angle={30}
                                            domain={[0, 100]}
                                            tick={false}
                                            axisLine={false}
                                        />
                                        <Radar
                                            name="Skill Level"
                                            dataKey="value"
                                            stroke="#6366f1"
                                            strokeWidth={2}
                                            fill="#818cf8"
                                            fillOpacity={0.3}
                                        />
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload
                                                    return (
                                                        <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-3 text-xs z-50">
                                                            <p className="font-bold text-gray-900 mb-1">{data.fullName}</p>
                                                            <div className="flex items-center justify-between gap-4">
                                                                <span className="text-gray-500">Score</span>
                                                                <span className="text-indigo-600 font-bold">{data.value}/100</span>
                                                            </div>
                                                            <div className="flex items-center justify-between gap-4 mt-1">
                                                                <span className="text-gray-500">Level</span>
                                                                <span className="text-gray-900">{data.level}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                                <p className="text-sm text-gray-400 mb-2">Belum cukup data</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="text-xs font-semibold text-indigo-600 hover:underline"
                                >
                                    Tambah Skill
                                </button>
                            </div>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                            <button className="text-xs text-gray-500 hover:text-indigo-600 font-medium flex items-center justify-center gap-1 mx-auto transition-colors">
                                Lihat Analisis Detail <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Skills List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm sticky top-24 z-10">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari skill..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                            {['all', 'Hard Skill', 'Soft Skill'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat === 'all' ? 'Semua' : cat}
                                </button>
                            ))}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2 whitespace-nowrap ml-auto"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Tambah</span>
                            </button>
                        </div>
                    </div>

                    {/* Skills Grid/List */}
                    {filteredUserSkills.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Mulai Perjalananmu</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mb-6">
                                Tambahkan skill yang kamu miliki atau yang ingin kamu pelajari.
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                Tambah Skill Pertama
                            </button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {filteredUserSkills.map((us, idx) => (
                                    <motion.div
                                        key={us.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        layout
                                        className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                                                    {us.skill.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md inline-block mt-1">
                                                    {us.skill.category}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${PROFICIENCY_COLORS[us.proficiency_level]} bg-opacity-50`}>
                                                {us.proficiency_level}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="text-gray-500 font-medium">Mastery</span>
                                                <span className="font-bold text-gray-900">{us.progress_percentage}%</span>
                                            </div>
                                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${us.progress_percentage}%` }}
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                                                <Zap className="w-3.5 h-3.5 fill-current" />
                                                {PROFICIENCY_XP[us.proficiency_level]} XP
                                            </div>

                                            {us.progress_percentage < 100 ? (
                                                <button
                                                    onClick={() => updateSkillProgress(us.id, us.progress_percentage + 10)}
                                                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                                                >
                                                    <TrendingUp className="w-3 h-3" />
                                                    Latih (+10%)
                                                </button>
                                            ) : (
                                                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Mastered
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Skill Modal - Simplified & Clean */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Tambah Skill Baru</h2>
                                <p className="text-gray-500 text-sm mt-0.5">Pilih skill untuk ditambahkan ke profilmu</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors"
                            >
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                            {availableSkills.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <p className="font-medium text-gray-900">Luar Biasa!</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Kamu sudah menambahkan semua skill yang tersedia.
                                    </p>
                                </div>
                            ) : (
                                availableSkills.map(skill => (
                                    <div key={skill.id} className="p-4 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all group bg-white">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{skill.name}</h3>
                                                <p className="text-xs text-gray-500 font-medium">{skill.category}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => addSkill(skill.id, level)}
                                                    className="py-1.5 text-[10px] sm:text-xs font-semibold rounded-lg border border-gray-100 bg-gray-50 text-gray-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95"
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
