'use client'

import { useState, useEffect } from 'react'
import {
    Users,
    Briefcase,
    Zap,
    MessageSquare,
    TrendingUp,
    Activity,
    Brain,
    FileText,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
    totalUsers: number
    newUsersThisWeek: number
    adminUsers: number
    regularUsers: number
    totalCareers: number
    totalSkills: number
    totalMentalHealthLogs: number
    unreadMessages: number
    totalBlogPosts: number
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin')
                const data = await res.json()
                if (data.stats) {
                    setStats(data.stats)
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [])

    const statCards = [
        {
            title: 'Total Pengguna',
            value: stats?.totalUsers || 0,
            change: stats?.newUsersThisWeek || 0,
            changeLabel: 'minggu ini',
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            href: '/admin/users',
        },
        {
            title: 'Total Karier',
            value: stats?.totalCareers || 0,
            icon: Briefcase,
            color: 'from-violet-500 to-purple-500',
            href: '/admin/careers',
        },
        {
            title: 'Total Skills',
            value: stats?.totalSkills || 0,
            icon: Zap,
            color: 'from-yellow-500 to-orange-500',
            href: '/admin/skills',
        },
        {
            title: 'Mental Health Logs',
            value: stats?.totalMentalHealthLogs || 0,
            icon: Brain,
            color: 'from-pink-500 to-rose-500',
            href: '/admin/logs',
        },
        {
            title: 'Pesan Baru',
            value: stats?.unreadMessages || 0,
            icon: MessageSquare,
            color: 'from-green-500 to-emerald-500',
            href: '/admin/messages',
        },
        {
            title: 'Blog Posts',
            value: stats?.totalBlogPosts || 0,
            icon: FileText,
            color: 'from-indigo-500 to-blue-500',
            href: '/admin/content',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Selamat datang di Admin Panel CareerPath.id</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors group"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">{card.title}</p>
                                <p className="text-3xl font-bold text-white mt-1">
                                    {isLoading ? '...' : card.value.toLocaleString()}
                                </p>
                                {card.change !== undefined && (
                                    <div className="flex items-center gap-1 mt-2">
                                        {card.change > 0 ? (
                                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <ArrowDownRight className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span className={`text-sm ${card.change > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                            +{card.change} {card.changeLabel}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <card.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Aktivitas Terbaru</h2>
                        <Activity className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-white text-sm">User baru bergabung</p>
                                <p className="text-gray-400 text-xs">Beberapa menit yang lalu</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-white text-sm">Pesan baru diterima</p>
                                <p className="text-gray-400 text-xs">1 jam yang lalu</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                                <p className="text-white text-sm">Wellness check completed</p>
                                <p className="text-gray-400 text-xs">2 jam yang lalu</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Ringkasan</h2>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Admin Users</span>
                            <span className="text-white font-medium">{stats?.adminUsers || 0}</span>
                        </div>
                        <div className="h-px bg-gray-700" />
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Regular Users</span>
                            <span className="text-white font-medium">{stats?.regularUsers || 0}</span>
                        </div>
                        <div className="h-px bg-gray-700" />
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Conversion Rate</span>
                            <span className="text-green-400 font-medium">
                                {stats?.totalUsers && stats?.totalMentalHealthLogs
                                    ? ((stats.totalMentalHealthLogs / stats.totalUsers) * 100).toFixed(1)
                                    : 0}%
                            </span>
                        </div>
                        <div className="h-px bg-gray-700" />
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Unread Messages</span>
                            <span className="text-orange-400 font-medium">{stats?.unreadMessages || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
