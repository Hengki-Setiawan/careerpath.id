'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Oops! Terjadi Kesalahan
                </h1>

                <p className="text-gray-600 mb-6">
                    Maaf, sepertinya ada yang tidak beres. Silakan coba lagi atau kembali ke halaman utama.
                </p>

                {error.digest && (
                    <p className="text-xs text-gray-400 mb-6 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={reset}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </button>

                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Beranda
                    </Link>
                </div>
            </div>
        </div>
    )
}
