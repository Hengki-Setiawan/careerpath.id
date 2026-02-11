'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Mail, School, MapPin, Phone, GraduationCap, Save, Loader2 } from 'lucide-react'
import type { User as UserType } from '@/lib/database.types'

export default function ProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<Partial<UserType>>({})
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) {
                setFormData(data)
            }
            setLoading(false)
        }

        fetchProfile()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { error } = await supabase
            .from('users')
            .update({
                full_name: formData.full_name,
                university: formData.university,
                major: formData.major,
                semester: formData.semester,
                bio: formData.bio,
                phone: formData.phone,
                city: formData.city
            })
            .eq('id', user.id)

        setSaving(false)
        if (error) {
            setMessage({ type: 'error', text: 'Gagal melakukan update profil' })
        } else {
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Profil Saya
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Kelola informasi pribadi dan preferensi akunmu
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header / Banner */}
                <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
                            <div className="w-full h-full rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                                <User className="w-10 h-10" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-16">
                    {message && (
                        <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {message.type === 'success' ? '✅' : '❌'} {message.text}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Personal Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-violet-600" />
                                Informasi Pribadi
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={formData.full_name || ''}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-600 outline-none transition-all"
                                        placeholder="Nama lengkapmu"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio Singkat</label>
                                    <textarea
                                        value={formData.bio || ''}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-600 outline-none transition-all resize-none"
                                        placeholder="Ceritakan sedikit tentang dirimu..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.city || ''}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-600 outline-none transition-all"
                                                placeholder="Kota domisili"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.phone || ''}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-600 outline-none transition-all"
                                                placeholder="08..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Education Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-indigo-600" />
                                Pendidikan
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Universitas</label>
                                    <div className="relative">
                                        <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.university || ''}
                                            onChange={e => setFormData({ ...formData, university: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-600 outline-none transition-all"
                                            placeholder="Nama Universitas"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                                        <input
                                            type="text"
                                            value={formData.major || ''}
                                            onChange={e => setFormData({ ...formData, major: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-600 outline-none transition-all"
                                            placeholder="Informatika"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                        <input
                                            type="number"
                                            value={formData.semester || ''}
                                            onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-600 outline-none transition-all"
                                            placeholder="5"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tips Card */}
                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 mt-6">
                                <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                    💡 Tips Profil
                                </h4>
                                <p className="text-sm text-indigo-700 leading-relaxed">
                                    Lengkapi profilmu agar AI kami bisa memberikan rekomendasi karier dan skill yang lebih akurat dan personal untukmu!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 pt-8 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-violet-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
