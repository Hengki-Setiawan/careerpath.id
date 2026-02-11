'use client'

import { useState, useEffect } from 'react'
import {
    Target,
    Brain,
    Heart,
    Zap,
    Trophy,
    BarChart3,
    MessageCircle,
    Shield,
    Sparkles,
    ArrowRight,
    CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const FEATURES = [
    {
        icon: BarChart3,
        title: 'Skill Gap Analysis',
        description: 'Analisis kesenjangan skill antara kemampuanmu saat ini dengan karier impian. Lihat persis apa yang perlu dipelajari.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Brain,
        title: 'AI Career Mentor',
        description: 'Konsultasi karier 24/7 dengan AI yang memahami konteks pendidikan dan industri Indonesia.',
        color: 'from-violet-500 to-purple-500',
    },
    {
        icon: Heart,
        title: 'Mental Health Check',
        description: 'Pantau kesehatan mentalmu dengan GAD-7 terstandar WHO. Dapatkan rekomendasi dan dukungan yang tepat.',
        color: 'from-pink-500 to-rose-500',
    },
    {
        icon: Trophy,
        title: 'Skill Challenges',
        description: 'Tantangan mingguan yang membuat belajar skill baru jadi menyenangkan. Kumpulkan XP dan lihat progressmu!',
        color: 'from-yellow-500 to-orange-500',
    },
    {
        icon: Target,
        title: '50+ Karier Terpetakan',
        description: 'Database karier yang lengkap dengan informasi gaji, prospek, dan skill yang dibutuhkan.',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: Shield,
        title: 'Data Aman & Privat',
        description: 'Hasil tes kesehatan mental dan data pribadimu dijaga dengan enkripsi dan standar keamanan tertinggi.',
        color: 'from-gray-600 to-gray-800',
    },
]

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-50">
            {/* Hero */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-600 rounded-full text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        Fitur Lengkap
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Semua yang Kamu Butuhkan untuk Sukses
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        CareerPath.id menyediakan tools lengkap untuk merencanakan karier sambil menjaga kesehatan mentalmu
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Cara Kerja CareerPath.id
                    </h2>
                    <div className="space-y-8">
                        {[
                            { step: 1, title: 'Daftar & Lengkapi Profil', description: 'Buat akun gratis dan isi informasi pendidikanmu' },
                            { step: 2, title: 'Pilih Karier Impian', description: 'Pilih satu atau lebih karier yang ingin kamu capai' },
                            { step: 3, title: 'Lihat Skill Gap', description: 'Sistem akan menganalisis skill yang sudah kamu miliki vs yang dibutuhkan' },
                            { step: 4, title: 'Ikuti Tantangan', description: 'Selesaikan weekly challenges untuk mengembangkan skill baru' },
                            { step: 5, title: 'Pantau Progress', description: 'Lihat perkembangan kesiapan kariermu dari waktu ke waktu' },
                        ].map((item, index, arr) => (
                            <div key={item.step} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">
                                        {item.step}
                                    </div>
                                    {index < arr.length - 1 && (
                                        <div className="w-0.5 h-full bg-violet-200 mt-2" />
                                    )}
                                </div>
                                <div className="flex-1 pb-8">
                                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Kenapa Berbeda?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-100 rounded-2xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Platform Lain ❌</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li>• Hanya fokus pada job listing</li>
                                <li>• Tidak ada analisis skill gap</li>
                                <li>• Mengabaikan kesehatan mental</li>
                                <li>• Tidak ada panduan personal</li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
                            <h3 className="font-semibold mb-4">CareerPath.id ✅</h3>
                            <ul className="space-y-3 text-violet-100">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    Skill gap analysis dengan AI
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    Integrasi kesehatan mental
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    Gamifikasi yang engaging
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    AI Mentor 24/7
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 bg-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Siap Memulai?
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Bergabung sekarang dan temukan potensi terbaikmu
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
                    >
                        Daftar Gratis
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
