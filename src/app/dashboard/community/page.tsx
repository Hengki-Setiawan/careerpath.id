'use client'

import { useState } from 'react'
import {
    Users, MessageSquare, Heart, Share2, Send, TrendingUp,
    Sparkles, Trophy, Star, ChevronRight, MoreHorizontal, ThumbsUp,
    Hash, Search, Filter, Image as ImageIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Post {
    id: string
    author: {
        name: string
        avatar: string
        role: string
        level: number
    }
    category: string
    title: string
    content: string
    likes: number
    comments: number
    time: string
    isLiked: boolean
    tags: string[]
}

const POSTS: Post[] = [
    {
        id: '1',
        author: { name: 'Rizki Pratama', avatar: '👨‍💻', role: 'Data Analyst', level: 12 },
        category: 'Success Story',
        title: 'Dari Fresh Graduate ke Data Analyst dalam 6 bulan! 🎉',
        content: 'Hai semua! Mau sharing perjalanan saya dari fresh graduate Teknik sampai akhirnya dapat kerja sebagai Data Analyst di startup Makassar. CareerPath.id banyak bantu saya identify skill gap dan learning path yang tepat. Kuncinya konsisten belajar SQL dan Python tiap malam!',
        likes: 48,
        comments: 12,
        time: '2 jam lalu',
        isLiked: false,
        tags: ['CareerSwitch', 'DataAnalyst', 'Motivation']
    },
    {
        id: '2',
        author: { name: 'Anisa Putri', avatar: '👩‍🎨', role: 'UI/UX Designer', level: 8 },
        category: 'Tips & Tricks',
        title: 'Tips Portfolio yang Bikin HRD Tertarik',
        content: 'Setelah apply ke 50+ perusahaan, akhirnya nemu formula portfolio yang works! Yang paling penting adalah: 1) Case study yang detailed, 2) Before/after comparison, 3) Metrics kalau ada. Jangan cuma tampilin gambar akhir aja ya teman-teman!',
        likes: 92,
        comments: 24,
        time: '5 jam lalu',
        isLiked: true,
        tags: ['Portfolio', 'UIUX', 'HiringTips']
    },
    {
        id: '3',
        author: { name: 'Budi Santoso', avatar: '👨‍💼', role: 'Product Manager', level: 15 },
        category: 'Job Market',
        title: 'Update Info Lowongan Makassar Februari 2026',
        content: 'Berbagi update lowongan di Makassar untuk teman-teman yang sedang mencari kerja. Beberapa posisi yang lagi banyak dicari: Software Engineer, Digital Marketing, Data Analyst. Cek detailnya di section Jobs ya!',
        likes: 156,
        comments: 45,
        time: '1 hari lalu',
        isLiked: false,
        tags: ['LokerMakassar', 'JobInfo', 'Networking']
    },
]

const CATEGORIES = [
    { id: 'all', label: 'Semua', icon: Hash },
    { id: 'success', label: 'Success Stories', icon: Trophy },
    { id: 'tips', label: 'Tips & Tricks', icon: Sparkles },
    { id: 'jobs', label: 'Job Market', icon: TrendingUp },
    { id: 'mental', label: 'Mental Health', icon: Heart },
]

const TOP_CONTRIBUTORS = [
    { name: 'Budi Santoso', points: 1250, avatar: '👨‍💼', border: 'border-amber-400' },
    { name: 'Sarah Andini', points: 980, avatar: '👩‍🏫', border: 'border-gray-300' },
    { name: 'Rizki Pratama', points: 856, avatar: '👨‍💻', border: 'border-orange-400' },
]

export default function CommunityPage() {
    const [posts, setPosts] = useState(POSTS)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [newPost, setNewPost] = useState('')
    const [isPosting, setIsPosting] = useState(false)

    const toggleLike = (postId: string) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                }
            }
            return post
        }))
    }

    const handlePost = () => {
        if (!newPost.trim()) return
        setIsPosting(true)

        // Simulate posting delay
        setTimeout(() => {
            const post: Post = {
                id: Date.now().toString(),
                author: { name: 'Anda', avatar: '👤', role: 'Member', level: 1 },
                category: 'General',
                title: 'Update Baru',
                content: newPost,
                likes: 0,
                comments: 0,
                time: 'Baru saja',
                isLiked: false,
                tags: []
            }
            setPosts([post, ...posts])
            setNewPost('')
            setIsPosting(false)
        }, 800)
    }

    const filteredPosts = selectedCategory === 'all'
        ? posts
        : posts.filter(p => {
            if (selectedCategory === 'success') return p.category === 'Success Story'
            if (selectedCategory === 'tips') return p.category === 'Tips & Tricks'
            if (selectedCategory === 'jobs') return p.category === 'Job Market'
            if (selectedCategory === 'mental') return p.category === 'Mental Health'
            return true
        })

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-8 h-8 text-violet-600" />
                        Community Hub
                    </h1>
                    <p className="text-gray-500 mt-1">Ruang diskusi, berbagi ilmu, dan networking profesional.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                                👤
                            </div>
                        ))}
                    </div>
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        128 Online
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Sidebar - Navigation (Hidden on mobile) */}
                <div className="hidden lg:block lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 px-4 mb-2">Menu</h3>
                        <div className="space-y-1">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${selectedCategory === cat.id
                                            ? 'bg-violet-50 text-violet-700 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <cat.icon className={`w-5 h-5 ${selectedCategory === cat.id ? 'text-violet-600' : 'text-gray-400'}`} />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content - Feed */}
                <div className="col-span-12 lg:col-span-6 space-y-6">
                    {/* Create Post */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shrink-0">
                                👤
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    placeholder="Apa yang ingin kamu diskusikan hari ini?"
                                    className="w-full p-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-violet-200 resize-none outline-none transition-all placeholder:text-gray-400 text-gray-900"
                                    rows={3}
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:bg-gray-100 hover:text-violet-600 rounded-lg transition-colors">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:bg-gray-100 hover:text-violet-600 rounded-lg transition-colors">
                                            <Hash className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handlePost}
                                        disabled={!newPost.trim() || isPosting}
                                        className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-200"
                                    >
                                        {isPosting ? 'Posting...' : 'Post'}
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter (Mobile Only) */}
                    <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                        ? 'bg-violet-600 text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-600'
                                    }`}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Posts Feed */}
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Post Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-2xl">
                                            {post.author.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-gray-900">{post.author.name}</p>
                                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                                                    LVL {post.author.level}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <span>{post.author.role}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <span>{post.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Post Metadata */}
                                <div className="mb-3 flex items-center gap-2 flex-wrap">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${post.category === 'Success Story' ? 'bg-green-100 text-green-700' :
                                            post.category === 'Tips & Tricks' ? 'bg-purple-100 text-purple-700' :
                                                post.category === 'Job Market' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-pink-100 text-pink-700'
                                        }`}>
                                        <Trophy className="w-3 h-3" />
                                        {post.category}
                                    </span>
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-xs font-medium text-gray-500 hover:text-violet-600 cursor-pointer">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Post Content */}
                                <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{post.title}</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">{post.content}</p>

                                {/* Post Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => toggleLike(post.id)}
                                            className={`flex items-center gap-2 text-sm font-bold transition-all ${post.isLiked ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                            {post.likes}
                                        </button>
                                        <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-violet-600 transition-colors">
                                            <MessageSquare className="w-5 h-5" />
                                            {post.comments}
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-violet-600 transition-colors">
                                        <Share2 className="w-5 h-5" />
                                        Share
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Right Sidebar - Trending & Contributors */}
                <div className="hidden lg:block lg:col-span-3 space-y-6">
                    {/* Top Contributors */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Top Contributors
                        </h3>
                        <div className="space-y-4">
                            {TOP_CONTRIBUTORS.map((user, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full border-2 ${user.border} p-0.5 flex items-center justify-center text-xl bg-gray-50`}>
                                        {user.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                                            <Sparkles className="w-3 h-3" />
                                            {user.points} XP
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        #{idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors">
                            Lihat Leaderboard →
                        </button>
                    </div>

                    {/* Trending Topics */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-violet-600" />
                            Sedang Hangat
                        </h3>
                        <div className="space-y-3">
                            {['DataAnalyst', 'CareerPath', 'LokerMakassar', 'InterviewTips'].map((tag, idx) => (
                                <div key={idx} className="group cursor-pointer">
                                    <p className="text-sm font-bold text-gray-700 group-hover:text-violet-600 transition-colors">#{tag}</p>
                                    <p className="text-xs text-gray-400">{1240 - (idx * 150)} posts</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Challenge */}
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-violet-200">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                            <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Weekly Challenge</h3>
                        <p className="text-violet-100 text-sm mb-4">
                            "Bagikan satu kesalahan saat interview dan apa yang kamu pelajari."
                        </p>
                        <button className="w-full py-2 bg-white text-violet-600 font-bold rounded-xl text-sm hover:bg-violet-50 transition-colors">
                            Ikut Challenge (+100 XP)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
