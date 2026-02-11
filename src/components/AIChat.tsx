'use client'

import { useState, useRef, useEffect } from 'react'
import {
    MessageCircle,
    X,
    Send,
    Loader2,
    Sparkles,
    User,
    Bot,
    Minimize2,
    Maximize2
} from 'lucide-react'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function AIChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Halo! 👋 Aku CareerPath AI. Ada yang bisa aku bantu soal karier atau perkuliahanmu hari ini?' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMessage }]
                })
            })

            if (!response.ok) throw new Error('Failed to send message')

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()

            if (!reader) return

            // Add placeholder for AI response
            setMessages(prev => [...prev, { role: 'assistant', content: '' }])

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        if (data === '[DONE]') break

                        try {
                            const { content } = JSON.parse(data)
                            setMessages(prev => {
                                const newMessages = [...prev]
                                const lastMsgIndex = newMessages.length - 1
                                const lastMessage = { ...newMessages[lastMsgIndex] }
                                lastMessage.content += content
                                newMessages[lastMsgIndex] = lastMessage
                                return newMessages
                            })
                        } catch (e) {
                            console.error('Error parsing chunk', e)
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, aku sedang mengalami gangguan. Coba lagi nanti ya! 🙏' }])
        } finally {
            setIsLoading(false)
        }
    }

    // Floating Button (Collapsed State)
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-violet-500/50 transition-all duration-300 z-50 group"
            >
                <MessageCircle className="w-8 h-8" />
                <span className="absolute right-0 top-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Curhat karier yuk! 🤖
                </div>
            </button>
        )
    }

    // Minimized Window
    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 w-72 bg-white rounded-t-2xl shadow-2xl z-50 border border-gray-100">
                <div
                    className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl flex items-center justify-between cursor-pointer"
                    onClick={() => setIsMinimized(false)}
                >
                    <div className="flex items-center gap-2 text-white">
                        <Bot className="w-5 h-5" />
                        <span className="font-semibold">CareerPath AI</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMinimized(false) }}
                            className="text-white/80 hover:text-white"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                            className="text-white/80 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Full Chat Window
    return (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl flex items-center justify-between shadow-md shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">CareerPath AI</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-xs text-violet-100">Online 24/7</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-violet-100' : 'bg-indigo-100'
                            }`}>
                            {msg.role === 'user' ? (
                                <User className="w-4 h-4 text-violet-600" />
                            ) : (
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                            )}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                            ? 'bg-violet-600 text-white rounded-tr-none'
                            : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl shrink-0">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Tanya soal karier, skill, atau curhat..."
                        disabled={isLoading}
                        className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all placeholder:text-gray-400 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 transition-colors"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </form>
                <p className="text-center text-[10px] text-gray-400 mt-2">
                    AI bisa saja salah. Selalu verifikasi informasi penting.
                </p>
            </div>
        </div>
    )
}
