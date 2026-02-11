'use client'

import { useState } from 'react'
import {
    HelpCircle, ChevronDown, ChevronUp, Search, Mail, MessageCircle
} from 'lucide-react'

const FAQ_DATA = [
    {
        category: 'Akun & Profil',
        questions: [
            {
                q: 'Bagaimana cara membuat akun di CareerPath.id?',
                a: 'Klik tombol "Daftar" di halaman utama, isi email dan password, lalu verifikasi emailmu. Setelah itu, ikuti onboarding 10 langkah untuk mendapatkan rekomendasi karir personal dari AI.'
            },
            {
                q: 'Apakah data saya aman di CareerPath.id?',
                a: 'Ya! Kami menggunakan enkripsi end-to-end, Supabase Auth untuk autentikasi, dan mematuhi standar GDPR. Kamu bisa export atau hapus datamu kapan saja di halaman Settings.'
            },
            {
                q: 'Bagaimana cara mengubah password?',
                a: 'Buka Dashboard → Settings → Akun → Ubah Password. Masukkan password lama dan password baru. Password baru minimal 8 karakter dengan huruf besar dan angka.'
            },
            {
                q: 'Bagaimana cara menghapus akun?',
                a: 'Buka Settings → Akun → Hapus Akun. Ketik "DELETE_MY_ACCOUNT" untuk konfirmasi. Semua data akan dihapus permanen dan tidak dapat dikembalikan.'
            }
        ]
    },
    {
        category: 'Fitur AI',
        questions: [
            {
                q: 'AI apa saja yang tersedia di CareerPath.id?',
                a: 'Kami memiliki 7 modul AI: Career Recommender, Skill Gap Analyzer, Learning Recommender, Job Matcher, Progress Predictor, Career Chatbot, dan Sentiment Analyzer. Semua powered by Groq AI.'
            },
            {
                q: 'Apakah rekomendasi AI akurat?',
                a: 'AI kami menganalisis data profilmu, skill, dan tren pasar kerja terkini untuk memberikan rekomendasi yang personalized. Semakin lengkap profilmu, semakin akurat rekomendasinya.'
            },
            {
                q: 'Bagaimana cara menggunakan AI Chatbot?',
                a: 'Klik ikon chat (💬) di pojok kanan bawah dashboard. Kamu bisa bertanya tentang karir, skill, tips interview, atau apa pun seputar pengembangan karir.'
            }
        ]
    },
    {
        category: 'Learning & Skills',
        questions: [
            {
                q: 'Bagaimana cara mendapatkan XP?',
                a: 'Kamu bisa mendapatkan XP dengan: menyelesaikan quiz (+50-200 XP), menyelesaikan course (+100 XP), upload sertifikat (+75 XP), dan daily mood check-in (+10 XP).'
            },
            {
                q: 'Apa itu Skill Radar Chart?',
                a: 'Skill Radar Chart adalah visualisasi skill-mu dalam bentuk radar/spider chart. Ini menunjukkan proficiency level (1-5) untuk setiap skill yang kamu track.'
            },
            {
                q: 'Bagaimana cara upload sertifikat?',
                a: 'Buka Dashboard → Portfolio → Certificates → Upload Certificate. Upload file gambar/PDF sertifikatmu, isi title dan issuer, lalu klik simpan.'
            }
        ]
    },
    {
        category: 'Lowongan Kerja',
        questions: [
            {
                q: 'Apa itu Match Score?',
                a: 'Match Score adalah persentase kecocokan antara skill-mu dengan requirement lowongan. Score 80%+ artinya kamu sangat cocok untuk posisi tersebut.'
            },
            {
                q: 'Bagaimana cara melamar pekerjaan?',
                a: 'Buka halaman Lowongan → klik lowongan yang menarik → klik "Lamar". Kamu bisa menambahkan cover letter. Track status lamaranmu di halaman Lamaran.'
            },
            {
                q: 'Apakah lowongan kerja di CareerPath.id real?',
                a: 'Ya, lowongan kerja kami dikurasi dari berbagai sumber terpercaya. Data diperbarui secara berkala untuk memastikan relevansi.'
            }
        ]
    },
    {
        category: 'Mental Health',
        questions: [
            {
                q: 'Apa itu Daily Mood Check-in?',
                a: 'Fitur untuk mencatat mood harianmu (skala 1-5), level energi, dan stress. AI akan menganalisis tren mood-mu dan memberikan saran wellness.'
            },
            {
                q: 'Apakah data mood saya bersifat privat?',
                a: 'Ya, data mood dan jurnal kamu sepenuhnya privat. Hanya kamu yang bisa mengaksesnya. Kami tidak membagikan data ini ke pihak mana pun.'
            },
            {
                q: 'Bagaimana cara booking konsultasi?',
                a: 'Buka Dashboard → Konsultasi → pilih psikolog atau career counselor → pilih jadwal → konfirmasi. Sesi konsultasi diadakan via video call.'
            }
        ]
    }
]

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState('')

    const toggleItem = (key: string) => {
        setOpenItems(prev => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    const filteredFAQ = searchQuery.trim()
        ? FAQ_DATA.map(cat => ({
            ...cat,
            questions: cat.questions.filter(
                q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    q.a.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(cat => cat.questions.length > 0)
        : FAQ_DATA

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 rounded-full text-indigo-600 text-sm font-medium mb-4">
                        <HelpCircle className="w-4 h-4" />
                        FAQ
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Temukan jawaban untuk pertanyaan umum tentang CareerPath.id
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-xl mx-auto mb-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari pertanyaan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm"
                    />
                </div>

                {/* FAQ Sections */}
                <div className="space-y-8">
                    {filteredFAQ.map((category) => (
                        <div key={category.category}>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">{category.category}</h2>
                            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden shadow-sm">
                                {category.questions.map((item, idx) => {
                                    const key = `${category.category}-${idx}`
                                    const isOpen = openItems.has(key)
                                    return (
                                        <div key={idx}>
                                            <button
                                                onClick={() => toggleItem(key)}
                                                className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="flex-1 font-medium text-gray-900 text-sm">
                                                    {item.q}
                                                </span>
                                                {isOpen ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                )}
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-4">
                                                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
                                                        {item.a}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
                    <h3 className="text-xl font-bold mb-2">Belum Menemukan Jawaban?</h3>
                    <p className="text-indigo-100 mb-6">Hubungi tim support kami, kami siap membantu!</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            Kirim Pesan
                        </a>
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
