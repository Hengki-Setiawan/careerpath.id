'use client'

import { Search, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50 p-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                    <div className="text-[150px] font-black text-violet-200 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl shadow-violet-500/30">
                            <Search className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Halaman Tidak Ditemukan
                </h1>

                <p className="text-gray-600 mb-8">
                    Sepertinya halaman yang kamu cari tidak ada atau sudah dipindahkan.
                </p>

                <div className="flex gap-3 justify-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 py-3 px-6 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Ke Beranda
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 py-3 px-6 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium border border-gray-200 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    )
}
