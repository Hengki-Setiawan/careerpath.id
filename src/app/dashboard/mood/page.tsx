'use client'

import { useState, useEffect } from 'react'
import {
    Heart, BookOpen, Smile, Meh, Frown, CloudRain, Sun,
    Calendar, TrendingUp, ChevronRight, Plus, Sparkles, AlertTriangle,
    Leaf, BarChart3, CheckCircle, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface JournalEntry {
    id: string
    date: string
    mood: number // 1-5
    content: string
    tags: string[]
}

interface MoodEntry {
    date: string
    mood: number
    note?: string
}

const MOOD_EMOJIS = [
    { value: 1, emoji: '😢', label: 'Sangat Buruk', color: 'bg-rose-100 text-rose-600 border-rose-200' },
    { value: 2, emoji: '😔', label: 'Buruk', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { value: 3, emoji: '😐', label: 'Biasa', color: 'bg-amber-100 text-amber-600 border-amber-200' },
    { value: 4, emoji: '🙂', label: 'Baik', color: 'bg-teal-100 text-teal-600 border-teal-200' },
    { value: 5, emoji: '🤩', label: 'Luar Biasa', color: 'bg-cyan-100 text-cyan-600 border-cyan-200' },
]

const QUICK_TAGS = [
    'Produktif', 'Lelah', 'Stres', 'Termotivasi', 'Cemas', 'Bahagia',
    'Overwhelmed', 'Fokus', 'Bingung', 'Optimis', 'Bersyukur', 'Sakit'
]

// Mock data
const MOCK_MOODS: MoodEntry[] = [
    { date: '2026-02-09', mood: 4, note: 'Produktif hari ini' },
    { date: '2026-02-08', mood: 3, note: 'Biasa saja' },
    { date: '2026-02-07', mood: 5, note: 'Dapat interview!' },
    { date: '2026-02-06', mood: 2, note: 'Kurang tidur' },
    { date: '2026-02-05', mood: 4 },
    { date: '2026-02-04', mood: 3 },
    { date: '2026-02-03', mood: 4 },
]

const MOCK_JOURNALS: JournalEntry[] = [
    {
        id: '1',
        date: '2026-02-09',
        mood: 4,
        content: 'Hari ini berhasil menyelesaikan 2 course dan apply 3 jobs. Merasa produktif dan termotivasi untuk terus belajar.',
        tags: ['Produktif', 'Termotivasi']
    },
    {
        id: '2',
        date: '2026-02-07',
        mood: 5,
        content: 'Excited! Dapat email interview dari perusahaan yang aku impikan. Persiapan dimulai dari sekarang!',
        tags: ['Bahagia', 'Optimis']
    }
]

export default function MoodPage() {
    const [moods, setMoods] = useState<MoodEntry[]>(MOCK_MOODS)
    const [journals, setJournals] = useState<JournalEntry[]>(MOCK_JOURNALS)
    const [selectedMood, setSelectedMood] = useState<number | null>(null)
    const [showJournal, setShowJournal] = useState(false)
    const [journalText, setJournalText] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [activeTab, setActiveTab] = useState<'checkin' | 'history' | 'journal'>('checkin')

    // Calculate stats
    const avgMood = moods.length > 0
        ? (moods.reduce((sum, m) => sum + m.mood, 0) / moods.length).toFixed(1)
        : 0
    const streak = moods.length // Simplified streak calculation
    const todayLogged = moods.some(m => m.date === new Date().toISOString().split('T')[0])

    // Check for concerning pattern
    const recentMoods = moods.slice(0, 5)
    const lowMoodCount = recentMoods.filter(m => m.mood <= 2).length
    const needsAttention = lowMoodCount >= 3

    const saveMood = () => {
        if (!selectedMood) return
        const today = new Date().toISOString().split('T')[0]
        setMoods(prev => [{
            date: today,
            mood: selectedMood,
            note: journalText.slice(0, 50)
        }, ...prev.filter(m => m.date !== today)])

        if (journalText) {
            setJournals(prev => [{
                id: Date.now().toString(),
                date: today,
                mood: selectedMood,
                content: journalText,
                tags: selectedTags
            }, ...prev])
        }

        setSelectedMood(null)
        setJournalText('')
        setSelectedTags([])
        setShowJournal(false)
    }

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Heart className="w-7 h-7 text-teal-600" />
                        Mood Tracker
                    </h1>
                    <p className="text-gray-500 mt-1">Pantau & pahami emosimu setiap hari.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 border border-teal-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                        {MOOD_EMOJIS[Math.floor(Number(avgMood)) - 1]?.emoji || '😐'}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Rata-rata Mood</p>
                        <p className="text-2xl font-bold text-gray-900">{avgMood}/5</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tracking Streak</p>
                        <p className="text-2xl font-bold text-gray-900">{streak} Hari</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${todayLogged ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'
                        }`}>
                        {todayLogged ? <CheckCircle className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Hari Ini</p>
                        <p className={`text-xl font-bold ${todayLogged ? 'text-green-600' : 'text-gray-400'}`}>
                            {todayLogged ? 'Sudah Check-in' : 'Belum Check-in'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Alert if concerning pattern */}
            {needsAttention && (
                <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">Kami Peduli Denganmu 💙</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Terdeteksi mood yang rendah beberapa hari terakhir. Tidak apa-apa untuk merasa tidak baik-baik saja.
                            Mungkin berbicara dengan seseorang bisa membantu?
                        </p>
                        <a href="/dashboard/consultation" className="text-sm font-bold text-rose-600 hover:text-rose-700 hover:underline">
                            Booking Konsultasi →
                        </a>
                    </div>
                </div>
            )}

            {/* Main Interface */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Check-in / History tabs */}
                <div className="flex-1 space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-gray-100/50 rounded-xl w-fit">
                        {[
                            { id: 'checkin', label: 'Check-in', icon: Smile },
                            { id: 'history', label: 'Riwayat', icon: Calendar },
                            { id: 'journal', label: 'Jurnal', icon: BookOpen },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === tab.id
                                    ? 'bg-white text-teal-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* Check-in Tab */}
                        {activeTab === 'checkin' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                                        Bagaimana perasaanmu?
                                    </h2>
                                    <p className="text-gray-500 text-sm">Pilih emoji yang paling mewakili harimu</p>
                                </div>

                                {/* Mood Selection */}
                                <div className="flex justify-center gap-2 sm:gap-4 mb-8">
                                    {MOOD_EMOJIS.map(mood => (
                                        <button
                                            key={mood.value}
                                            onClick={() => setSelectedMood(mood.value)}
                                            className={`relative group transition-all duration-300 ${selectedMood === mood.value ? 'scale-110 -translate-y-2' : 'hover:-translate-y-1'
                                                }`}
                                        >
                                            <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-3xl sm:text-4xl rounded-2xl border-2 transition-all ${selectedMood === mood.value
                                                ? mood.color + ' shadow-lg'
                                                : 'bg-white border-gray-100 grayscale hover:grayscale-0'
                                                }`}>
                                                {mood.emoji}
                                            </div>
                                            <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium transition-opacity ${selectedMood === mood.value ? 'opacity-100 text-gray-900' : 'opacity-0 group-hover:opacity-100 text-gray-500'
                                                }`}>
                                                {mood.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Detailed Input (Tags & Note) */}
                                <AnimatePresence>
                                    {selectedMood && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-6 pt-4 border-t border-gray-100"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-gray-700 mb-3">Apa yang mempengaruhimu?</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {QUICK_TAGS.map(tag => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => toggleTag(tag)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedTags.includes(tag)
                                                                ? 'bg-teal-50 text-teal-700 border-teal-200'
                                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-sm font-bold text-gray-700">Catatan Harian</p>
                                                    <span className="text-xs text-gray-400">{journalText.length}/300</span>
                                                </div>
                                                <textarea
                                                    value={journalText}
                                                    onChange={(e) => setJournalText(e.target.value)}
                                                    maxLength={300}
                                                    rows={3}
                                                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none resize-none transition-all text-sm"
                                                    placeholder="Tuliskan apa yang ada di pikiranmu..."
                                                />
                                            </div>

                                            <button
                                                onClick={saveMood}
                                                className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Simpan Check-in
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* History Tab */}
                        {activeTab === 'history' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                {moods.map((entry, idx) => (
                                    <div key={idx} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-all">
                                        <div className="w-12 h-12 flex items-center justify-center text-3xl bg-gray-50 rounded-xl">
                                            {MOOD_EMOJIS[entry.mood - 1].emoji}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-bold text-gray-900">
                                                    {new Date(entry.date).toLocaleDateString('id-ID', {
                                                        weekday: 'long', day: 'numeric', month: 'long'
                                                    })}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${entry.mood >= 4 ? 'bg-green-100 text-green-700' :
                                                        entry.mood <= 2 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {MOOD_EMOJIS[entry.mood - 1].label}
                                                </span>
                                            </div>
                                            {entry.note && (
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{entry.note}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Journal Tab */}
                        {activeTab === 'journal' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                {journals.map(entry => (
                                    <div key={entry.id} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl bg-gray-50 p-2 rounded-xl">
                                                    {MOOD_EMOJIS[entry.mood - 1].emoji}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">
                                                        {new Date(entry.date).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'long', year: 'numeric'
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        {new Date(entry.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pl-4 border-l-2 border-teal-100 mb-4">
                                            <p className="text-gray-600 leading-relaxed text-sm">{entry.content}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            {entry.tags.map(tag => (
                                                <span key={tag} className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: Weekly Grid */}
                <div className="lg:w-80 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-teal-600" />
                            Mood Grafik (7 Hari)
                        </h3>
                        <div className="h-40 flex items-end justify-between gap-2 px-2">
                            {moods.slice(0, 7).reverse().map((m, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full flex justify-center">
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none z-10">
                                            {m.mood}/5 - {new Date(m.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                                        </div>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(m.mood / 5) * 100}%` }}
                                            className={`w-full max-w-[20px] rounded-t-lg transition-colors ${m.mood >= 4 ? 'bg-teal-400' :
                                                    m.mood === 3 ? 'bg-amber-400' : 'bg-rose-400'
                                                }`}
                                            style={{ minHeight: '4px' }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {new Date(m.date).toLocaleDateString('id-ID', { weekday: 'narrow' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white text-center relative overflow-hidden shadow-lg shadow-indigo-200">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <BookOpen className="w-10 h-10 mx-auto mb-3 text-indigo-200" />
                        <h3 className="font-bold text-lg mb-2">Refleksi Mingguan</h3>
                        <p className="text-indigo-100 text-sm mb-4">
                            "Kesehatan mental bukanlah tujuan, tapi sebuah proses. Hargai setiap langkah kecilmu."
                        </p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-sm font-bold transition-colors">
                            Baca Tips Minggu Ini
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
