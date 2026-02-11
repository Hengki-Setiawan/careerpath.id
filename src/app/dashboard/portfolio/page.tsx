'use client'

import { useState, useEffect } from 'react'
import {
    Folder, Plus, Link2, Github, Globe, Image as ImageIcon,
    Star, Eye, Edit2, Trash2, ExternalLink, Download, Award,
    CheckCircle, AlertCircle, Sparkles, Share2, Code, Briefcase,
    LayoutGrid, List, MoreVertical, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Project {
    id: string
    title: string
    description: string
    techStack: string[]
    imageUrl?: string
    liveUrl?: string
    githubUrl?: string
    category: string
    featured: boolean
}

interface Certificate {
    id: string
    title: string
    issuer: string
    date: string
    skillTags: string[]
    imageUrl?: string
}

// Mock data
const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        title: 'E-Commerce Dashboard',
        description: 'Dashboard analytics untuk toko online dengan visualisasi data penjualan, inventory, dan customer insights. Menggunakan Recharts untuk grafik dan Tailwind CSS untuk styling responsif.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/example',
        category: 'Web Development',
        featured: true
    },
    {
        id: '2',
        title: 'Data Analysis: Makassar Tourism',
        description: 'Analisis data wisatawan Makassar 2024 dengan Python, menggunakan pandas dan matplotlib untuk visualisasi pattern kunjungan wisatawan mancanegara.',
        techStack: ['Python', 'Pandas', 'Matplotlib', 'Jupyter'],
        githubUrl: 'https://github.com/example',
        category: 'Data Analysis',
        featured: false
    }
]

const MOCK_CERTIFICATES: Certificate[] = [
    {
        id: '1',
        title: 'Google Data Analytics Professional Certificate',
        issuer: 'Coursera',
        date: '2026-01',
        skillTags: ['Data Analysis', 'SQL', 'Tableau', 'R']
    },
    {
        id: '2',
        title: 'Meta Front-End Developer',
        issuer: 'Coursera',
        date: '2025-11',
        skillTags: ['React', 'JavaScript', 'HTML/CSS']
    }
]

const MOCK_SKILLS = [
    { name: 'JavaScript', level: 4 },
    { name: 'React', level: 4 },
    { name: 'Python', level: 3 },
    { name: 'SQL', level: 3 },
    { name: 'TypeScript', level: 3 },
    { name: 'Data Analysis', level: 2 },
]

export default function PortfolioPage() {
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
    const [certificates, setCertificates] = useState<Certificate[]>(MOCK_CERTIFICATES)
    const [skills, setSkills] = useState(MOCK_SKILLS)
    const [showAddProject, setShowAddProject] = useState(false)
    const [portfolioScore, setPortfolioScore] = useState(7)
    const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'skills'>('projects')

    // Calculate portfolio score
    useEffect(() => {
        let score = 0
        score += Math.min(projects.length * 1.5, 4) // Max 4 points for projects
        score += Math.min(certificates.length * 1, 3) // Max 3 points for certs
        score += skills.length > 5 ? 2 : 1 // Points for skills
        score += projects.some(p => p.featured) ? 1 : 0 // Bonus for featured
        setPortfolioScore(Math.min(Math.round(score), 10))
    }, [projects, certificates, skills])

    const [newProject, setNewProject] = useState<Partial<Project>>({
        title: '',
        description: '',
        techStack: [],
        category: 'Web Development',
        featured: false
    })

    const addProject = () => {
        if (!newProject.title || !newProject.description) return
        setProjects(prev => [...prev, {
            ...newProject,
            id: Date.now().toString(),
            techStack: newProject.techStack || []
        } as Project])
        setNewProject({ title: '', description: '', techStack: [], category: 'Web Development', featured: false })
        setShowAddProject(false)
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Folder className="w-7 h-7 text-indigo-600" />
                        Portfolio Builder
                    </h1>
                    <p className="text-gray-500 mt-1">Bangun personal branding profesionalmu.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
                    <Share2 className="w-4 h-4" />
                    Share Portfolio
                </button>
            </div>

            {/* Portfolio Score Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-8 text-white shadow-xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
                    <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 shadow-inner">
                        <span className="text-4xl font-black">{portfolioScore}<span className="text-xl text-white/70 font-medium">/10</span></span>
                    </div>

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">Portfolio Strength</h2>
                        <p className="text-indigo-100 mb-4 opacity-90 max-w-xl">
                            {portfolioScore >= 8 ? 'Luar biasa! Portfolio kamu sudah sangat kompetitif untuk melamar kerja.' :
                                portfolioScore >= 6 ? 'Bagus! Tambahkan 1-2 project lagi untuk membuat recuiter terkesan.' :
                                    'Ayo lengkapi portfoliomu! Tambahkan project dan sertifikat untuk meningkatkan skor.'}
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full max-w-md h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${portfolioScore * 10}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full rounded-full ${portfolioScore >= 8 ? 'bg-green-400' :
                                        portfolioScore >= 5 ? 'bg-amber-400' : 'bg-red-400'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* AI Suggestions Box */}
                    <div className="lg:w-72 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold text-sm">
                            <Sparkles className="w-4 h-4" />
                            AI Recommendation
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed">
                            {portfolioScore < 8
                                ? 'Tambahkan 1 "Featured Project" dengan deskripsi teknis mendalam untuk meningkatkan skor +2 poin.'
                                : 'Optimalkan bagian "About Me" untuk menonjolkan soft skill kepemimpinan kamu.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-100 overflow-x-auto">
                {[
                    { id: 'projects', label: 'Projects', icon: Code, count: projects.length },
                    { id: 'certificates', label: 'Certificates', icon: Award, count: certificates.length },
                    { id: 'skills', label: 'Skills', icon: Star, count: skills.length },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                            ? 'text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'stroke-[2.5px]' : ''}`} />
                        {tab.label}
                        <span className={`px-2 py-0.5 rounded-full text-xs transition-colors ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                            }`}>{tab.count}</span>

                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            {/* Add Project Button */}
                            <button
                                onClick={() => setShowAddProject(true)}
                                className="w-full py-8 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center gap-2 group"
                            >
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="font-medium">Tambahkan Project Baru</span>
                            </button>

                            {/* Project Cards */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {projects.map((project, idx) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col"
                                    >
                                        {/* Project Image Placeholder */}
                                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                                <ImageIcon className="w-12 h-12" />
                                            </div>
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                {project.liveUrl && (
                                                    <a href={project.liveUrl} target="_blank" className="p-2 bg-white rounded-full hover:scale-110 transition-transform text-gray-900">
                                                        <Globe className="w-5 h-5" />
                                                    </a>
                                                )}
                                                {project.githubUrl && (
                                                    <a href={project.githubUrl} target="_blank" className="p-2 bg-white rounded-full hover:scale-110 transition-transform text-gray-900">
                                                        <Github className="w-5 h-5" />
                                                    </a>
                                                )}
                                            </div>
                                            {project.featured && (
                                                <div className="absolute top-3 right-3 px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" /> Featured
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">{project.category}</p>
                                                </div>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">{project.description}</p>

                                            <div className="flex gap-2 flex-wrap mt-auto">
                                                {project.techStack.map(tech => (
                                                    <span key={tech} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certificates Tab */}
                    {activeTab === 'certificates' && (
                        <div className="space-y-6">
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Award className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Tambahkan Sertifikat</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-8">
                                    Upload sertifikat dari kursus, bootcamp, atau kompetisi untuk memvalidasi skill kamu.
                                </p>
                                <button className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                    <Plus className="w-5 h-5" />
                                    Upload Sertifikat
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {certificates.map(cert => (
                                    <div key={cert.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-all">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100">
                                            <Award className="w-8 h-8 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{cert.title}</h4>
                                            <p className="text-sm text-gray-500">{cert.issuer} • {cert.date}</p>
                                            <div className="flex gap-1 mt-2">
                                                {cert.skillTags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills Tab */}
                    {activeTab === 'skills' && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Skill Overview</h3>
                            <p className="text-gray-500 mb-6">
                                Skill kamu dikelola di halaman <strong>Skill Tracking</strong>. Perubahan di sana akan otomatis update di portfolio.
                            </p>
                            <a
                                href="/dashboard/skills"
                                className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline"
                            >
                                Pergi ke Skill Tracking <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Add Project Modal */}
            {showAddProject && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Project Baru</h3>
                            <button
                                onClick={() => setShowAddProject(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Judul Project <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium"
                                    placeholder="Contoh: E-Commerce Dashboard"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi <span className="text-red-500">*</span></label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none"
                                    placeholder="Jelaskan tantangan, solusi, dan teknologii yang digunakan..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tech Stack (pisahkan dengan koma)</label>
                                <input
                                    type="text"
                                    onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value.split(',').map(s => s.trim()) })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                    placeholder="React, TypeScript, Node.js, PostgreSQL"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Live URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={newProject.liveUrl || ''}
                                            onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Repository URL</label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={newProject.githubUrl || ''}
                                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mt-2">
                                <input
                                    type="checkbox"
                                    checked={newProject.featured}
                                    onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                    id="featured_check"
                                />
                                <label htmlFor="featured_check" className="text-sm text-gray-700">
                                    <span className="font-bold block">Jadikan Featured Project</span>
                                    <span className="text-xs text-gray-500">Project ini akan muncul di highlight profil kamu</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setShowAddProject(false)}
                                className="flex-1 py-3.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={addProject}
                                className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                Simpan Project
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
