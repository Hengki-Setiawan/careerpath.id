'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Activity,
    User,
    Briefcase,
    Zap,
    Settings,
    FileText,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Clock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AuditLog {
    id: string
    admin_id: string
    action: string
    target_type: string
    target_id: string
    details: Record<string, unknown>
    ip_address: string
    created_at: string
    admin?: { full_name: string }
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const limit = 20

    const fetchLogs = useCallback(async () => {
        setIsLoading(true)
        const supabase = createClient()

        const { data } = await supabase
            .from('admin_audit_logs')
            .select('*, admin:admin_id(full_name)')
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1)

        if (data) setLogs(data as AuditLog[])
        setIsLoading(false)
    }, [page])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const getActionIcon = (action: string) => {
        if (action.includes('USER')) return User
        if (action.includes('CAREER')) return Briefcase
        if (action.includes('SKILL')) return Zap
        if (action.includes('SETTING')) return Settings
        return FileText
    }

    const getActionColor = (action: string) => {
        if (action.includes('CREATE')) return 'bg-green-500/20 text-green-400'
        if (action.includes('UPDATE')) return 'bg-blue-500/20 text-blue-400'
        if (action.includes('DELETE')) return 'bg-red-500/20 text-red-400'
        return 'bg-gray-500/20 text-gray-400'
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Audit Log</h1>
                <p className="text-gray-400">Riwayat aktivitas admin</p>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Belum ada aktivitas tercatat</p>
                    </div>
                ) : (
                    <>
                        <div className="divide-y divide-gray-700">
                            {logs.map((log) => {
                                const IconComponent = getActionIcon(log.action)
                                return (
                                    <div key={log.id} className="p-4 hover:bg-gray-700/30">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActionColor(log.action)}`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                                                        {log.action.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className="text-gray-500 text-sm">•</span>
                                                    <span className="text-gray-400 text-sm">{log.target_type}</span>
                                                </div>
                                                <p className="text-white">
                                                    <span className="font-medium">{(log.admin as { full_name: string } | null)?.full_name || 'Unknown'}</span>
                                                    <span className="text-gray-400"> melakukan aksi pada </span>
                                                    <span className="font-mono text-sm text-gray-300">{log.target_id?.slice(0, 8) || '-'}</span>
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(log.created_at).toLocaleString('id-ID')}
                                                    </span>
                                                    <span>IP: {log.ip_address}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex items-center justify-between p-4 border-t border-gray-700">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="flex items-center gap-1 px-3 py-1.5 text-gray-400 hover:text-white disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Sebelumnya
                            </button>
                            <span className="text-gray-400 text-sm">Halaman {page}</span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={logs.length < limit}
                                className="flex items-center gap-1 px-3 py-1.5 text-gray-400 hover:text-white disabled:opacity-50"
                            >
                                Selanjutnya
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
