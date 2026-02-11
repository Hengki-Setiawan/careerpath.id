'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    cover_image: string
    published_at: string
    views: number
}

// Placeholder posts for demo
const DEMO_POSTS = [
    {
        id: '1',
        title: '5 Tips Mempersiapkan Karier Sejak Semester 1',
        slug: 'tips-persiapan-karier',
        excerpt: 'Mulai dari mana? Berikut 5 tips praktis yang bisa kamu terapkan sejak awal kuliah untuk membangun fondasi karier yang kuat.',
        cover_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
        published_at: '2024-01-15',
        views: 1250,
    },
    {
        id: '2',
        title: 'Mengapa Kesehatan Mental Penting untuk Sukses Karier',
        slug: 'kesehatan-mental-dan-karier',
        excerpt: 'Hubungan antara kesehatan mental dan produktivitas kerja lebih erat dari yang kamu bayangkan. Simak penjelasannya.',
        cover_image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600',
        published_at: '2024-01-10',
        views: 980,
    },
    {
        id: '3',
        title: 'Skill Tech yang Paling Dicari di 2024',
        slug: 'skill-tech-2024',
        excerpt: 'Dari AI hingga Cloud Computing, ini adalah skill teknologi yang paling dicari oleh perusahaan tahun ini.',
        cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
        published_at: '2024-01-05',
        views: 2100,
    },
    {
        id: '4',
        title: 'Cara Membangun Personal Branding di LinkedIn',
        slug: 'personal-branding-linkedin',
        excerpt: 'LinkedIn bukan hanya untuk mencari kerja. Pelajari cara memaksimalkan profilmu untuk membangun personal branding.',
        cover_image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=600',
        published_at: '2024-01-01',
        views: 750,
    },
]

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>(DEMO_POSTS)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchPosts = async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('blog_posts')
                .select('id, title, slug, excerpt, cover_image, published_at, views')
                .eq('status', 'published')
                .order('published_at', { ascending: false })

            if (data && data.length > 0) {
                setPosts(data)
            }
        }
        fetchPosts()
    }, [])

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-50">
            {/* Hero */}
            <section className="py-20 px-4 bg-gradient-to-r from-violet-600 to-indigo-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog CareerPath</h1>
                    <p className="text-violet-100 text-lg mb-8">
                        Tips karier, pengembangan diri, dan kesehatan mental untuk mahasiswa
                    </p>
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:ring-4 focus:ring-white/30 outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                <div className="relative h-48 bg-gray-100">
                                    <img
                                        src={post.cover_image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(post.published_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span>{post.views} views</span>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-1 text-violet-600 font-medium text-sm hover:gap-2 transition-all"
                                    >
                                        Baca selengkapnya
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Tidak ada artikel ditemukan</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 px-4 bg-gray-900">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Dapatkan Tips Karier Terbaru
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Subscribe untuk mendapatkan artikel dan tips karier langsung ke emailmu
                    </p>
                    <form className="flex gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Email kamu"
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-violet-500 outline-none"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}
