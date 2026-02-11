'use client'

import { useState, useEffect } from 'react'
import {
    BarChart3, Users, GraduationCap, TrendingUp, Target,
    Download, Building2, Brain, AlertTriangle, ChevronRight,
    Lightbulb, PieChart
} from 'lucide-react'

interface AnalyticsData {
    total_students: number
    active_users: number
    onboarding_rate: number
    top_careers: { career: string; count: number; percentage: number }[]
    skill_gaps: { skill: string; avg_level: number; gap: number; students: number }[]
    departments: { major: string; count: number }[]
    employability_score: number
    avg_xp: number
    recommendations: string[]
}

export default function B2BDashboardPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [university, setUniversity] = useState('')

    useEffect(() => {
        fetchAnalytics()
    }, [university])

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const params = university ? `?university=${encodeURIComponent(university)}` : ''
            const res = await fetch(`/api/b2b/analytics${params}`)
            const data = await res.json()
            if (data.success) setAnalytics(data.analytics)
        } catch (err) {
            console.error('Failed to fetch analytics:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
                    <div className="h-8 w-64 bg-gray-200 rounded" />
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-white rounded-2xl" />)}
                    </div>
                    <div className="h-64 bg-white rounded-2xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-6 h-6" />
                                <span className="text-indigo-200 text-sm font-medium">B2B University Dashboard</span>
                            </div>
                            <h1 className="text-3xl font-bold">Career Center Analytics</h1>
                            <p className="text-indigo-200 mt-1">AI-powered institutional insights & recommendations</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Filter universitas..."
                                value={university}
                                onChange={e => setUniversity(e.target.value)}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors">
                                <Download className="w-4 h-4" /> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-4 pb-12 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Mahasiswa', value: analytics?.total_students || 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
                        { label: 'User Aktif', value: analytics?.active_users || 0, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
                        { label: 'Onboarding Rate', value: `${analytics?.onboarding_rate || 0}%`, icon: GraduationCap, color: 'text-violet-600 bg-violet-50' },
                        { label: 'Employability Score', value: `${analytics?.employability_score || 0}%`, icon: Target, color: 'text-amber-600 bg-amber-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-500">{stat.label}</span>
                                <div className={`p-2 rounded-lg ${stat.color}`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Top Skill Gaps */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            <h2 className="text-lg font-bold text-gray-900">Top Skill Gaps</h2>
                        </div>
                        <div className="space-y-3">
                            {analytics?.skill_gaps.slice(0, 6).map((gap, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700 w-32 truncate">{gap.skill}</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-red-400 to-amber-400"
                                            style={{ width: `${(gap.gap / 5) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500 w-20 text-right">Gap: {gap.gap}/5</span>
                                </div>
                            )) || <p className="text-gray-400 text-sm">Belum ada data</p>}
                        </div>
                    </div>

                    {/* Top Career Targets */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <PieChart className="w-5 h-5 text-violet-500" />
                            <h2 className="text-lg font-bold text-gray-900">Karir Paling Diminati</h2>
                        </div>
                        <div className="space-y-3">
                            {analytics?.top_careers.map((career, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">{career.career}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">{career.count} mahasiswa</span>
                                        <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
                                            {career.percentage}%
                                        </span>
                                    </div>
                                </div>
                            )) || <p className="text-gray-400 text-sm">Belum ada data</p>}
                        </div>
                    </div>
                </div>

                {/* Department Breakdown */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-lg font-bold text-gray-900">Jurusan / Department</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {analytics?.departments.map((dept, i) => (
                            <div key={i} className="p-3 bg-indigo-50 rounded-xl text-center">
                                <p className="text-xl font-bold text-indigo-700">{dept.count}</p>
                                <p className="text-xs text-indigo-600 mt-1 truncate">{dept.major}</p>
                            </div>
                        )) || <p className="text-gray-400 text-sm col-span-5">Belum ada data</p>}
                    </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-5 h-5 text-violet-600" />
                        <h2 className="text-lg font-bold text-gray-900">🤖 AI Recommendations</h2>
                    </div>
                    <div className="space-y-3">
                        {analytics?.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                                <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700">{rec}</p>
                                <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            </div>
                        )) || <p className="text-gray-400 text-sm">Belum ada rekomendasi</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
