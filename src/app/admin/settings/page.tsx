'use client'

import { useState, useEffect } from 'react'
import {
    Settings,
    Save,
    Loader2,
    Globe,
    Shield,
    Bell,
    Palette,
    Brain
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Setting {
    id: string
    key: string
    value: string | boolean | number
    description: string
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string | boolean | number>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        const fetchSettings = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('site_settings').select('*')

            if (data) {
                const settingsMap: Record<string, string | boolean | number> = {}
                data.forEach((s: Setting) => {
                    try {
                        settingsMap[s.key] = JSON.parse(s.value as string)
                    } catch {
                        settingsMap[s.key] = s.value
                    }
                })
                setSettings(settingsMap)
            }
            setIsLoading(false)
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        setMessage(null)

        try {
            const supabase = createClient()

            for (const [key, value] of Object.entries(settings)) {
                await supabase
                    .from('site_settings')
                    .update({ value: JSON.stringify(value), updated_at: new Date().toISOString() })
                    .eq('key', key)
            }

            setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' })
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal menyimpan pengaturan' })
        } finally {
            setIsSaving(false)
        }
    }

    const updateSetting = (key: string, value: string | boolean | number) => {
        setSettings({ ...settings, [key]: value })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
                    <p className="text-gray-400">Konfigurasi website</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Simpan
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {/* General Settings */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Umum</h2>
                        <p className="text-gray-400 text-sm">Pengaturan dasar website</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Nama Website</label>
                        <input
                            type="text"
                            value={settings.site_name as string || ''}
                            onChange={(e) => updateSetting('site_name', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Deskripsi Website</label>
                        <input
                            type="text"
                            value={settings.site_description as string || ''}
                            onChange={(e) => updateSetting('site_description', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Keamanan</h2>
                        <p className="text-gray-400 text-sm">Pengaturan keamanan dan akses</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Mode Maintenance</p>
                            <p className="text-gray-400 text-sm">Nonaktifkan akses publik sementara</p>
                        </div>
                        <button
                            onClick={() => updateSetting('maintenance_mode', !settings.maintenance_mode)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.maintenance_mode ? 'bg-red-500' : 'bg-gray-600'
                                }`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.maintenance_mode ? 'translate-x-7' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">Izinkan Pendaftaran</p>
                            <p className="text-gray-400 text-sm">Izinkan user baru untuk mendaftar</p>
                        </div>
                        <button
                            onClick={() => updateSetting('allow_registration', !settings.allow_registration)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.allow_registration ? 'bg-green-500' : 'bg-gray-600'
                                }`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.allow_registration ? 'translate-x-7' : 'translate-x-1'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Settings */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">AI Configuration</h2>
                        <p className="text-gray-400 text-sm">Pengaturan Groq AI</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Model Groq</label>
                        <select
                            value={settings.groq_model as string || 'llama-3.3-70b-versatile'}
                            onChange={(e) => updateSetting('groq_model', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 outline-none"
                        >
                            <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
                            <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant</option>
                            <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                            <option value="gemma2-9b-it">Gemma 2 9B</option>
                        </select>
                    </div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-400 text-sm">
                            💡 API Key Groq dikonfigurasi melalui environment variable <code className="bg-gray-700 px-1 rounded">GROQ_API_KEY</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
