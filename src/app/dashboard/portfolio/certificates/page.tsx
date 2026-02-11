'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import {
    Upload,
    Trash2,
    Calendar,
    Award,
    ExternalLink,
    Loader2,
    Plus,
    X,
    FileText,
    CheckCircle
} from 'lucide-react'

interface Certificate {
    id: string
    title: string
    issuer: string
    issue_date: string
    expiry_date: string | null
    credential_url: string | null
    image_url: string | null
    is_verified: boolean
}

export default function CertificatesPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [showForm, setShowForm] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        credential_url: '',
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        fetchCertificates()
    }, [])

    const fetchCertificates = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/portfolio/certificates')
            const data = await res.json()
            if (data.success) {
                setCertificates(data.certificates)
            }
        } catch (error) {
            console.error('Failed to load certificates', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedFile(file)

            // Create preview
            const objectUrl = URL.createObjectURL(file)
            setPreviewUrl(objectUrl)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile || !formData.title || !formData.issuer || !formData.issue_date) {
            alert('Mohon lengkapi data wajib dan pilih file')
            return
        }

        setIsUploading(true)
        const supabase = createClient()

        try {
            // 1. Upload File to Storage
            const fileExt = selectedFile.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${(await supabase.auth.getUser()).data.user?.id}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('certificates')
                .upload(filePath, selectedFile)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('certificates')
                .getPublicUrl(filePath)

            // 3. Save to Database
            const res = await fetch('/api/portfolio/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    image_url: publicUrl, // or credential_url if PDF
                    credential_url: formData.credential_url || publicUrl
                })
            })

            const data = await res.json()
            if (data.success) {
                // Reset form
                setShowForm(false)
                setFormData({
                    title: '',
                    issuer: '',
                    issue_date: '',
                    expiry_date: '',
                    credential_url: '',
                })
                setSelectedFile(null)
                setPreviewUrl(null)
                fetchCertificates()
            } else {
                alert('Gagal menyimpan data sertifikat')
            }

        } catch (error) {
            console.error('Upload failed:', error)
            alert('Gagal mengupload file')
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus sertifikat ini?')) return

        try {
            const res = await fetch(`/api/portfolio/certificates/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                setCertificates(prev => prev.filter(c => c.id !== id))
            }
        } catch (error) {
            console.error('Delete failed:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Award className="w-8 h-8 text-indigo-600" />
                        Sertifikat & Penghargaan
                    </h1>
                    <p className="text-gray-500 mt-1">Kelola bukti skill dan pencapaian profesionalmu</p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {showForm ? 'Batal' : 'Tambah Sertifikat'}
                </button>
            </div>

            {/* Upload Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Upload Sertifikat Baru</h2>
                    <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-8">
                        {/* File Upload Area */}
                        <div className="space-y-4">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${previewUrl ? 'border-indigo-200 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept="image/*,application/pdf"
                                />

                                {previewUrl ? (
                                    <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
                                        {selectedFile?.type === 'application/pdf' ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                                                <FileText className="w-16 h-16 mb-2" />
                                                <p className="font-medium text-sm truncate max-w-[200px]">{selectedFile.name}</p>
                                            </div>
                                        ) : (
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                fill
                                                className="object-contain"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <p className="text-white font-medium">Klik untuk ganti</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="font-medium text-gray-900">Klik untuk upload file</p>
                                        <p className="text-sm text-gray-500 mt-2">Format: JPG, PNG, PDF (Max 5MB)</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Metadata Inputs */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nama Sertifikat *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Google Data Analytics Professional Certificate"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Penerbit (Issuer) *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Coursera, Dicoding, Google"
                                    value={formData.issuer}
                                    onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Tanggal Terbit *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.issue_date}
                                        onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Tanggal Kadaluarsa</label>
                                    <input
                                        type="date"
                                        value={formData.expiry_date}
                                        onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Link Kredensial (Opsional)</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={formData.credential_url}
                                    onChange={e => setFormData({ ...formData, credential_url: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isUploading}
                                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Mengupload...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Simpan Sertifikat
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Certificates Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada sertifikat</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-6">
                            Upload sertifikat kursus, kompetisi, atau penghargaan untuk memperkuat portofolio kamu.
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Upload Sekarang
                        </button>
                    </div>
                ) : (
                    certificates.map((cert) => (
                        <div key={cert.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative">
                            {/* Actions Overlay */}
                            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={() => handleDelete(cert.id)}
                                    className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-red-50 backdrop-blur-sm border border-red-100 shadow-sm"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="aspect-video bg-gray-100 relative overflow-hidden border-b border-gray-100">
                                {cert.image_url ? (
                                    <Image
                                        src={cert.image_url}
                                        alt={cert.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Award className="w-12 h-12" />
                                    </div>
                                )}
                                {cert.is_verified && (
                                    <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Verified
                                    </div>
                                )}
                            </div>

                            <div className="p-5">
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                                        {cert.issuer}
                                    </p>
                                    <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">
                                        {cert.title}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(cert.issue_date).toLocaleDateString()}</span>
                                    </div>

                                    {cert.credential_url && (
                                        <a
                                            href={cert.credential_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
