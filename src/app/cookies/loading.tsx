export default function CookiesLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
            <div className="animate-pulse text-center space-y-4">
                <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
                <p className="text-gray-400 text-sm">Memuat kebijakan cookie...</p>
            </div>
        </div>
    )
}
