'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Zap,
    FileText,
    MessageSquare,
    Settings,
    Shield,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronDown,
    Activity,
    Database,
    Search,
    Command
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import NotificationCenter from '@/components/NotificationCenter'

interface AdminUser {
    id: string
    full_name: string
    email: string
    role: string
}

const NAV_ITEMS = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/admin/careers', icon: Activity, label: 'Careers' },
    { href: '/admin/skills', icon: Zap, label: 'Skills' },
    { href: '/admin/content', icon: FileText, label: 'Content' },
    { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/admin/logs', icon: Activity, label: 'Logs' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [admin, setAdmin] = useState<AdminUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                // Mock admin check for demo purposes if API not ready
                // setAdmin({ id: '1', full_name: 'Admin Demo', email: 'admin@demo.com', role: 'super_admin' }) 
                // setIsLoading(false)

                const res = await fetch('/api/admin')
                const data = await res.json()

                if (data.error) {
                    router.push('/login?error=admin_required')
                    return
                }

                setAdmin(data.admin)
            } catch {
                router.push('/login')
            } finally {
                setIsLoading(false)
            }
        }
        checkAdmin()
    }, [router])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-400 font-mono animate-pulse">Initializing Command Center...</p>
                </div>
            </div>
        )
    }

    if (!admin) return null

    return (
        <div className="min-h-screen bg-[#0f1117] text-gray-200 font-sans selection:bg-indigo-500/30">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-[#161b22] border-r border-[#30363d] z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-[#30363d] bg-[#161b22]/50 backdrop-blur-xl">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                            <Shield className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <span className="font-bold text-gray-100 block leading-tight">Admin<span className="text-indigo-500">Panel</span></span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">v2.0.0</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)] scrollbar-hide">
                    <div className="px-3 mb-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Main Menu</p>
                    </div>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/admin' && pathname.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-indigo-600/10 text-indigo-400 font-medium'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"
                                    />
                                )}
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                                <span>{item.label}</span>
                                {item.label === 'Messages' && (
                                    <span className="ml-auto bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">3</span>
                                )}
                            </Link>
                        )
                    })}

                    <div className="px-3 mt-8 mb-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">System</p>
                    </div>
                    <Link
                        href="/dashboard"
                        target="_blank"
                        title="Live Site"
                        className="flex items-center justify-center p-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
                    >
                        <Database className="w-5 h-5" />
                    </Link>
                </nav>

                {/* User Profile Mini */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#30363d] bg-[#161b22]">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-[#0f1117] border border-[#30363d]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                            {admin.full_name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-200 truncate">{admin.full_name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{admin.role}</p>
                        </div>
                        <button onClick={handleLogout} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
                {/* Topbar */}
                <header className="h-20 bg-[#0f1117]/80 backdrop-blur-xl border-b border-[#30363d] flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="pl-10 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-xl text-sm text-gray-200 placeholder:text-gray-600 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none w-64 transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <span className="bg-[#30363d] border border-[#30363d] rounded px-1.5 py-0.5 text-[10px] font-mono text-gray-400">⌘</span>
                                <span className="bg-[#30363d] border border-[#30363d] rounded px-1.5 py-0.5 text-[10px] font-mono text-gray-400">K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f1117]" />
                        </button>

                        <div className="h-8 w-px bg-[#30363d]" />

                        <div className="flex items-center gap-3">
                            <p className="hidden md:block text-sm text-gray-400">
                                <span className="text-gray-600">Timezone:</span> UTC+8
                            </p>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
