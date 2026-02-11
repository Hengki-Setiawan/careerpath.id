'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Compass,
    Book,
    LayoutDashboard,
    Target,
    TrendingUp,
    Brain,
    User,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Loader2,
    Briefcase,
    Calendar,
    Users,
    UserCheck,
    Folder,
    Heart,
    FileText,
    Settings,
    Trophy,
    HelpCircle,
    Crown,
    Video,
    Map,
    Award,
    MessageCircle,
    Globe
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as UserType } from '@/lib/database.types'
import AIChat from '@/components/AIChat'
import NotificationCenter from '@/components/NotificationCenter'
import SessionTimeout from '@/components/SessionTimeout'

interface DashboardLayoutProps {
    children: React.ReactNode
}

const NAV_GROUPS = [
    {
        title: "UTAMA",
        items: [
            { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/dashboard/profile', icon: User, label: 'Profile' },
            { href: '/', icon: Globe, label: 'Lihat Website', target: '_blank' },
        ]
    },
    {
        title: "KARIER",
        items: [
            { href: '/dashboard/careers', icon: Compass, label: 'Eksplorasi' },
            { href: '/dashboard/jobs', icon: Briefcase, label: 'Lowongan' },
            { href: '/dashboard/applications', icon: FileText, label: 'Lamaran' },
            { href: '/dashboard/roadmap', icon: Map, label: 'Roadmap' },
        ]
    },
    {
        title: "BELAJAR",
        items: [
            { href: '/dashboard/skills', icon: TrendingUp, label: 'Skill Saya' },
            { href: '/dashboard/learning', icon: Book, label: 'Kursus' },
            { href: '/dashboard/portfolio', icon: Folder, label: 'Portfolio' },
        ]
    },
    {
        title: "KESEHATAN",
        items: [
            { href: '/dashboard/wellness', icon: Brain, label: 'Wellness' },
            { href: '/dashboard/mood', icon: Heart, label: 'Mood' },
            { href: '/dashboard/consultation', icon: UserCheck, label: 'Konsultasi' },
        ]
    },
    {
        title: "SOSIAL",
        items: [
            { href: '/dashboard/community', icon: MessageCircle, label: 'Community' },
            { href: '/dashboard/leaderboard', icon: Trophy, label: 'Leaderboard' },
        ]
    }
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter()
    const [user, setUser] = useState<UserType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<{ type: string; title: string; url: string }[]>([])
    const [showSearch, setShowSearch] = useState(false)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()

            const { data: { user: authUser } } = await supabase.auth.getUser()

            if (!authUser) {
                router.push('/login')
                return
            }

            // Get user profile
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (!profile?.university || !profile?.major) {
                router.push('/onboarding')
                return
            }

            setUser(profile)
            setIsLoading(false)
        }

        checkUser()
    }, [router])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Memuat dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } flex flex-col`}>
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                            <Compass className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                CareerPath
                            </span>
                            <span className="text-[10px] text-gray-500 -mt-1 tracking-wider">.id</span>
                        </div>
                    </Link>

                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-6 flex-1 overflow-y-auto">
                    {NAV_GROUPS.map((group) => (
                        <div key={group.title}>
                            <h3 className="px-4 text-xs font-semibold text-gray-400 tracking-wider mb-2">
                                {group.title}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        target={(item as any).target}
                                        className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group"
                                    >
                                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Utility Links (Bottom) */}
                    <div className="pt-4 border-t border-gray-100 mt-4 px-4 pb-4">
                        <Link href="/dashboard/premium" className="flex items-center gap-3 px-4 py-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all mb-2">
                            <Crown className="w-5 h-5" />
                            <span className="font-medium text-sm">Upgrade Premium</span>
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all mb-2">
                            <Settings className="w-5 h-5" />
                            <span className="font-medium text-sm">Settings</span>
                        </Link>
                    </div>
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-100 shrink-0 mt-auto bg-white">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                            {user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{user?.full_name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.university}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 lg:px-8 h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                <Menu className="w-6 h-6 text-gray-600" />
                            </button>

                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl relative">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari karier, skill..."
                                    className="bg-transparent outline-none text-gray-900 placeholder:text-gray-400 w-64"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
                                        if (e.target.value.length >= 2) {
                                            searchTimeoutRef.current = setTimeout(async () => {
                                                try {
                                                    const res = await fetch(`/api/search?q=${encodeURIComponent(e.target.value)}`)
                                                    if (res.ok) {
                                                        const data = await res.json()
                                                        const items: { type: string; title: string; url: string }[] = []
                                                        data.results?.careers?.forEach((c: { name: string; id: string }) => items.push({ type: 'Karier', title: c.name, url: '/dashboard/careers' }))
                                                        data.results?.courses?.forEach((c: { title: string; id: string }) => items.push({ type: 'Course', title: c.title, url: '/dashboard/learning' }))
                                                        data.results?.jobs?.forEach((j: { title: string; id: string }) => items.push({ type: 'Lowongan', title: j.title, url: '/dashboard/jobs' }))
                                                        data.results?.skills?.forEach((s: { name: string; id: string }) => items.push({ type: 'Skill', title: s.name, url: '/dashboard/skills' }))
                                                        setSearchResults(items.slice(0, 8))
                                                        setShowSearch(true)
                                                    }
                                                } catch { /* silent */ }
                                            }, 400)
                                        } else {
                                            setShowSearch(false)
                                        }
                                    }}
                                    onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                                    onFocus={() => { if (searchResults.length > 0) setShowSearch(true) }}
                                />
                                {showSearch && searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                        {searchResults.map((item, idx) => (
                                            <button
                                                key={idx}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors text-left"
                                                onMouseDown={() => {
                                                    router.push(item.url)
                                                    setShowSearch(false)
                                                    setSearchQuery('')
                                                }}
                                            >
                                                <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">{item.type}</span>
                                                <span className="text-sm text-gray-900 truncate">{item.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <NotificationCenter />

                            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                    {user?.full_name?.charAt(0) || 'U'}
                                </div>
                                <div className="hidden lg:block">
                                    <p className="font-medium text-gray-900 text-sm">{user?.full_name}</p>
                                    <p className="text-xs text-gray-500">{user?.major}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    <SessionTimeout>
                        {children}
                    </SessionTimeout>
                </main>
            </div>

            {/* AI Chat Widget */}
            <AIChat />
        </div>
    )
}
