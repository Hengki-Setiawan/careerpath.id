'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, User, CheckCircle, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

export default function RegisterPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Password validation
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
    }
    const isPasswordValid = Object.values(passwordChecks).every(Boolean)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        if (!isPasswordValid) {
            setError('Password requirements not met.')
            setIsLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            setIsLoading(false)
            return
        }

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                if (error.message.includes('already registered')) {
                    setError('Email is already registered. Please login.')
                } else {
                    setError(error.message)
                }
                return
            }

            setSuccess(true)
        } catch {
            setError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-[#030014] overflow-hidden relative">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[128px] animate-pulse" />
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md text-center relative z-10 p-8 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                    >
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-white mb-4">Registration Successful! 🎉</h1>
                    <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                        We've sent a confirmation link to <span className="text-green-400 font-medium">{email}</span>. Please verify your email.
                    </p>

                    <Link
                        href="/login"
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] transition-all duration-300"
                    >
                        Proceed to Login
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex bg-[#030014] text-white overflow-hidden relative selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            {/* Scale-in content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 z-10 relative"
            >
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform duration-300">
                                <Compass className="w-7 h-7 text-white" />
                            </div>
                        </Link>
                        <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200">
                            Create Account
                        </h1>
                        <p className="text-gray-400">
                            Join the future of career development.
                        </p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -20, height: 0 }}
                                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm md:text-md text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Register Form */}
                    <form onSubmit={handleRegister} className="space-y-5 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:bg-black/40 outline-none transition-all text-white placeholder:text-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:bg-black/40 outline-none transition-all text-white placeholder:text-gray-600"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a strong password"
                                    className="w-full pl-12 pr-12 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:bg-black/40 outline-none transition-all text-white placeholder:text-gray-600"
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

                            {/* Password Strength Meter */}
                            <div className="mt-3 grid grid-cols-4 gap-2 h-1">
                                {Object.values(passwordChecks).map((isValid, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-full transition-all duration-500 ${isValid ? 'bg-green-500' : 'bg-gray-700'}`}
                                    />
                                ))}
                            </div>
                            <div className="mt-2 text-xs flex justify-between text-gray-500">
                                <span>8+ chars</span>
                                <span>Uppercase</span>
                                <span>Lowercase</span>
                                <span>Number</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                            <div className="relative group">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat password"
                                    className={`w-full pl-12 pr-4 py-3.5 bg-black/20 border rounded-xl outline-none transition-all text-white placeholder:text-gray-600 ${confirmPassword && password !== confirmPassword
                                            ? 'border-red-500/50 focus:border-red-500'
                                            : 'border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20'
                                        }`}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isPasswordValid || password !== confirmPassword}
                            className="w-full py-4 mt-2 bg-white text-indigo-950 rounded-xl font-bold text-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Join Now
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-gray-400 mt-6">
                            Already have an account?{' '}
                            <Link href="/login" className="text-white font-bold hover:text-indigo-400 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
