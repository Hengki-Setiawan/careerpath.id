'use client'

import { useState } from 'react'
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageCircle,
    Clock,
    CheckCircle,
    Loader2
} from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                setIsSubmitted(true)
                setFormData({ name: '', email: '', subject: '', message: '' })
            }
        } catch (error) {
            console.error('Failed to submit:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-50 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Punya pertanyaan atau saran? Tim kami siap membantu kamu
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4">
                                <Mail className="w-6 h-6 text-violet-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                            <p className="text-gray-600">hello@careerpath.id</p>
                            <p className="text-gray-600">support@careerpath.id</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                                <Phone className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                            <p className="text-gray-600">+62 812 3456 7890</p>
                            <p className="text-gray-500 text-sm">Sen-Jum, 09:00-17:00 WITA</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                                <MapPin className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Lokasi</h3>
                            <p className="text-gray-600">Makassar, Sulawesi Selatan</p>
                            <p className="text-gray-600">Indonesia</p>
                        </div>

                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5" />
                                <span className="font-semibold">Respons Cepat</span>
                            </div>
                            <p className="text-violet-100 text-sm">
                                Kami biasanya merespons dalam waktu 24 jam pada hari kerja
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-100 p-8">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesan Terkirim!</h2>
                                    <p className="text-gray-600 mb-6">
                                        Terima kasih telah menghubungi kami. Kami akan segera merespons.
                                    </p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="text-violet-600 font-medium hover:text-violet-700"
                                    >
                                        Kirim pesan lain
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                                                placeholder="Nama kamu"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Subjek</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                                            placeholder="Topik pesan"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Pesan</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all resize-none"
                                            placeholder="Tulis pesan kamu di sini..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors disabled:opacity-70"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Kirim Pesan
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAQ Quick Links */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
                    <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {[
                            { q: 'Apakah CareerPath.id gratis?', a: 'Ya, semua fitur dasar gratis untuk mahasiswa.' },
                            { q: 'Bagaimana cara menghapus akun?', a: 'Hubungi kami via email untuk penghapusan akun.' },
                            { q: 'Data saya aman?', a: 'Ya, kami menggunakan enkripsi dan standar keamanan tinggi.' },
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 text-left">
                                <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
                                <p className="text-gray-600 text-sm">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
