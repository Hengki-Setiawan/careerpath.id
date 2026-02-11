import Link from 'next/link'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-red-50 via-white to-orange-50">
            <div className="w-full max-w-md text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
                    <AlertTriangle className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Oops! Ada Masalah 😕
                </h1>

                <p className="text-gray-600 mb-8">
                    Terjadi kesalahan saat memproses autentikasi.
                    Link mungkin sudah kadaluarsa atau tidak valid.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/login"
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-300"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Coba Login Lagi
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-gray-500 hover:text-violet-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    )
}
