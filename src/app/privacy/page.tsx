'use client'

import { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'
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

export default function PrivacyPage() {
    const [content, setContent] = useState<PageContent | null>(null)

    useEffect(() => {
        const fetchContent = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('page_contents')
                .select('content')
                .eq('page_key', 'privacy')
                .single()

            if (data?.content) {
                setContent(data.content as PageContent)
            }
        }
        fetchContent()
    }, [])

    const defaultSections = [
        {
            title: '1. Pendahuluan',
            content: 'CareerPath.id ("kami", "kita", atau "Platform") berkomitmen untuk melindungi privasi pengguna kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.'
        },
        {
            title: '2. Informasi yang Kami Kumpulkan',
            content: 'Kami mengumpulkan informasi yang Anda berikan secara langsung, termasuk: nama lengkap, alamat email, informasi pendidikan (universitas, jurusan, semester), dan hasil asesmen kesehatan mental. Kami juga mengumpulkan data penggunaan secara otomatis seperti aktivitas login dan interaksi dengan fitur platform.'
        },
        {
            title: '3. Penggunaan Informasi',
            content: 'Informasi yang dikumpulkan digunakan untuk: menyediakan layanan analisis skill gap dan rekomendasi karier, memberikan hasil asesmen kesehatan mental yang akurat, meningkatkan pengalaman pengguna, dan mengirim notifikasi terkait layanan.'
        },
        {
            title: '4. Keamanan Data',
            content: 'Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang sesuai untuk melindungi data Anda, termasuk enkripsi data, kontrol akses ketat, dan audit keamanan berkala.'
        },
        {
            title: '5. Berbagi Informasi',
            content: 'Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Data hanya dibagikan dengan penyedia layanan yang membantu operasional platform, dan mereka terikat perjanjian kerahasiaan.'
        },
        {
            title: '6. Hak Anda',
            content: 'Anda memiliki hak untuk: mengakses data pribadi Anda, memperbarui atau memperbaiki informasi yang tidak akurat, meminta penghapusan akun dan data, dan menarik persetujuan untuk pemrosesan data tertentu.'
        },
        {
            title: '7. Hubungi Kami',
            content: 'Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di privacy@careerpath.id'
        },
    ]

    const sections = content?.sections || defaultSections

    return (
        <div className="min-h-screen bg-white py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {content?.title || 'Kebijakan Privasi'}
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

                <div className="mt-12 p-6 bg-violet-50 rounded-2xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Ada Pertanyaan?</h3>
                    <p className="text-gray-600 text-sm">
                        Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di{' '}
                        <a href="mailto:privacy@careerpath.id" className="text-violet-600 hover:underline">
                            privacy@careerpath.id
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
