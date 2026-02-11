'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Loader2,
    X,
    Zap,
    Filter
} from 'lucide-react'

interface Skill {
    id: string
    name: string
    category: string
    description: string
    icon_name: string
    is_active: boolean
}

const EMPTY_FORM: Partial<Skill> = {
    name: '',
    category: 'Hard Skill',
    description: '',
    icon_name: 'code',
    is_active: true,
}

const ICON_OPTIONS = [
    { value: 'code', label: 'Code' },
    { value: 'palette', label: 'Design' },
    { value: 'users', label: 'People' },
    { value: 'brain', label: 'Brain' },
    { value: 'book-open', label: 'Book' },
    { value: 'award', label: 'Award' },
    { value: 'star', label: 'Star' },
]

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const fetchSkills = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({ search, category: categoryFilter })
            const res = await fetch(`/api/admin/skills?${params}`)
            const data = await res.json()
            if (data.skills) {
                setSkills(data.skills)
            }
        } catch (error) {
            console.error('Failed to fetch skills:', error)
        } finally {
            setIsLoading(false)
        }
    }, [search, categoryFilter])

    useEffect(() => {
        fetchSkills()
    }, [fetchSkills])

    const handleSave = async () => {
        if (!editingSkill?.name) {
            alert('Name is required')
            return
        }

        setIsSaving(true)
        try {
            const method = editingSkill.id ? 'PATCH' : 'POST'
            const res = await fetch('/api/admin/skills', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingSkill),
            })

            if (res.ok) {
                fetchSkills()
                setShowModal(false)
                setEditingSkill(null)
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
        if (!confirm('Yakin ingin menghapus skill ini?')) return

        try {
            const res = await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                fetchSkills()
            }
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    const hardSkills = skills.filter(s => s.category === 'Hard Skill')
    const softSkills = skills.filter(s => s.category === 'Soft Skill')

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manajemen Skills</h1>
                    <p className="text-gray-400">{skills.length} skills tersedia</p>
                </div>
                <button
                    onClick={() => { setEditingSkill(EMPTY_FORM); setShowModal(true) }}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Skill
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari skill..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-violet-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="pl-10 pr-8 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 outline-none appearance-none cursor-pointer"
                    >
                        <option value="all">Semua Kategori</option>
                        <option value="Hard Skill">Hard Skill</option>
                        <option value="Soft Skill">Soft Skill</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Hard Skills */}
                    {(categoryFilter === 'all' || categoryFilter === 'Hard Skill') && hardSkills.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="w-3 h-3 bg-blue-500 rounded-full" />
                                Hard Skills ({hardSkills.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {hardSkills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-blue-500/50 transition-colors group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                                    <Zap className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">{skill.name}</h3>
                                                    <p className="text-gray-400 text-sm line-clamp-1">{skill.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingSkill(skill); setShowModal(true) }}
                                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(skill.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Soft Skills */}
                    {(categoryFilter === 'all' || categoryFilter === 'Soft Skill') && softSkills.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="w-3 h-3 bg-pink-500 rounded-full" />
                                Soft Skills ({softSkills.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {softSkills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-pink-500/50 transition-colors group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                                    <Zap className="w-5 h-5 text-pink-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">{skill.name}</h3>
                                                    <p className="text-gray-400 text-sm line-clamp-1">{skill.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingSkill(skill); setShowModal(true) }}
                                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(skill.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {skills.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            Tidak ada skill ditemukan
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && editingSkill && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg">
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingSkill.id ? 'Edit Skill' : 'Tambah Skill'}
                            </h2>
                            <button onClick={() => { setShowModal(false); setEditingSkill(null) }} className="p-2 text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Nama Skill *</label>
                                <input
                                    type="text"
                                    value={editingSkill.name || ''}
                                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Kategori</label>
                                <select
                                    value={editingSkill.category || 'Hard Skill'}
                                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                >
                                    <option value="Hard Skill">Hard Skill</option>
                                    <option value="Soft Skill">Soft Skill</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Deskripsi</label>
                                <textarea
                                    value={editingSkill.description || ''}
                                    onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Icon</label>
                                <select
                                    value={editingSkill.icon_name || 'code'}
                                    onChange={(e) => setEditingSkill({ ...editingSkill, icon_name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                                >
                                    {ICON_OPTIONS.map((icon) => (
                                        <option key={icon.value} value={icon.value}>{icon.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => { setShowModal(false); setEditingSkill(null) }}
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
