'use client'

import { useState } from 'react'
import { Crown, Check, Zap, Star, Shield, Clock, CreditCard, ArrowRight, Sparkles } from 'lucide-react'
import Script from 'next/script'

const PLANS = [
    {
        id: 'premium_monthly',
        name: 'Premium Bulanan',
        price: 49000,
        priceLabel: 'Rp 49.000',
        period: '/bulan',
        features: [
            'AI Career Chatbot unlimited',
            'AI Cover Letter Generator',
            'AI CV Review & Portfolio Optimizer',
            'AI Interview Preparation',
            'Konsultasi prioritas',
            'Badge Premium di profil',
            'Akses semua course premium'
        ],
        popular: false
    },
    {
        id: 'premium_yearly',
        name: 'Premium Tahunan',
        price: 399000,
        priceLabel: 'Rp 399.000',
        period: '/tahun',
        savings: 'Hemat Rp 189.000',
        features: [
            'Semua fitur Premium Bulanan',
            'AI Career Chatbot unlimited',
            'Konsultasi 1x gratis/bulan',
            'Sertifikat premium completion',
            'Prioritas support',
            'Early access fitur baru',
            'Analytics detailed report'
        ],
        popular: true
    }
]

declare global {
    interface Window {
        snap?: {
            pay: (token: string, options: {
                onSuccess?: (result: Record<string, unknown>) => void
                onPending?: (result: Record<string, unknown>) => void
                onError?: (result: Record<string, unknown>) => void
                onClose?: () => void
            }) => void
        }
    }
}

export default function PremiumPage() {
    const [loading, setLoading] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubscribe = async (planId: string) => {
        setLoading(planId)
        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId })
            })
            const data = await res.json()

            if (data.success && data.token) {
                window.snap?.pay(data.token, {
                    onSuccess: () => setSuccess(true),
                    onPending: () => alert('Pembayaran sedang diproses. Cek status di Settings.'),
                    onError: () => alert('Pembayaran gagal. Silakan coba lagi.'),
                    onClose: () => setLoading(null)
                })
            } else {
                alert(data.error || 'Gagal membuat pembayaran')
            }
        } catch {
            alert('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setLoading(null)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 to-white p-6">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">🎉 Premium Aktif!</h1>
                    <p className="text-gray-600">Selamat! Kamu sekarang pengguna premium CareerPath.id. Nikmati semua fitur eksklusif.</p>
                    <a href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors">
                        Ke Dashboard <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        )
    }

    return (
        <>
            <Script
                src={`https://app.sandbox.midtrans.com/snap/snap.js`}
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            />
            <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-amber-50">
                {/* Hero */}
                <div className="text-center pt-16 pb-12 px-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-violet-100 rounded-full mb-6">
                        <Crown className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-violet-600 text-transparent bg-clip-text">
                            Upgrade ke Premium
                        </span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Percepat Karir Impianmu
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Dapatkan akses ke fitur AI canggih, konsultasi profesional, dan tools eksklusif untuk mempercepat perjalanan karirmu.
                    </p>
                </div>

                {/* Plans */}
                <div className="max-w-4xl mx-auto px-6 pb-16">
                    <div className="grid md:grid-cols-2 gap-8">
                        {PLANS.map(plan => (
                            <div key={plan.id} className={`relative bg-white rounded-3xl border-2 p-8 transition-all hover:shadow-xl ${plan.popular ? 'border-violet-500 shadow-lg shadow-violet-100' : 'border-gray-100'}`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-full flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> PALING POPULER
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-gray-900">{plan.priceLabel}</span>
                                        <span className="text-gray-500">{plan.period}</span>
                                    </div>
                                    {plan.savings && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                            {plan.savings}
                                        </span>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={loading === plan.id}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${plan.popular
                                            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        } disabled:opacity-50`}
                                >
                                    {loading === plan.id ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4" />
                                            Berlangganan
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust */}
                <div className="max-w-4xl mx-auto px-6 pb-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Shield, label: 'Pembayaran Aman', sub: 'Midtrans certified' },
                            { icon: Clock, label: 'Batal Kapan Saja', sub: 'Tanpa biaya extra' },
                            { icon: Zap, label: 'Aktivasi Instan', sub: 'Langsung aktif' },
                            { icon: Star, label: 'Garansi 7 Hari', sub: 'Uang kembali' },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-4">
                                <item.icon className="w-8 h-8 text-violet-600 mx-auto mb-2" />
                                <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                                <p className="text-xs text-gray-500">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
