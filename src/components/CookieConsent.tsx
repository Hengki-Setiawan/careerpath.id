'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Shield } from 'lucide-react'
import Link from 'next/link'

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false)

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            // Delay showing banner for better UX
            const timer = setTimeout(() => setShowBanner(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        localStorage.setItem('cookie-consent-date', new Date().toISOString())
        setShowBanner(false)

        // Enable analytics if needed
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('consent', 'update', {
                analytics_storage: 'granted'
            })
        }
    }

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined')
        localStorage.setItem('cookie-consent-date', new Date().toISOString())
        setShowBanner(false)
    }

    if (!showBanner) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex-shrink-0">
                            <Cookie className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Cookie className="w-5 h-5 sm:hidden text-purple-400" />
                                Kami Menghargai Privasi Anda
                            </h3>
                            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                                Kami menggunakan cookies untuk meningkatkan pengalaman Anda,
                                menganalisis traffic website, dan personalisasi konten.
                                Dengan mengklik &quot;Terima&quot;, Anda menyetujui penggunaan cookies.{' '}
                                <Link
                                    href="/privacy"
                                    className="text-purple-400 hover:text-purple-300 underline"
                                >
                                    Baca Kebijakan Privasi
                                </Link>
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-3 mt-4">
                                <button
                                    onClick={handleAccept}
                                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                                >
                                    <Shield className="w-4 h-4" />
                                    Terima Semua
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
                                >
                                    Tolak
                                </button>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={handleDecline}
                            className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                            aria-label="Tutup"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    )
}
