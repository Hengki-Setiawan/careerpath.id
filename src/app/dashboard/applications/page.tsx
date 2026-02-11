'use client'

import { useState } from 'react'
import {
    FileText, Building2, Calendar, Clock, CheckCircle, XCircle,
    MessageSquare, ChevronRight, Plus, Filter, MoreHorizontal,
    Eye, Edit2, Trash2, ExternalLink, Star, LayoutGrid, List as ListIcon,
    ArrowRight, Search, TrendingUp
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Application {
    id: string
    jobTitle: string
    company: string
    companyLogo?: string
    location: string
    salary: string
    status: 'applied' | 'reviewing' | 'interview' | 'offered' | 'rejected'
    appliedDate: string
    lastUpdate: string
    matchScore: number
    notes?: string
    interviewDate?: string
}

const STATUS_CONFIG = {
    applied: { label: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: FileText, step: 1 },
    reviewing: { label: 'Reviewing', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Eye, step: 2 },
    interview: { label: 'Interview', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: MessageSquare, step: 3 },
    offered: { label: 'Offered', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle, step: 4 },
    rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle, step: 0 },
}

const STATUS_KEYS = ['applied', 'reviewing', 'interview', 'offered', 'rejected'] as const

const MOCK_APPLICATIONS: Application[] = [
    {
        id: '1',
        jobTitle: 'Data Analyst',
        company: 'PT Telkom Indonesia',
        location: 'Makassar',
        salary: 'Rp 7-9 juta',
        status: 'interview',
        appliedDate: '2026-02-01',
        lastUpdate: '2026-02-07',
        matchScore: 92,
        interviewDate: '2026-02-15',
        notes: 'HR interview scheduled via Zoom'
    },
    {
        id: '2',
        jobTitle: 'Junior Software Engineer',
        company: 'Gojek',
        location: 'Remote',
        salary: 'Rp 8-12 juta',
        status: 'reviewing',
        appliedDate: '2026-02-03',
        lastUpdate: '2026-02-05',
        matchScore: 85,
    },
    {
        id: '3',
        jobTitle: 'Business Intelligence Analyst',
        company: 'Bank Mandiri',
        location: 'Jakarta',
        salary: 'Rp 9-13 juta',
        status: 'applied',
        appliedDate: '2026-02-08',
        lastUpdate: '2026-02-08',
        matchScore: 78,
    },
    {
        id: '4',
        jobTitle: 'Marketing Analyst',
        company: 'Tokopedia',
        location: 'Jakarta',
        salary: 'Rp 7-10 juta',
        status: 'rejected',
        appliedDate: '2026-01-20',
        lastUpdate: '2026-02-01',
        matchScore: 72,
        notes: 'They went with a more experienced candidate'
    },
    {
        id: '5',
        jobTitle: 'Product Analyst',
        company: 'Bukalapak',
        location: 'Remote',
        salary: 'Rp 8-11 juta',
        status: 'offered',
        appliedDate: '2026-01-15',
        lastUpdate: '2026-02-06',
        matchScore: 88,
        notes: 'Offer: Rp 9.5 juta/bulan + benefits. Respond by Feb 12'
    }
]

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS)
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
    const [searchQuery, setSearchQuery] = useState('')

    // Stats
    const stats = {
        total: applications.length,
        active: applications.filter(a => !['rejected', 'offered'].includes(a.status)).length,
        interviews: applications.filter(a => a.status === 'interview').length,
        offers: applications.filter(a => a.status === 'offered').length,
    }

    const moveStatus = (id: string, newStatus: Application['status']) => {
        setApplications(prev => prev.map(app =>
            app.id === id ? { ...app, status: newStatus, lastUpdate: new Date().toISOString().split('T')[0] } : app
        ))
    }

    const filteredApps = applications.filter(app =>
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const KanbanColumn = ({ status }: { status: typeof STATUS_KEYS[number] }) => {
        const apps = filteredApps.filter(a => a.status === status)
        const config = STATUS_CONFIG[status]
        const Icon = config.icon

        return (
            <div className="flex-shrink-0 w-72 md:w-80 flex flex-col gap-4">
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${config.color} bg-opacity-50`}>
                    <Icon className="w-4 h-4" />
                    <span className="font-semibold">{config.label}</span>
                    <span className="ml-auto bg-white/50 px-2 py-0.5 rounded text-xs font-bold">
                        {apps.length}
                    </span>
                </div>

                <div className="flex flex-col gap-3 min-h-[200px]">
                    {apps.map(app => (
                        <motion.div
                            layoutId={app.id}
                            key={app.id}
                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-move group"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="hover:bg-gray-50 p-1 rounded-lg cursor-pointer">
                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            <h4 className="font-bold text-gray-900 leading-tight mb-1">{app.jobTitle}</h4>
                            <p className="text-sm text-gray-500 mb-3">{app.company}</p>

                            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                                <span>{app.lastUpdate}</span>
                                <span className={`px-2 py-1 rounded-md ${app.matchScore >= 80 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                                    {app.matchScore}% Match
                                </span>
                            </div>

                            {/* Quick Actions (Hover) */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-between mt-3 pt-2 text-xs font-medium text-indigo-600">
                                {status !== 'applied' && (
                                    <button onClick={() => moveStatus(app.id, STATUS_KEYS[STATUS_KEYS.indexOf(status) - 1])} className="hover:underline">
                                        &larr; Prev
                                    </button>
                                )}
                                {status !== 'rejected' && status !== 'offered' && (
                                    <button onClick={() => moveStatus(app.id, STATUS_KEYS[STATUS_KEYS.indexOf(status) + 1])} className="ml-auto hover:underline">
                                        Next &rarr;
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {apps.length === 0 && (
                        <div className="h-24 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 text-sm">
                            Empty
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 min-h-screen pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-7 h-7 text-indigo-600" />
                        Application Tracking
                    </h1>
                    <p className="text-gray-500 mt-1">Kelola dan pantau status lamaran kerjamu.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200">
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'kanban' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Kanban
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        <ListIcon className="w-4 h-4" />
                        List
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats).map(([key, value], idx) => (
                    <div key={key} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 capitalize">{key}</p>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${idx === 0 ? 'bg-blue-50 text-blue-600' :
                                idx === 1 ? 'bg-indigo-50 text-indigo-600' :
                                    idx === 2 ? 'bg-purple-50 text-purple-600' :
                                        'bg-green-50 text-green-600'
                            }`}>
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari lamaran..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                />
            </div>

            {/* Kanban View */}
            {viewMode === 'kanban' && (
                <div className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
                    <KanbanColumn status="applied" />
                    <KanbanColumn status="reviewing" />
                    <KanbanColumn status="interview" />
                    <KanbanColumn status="offered" />
                    <KanbanColumn status="rejected" />
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="space-y-4">
                    {filteredApps.map(app => (
                        <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                <Building2 className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">{app.jobTitle}</h3>
                                <p className="text-sm text-gray-600">{app.company} • {app.location}</p>
                            </div>
                            <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_CONFIG[app.status].color}`}>
                                {STATUS_CONFIG[app.status].label}
                            </div>
                            <div className="text-sm text-gray-500">
                                Updated {app.lastUpdate}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
