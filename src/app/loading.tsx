'use client'

import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            <div className="text-center relative">
                {/* Logo Animation */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mx-auto mb-8 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    <Compass className="w-12 h-12 text-white animate-spin-slow" style={{ animationDuration: '3s' }} />
                </motion.div>

                {/* Text Animation */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">CareerPath<span className="text-indigo-600">.id</span></h2>
                    <div className="flex items-center justify-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0s' }} />
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
