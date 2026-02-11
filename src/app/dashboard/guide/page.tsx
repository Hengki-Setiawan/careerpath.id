'use client'

import { useState } from 'react'
import {
    HelpCircle, BookOpen, Target, TrendingUp, Brain, Briefcase,
    Award, Heart, Sparkles, ChevronDown, ChevronUp, ExternalLink,
    Rocket, CheckCircle2
} from 'lucide-react'

interface GuideSection {
    id: string
    icon: typeof HelpCircle
    title: string
    description: string
    steps: string[]
    color: string
}

const GUIDE_SECTIONS: GuideSection[] = [
    {
        id: 'getting-started',
        icon: Rocket,
        title: 'Memulai CareerPath.id',
        description: 'Langkah pertama untuk memaksimalkan platform',
        color: 'indigo',
        steps: [
            'Lengkapi profil dan data pribadimu di halaman Profil',
            'Ikuti onboarding untuk mendapatkan rekomendasi karir dari AI',
            'Jelajahi halaman Karier untuk melihat path yang cocok',
            'Mulai track skill-mu di halaman Skills',
            'Set target bulanan di halaman Evaluasi'
        ]
    },
    {
        id: 'skills',
        icon: TrendingUp,
        title: 'Skill Tracking',
        description: 'Cara melacak dan meningkatkan kemampuanmu',
        color: 'green',
        steps: [
            'Buka halaman Skills untuk melihat radar chart skill-mu',
            'Update proficiency level untuk setiap skill (1-5)',
            'Lihat gap analysis terhadap karir target',
            'Selesaikan course untuk auto-update skill',
            'Upload sertifikat sebagai bukti kompetensi'
        ]
    },
    {
        id: 'learning',
        icon: BookOpen,
        title: 'Learning & Course',
        description: 'Panduan belajar dan menyelesaikan kursus',
        color: 'blue',
        steps: [
            'Browse course yang tersedia di halaman Learning',
            'Filter berdasarkan difficulty/provider/skill',
            'Klik "Mulai Belajar" untuk track progress',
            'Selesaikan quiz untuk mendapatkan XP',
            'Dapatkan sertifikat setelah menyelesaikan course'
        ]
    },
    {
        id: 'jobs',
        icon: Briefcase,
        title: 'Job Search & Matching',
        description: 'Cara mencari dan melamar lowongan kerja',
        color: 'purple',
        steps: [
            'Buka halaman Lowongan untuk melihat job listings',
            'Perhatikan Match Score - semakin tinggi semakin cocok',
            'Klik job untuk melihat detail dan skill requirements',
            'Simpan lowongan favorit untuk nanti',
            'Track status lamaran di halaman Lamaran'
        ]
    },
    {
        id: 'career',
        icon: Target,
        title: 'Career Planning',
        description: 'Merencanakan jalur karirmu',
        color: 'orange',
        steps: [
            'Gunakan AI Career Recommender di halaman Karier',
            'Pilih karir target untuk mendapatkan roadmap',
            'Lihat skill gap dan prioritas improvement',
            'Ikuti roadmap yang disarankan AI',
            'Evaluasi progress setiap bulan'
        ]
    },
    {
        id: 'wellness',
        icon: Heart,
        title: 'Mental Health & Mood',
        description: 'Menjaga kesehatan mental selama perjalanan karir',
        color: 'pink',
        steps: [
            'Lakukan daily mood check-in di halaman Mood',
            'Tulis jurnal untuk merefleksikan perasaanmu',
            'AI akan menganalisis sentiment dan memberikan saran',
            'Akses resources kesehatan mental di halaman Wellness',
            'Booking konsultasi dengan psikolog jika diperlukan'
        ]
    },
    {
        id: 'gamification',
        icon: Award,
        title: 'XP & Leaderboard',
        description: 'Sistem gamifikasi dan kompetisi',
        color: 'yellow',
        steps: [
            'Dapatkan XP dari menyelesaikan quiz dan course',
            'Upload sertifikat untuk bonus XP',
            'Naik level setiap 500 XP',
            'Lihat peringkatmu di Leaderboard',
            'Kumpulkan achievement badges'
        ]
    },
    {
        id: 'ai',
        icon: Sparkles,
        title: 'Fitur AI',
        description: 'Memaksimalkan fitur AI yang tersedia',
        color: 'violet',
        steps: [
            'Career Recommender: Rekomendasi karir berdasarkan profilmu',
            'Skill Gap Analyzer: Analisis gap skill vs karir target',
            'Job Matcher: Matching otomatis dengan lowongan kerja',
            'AI Chatbot: Tanya apa saja seputar karir (klik 💬 di kanan bawah)',
            'Sentiment Analyzer: Analisis mood dan saran berdasarkan jurnal',
            'Progress Predictor: Prediksi waktu untuk job-ready'
        ]
    }
]

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'bg-indigo-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600', icon: 'bg-pink-100' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'bg-yellow-100' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', icon: 'bg-violet-100' },
}

export default function GuidePage() {
    const [openSection, setOpenSection] = useState<string | null>('getting-started')

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <HelpCircle className="w-7 h-7 text-indigo-600" />
                    Panduan Pengguna
                </h1>
                <p className="text-gray-500 mt-1">Pelajari cara memaksimalkan semua fitur CareerPath.id</p>
            </div>

            {/* Quick Start Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-start gap-4">
                    <Rocket className="w-10 h-10 opacity-80 flex-shrink-0 mt-1" />
                    <div>
                        <h2 className="font-bold text-lg">Selamat Datang di CareerPath.id! 🎉</h2>
                        <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
                            CareerPath.id adalah Career Operating System yang membantu Gen Z Indonesia
                            merencanakan karir, meningkatkan skill, dan menjaga kesehatan mental —
                            semua didukung oleh 7 modul AI.
                        </p>
                    </div>
                </div>
            </div>

            {/* Guide Sections */}
            <div className="space-y-3">
                {GUIDE_SECTIONS.map((section) => {
                    const colors = colorMap[section.color] || colorMap.indigo
                    const isOpen = openSection === section.id

                    return (
                        <div key={section.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setOpenSection(isOpen ? null : section.id)}
                                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-xl ${colors.icon} ${colors.text} flex items-center justify-center flex-shrink-0`}>
                                    <section.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">{section.description}</p>
                                </div>
                                {isOpen ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                            </button>

                            {isOpen && (
                                <div className={`px-5 pb-5 ${colors.bg} mx-4 mb-4 rounded-xl`}>
                                    <ol className="space-y-3 py-4">
                                        {section.steps.map((step, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className={`w-6 h-6 rounded-full ${colors.icon} ${colors.text} flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5`}>
                                                    {idx + 1}
                                                </div>
                                                <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Help Links */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Butuh Bantuan Lebih?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/contact" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <HelpCircle className="w-5 h-5 text-indigo-600" />
                        <div>
                            <p className="font-medium text-sm text-gray-900">Hubungi Support</p>
                            <p className="text-xs text-gray-500">Kirim pesan ke tim kami</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                    <a href="/dashboard/consultation" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <Brain className="w-5 h-5 text-purple-600" />
                        <div>
                            <p className="font-medium text-sm text-gray-900">Konsultasi Karir</p>
                            <p className="text-xs text-gray-500">Booking sesi dengan expert</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                    <a href="/features" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        <div>
                            <p className="font-medium text-sm text-gray-900">Semua Fitur</p>
                            <p className="text-xs text-gray-500">Lihat daftar lengkap fitur</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                </div>
            </div>
        </div>
    )
}
