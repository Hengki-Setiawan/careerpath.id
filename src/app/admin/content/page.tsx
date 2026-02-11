'use client'

import { useState, useEffect } from 'react'
import {
    FileText,
    Edit,
    Save,
    Loader2,
    X,
    Eye,
    Globe,
    Check
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PageContent {
    id: string
    page_key: string
    title: string
    content: Record<string, unknown>
    meta_title: string
    meta_description: string
    updated_at: string
}

const PAGES = [
    { key: 'about', name: 'Tentang Kami', icon: '📖' },
    { key: 'features', name: 'Fitur', icon: '⚡' },
    { key: 'privacy', name: 'Kebijakan Privasi', icon: '🔒' },
    { key: 'terms', name: 'Syarat & Ketentuan', icon: '📋' },
]

export default function AdminContentPage() {
    const [pages, setPages] = useState<PageContent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingPage, setEditingPage] = useState<PageContent | null>(null)
    const [editContent, setEditContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        const fetchPages = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('page_contents')
                .select('*')
                .order('page_key')

            if (data) setPages(data)
            setIsLoading(false)
        }
        fetchPages()
    }, [])

    const handleEdit = (page: PageContent) => {
        setEditingPage(page)
        setEditContent(JSON.stringify(page.content, null, 2))
    }

    const handleSave = async () => {
        if (!editingPage) return

        setIsSaving(true)
        setMessage(null)

        try {
            const parsedContent = JSON.parse(editContent)
            const supabase = createClient()

            const { error } = await supabase
                .from('page_contents')
                .update({
                    content: parsedContent,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingPage.id)

            if (error) throw error

            // Update local state
            setPages(pages.map(p =>
                p.id === editingPage.id
                    ? { ...p, content: parsedContent, updated_at: new Date().toISOString() }
                    : p
            ))
            setMessage({ type: 'success', text: 'Konten berhasil disimpan!' })
            setTimeout(() => setEditingPage(null), 1500)
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal menyimpan. Pastikan format JSON valid.' })
        } finally {
            setIsSaving(false)
        }
    }

    const getPageInfo = (key: string) => PAGES.find(p => p.key === key) || { key, name: key, icon: '📄' }

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Manajemen Konten</h1>
                <p className="text-gray-400">Edit konten halaman website</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {pages.map((page) => {
                    const info = getPageInfo(page.page_key)
                    return (
                        <div
                            key={page.id}
                            className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{info.icon}</span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{info.name}</h3>
                                        <p className="text-gray-400 text-sm">/{page.page_key}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`/${page.page_key}`}
                                        target="_blank"
                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Lihat Halaman"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => handleEdit(page)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Edit Konten"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-500 text-xs mt-4">
                                Terakhir diupdate: {new Date(page.updated_at).toLocaleString('id-ID')}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Edit Modal */}
            {editingPage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Edit: {getPageInfo(editingPage.page_key).name}
                                </h2>
                                <p className="text-gray-400 text-sm">Edit konten dalam format JSON</p>
                            </div>
                            <button
                                onClick={() => setEditingPage(null)}
                                className="p-2 text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {message && (
                            <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 ${message.type === 'success'
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                }`}>
                                {message.type === 'success' && <Check className="w-4 h-4" />}
                                {message.text}
                            </div>
                        )}

                        <div className="p-6 flex-1 overflow-hidden">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full h-[400px] px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-300 font-mono text-sm focus:border-violet-500 outline-none resize-none"
                                placeholder="JSON content..."
                            />
                        </div>

                        <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => setEditingPage(null)}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
