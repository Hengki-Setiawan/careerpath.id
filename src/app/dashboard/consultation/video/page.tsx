'use client'

import { useState } from 'react'
import {
    Video, Phone, Monitor, Clock, Calendar, User, Star,
    Shield, CheckCircle, ArrowRight, MessageSquare, Settings
} from 'lucide-react'

export default function VideoConsultationPage() {
    const [roomReady, setRoomReady] = useState(false)
    const [joinUrl, setJoinUrl] = useState('')

    const handleStartCall = async (bookingId: string) => {
        // Generate Jitsi Meet room (free, no API key needed)
        const roomName = `careerpath-${bookingId}-${Date.now()}`
        const url = `https://meet.jit.si/${roomName}`
        setJoinUrl(url)
        setRoomReady(true)
    }

    if (roomReady) {
        return (
            <div className="h-screen flex flex-col">
                <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-green-400" />
                        <span className="font-semibold">Video Consultation - CareerPath.id</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live
                        </span>
                        <button
                            onClick={() => setRoomReady(false)}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                            End Call
                        </button>
                    </div>
                </div>
                <iframe
                    src={joinUrl}
                    className="flex-1 w-full border-0"
                    allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                    title="Video Consultation"
                />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Video Konsultasi</h1>
                <p className="text-gray-600 mt-1">Konsultasi langsung dengan psikolog atau career counselor via video call</p>
            </div>

            {/* How it works */}
            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Cara Kerja</h2>
                <div className="grid md:grid-cols-4 gap-4">
                    {[
                        { step: '1', icon: Calendar, title: 'Booking', desc: 'Pilih jadwal & profesional' },
                        { step: '2', icon: Shield, title: 'Bayar', desc: 'Pembayaran via Midtrans' },
                        { step: '3', icon: Video, title: 'Join Call', desc: 'Klik tombol saat jadwal tiba' },
                        { step: '4', icon: CheckCircle, title: 'Follow-Up', desc: 'Terima catatan sesi & action items' },
                    ].map((item, i) => (
                        <div key={i} className="text-center p-4">
                            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <item.icon className="w-5 h-5 text-violet-600" />
                            </div>
                            <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Sessions */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Sesi Mendatang</h2>
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-violet-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Dr. Rina Amalia, M.Psi</h3>
                                    <p className="text-sm text-gray-500">Career Anxiety Consultation</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> Rabu, 12 Feb
                                </p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> 18:00 - 19:00
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <button
                                onClick={() => handleStartCall('session-1')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
                            >
                                <Video className="w-4 h-4" /> Join Video Call
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm transition-colors">
                                <MessageSquare className="w-4 h-4" /> Chat
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm transition-colors">
                                <Settings className="w-4 h-4" /> Test Audio/Video
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Book */}
            <div className="grid md:grid-cols-3 gap-4">
                {[
                    { type: 'Psikolog', desc: 'Career anxiety, stress management', price: 'Rp 99.000', icon: Star, color: 'from-pink-500 to-rose-500' },
                    { type: 'Career Counselor', desc: 'Career planning, job strategy', price: 'Rp 99.000', icon: Monitor, color: 'from-violet-500 to-indigo-500' },
                    { type: 'Industry Mentor', desc: 'Industry insights, networking', price: 'Rp 149.000', icon: Phone, color: 'from-amber-500 to-orange-500' },
                ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                            <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">{item.type}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                        <div className="flex items-center justify-between mt-4">
                            <span className="font-bold text-violet-600">{item.price}</span>
                            <a href="/dashboard/consultation" className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1">
                                Book <ArrowRight className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
