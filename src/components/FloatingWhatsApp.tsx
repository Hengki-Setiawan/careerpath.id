'use client'

import { MessageCircle } from 'lucide-react'

interface FloatingWhatsAppProps {
    phoneNumber?: string
    message?: string
}

export function FloatingWhatsApp({
    phoneNumber = '6281934415371',
    message = 'Halo CareerPath.id! Saya ingin bertanya tentang...'
}: FloatingWhatsAppProps) {
    const handleClick = () => {
        const encodedMessage = encodeURIComponent(message)
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
        window.open(url, '_blank')
    }

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            aria-label="Chat via WhatsApp"
        >
            <MessageCircle className="w-6 h-6 fill-white" />
            <span className="hidden sm:inline font-medium">Chat Kami</span>

            {/* Pulse animation */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-300"></span>
            </span>
        </button>
    )
}
