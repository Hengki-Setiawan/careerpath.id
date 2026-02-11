'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    MessageSquare,
    Mail,
    Clock,
    CheckCircle,
    Archive,
    Reply,
    Loader2,
    Search,
    Filter
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Message {
    id: string
    name: string
    email: string
    subject: string
    message: string
    status: string
    created_at: string
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const [statusFilter, setStatusFilter] = useState('all')

    const fetchMessages = useCallback(async () => {
        setIsLoading(true)
        const supabase = createClient()

        let query = supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter)
        }

        const { data } = await query
        if (data) setMessages(data)
        setIsLoading(false)
    }, [statusFilter])

    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    const updateStatus = async (id: string, status: string) => {
        const supabase = createClient()
        await supabase
            .from('contact_messages')
            .update({ status })
            .eq('id', id)
        fetchMessages()
        if (selectedMessage?.id === id) {
            setSelectedMessage({ ...selectedMessage, status })
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">Baru</span>
            case 'read':
                return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">Dibaca</span>
            case 'replied':
                return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Dibalas</span>
            case 'archived':
                return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">Arsip</span>
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pesan Masuk</h1>
                    <p className="text-gray-400">{messages.length} pesan</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                ? 'bg-violet-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        {status === 'all' ? 'Semua' : status === 'new' ? 'Baru' : status === 'read' ? 'Dibaca' : status === 'replied' ? 'Dibalas' : 'Arsip'}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            Tidak ada pesan
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-700">
                            {messages.map((msg) => (
                                <button
                                    key={msg.id}
                                    onClick={() => { setSelectedMessage(msg); if (msg.status === 'new') updateStatus(msg.id, 'read') }}
                                    className={`w-full p-4 text-left hover:bg-gray-700/50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-gray-700/50' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className="font-medium text-white truncate">{msg.name}</span>
                                        {getStatusBadge(msg.status)}
                                    </div>
                                    <p className="text-gray-400 text-sm truncate">{msg.subject || 'No Subject'}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {new Date(msg.created_at).toLocaleDateString('id-ID')}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-6">
                    {selectedMessage ? (
                        <div>
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                                    <p className="text-gray-400">{selectedMessage.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStatus(selectedMessage.id, 'replied')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                    >
                                        <Reply className="w-4 h-4" />
                                        Tandai Dibalas
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedMessage.id, 'archived')}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                                    >
                                        <Archive className="w-4 h-4" />
                                        Arsip
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Subjek</p>
                                    <p className="text-white">{selectedMessage.subject || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Pesan</p>
                                    <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {new Date(selectedMessage.created_at).toLocaleString('id-ID')}
                                    </span>
                                    {getStatusBadge(selectedMessage.status)}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Pesan dari CareerPath.id'}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                                >
                                    <Mail className="w-4 h-4" />
                                    Balas via Email
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Pilih pesan untuk melihat detail</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
