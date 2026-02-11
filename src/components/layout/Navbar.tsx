'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Compass, LogIn, User, LayoutDashboard, Briefcase } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { User as UserType } from '@supabase/supabase-js'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [user, setUser] = useState<UserType | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                                CareerPath
                            </span>
                            <span className="text-[10px] text-gray-500 -mt-1 tracking-wider">.id</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/features"
                            className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                        >
                            Fitur
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            href="/blog"
                            className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/faq"
                            className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                        >
                            Kontak
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {(user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super_admin' || (user as any)?.role === 'admin' || (user as any)?.role === 'super_admin') && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-2 px-4 py-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium transition-all"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Admin
                            </Link>
                        )}
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium transition-all duration-200"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
                                >
                                    <User className="w-4 h-4" />
                                    Daftar Gratis
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200 bg-white">
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/features"
                                className="px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors font-medium"
                            >
                                Fitur
                            </Link>
                            <Link
                                href="/about"
                                className="px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors font-medium"
                            >
                                Tentang Kami
                            </Link>
                            <Link
                                href="/blog"
                                className="px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors font-medium"
                            >
                                Blog
                            </Link>
                            <Link
                                href="/faq"
                                className="px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors font-medium"
                            >
                                FAQ
                            </Link>
                            <Link
                                href="/contact"
                                className="px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors font-medium"
                            >
                                Kontak
                            </Link>
                            <hr className="my-2 border-gray-100" />
                            {(user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super_admin' || (user as any)?.role === 'admin' || (user as any)?.role === 'super_admin') && (
                                <Link
                                    href="/admin"
                                    className="px-4 py-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors font-medium block"
                                >
                                    Admin Panel
                                </Link>
                            )}
                            {user ? (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center gap-2 px-4 py-3 text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium transition-all"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium"
                                    >
                                        <User className="w-4 h-4" />
                                        Daftar Gratis
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
