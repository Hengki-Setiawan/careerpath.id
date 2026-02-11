'use client'

import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Section {
    title: string
    content: string
}

interface PageContent {
    title: string
    lastUpdated: string
    sections: Section[]
}

export default function TermsPage() {
    const [content, setContent] = useState<PageContent | null>(null)

    useEffect(() => {
        const fetchContent = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('page_contents')
                .select('content')
                .eq('page_key', 'terms')
                .single()

            if (data?.content) {
                setContent(data.content as PageContent)
            }
        }
        fetchContent()
    }, [])

    const defaultSections = [
        {
            title: '1. Penerimaan Ketentuan',
            content: 'Dengan mengakses dan menggunakan CareerPath.id, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan ketentuan ini, mohon untuk tidak menggunakan platform kami.'
        },
        {
            title: '2. Deskripsi Layanan',
            content: 'CareerPath.id menyediakan layanan analisis skill gap, panduan karier berbasis AI, dan asesmen kesehatan mental untuk mahasiswa. Layanan kami bersifat edukatif dan informatif, bukan pengganti konsultasi profesional.'
        },
        {
            title: '3. Akun Pengguna',
            content: 'Anda bertanggung jawab untuk menjaga keamanan akun dan kata sandi Anda. Anda harus segera memberitahu kami jika terjadi penggunaan tidak sah atas akun Anda. Anda setuju untuk memberikan informasi yang akurat dan terkini.'
        },
        {
            title: '4. Penggunaan yang Diizinkan',
            content: 'Anda setuju untuk menggunakan platform hanya untuk tujuan yang sah dan tidak melanggar hukum. Dilarang menggunakan platform untuk menyebarkan konten berbahaya, spam, atau melakukan aktivitas yang dapat merusak platform.'
        },
        {
            title: '5. Konten Pengguna',
            content: 'Anda mempertahankan hak atas konten yang Anda kirimkan ke platform. Dengan mengirimkan konten, Anda memberikan kami lisensi untuk menggunakan konten tersebut dalam rangka menyediakan dan meningkatkan layanan.'
        },
        {
            title: '6. Batasan Tanggung Jawab',
            content: 'Platform ini disediakan "sebagaimana adanya". Kami tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan. Hasil asesmen kesehatan mental bukan diagnosis medis dan tidak menggantikan konsultasi profesional.'
        },
        {
            title: '7. Perubahan Ketentuan',
            content: 'Kami berhak mengubah Syarat dan Ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui platform. Penggunaan berkelanjutan setelah perubahan berarti Anda menerima ketentuan yang diperbarui.'
        },
        {
            title: '8. Hukum yang Berlaku',
            content: 'Syarat dan Ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa akan diselesaikan di pengadilan yang berwenang di Indonesia.'
        },
    ]

    const sections = content?.sections || defaultSections

    return (
        <div className="min-h-screen bg-white py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {content?.title || 'Syarat & Ketentuan'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Terakhir diperbarui: {content?.lastUpdated || '1 Januari 2024'}
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <section key={index}>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                {section.title}
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-indigo-50 rounded-2xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Butuh Bantuan?</h3>
                    <p className="text-gray-600 text-sm">
                        Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami di{' '}
                        <a href="mailto:support@careerpath.id" className="text-indigo-600 hover:underline">
                            support@careerpath.id
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
