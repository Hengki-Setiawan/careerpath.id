'use client'

import { useState } from 'react'
import {
    Settings, Bell, Shield, Eye, Moon, Sun, Globe, Trash2,
    ChevronRight, User, Mail, Lock, LogOut, Download, Loader2
} from 'lucide-react'

interface SettingsSection {
    id: string
    title: string
    description: string
    icon: typeof Settings
    items: SettingItem[]
}

interface SettingItem {
    id: string
    label: string
    description?: string
    type: 'toggle' | 'select' | 'action'
    value?: boolean | string
    options?: string[]
    danger?: boolean
}

const SETTINGS_SECTIONS: SettingsSection[] = [
    {
        id: 'notifications',
        title: 'Notifikasi',
        description: 'Kelola preferensi notifikasimu',
        icon: Bell,
        items: [
            { id: 'email_digest', label: 'Email Digest Mingguan', description: 'Ringkasan progress dan rekomendasi', type: 'toggle', value: true },
            { id: 'job_alerts', label: 'Alert Lowongan Baru', description: 'Notifikasi saat ada lowongan match 80%+', type: 'toggle', value: true },
            { id: 'learning_reminder', label: 'Pengingat Belajar', description: 'Ingatkan untuk belajar setiap hari', type: 'toggle', value: true },
            { id: 'mood_checkin', label: 'Daily Mood Check-in', description: 'Pengingat mood tracking harian', type: 'toggle', value: false },
            { id: 'evaluation', label: 'Evaluasi Bulanan', description: 'Notifikasi akhir bulan untuk evaluasi', type: 'toggle', value: true },
        ]
    },
    {
        id: 'privacy',
        title: 'Privasi & Keamanan',
        description: 'Kontrol data dan keamanan akun',
        icon: Shield,
        items: [
            { id: 'public_portfolio', label: 'Portfolio Publik', description: 'Izinkan orang lain melihat portfolio', type: 'toggle', value: false },
            { id: 'show_progress', label: 'Tampilkan Progress di Community', description: 'Bagikan achievement di community', type: 'toggle', value: true },
            { id: 'analytics', label: 'Analytics & Personalisasi', description: 'Izinkan AI menganalisis data untuk personalisasi', type: 'toggle', value: true },
        ]
    },
    {
        id: 'display',
        title: 'Tampilan',
        description: 'Sesuaikan tampilan aplikasi',
        icon: Eye,
        items: [
            { id: 'theme', label: 'Tema', type: 'select', value: 'light', options: ['Light', 'Dark', 'System'] },
            { id: 'language', label: 'Bahasa', type: 'select', value: 'id', options: ['Indonesia', 'English'] },
        ]
    },
    {
        id: 'account',
        title: 'Akun',
        description: 'Kelola akun dan data',
        icon: User,
        items: [
            { id: 'export', label: 'Export Data', description: 'Download semua data kamu', type: 'action' },
            { id: 'change_password', label: 'Ubah Password', type: 'action' },
            { id: 'logout_all', label: 'Logout Semua Perangkat', description: 'Keluar dari semua sesi aktif', type: 'action' },
            { id: 'delete_account', label: 'Hapus Akun', description: 'Hapus akun dan semua data secara permanen', type: 'action', danger: true },
        ]
    }
]

export default function SettingsPage() {
    const [settings, setSettings] = useState<Record<string, boolean | string>>({
        email_digest: true,
        job_alerts: true,
        learning_reminder: true,
        mood_checkin: false,
        evaluation: true,
        public_portfolio: false,
        show_progress: true,
        analytics: true,
        theme: 'light',
        language: 'id',
    })
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const [exporting, setExporting] = useState(false)

    const toggleSetting = (id: string) => {
        setSettings(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleAction = async (actionId: string) => {
        if (actionId === 'export') {
            setExporting(true)
            try {
                const response = await fetch('/api/user/export')
                if (response.ok) {
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `careerpath-data-${new Date().toISOString().split('T')[0]}.json`
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)
                    a.remove()
                } else {
                    alert('Gagal mengexport data. Silakan coba lagi.')
                }
            } catch (error) {
                console.error('Export error:', error)
                alert('Terjadi kesalahan saat export data.')
            } finally {
                setExporting(false)
            }
        } else if (actionId === 'delete_account') {
            const confirmText = prompt('PERINGATAN: Ini akan menghapus semua data Anda secara PERMANEN.\n\nKetik "DELETE_MY_ACCOUNT" untuk konfirmasi:')
            if (confirmText === 'DELETE_MY_ACCOUNT') {
                try {
                    const response = await fetch('/api/user/delete', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ confirmation: 'DELETE_MY_ACCOUNT' })
                    })
                    if (response.ok) {
                        alert('Akun berhasil dihapus. Anda akan dialihkan ke halaman utama.')
                        window.location.href = '/'
                    } else {
                        alert('Gagal menghapus akun. Silakan coba lagi.')
                    }
                } catch (error) {
                    console.error('Delete error:', error)
                    alert('Terjadi kesalahan saat menghapus akun.')
                }
            } else if (confirmText !== null) {
                alert('Konfirmasi tidak valid. Akun tidak dihapus.')
            }
        } else if (actionId === 'change_password') {
            const currentPassword = prompt('Masukkan password saat ini:')
            if (!currentPassword) return
            const newPassword = prompt('Masukkan password baru (min 8 karakter, huruf besar + angka):')
            if (!newPassword) return
            if (newPassword.length < 8) {
                alert('Password baru minimal 8 karakter.')
                return
            }
            try {
                const response = await fetch('/api/user/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentPassword, newPassword })
                })
                const result = await response.json()
                if (result.success) {
                    alert('Password berhasil diubah! ✅')
                } else {
                    alert(result.error || 'Gagal mengubah password.')
                }
            } catch (error) {
                console.error('Password change error:', error)
                alert('Terjadi kesalahan saat mengubah password.')
            }
        } else if (actionId === 'logout_all') {
            if (confirm('Yakin ingin logout dari semua perangkat? Kamu harus login kembali.')) {
                try {
                    const response = await fetch('/api/user/logout-all', { method: 'POST' })
                    const result = await response.json()
                    if (result.success) {
                        alert('Berhasil logout dari semua perangkat.')
                        window.location.href = '/login'
                    } else {
                        alert(result.error || 'Gagal logout.')
                    }
                } catch (error) {
                    console.error('Logout all error:', error)
                    alert('Terjadi kesalahan.')
                }
            }
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Settings className="w-7 h-7 text-indigo-600" />
                    Pengaturan
                </h1>
                <p className="text-gray-500 mt-1">Kelola preferensi dan akun kamu</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
                {SETTINGS_SECTIONS.map(section => (
                    <div key={section.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        {/* Section Header */}
                        <button
                            onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                            className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                                <section.icon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                                <p className="text-sm text-gray-500">{section.description}</p>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === section.id ? 'rotate-90' : ''
                                }`} />
                        </button>

                        {/* Section Items */}
                        {activeSection === section.id && (
                            <div className="border-t border-gray-100">
                                {section.items.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className={`p-4 pl-16 flex items-center justify-between ${idx < section.items.length - 1 ? 'border-b border-gray-50' : ''
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <p className={`font-medium ${item.danger ? 'text-red-600' : 'text-gray-900'}`}>
                                                {item.label}
                                            </p>
                                            {item.description && (
                                                <p className="text-sm text-gray-500">{item.description}</p>
                                            )}
                                        </div>

                                        {item.type === 'toggle' && (
                                            <button
                                                onClick={() => toggleSetting(item.id)}
                                                className={`w-12 h-6 rounded-full transition-colors ${settings[item.id] ? 'bg-indigo-600' : 'bg-gray-200'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${settings[item.id] ? 'translate-x-6' : 'translate-x-0.5'
                                                    }`} />
                                            </button>
                                        )}

                                        {item.type === 'select' && (
                                            <select
                                                value={settings[item.id] as string}
                                                onChange={(e) => setSettings(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                            >
                                                {item.options?.map(opt => (
                                                    <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                                                ))}
                                            </select>
                                        )}

                                        {item.type === 'action' && (
                                            <button
                                                onClick={() => handleAction(item.id)}
                                                disabled={item.id === 'export' && exporting}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${item.danger
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    } ${item.id === 'export' && exporting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                {item.id === 'export' && exporting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : item.danger ? (
                                                    <Trash2 className="w-4 h-4" />
                                                ) : item.id === 'export' ? (
                                                    <Download className="w-4 h-4" />
                                                ) : item.id === 'change_password' ? (
                                                    <Lock className="w-4 h-4" />
                                                ) : null}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Account Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Informasi Akun</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">user@example.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Bergabung sejak Januari 2026</span>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700">
                        <LogOut className="w-4 h-4" />
                        Keluar
                    </button>
                </div>
            </div>
        </div>
    )
}
