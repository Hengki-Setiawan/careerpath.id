import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Kebijakan Cookie | CareerPath.id',
    description: 'Informasi tentang penggunaan cookie di CareerPath.id'
}

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">🍪 Kebijakan Cookie</h1>
                    <p className="text-gray-500 mb-8">Terakhir diperbarui: Februari 2026</p>

                    <div className="prose prose-gray max-w-none space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">Apa Itu Cookie?</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Cookie adalah file kecil yang disimpan di perangkat Anda saat mengunjungi situs web.
                                Cookie membantu kami mengingat preferensi Anda dan meningkatkan pengalaman penggunaan
                                platform CareerPath.id.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">Jenis Cookie yang Kami Gunakan</h2>

                            <div className="space-y-4 mt-4">
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <h3 className="font-semibold text-green-800 mb-1">✅ Cookie Esensial (Wajib)</h3>
                                    <p className="text-sm text-green-700">
                                        Diperlukan agar situs dapat berfungsi. Termasuk autentikasi sesi,
                                        keamanan, dan preferensi bahasa. Tidak bisa dinonaktifkan.
                                    </p>
                                    <ul className="text-sm text-green-700 mt-2 list-disc list-inside">
                                        <li>Session cookie untuk login</li>
                                        <li>CSRF protection token</li>
                                        <li>Cookie consent preference</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <h3 className="font-semibold text-blue-800 mb-1">📊 Cookie Analitik (Opsional)</h3>
                                    <p className="text-sm text-blue-700">
                                        Membantu kami memahami bagaimana pengunjung menggunakan situs. Data dikumpulkan
                                        secara anonim untuk meningkatkan layanan.
                                    </p>
                                    <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                                        <li>Vercel Analytics</li>
                                        <li>Halaman yang dikunjungi</li>
                                        <li>Durasi kunjungan</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                    <h3 className="font-semibold text-purple-800 mb-1">🎯 Cookie Fungsional (Opsional)</h3>
                                    <p className="text-sm text-purple-700">
                                        Digunakan untuk menyimpan preferensi tema, bahasa, dan pengaturan tampilan Anda.
                                    </p>
                                    <ul className="text-sm text-purple-700 mt-2 list-disc list-inside">
                                        <li>Dark mode preference</li>
                                        <li>Dashboard layout preference</li>
                                        <li>Notification settings</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">Mengelola Cookie</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Anda dapat mengelola atau menghapus cookie melalui pengaturan browser Anda.
                                Perlu diingat bahwa menonaktifkan cookie esensial dapat memengaruhi fungsi situs.
                            </p>
                            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <p className="text-sm text-amber-800">
                                    <strong>⚠️ Penting:</strong> Menghapus semua cookie akan membuat Anda logout
                                    dari akun dan menghapus semua preferensi yang tersimpan.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">Masa Berlaku Cookie</h2>
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-2 font-semibold text-gray-900">Cookie</th>
                                            <th className="text-left py-2 font-semibold text-gray-900">Jenis</th>
                                            <th className="text-left py-2 font-semibold text-gray-900">Durasi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2">Session Token</td>
                                            <td className="py-2">Esensial</td>
                                            <td className="py-2">30 hari</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2">Cookie Consent</td>
                                            <td className="py-2">Esensial</td>
                                            <td className="py-2">1 tahun</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2">Analytics</td>
                                            <td className="py-2">Analitik</td>
                                            <td className="py-2">90 hari</td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2">Preferences</td>
                                            <td className="py-2">Fungsional</td>
                                            <td className="py-2">1 tahun</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900">Kontak</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Jika Anda memiliki pertanyaan tentang penggunaan cookie,
                                hubungi kami di{' '}
                                <a href="mailto:privacy@careerpath.id" className="text-indigo-600 hover:underline">
                                    privacy@careerpath.id
                                </a>
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4 text-sm">
                        <Link href="/privacy" className="text-indigo-600 hover:underline">
                            Kebijakan Privasi
                        </Link>
                        <Link href="/terms" className="text-indigo-600 hover:underline">
                            Syarat & Ketentuan
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
