'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2, Trash } from 'lucide-react'

export default function JobFormPage({ params }: { params: { id: string } }) {
    const isNew = params.id === 'new'
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(!isNew)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        job_type: 'Full-time',
        salary_min: 0,
        salary_max: 0,
        description: '',
        requirements: '', // comma separated
        skills_required: '', // comma separated
        skills_preferred: '', // comma separated
        experience_years: 0,
        is_active: true
    })

    useEffect(() => {
        if (!isNew) {
            fetchJob()
        }
    }, [isNew, params.id])

    const fetchJob = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', params.id)
                .single()

            if (error) throw error

            if (data) {
                setFormData({
                    title: data.title,
                    company: data.company,
                    location: data.location || '',
                    job_type: data.job_type || 'Full-time',
                    salary_min: data.salary_min || 0,
                    salary_max: data.salary_max || 0,
                    description: data.description || '',
                    requirements: data.requirements?.join(', ') || '',
                    skills_required: data.skills_required?.join(', ') || '',
                    skills_preferred: data.skills_preferred?.join(', ') || '',
                    experience_years: data.experience_years || 0,
                    is_active: data.is_active ?? true
                })
            }
        } catch (error) {
            console.error('Error fetching job:', error)
            alert('Gagal mengambil data lowongan')
            router.push('/admin/jobs')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const supabase = createClient()

            const payload = {
                title: formData.title,
                company: formData.company,
                location: formData.location,
                job_type: formData.job_type,
                salary_min: formData.salary_min,
                salary_max: formData.salary_max,
                description: formData.description,
                requirements: formData.requirements.split(',').map(s => s.trim()).filter(s => s),
                skills_required: formData.skills_required.split(',').map(s => s.trim()).filter(s => s),
                skills_preferred: formData.skills_preferred.split(',').map(s => s.trim()).filter(s => s),
                experience_years: formData.experience_years,
                is_active: formData.is_active
            }

            if (isNew) {
                const { error } = await supabase.from('jobs').insert([payload])
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('jobs')
                    .update(payload)
                    .eq('id', params.id)
                if (error) throw error
            }

            router.push('/admin/jobs')
            router.refresh()
        } catch (error) {
            console.error('Error saving job:', error)
            alert('Gagal menyimpan data')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/jobs"
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white">
                    {isNew ? 'Tambah Lowongan Baru' : 'Edit Lowongan'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Judul Posisi</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                            placeholder="Contoh: Senior Frontend Developer"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Nama Perusahaan</label>
                        <input
                            type="text"
                            required
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                            placeholder="Contoh: Tokopedia"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Lokasi</label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                            placeholder="Contoh: Jakarta / Remote"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Tipe Pekerjaan</label>
                        <select
                            value={formData.job_type}
                            onChange={e => setFormData({ ...formData, job_type: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Freelance">Freelance</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Gaji Minimum (Rp)</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.salary_min}
                            onChange={e => setFormData({ ...formData, salary_min: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Gaji Maksimum (Rp)</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.salary_max}
                            onChange={e => setFormData({ ...formData, salary_max: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Deskripsi Pekerjaan</label>
                    <textarea
                        required
                        rows={6}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                        placeholder="Deskripsikan tanggung jawab dan benefit..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Requirements (Pisahkan dengan koma)</label>
                    <textarea
                        rows={3}
                        value={formData.requirements}
                        onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                        placeholder="Contoh: S1 Teknik Informatika, Pengalaman 2 tahun, Bisa Bahasa Inggris"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Required Skills (Pisahkan dengan koma)</label>
                        <input
                            type="text"
                            value={formData.skills_required}
                            onChange={e => setFormData({ ...formData, skills_required: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                            placeholder="Contoh: React, Node.js, SQL"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Preferred Skills (Pisahkan dengan koma)</label>
                        <input
                            type="text"
                            value={formData.skills_preferred}
                            onChange={e => setFormData({ ...formData, skills_preferred: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                            placeholder="Contoh: AWS, Docker, TypeScript"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSaving ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                    <Link
                        href="/admin/jobs"
                        className="px-6 py-2 bg-transparent hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-600"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    )
}
