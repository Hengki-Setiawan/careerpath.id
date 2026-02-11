'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, MapPin, Building2, Briefcase, Loader2, AlertCircle } from 'lucide-react'

interface Job {
    id: string
    title: string
    company: string
    location: string
    job_type: string
    posted_date: string
    is_active: boolean
}

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('posted_date', { ascending: false })

            if (error) throw error
            setJobs(data || [])
        } catch (error) {
            console.error('Error fetching jobs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah anda yakin ingin menghapus lowongan ini?')) return

        setIsDeleting(id)
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', id)

            if (error) throw error

            // Remove from state
            setJobs(prev => prev.filter(job => job.id !== id))
        } catch (error) {
            console.error('Error deleting job:', error)
            alert('Gagal menghapus lowongan')
        } finally {
            setIsDeleting(null)
        }
    }

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-violet-500" />
                        Manajemen Lowongan
                    </h1>
                    <p className="text-gray-400">Kelola data lowongan pekerjaan</p>
                </div>
                <Link
                    href="/admin/jobs/new"
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Lowongan
                </Link>
            </div>

            {/* Sub-header / Stats or Filters usually go here but keeping it simple */}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari lowongan atau perusahaan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
            </div>

            {/* Jobs List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
                        <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Belum ada lowongan kerja.</p>
                        <p className="text-gray-500 text-sm mt-1">Silakan tambah lowongan baru.</p>
                    </div>
                ) : (
                    filteredJobs.map(job => (
                        <div
                            key={job.id}
                            className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                                    <Building2 className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                                    <p className="text-gray-400">{job.company}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {job.location}
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-300 text-xs border border-gray-600">
                                            {job.job_type}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs border ${job.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                            {job.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center">
                                <Link
                                    href={`/admin/jobs/${job.id}`}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Pencil className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(job.id)}
                                    disabled={isDeleting === job.id}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete"
                                >
                                    {isDeleting === job.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
