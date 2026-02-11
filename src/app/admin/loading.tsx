export default function AdminLoading() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-7 w-48 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-72 bg-gray-100 rounded" />
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded-xl" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-24">
                        <div className="h-4 w-20 bg-gray-100 rounded mb-3" />
                        <div className="h-6 w-16 bg-gray-200 rounded" />
                    </div>
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="h-5 w-32 bg-gray-200 rounded mb-6" />
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50">
                        <div className="w-8 h-8 bg-gray-100 rounded-full" />
                        <div className="flex-1 h-4 bg-gray-100 rounded" />
                        <div className="w-20 h-4 bg-gray-100 rounded" />
                        <div className="w-16 h-6 bg-gray-100 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}
