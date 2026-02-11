'use client'

import { useState } from 'react'
import {
    UserCheck, Calendar, Clock, Video, Phone, MessageSquare,
    Star, ChevronRight, CheckCircle, Loader2, Heart, Brain, Sparkles,
    Shield, MapPin, Search, Filter, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Consultant {
    id: string
    name: string
    title: string
    specializations: string[]
    rating: number
    reviews: number
    price: number
    available: string[]
    avatar: string
    type: 'psikolog' | 'konselor' | 'mentor'
    experience: number
}

const CONSULTANTS: Consultant[] = [
    {
        id: '1',
        name: 'Dr. Siti Aminah, M.Psi',
        title: 'Psikolog Klinis',
        specializations: ['Anxiety', 'Stress Kerja', 'Quarter-life Crisis'],
        rating: 4.9,
        reviews: 128,
        price: 150000,
        available: ['09:00', '10:00', '14:00', '15:00'],
        avatar: '👩‍⚕️',
        type: 'psikolog',
        experience: 8
    },
    {
        id: '2',
        name: 'Budi Santoso, S.Psi',
        title: 'Career Counselor',
        specializations: ['Career Transition', 'Interview Prep', 'CV Review'],
        rating: 4.8,
        reviews: 95,
        price: 100000,
        available: ['10:00', '11:00', '13:00', '16:00'],
        avatar: '👨‍💼',
        type: 'konselor',
        experience: 5
    },
    {
        id: '3',
        name: 'Maria Chen',
        title: 'Tech Industry Mentor',
        specializations: ['Software Engineering', 'Data Science', 'Product Management'],
        rating: 4.9,
        reviews: 67,
        price: 200000,
        available: ['19:00', '20:00', '21:00'],
        avatar: '👩‍💻',
        type: 'mentor',
        experience: 10
    },
    {
        id: '4',
        name: 'Andi Wijaya, M.Psi',
        title: 'Psikolog Industri',
        specializations: ['Work-Life Balance', 'Burnout', 'Pengembangan Diri'],
        rating: 4.7,
        reviews: 82,
        price: 125000,
        available: ['08:00', '09:00', '10:00', '14:00'],
        avatar: '👨‍⚕️',
        type: 'psikolog',
        experience: 6
    }
]

export default function ConsultationPage() {
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [step, setStep] = useState<'choose' | 'booking' | 'confirm'>('choose')
    const [isBooking, setIsBooking] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleBook = async () => {
        setIsBooking(true)
        // Simulate booking
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsBooking(false)
        setStep('confirm')
    }

    const resetBooking = () => {
        setSelectedConsultant(null)
        setSelectedDate('')
        setSelectedTime('')
        setStep('choose')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Filter logic
    const filteredConsultants = CONSULTANTS.filter(c => {
        const matchesType = selectedType ? c.type === selectedType : true
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesType && matchesSearch
    })

    return (
        <div className="space-y-8 pb-10 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <UserCheck className="w-8 h-8 text-teal-600" />
                        Konsultasi Profesional
                    </h1>
                    <p className="text-gray-500 mt-1">Temukan mentor & psikolog terbaik untuk perjalanan kariermu.</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* FINAL STEP: Confirmation */}
                {step === 'confirm' && selectedConsultant && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl max-w-xl mx-auto text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle className="w-12 h-12 text-teal-600" />
                        </motion.div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Berhasil! 🎉</h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            Jadwalmu dengan <span className="font-semibold text-teal-600">{selectedConsultant.name}</span> telah terkonfirmasi.
                        </p>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-5xl">{selectedConsultant.avatar}</div>
                                <div>
                                    <p className="font-bold text-gray-900 text-lg">{selectedConsultant.name}</p>
                                    <p className="text-gray-500">{selectedConsultant.title}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Calendar className="w-5 h-5 text-teal-500" />
                                    <span className="font-medium">
                                        {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Clock className="w-5 h-5 text-teal-500" />
                                    <span className="font-medium">{selectedTime} WIB</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Video className="w-5 h-5 text-teal-500" />
                                    <span className="font-medium">Google Meet (Link dikirim via email)</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={resetBooking}
                            className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
                        >
                            Kembali ke Daftar
                        </button>
                    </motion.div>
                )}

                {/* STEP 2: Booking Form */}
                {step === 'booking' && selectedConsultant && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {/* Profile Card (Left) */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-8">
                                <button
                                    onClick={() => setStep('choose')}
                                    className="flex items-center gap-2 text-gray-500 hover:text-teal-600 font-medium mb-6 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 rotate-180" />
                                    Kembali
                                </button>

                                <div className="text-center mb-6">
                                    <div className="text-7xl mb-4">{selectedConsultant.avatar}</div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedConsultant.name}</h2>
                                    <p className="text-teal-600 font-medium">{selectedConsultant.title}</p>
                                </div>

                                <div className="flex items-center justify-center gap-4 mb-6 text-sm">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg text-amber-700 font-bold border border-amber-100">
                                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                        {selectedConsultant.rating}
                                    </div>
                                    <div className="text-gray-500 font-medium">
                                        {selectedConsultant.experience} Tahun Pengalaman
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    {selectedConsultant.specializations.map(spec => (
                                        <div key={spec} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                            <CheckCircle className="w-4 h-4 text-teal-500" />
                                            {spec}
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Total Biaya</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        Rp {selectedConsultant.price.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Form (Right) */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-teal-500" />
                                    Pilih Jadwal Konsultasi
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Waktu (WIB)</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedConsultant.available.map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`px-3 py-3 rounded-xl text-sm font-bold transition-all border ${selectedTime === time
                                                        ? 'bg-teal-600 text-white border-teal-600 shadow-md transform scale-[1.02]'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBook}
                                    disabled={!selectedDate || !selectedTime || isBooking}
                                    className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-200 flex items-center justify-center gap-2 text-lg"
                                >
                                    {isBooking ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Memproses Pembayaran...
                                        </>
                                    ) : (
                                        <>
                                            Konfirmasi Booking
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    Pembayaran aman & terenkripsi
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STEP 1: Choose Consultant */}
                {step === 'choose' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Filters */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau spesialisasi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-teal-500/20 text-sm font-medium"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                                {[
                                    { id: 'psikolog', label: 'Psikolog', icon: Brain },
                                    { id: 'konselor', label: 'Konselor', icon: Heart },
                                    { id: 'mentor', label: 'Mentor', icon: Sparkles },
                                ].map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${selectedType === type.id
                                                ? 'bg-teal-50 text-teal-700 border-teal-200 shadow-sm'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <type.icon className="w-4 h-4" />
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredConsultants.map((consultant, idx) => (
                                <motion.div
                                    key={consultant.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-teal-900/5 transition-all group cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        setSelectedConsultant(consultant)
                                        setStep('booking')
                                    }}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-100 transition-colors" />

                                    <div className="relative z-10">
                                        <div className="flex items-start gap-5 mb-6">
                                            <div className="text-6xl bg-gray-50 rounded-2xl p-2 shadow-inner">
                                                {consultant.avatar}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                                                    {consultant.name}
                                                </h3>
                                                <p className="text-teal-600 font-medium text-sm mb-2">{consultant.title}</p>
                                                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                                    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg">
                                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                        {consultant.rating}
                                                    </span>
                                                    <span>{consultant.reviews} Reviews</span>
                                                    <span>•</span>
                                                    <span>{consultant.experience}thn Pengalaman</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-wrap mb-6">
                                            {consultant.specializations.slice(0, 3).map(spec => (
                                                <span key={spec} className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold">
                                                    {spec}
                                                </span>
                                            ))}
                                            {consultant.specializations.length > 3 && (
                                                <span className="px-2.5 py-1 bg-gray-50 text-gray-400 rounded-lg text-xs font-bold">
                                                    +{consultant.specializations.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium mb-0.5">Biaya Sesi</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    Rp {(consultant.price / 1000)}K
                                                    <span className="text-xs font-medium text-gray-400 ml-1">/45mnt</span>
                                                </p>
                                            </div>
                                            <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl group-hover:bg-teal-600 transition-colors shadow-lg shadow-gray-200 group-hover:shadow-teal-200 flex items-center gap-2">
                                                Booking
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Banner */}
                        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-6 border border-rose-100 flex items-center gap-5">
                            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                <Heart className="w-7 h-7 text-rose-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg mb-1">Butuh Bantuan Segera?</h3>
                                <p className="text-sm text-gray-600 mb-0">
                                    Jika kamu dalam kondisi darurat, jangan ragu untuk menghubungi bantuan profesional.
                                </p>
                            </div>
                            <a
                                href="tel:119"
                                className="px-6 py-3 bg-white text-rose-600 font-bold rounded-xl shadow-sm hover:bg-rose-50 transition-colors border border-rose-200 whitespace-nowrap"
                            >
                                Hotline 119
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
