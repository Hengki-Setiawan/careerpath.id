'use client'

import { useState, useEffect } from 'react'
import {
    Target,
    Heart,
    Sparkles,
    Users,
    TrendingUp,
    Shield,
    ArrowRight,
    CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface PageContent {
    hero: { title: string; subtitle: string }
    mission: { title: string; content: string }
    team: { name: string; role: string; bio: string }[]
}

export default function AboutPage() {
    const [content, setContent] = useState<PageContent | null>(null)

    useEffect(() => {
        const fetchContent = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('page_contents')
                .select('content')
                .eq('page_key', 'about')
                .single()

            if (data?.content) {
                setContent(data.content as PageContent)
            }
        }
        fetchContent()
    }, [])

    const values = [
        {
            icon: Target,
            title: 'Fokus pada Mahasiswa',
            description: 'Kami memahami tantangan unik yang dihadapi mahasiswa Indonesia dalam merencanakan karier mereka.'
        },
        {
            icon: Heart,
            title: 'Kesehatan Mental',
            description: 'Kami percaya bahwa kesehatan mental dan kesuksesan karier saling berkaitan erat.'
        },
        {
            icon: Sparkles,
            title: 'Teknologi AI',
            description: 'Memanfaatkan kecerdasan buatan untuk memberikan panduan karier yang dipersonalisasi.'
        },
        {
            icon: Shield,
            title: 'Privasi & Keamanan',
            description: 'Data pribadi dan hasil tes kesehatan mentalmu dijaga dengan standar keamanan tertinggi.'
        }
    ]

    const stats = [
        { value: '10,000+', label: 'Mahasiswa Terbantu' },
        { value: '50+', label: 'Karier Tersedia' },
        { value: '100+', label: 'Skills Terpetakan' },
        { value: '98%', label: 'Tingkat Kepuasan' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-50">
            {/* Hero */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {content?.hero?.title || 'Tentang CareerPath.id'}
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        {content?.hero?.subtitle || 'Platform Career Guidance & Mental Health untuk Mahasiswa Indonesia'}
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
                        >
                            Mulai Gratis
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/features"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Lihat Fitur
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            {content?.mission?.title || 'Misi Kami'}
                        </h2>
                        <p className="text-lg text-violet-100 max-w-2xl mx-auto">
                            {content?.mission?.content || 'Membantu mahasiswa Indonesia menemukan karier impian mereka dengan dukungan teknologi AI dan perhatian pada kesehatan mental.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Nilai-Nilai Kami
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                                    <value.icon className="w-6 h-6 text-violet-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-4 bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Mengapa CareerPath.id?
                    </h2>
                    <div className="space-y-4">
                        {[
                            'Analisis skill gap yang akurat berdasarkan data industri terkini',
                            'Integrasi kesehatan mental dengan GAD-7 terstandar WHO',
                            'AI Mentor yang memahami konteks pendidikan Indonesia',
                            'Gamifikasi yang membuat perjalanan kariermu menyenangkan',
                            'Gratis untuk semua mahasiswa Indonesia'
                        ].map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100">
                                <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                                <span className="text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 bg-gradient-to-r from-violet-600 to-indigo-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Mulai Perjalanan Kariermu Sekarang
                    </h2>
                    <p className="text-violet-100 mb-8 text-lg">
                        Bergabung dengan ribuan mahasiswa yang sudah menemukan arah karier mereka
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-xl font-semibold hover:bg-violet-50 transition-colors"
                    >
                        Daftar Gratis Sekarang
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
