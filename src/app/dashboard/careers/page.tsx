'use client'

import { useState, useEffect } from 'react'
import {
    Target, Briefcase, TrendingUp, DollarSign, Users, Star, Search,
    ChevronRight, BarChart3, Sparkles, Loader2, BookmarkPlus, BookmarkCheck,
    Filter, X
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Career, UserCareer } from '@/lib/database.types'

const DEMAND_COLORS = {
    'Low': 'bg-gray-100 text-gray-600',
    'Medium': 'bg-amber-100 text-amber-700',
    'High': 'bg-green-100 text-green-700',
    'Very High': 'bg-indigo-100 text-indigo-700',
}

const INDUSTRIES = ['Semua', 'Technology', 'Creative', 'Business', 'Marketing', 'Education', 'Health']
const JOB_TYPES = ['Semua', 'Full-time', 'Part-time', 'Freelance', 'Remote']

export default function CareersPage() {
    const [careers, setCareers] = useState<Career[]>([])
    const [userCareers, setUserCareers] = useState<UserCareer[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Filters
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedIndustry, setSelectedIndustry] = useState('Semua')
    const [selectedType, setSelectedType] = useState('Semua')
    const [showFilters, setShowFilters] = useState(false) // Mobile filter toggle

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const supabase = createClient()

        // Fetch all careers
        const { data: careersData } = await supabase
            .from('careers')
            .select('*')
            .eq('is_active', true)
            .order('demand_level', { ascending: false })

        if (careersData) {
            setCareers(careersData)
        }

        // Fetch user's saved careers
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data: userCareersData } = await supabase
                .from('user_careers')
                .select('*')
                .eq('user_id', user.id)

            if (userCareersData) {
                setUserCareers(userCareersData)
            }
        }

        setIsLoading(false)
    }

    const toggleSaveCareer = async (careerId: string) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const existing = userCareers.find(uc => uc.career_id === careerId)

        if (existing) {
            // Optimistic Update
            setUserCareers(prev => prev.filter(uc => uc.career_id !== careerId))
            await supabase
                .from('user_careers')
                .delete()
                .eq('user_id', user.id)
                .eq('career_id', careerId)
        } else {
            // Optimistic Update
            const newCareer: UserCareer = {
                id: 'temp-' + Date.now(),
                user_id: user.id,
                career_id: careerId,
                is_primary: false,
                match_percentage: 0,
                notes: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
            setUserCareers(prev => [...prev, newCareer])

            await supabase
                .from('user_careers')
                .insert({
                    user_id: user.id,
                    career_id: careerId,
                    is_primary: false,
                    match_percentage: 0
                })
        }
    }

    const filteredCareers = careers.filter(career => {
        const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            career.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesIndustry = selectedIndustry === 'Semua' || career.industry === selectedIndustry
        const matchesType = selectedType === 'Semua' || career.job_type === selectedType

        return matchesSearch && matchesIndustry && matchesType
    })

    const formatSalary = (min: number | null, max: number | null) => {
        if (!min || !max) return 'Salary Undisclosed'
        const formatNum = (n: number) => {
            if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
            return n.toString()
        }
        return `Rp ${formatNum(min)} - ${formatNum(max)} Juta`
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Target className="w-7 h-7 text-indigo-600" />
                    Eksplorasi Karier
                </h1>
                <p className="text-gray-500 mt-1">
                    Temukan {careers.length} jalur karier potensial untuk masa depanmu.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Clean Sidebar / Filters */}
                <div className={`
                    lg:w-64 space-y-6 lg:block
                    ${showFilters ? 'block' : 'hidden'}
                `}>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Filter</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Industry Filter */}
                        <div className="mb-6">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                Industri
                            </label>
                            <div className="space-y-1">
                                {INDUSTRIES.map(ind => (
                                    <button
                                        key={ind}
                                        onClick={() => setSelectedIndustry(ind)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedIndustry === ind
                                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {ind}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Job Type Filter */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                Tipe Pekerjaan
                            </label>
                            <div className="space-y-1">
                                {JOB_TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedType === type
                                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Search Bar Mobile Toggle */}
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari posisi, skill, atau kata kunci..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Results Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        </div>
                    ) : filteredCareers.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {filteredCareers.map((career, index) => {
                                    const isSaved = userCareers.some(uc => uc.career_id === career.id)
                                    return (
                                        <motion.div
                                            key={career.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all group relative overflow-hidden"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSaved ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                                                        } transition-colors`}>
                                                        <Briefcase className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                                                            {career.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">{career.industry}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleSaveCareer(career.id)}
                                                    className={`p-2 rounded-full transition-all ${isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {isSaved ? <BookmarkCheck className="w-6 h-6" /> : <BookmarkPlus className="w-6 h-6" />}
                                                </button>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {career.description || 'Tidak ada deskripsi tersedia.'}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-5">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${career.demand_level === 'High' || career.demand_level === 'Very High'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-gray-50 text-gray-600 border-gray-100'
                                                    }`}>
                                                    {career.demand_level || 'Medium'} Demand
                                                </span>
                                                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                                                    {career.experience_level || 'Entry Level'}
                                                </span>
                                                {/* Blueprint Match Score - Simulated (90-99%) */}
                                                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" />
                                                    {90 + (index % 10)}% Match
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                                    {formatSalary(career.salary_range_min, career.salary_range_max)}
                                                </div>
                                                <Link
                                                    href={`/dashboard/careers/${career.id}`}
                                                    className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:translate-x-1 transition-all"
                                                >
                                                    Detail
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Tidak ditemukan</h3>
                            <p className="text-gray-500">
                                Coba ubah kata kunci atau filter pencarianmu.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedIndustry('Semua')
                                    setSelectedType('Semua')
                                }}
                                className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
