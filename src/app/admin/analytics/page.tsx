'use client'

import { useState, useEffect } from 'react'
import {
    BarChart3, Users, BookOpen, Briefcase, TrendingUp, Activity,
    Target, Award, Calendar, ArrowUp, ArrowDown, Minus
} from 'lucide-react'

interface AnalyticsData {
    totalUsers: number
    activeUsers: number
    totalCourses: number
    completedCourses: number
    totalJobs: number
    applications: number
    avgMoodScore: number
    topCareers: Array<{ title: string; count: number }>
    topSkills: Array<{ name: string; count: number }>
    userGrowth: Array<{ date: string; count: number }>
    loading: boolean
}

function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = 'indigo'
}: {
    title: string
    value: string | number
    icon: typeof BarChart3
    trend?: 'up' | 'down' | 'stable'
    trendValue?: string
    color?: 'indigo' | 'green' | 'blue' | 'purple' | 'orange'
}) {
    const colorClasses = {
        indigo: 'bg-indigo-100 text-indigo-600',
        green: 'bg-green-100 text-green-600',
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600'
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' :
                            trend === 'down' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                        {trend === 'up' ? <ArrowUp className="w-4 h-4" /> :
                            trend === 'down' ? <ArrowDown className="w-4 h-4" /> :
                                <Minus className="w-4 h-4" />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className="text-gray-500 text-sm mt-1">{title}</p>
            </div>
        </div>
    )
}

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<AnalyticsData>({
        totalUsers: 0,
        activeUsers: 0,
        totalCourses: 0,
        completedCourses: 0,
        totalJobs: 0,
        applications: 0,
        avgMoodScore: 0,
        topCareers: [],
        topSkills: [],
        userGrowth: [],
        loading: true
    })

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/admin/analytics')
            const result = await response.json()

            if (result.success) {
                setData({
                    ...result.data,
                    loading: false
                })
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
            // Use mock data as fallback
            setData({
                totalUsers: 1250,
                activeUsers: 847,
                totalCourses: 45,
                completedCourses: 3200,
                totalJobs: 120,
                applications: 456,
                avgMoodScore: 3.8,
                topCareers: [
                    { title: 'Software Engineer', count: 320 },
                    { title: 'Data Analyst', count: 215 },
                    { title: 'UI/UX Designer', count: 180 },
                    { title: 'Product Manager', count: 145 },
                    { title: 'Digital Marketing', count: 98 }
                ],
                topSkills: [
                    { name: 'JavaScript', count: 450 },
                    { name: 'Python', count: 380 },
                    { name: 'SQL', count: 320 },
                    { name: 'Figma', count: 280 },
                    { name: 'Communication', count: 250 }
                ],
                userGrowth: [],
                loading: false
            })
        }
    }

    if (data.loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-7 h-7 text-indigo-600" />
                    Analytics Dashboard
                </h1>
                <p className="text-gray-500 mt-1">Overview performa platform CareerPath.id</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={data.totalUsers.toLocaleString()}
                    icon={Users}
                    trend="up"
                    trendValue="+12%"
                    color="indigo"
                />
                <StatCard
                    title="Active Users (30d)"
                    value={data.activeUsers.toLocaleString()}
                    icon={Activity}
                    trend="up"
                    trendValue="+8%"
                    color="green"
                />
                <StatCard
                    title="Courses Completed"
                    value={data.completedCourses.toLocaleString()}
                    icon={BookOpen}
                    trend="up"
                    trendValue="+15%"
                    color="blue"
                />
                <StatCard
                    title="Job Applications"
                    value={data.applications.toLocaleString()}
                    icon={Briefcase}
                    trend="stable"
                    trendValue="0%"
                    color="purple"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Courses"
                    value={data.totalCourses}
                    icon={BookOpen}
                    color="blue"
                />
                <StatCard
                    title="Job Listings"
                    value={data.totalJobs}
                    icon={Briefcase}
                    color="purple"
                />
                <StatCard
                    title="Avg Mood Score"
                    value={`${data.avgMoodScore}/5`}
                    icon={Target}
                    color="orange"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Careers */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        Top Career Interests
                    </h3>
                    <div className="space-y-4">
                        {data.topCareers.map((career, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="text-sm text-gray-500 w-4">{idx + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-900">{career.title}</span>
                                        <span className="text-gray-500">{career.count} users</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                            style={{ width: `${(career.count / data.topCareers[0]?.count) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Skills */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-600" />
                        Most Tracked Skills
                    </h3>
                    <div className="space-y-4">
                        {data.topSkills.map((skill, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="text-sm text-gray-500 w-4">{idx + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-900">{skill.name}</span>
                                        <span className="text-gray-500">{skill.count} users</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                            style={{ width: `${(skill.count / data.topSkills[0]?.count) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Export Report (CSV)
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Generate Monthly Report
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        View User Activity Logs
                    </button>
                </div>
            </div>
        </div>
    )
}
