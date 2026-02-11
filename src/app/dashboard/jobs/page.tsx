'use client'

import { useState, useEffect } from 'react'
import {
    Briefcase, MapPin, Clock, DollarSign, TrendingUp, Search, Filter,
    ExternalLink, Bookmark, BookmarkCheck, Star, Building2, Loader2,
    CheckCircle2, Sparkles, X, ChevronRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// Extended Job Type based on expected DB schema or View
interface Job {
    id: string
    title: string
    company: string
    location: string
    type: string
    salary_min: number
    salary_max: number
    posted_at: string
    description: string
    skills: string[]
    match_score: number
    is_featured: boolean
    is_remote: boolean
    logo_url?: string
}

const JOB_TYPES = ['Semua', 'Full-time', 'Part-time', 'Internship', 'Remote', 'Contract']

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Filters
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('Semua')
    const [showFilters, setShowFilters] = useState(false)
    const [sortBy, setSortBy] = useState<'match' | 'recent'>('match')

    // Interactions
    const [savedJobs, setSavedJobs] = useState<string[]>([])

    useEffect(() => {
        // Mock Data for UI Demonstration (until backend API is fully populated)
        // In production, this would be a Supabase query or API call
        const mockJobs: Job[] = [
            {
                id: '1',
                title: 'Senior Frontend Engineer',
                company: 'GoTo Financial',
                location: 'Jakarta Selatan',
                type: 'Full-time',
                salary_min: 15000000,
                salary_max: 25000000,
                posted_at: new Date().toISOString(),
                description: 'We are looking for an experienced Frontend Engineer to join our core team. You will be responsible for building high-quality web applications using React, TypeScript, and Next.js.',
                skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
                match_score: 95,
                is_featured: true,
                is_remote: false
            },
            {
                id: '2',
                title: 'Product Designer',
                company: 'Traveloka',
                location: 'Remote',
                type: 'Full-time',
                salary_min: 12000000,
                salary_max: 20000000,
                posted_at: new Date(Date.now() - 86400000).toISOString(),
                description: 'Join our design team to create delightful user experiences for millions of users.',
                skills: ['Figma', 'UI/UX', 'Prototyping'],
                match_score: 88,
                is_featured: false,
                is_remote: true
            },
            {
                id: '3',
                title: 'Data Analyst Intern',
                company: 'Telkom Indonesia',
                location: 'Bandung',
                type: 'Internship',
                salary_min: 4000000,
                salary_max: 6000000,
                posted_at: new Date(Date.now() - 172800000).toISOString(),
                description: 'Great opportunity for students to learn real-world data analysis.',
                skills: ['SQL', 'Python', 'Tableau'],
                match_score: 75,
                is_featured: false,
                is_remote: false
            }
        ]

        // Simulate network delay
        setTimeout(() => {
            setJobs(mockJobs)
            setIsLoading(false)
        }, 1000)
    }, [])

    const toggleSave = (jobId: string) => {
        setSavedJobs(prev =>
            prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        )
    }

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesType = selectedType === 'Semua' ||
            job.type === selectedType ||
            (selectedType === 'Remote' && job.is_remote)

        return matchesSearch && matchesType
    }).sort((a, b) => {
        if (sortBy === 'match') return b.match_score - a.match_score
        return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
    })

    const formatSalary = (min: number, max: number) => {
        const format = (n: number) => {
            return (n / 1000000).toFixed(1) + 'jt'
        }
        return `Rp ${format(min)} - ${format(max)}`
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 24) return `${diffInHours} jam yang lalu`
        return `${Math.floor(diffInHours / 24)} hari yang lalu`
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase className="w-7 h-7 text-indigo-600" />
                            Lowongan Kerja
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Rekomendasi pekerjaan berdasarkan profil & skill kamu.
                        </p>
                    </div>

                    {/* Stats Badge */}
                    <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm">
                                    {90 + i}%
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-indigo-900">{filteredJobs.filter(j => j.match_score > 80).length} High Match</p>
                            <p className="text-indigo-600 text-xs">Siap dilamar hari ini</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Filters Sidebar */}
                <div className={`
                    lg:w-64 space-y-6 lg:block
                    ${showFilters ? 'block' : 'hidden'}
                `}>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Filter Job</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Sort By */}
                        <div className="mb-6">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                Urutkan
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none"
                            >
                                <option value="match">Match Tertinggi</option>
                                <option value="recent">Terbaru Posted</option>
                            </select>
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
                    {/* Search Bar */}
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari posisi, perusahaan..."
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

                    {/* AI Insight Box (If High Match exists) */}
                    {filteredJobs.some(j => j.match_score >= 90) && (
                        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                                    <Sparkles className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Peluang Emas!</h3>
                                    <p className="text-indigo-100 text-sm max-w-xl">
                                        Ada lowongan dengan kecocokan <strong>95%</strong> dengan profilmu.
                                        Kandidat dengan skor match setinggi ini memiliki peluang 3x lebih besar untuk dipanggil interview.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Cards */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        </div>
                    ) : filteredJobs.length > 0 ? (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {filteredJobs.map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`bg-white p-6 rounded-2xl border transition-all hover:shadow-lg group ${job.is_featured ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-gray-100'
                                            }`}
                                    >
                                        <div className="flex flex-col md:flex-row gap-5">
                                            {/* Logo Placeholder */}
                                            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                                                <Building2 className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
                                                            <span className="font-medium">{job.company}</span>
                                                            <span>•</span>
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-3.5 h-3.5" />
                                                                {job.location}
                                                            </div>
                                                            <span>•</span>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {formatTimeAgo(job.posted_at)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Match Score */}
                                                    <div className="flex items-center gap-3">
                                                        <div className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1.5 ${job.match_score >= 80 ? 'bg-green-50 text-green-700' :
                                                                job.match_score >= 60 ? 'bg-amber-50 text-amber-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                            {job.match_score}% Match
                                                        </div>
                                                        <button
                                                            onClick={() => toggleSave(job.id)}
                                                            className={`p-2 rounded-lg transition-colors border ${savedJobs.includes(job.id) ? 'bg-amber-50 border-amber-200 text-amber-500' : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {savedJobs.includes(job.id) ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 flex-wrap my-4">
                                                    <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-100 flex items-center gap-1">
                                                        <Briefcase className="w-3 h-3" /> {job.type}
                                                    </span>
                                                    <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-100 flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3" /> {formatSalary(job.salary_min, job.salary_max)}
                                                    </span>
                                                    {job.is_remote && (
                                                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md border border-green-100">
                                                            Remote
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-gray-600 text-sm line-clamp-2 md:line-clamp-1 mb-4">
                                                    {job.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex gap-2 overflow-hidden">
                                                        {job.skills.slice(0, 3).map(skill => (
                                                            <span key={skill} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {job.skills.length > 3 && (
                                                            <span className="text-xs text-gray-400 px-2 py-1">+ {job.skills.length - 3} more</span>
                                                        )}
                                                    </div>

                                                    <Link
                                                        href={`/dashboard/jobs/${job.id}`}
                                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                                                    >
                                                        Lihat Detail
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Lowongan tidak ditemukan</h3>
                            <p className="text-gray-500">
                                Coba ubah filter atau kata kunci pencarianmu.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
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
