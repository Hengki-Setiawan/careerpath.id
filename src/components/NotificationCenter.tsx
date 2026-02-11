'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    link?: string
    is_read: boolean
    created_at: string
}

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications')
            const data = await res.json()
            if (data.success) {
                setNotifications(data.notifications)
                setUnreadCount(data.unreadCount)
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        // Close dropdown when clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const markAsRead = async (id: string, link?: string) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))

            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })

            if (link) {
                setIsOpen(false)
            }
        } catch (error) {
            console.error('Failed to mark read', error)
        }
    }

    const markAllRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
            setUnreadCount(0)

            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllRead: true })
            })
        } catch (error) {
            console.error('Failed to mark all read', error)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />
            case 'error': return <XCircle className="w-5 h-5 text-red-500" />
            default: return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
                <Bell className={`w-6 h-6 ${isOpen ? 'text-violet-600' : 'text-gray-600'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" />
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 mb-2">
                                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                <p>Belum ada notifikasi</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-violet-50/30' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1 shrink-0">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 shrink-0">
                                                        {new Date(notification.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                {notification.link ? (
                                                    <Link
                                                        href={notification.link}
                                                        onClick={() => markAsRead(notification.id, notification.link)}
                                                        className="inline-block mt-2 text-xs font-medium text-violet-600 hover:text-violet-700"
                                                    >
                                                        Lihat Detail →
                                                    </Link>
                                                ) : (
                                                    !notification.is_read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="mt-2 text-xs text-gray-400 hover:text-violet-600"
                                                        >
                                                            Tandai dibaca
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
