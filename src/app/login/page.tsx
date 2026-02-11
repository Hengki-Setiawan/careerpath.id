'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, ShieldCheck, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setError('Email atau password salah. Silakan coba lagi.')
                } else if (error.message.includes('Email not confirmed')) {
                    setError('Email belum dikonfirmasi. Cek inbox email kamu.')
                } else {
                    setError(error.message)
                }
                return
            }

            router.push('/dashboard')
            router.refresh()
        } catch {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-[#030014] text-white overflow-hidden relative selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            {/* Left Side - Form */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 z-10 relative"
            >
                <div className="w-full max-w-md mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                <Compass className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                CareerPath.id
                            </span>
                        </Link>

                        <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200">
                            Welcome Back.
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Continue your journey to professional excellence.
                        </p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -20, height: 0 }}
                                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-indigo-400 transition-colors">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white/10 outline-none transition-all text-white placeholder:text-gray-600"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-400 group-focus-within:text-indigo-400 transition-colors">Password</label>
                                    <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white/10 outline-none transition-all text-white placeholder:text-gray-600"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-white font-bold hover:text-indigo-400 transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Visuals (Hidden on mobile) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:flex flex-1 relative items-center justify-center p-12"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-violet-900/50 to-[#030014] backdrop-blur-3xl" />

                <div className="relative z-10 w-full max-w-lg">
                    {/* Floating Cards Animation */}
                    <div className="relative h-[500px] w-full perspective-1000">
                        {/* Card 1 */}


                        {/* Card 2 */}


                        {/* Centerpiece Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
                            <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 mb-6 leading-tight">
                                Elevator to<br />Success
                            </h2>
                            <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                                Join thousands of professionals accelerating their careers with AI-driven insights and world-class mentorship.
                            </p>

                            <div className="mt-8 flex items-center justify-center gap-8">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-2xl font-bold text-white">50k+</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Users</span>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-2xl font-bold text-white">98%</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Hired</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
