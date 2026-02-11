'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Loader2,
    X,
    Briefcase,
    DollarSign,
    TrendingUp
} from 'lucide-react'

interface Career {
    id: string
    title: string
    description: string
    industry: string
    salary_range_min: number
    salary_range_max: number
    job_type: string
    experience_level: string
    demand_level: string
    growth_outlook: string
    icon_name: string
    color: string
    is_active: boolean
}

const EMPTY_FORM: Partial<Career> = {
    title: '',
    description: '',
    industry: '',
    salary_range_min: 0,
    salary_range_max: 0,
    job_type: 'Full-time',
    experience_level: 'Entry Level',
    demand_level: 'Medium',
    growth_outlook: '',
    icon_name: 'briefcase',
    color: '#8B5CF6',
    is_active: true,
}

export default function AdminCareersPage() {
    const [careers, setCareers] = useState<Career[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingCareer, setEditingCareer] = useState<Partial<Career> | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const fetchCareers = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({ search })
            const res = await fetch(`/api/admin/careers?${params}`)
            const data = await res.json()
            if (data.careers) {
                setCareers(data.careers)
            }
        } catch (error) {
            console.error('Failed to fetch careers:', error)
        } finally {
            setIsLoading(false)
        }
    }, [search])

    useEffect(() => {
        fetchCareers()
    }, [fetchCareers])

    const handleSave = async () => {
        if (!editingCareer?.title) {
            alert('Title is required')
            return
        }

        setIsSaving(true)
        try {
            const method = editingCareer.id ? 'PATCH' : 'POST'
            const res = await fetch('/api/admin/careers', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingCareer),
            })

            if (res.ok) {
                fetchCareers()
                setShowModal(false)
                setEditingCareer(null)
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to save')
            }
        } catch (error) {
            console.error('Failed to save:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus karier ini?')) return

        try {
            const res = await fetch(`/api/admin/careers?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchCareers()
            }
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    const getDemandColor = (level: string) => {
        switch (level) {
            case 'Very High': return 'bg-green-500/20 text-green-400'
            case 'High': return 'bg-blue-500/20 text-blue-400'
            case 'Medium': return 'bg-yellow-500/20 text-yellow-400'
            default: return 'bg-gray-500/20 text-gray-400'
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manajemen Karier</h1>
                    <p className="text-gray-400">{careers.length} karier tersedia</p>
                </div>
                <button
                    onClick={() => { setEditingCareer(EMPTY_FORM); setShowModal(true) }}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Karier
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari karier..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-violet-500 outline-none"
                />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {careers.map((career) => (
                        <div
                            key={career.id}
                            className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: career.color + '30' }}
                                    >
                                        <Briefcase className="w-6 h-6" style={{ color: career.color }} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{career.title}</h3>
                                        <p className="text-gray-400 text-sm">{career.industry}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => { setEditingCareer(career); setShowModal(true) }}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(career.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{career.description}</p>

                            <div className="flex items-center gap-2 mb-3">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <span className="text-gray-300 text-sm">
                                    Rp {(career.salary_range_min / 1000000).toFixed(0)}jt - {(career.salary_range_max / 1000000).toFixed(0)}jt
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(career.demand_level)}`}>
                                    {career.demand_level}
                                </span>
                                <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                                    {career.job_type}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && editingCareer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingCareer.id ? 'Edit Karier' : 'Tambah Karier'}
                            </h2>
                            <button onClick={() => { setShowModal(false); setEditingCareer(null) }} className="p-2 text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-gray-400 text-sm mb-1">Judul Karier *</label>
                                    <input
                                        type="text"
                                        value={editingCareer.title || ''}
                                        onChange={(e) => setEditingCareer({ ...editingCareer, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Industri</label>
                                    <input
                                        type="text"
                                        value={editingCareer.industry || ''}
                                        onChange={(e) => setEditingCareer({ ...editingCareer, industry: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Warna</label>
                                    <input
                                        type="color"
                                        value={editingCareer.color || '#8B5CF6'}
                                        onChange={(e) => setEditingCareer({ ...editingCareer, color: e.target.value })}
                                        className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-gray-400 text-sm mb-1">Deskripsi</label>
                                    <textarea
                                        value={editingCareer.description || ''}
                                        onChange={(e) => setEditingCareer({ ...editingCareer, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Gaji Min (Rp)</label>
                                    <input
                                        type="number"
                                        value={editingCareer.salary_range_min || 0}
                                        onChange={(e) => setEditingCareer({ ...editingCareer, salary_range_min: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Gaji Max (Rp)</label>
                                    <input
                                        type="number"
                                        value={editingCareer.salary_range_max || 0}
                                        onChange={(e) => setEditingCareer({ ...editingCareer, salary_range_max: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Tipe Pekerjaan</label>
                                    <select
                                        value={editingCareer.job_type || 'Full-time'}
                                        onChange={(e) => setEditingCareer({ ...editingCareer, job_type: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Level Pengalaman</label>
                                    <select
                                        value={editingCareer.experience_level || 'Entry Level'}
                                        onChange={(e) => setEditingCareer({ ...editingCareer, experience_level: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                    >
                                        <option value="Entry Level">Entry Level</option>
                                        <option value="Mid Level">Mid Level</option>
                                        <option value="Senior Level">Senior Level</option>
                                        <option value="Lead/Manager">Lead/Manager</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Tingkat Permintaan</label>
                                    <select
                                        value={editingCareer.demand_level || 'Medium'}
                                        onChange={(e) => setEditingCareer({ ...editingCareer, demand_level: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Very High">Very High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Prospek Pertumbuhan</label>
                                    <input
                                        type="text"
                                        value={editingCareer.growth_outlook || ''}
                                        onChange={(e) => setEditingCareer({ ...editingCareer, growth_outlook: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                        placeholder="e.g., Growing Fast"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => { setShowModal(false); setEditingCareer(null) }}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
