'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import {
    User,
    MapPin,
    Briefcase,
    GraduationCap,
    Award,
    Code,
    ExternalLink,
    Mail,
    Linkedin,
    Github,
    Star
} from 'lucide-react'

interface PortfolioData {
    user: {
        full_name: string
        avatar_url: string | null
        bio: string | null
        city: string | null
        university: string | null
        major: string | null
    }
    skills: Array<{
        name: string
        proficiency_level: string
        category: string
    }>
    projects: Array<{
        id: string
        title: string
        description: string
        image_url: string | null
        project_url: string | null
        technologies: string[]
    }>
    certificates: Array<{
        id: string
        title: string
        issuer: string
        issue_date: string
        image_url: string | null
    }>
    careers: Array<{
        title: string
        match_percentage: number
    }>
}

export default function PublicPortfolioPage({ params }: { params: { username: string } }) {
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        async function fetchPortfolio() {
            try {
                const res = await fetch(`/api/portfolio/public/${params.username}`)
                if (!res.ok) {
                    setError(true)
                    return
                }
                const data = await res.json()
                if (data.success) {
                    setPortfolio(data.portfolio)
                } else {
                    setError(true)
                }
            } catch {
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchPortfolio()
    }, [params.username])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        )
    }

    if (error || !portfolio) {
        notFound()
    }

    const { user, skills, projects, certificates, careers } = portfolio

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        CareerPath.id
                    </span>
                    <span className="text-sm text-gray-400">
                        Portfolio Publik
                    </span>
                </div>
            </header>

            {/* Profile Section */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                {user.avatar_url ? (
                                    <Image
                                        src={user.avatar_url}
                                        alt={user.full_name}
                                        width={128}
                                        height={128}
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="w-16 h-16 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {user.full_name}
                        </h1>
                        {user.bio && (
                            <p className="text-gray-300 mb-4 max-w-2xl">
                                {user.bio}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-400">
                            {user.city && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" /> {user.city}
                                </span>
                            )}
                            {user.university && (
                                <span className="flex items-center gap-1">
                                    <GraduationCap className="w-4 h-4" /> {user.university}
                                </span>
                            )}
                            {user.major && (
                                <span className="flex items-center gap-1">
                                    <Briefcase className="w-4 h-4" /> {user.major}
                                </span>
                            )}
                        </div>

                        {/* Career Goals */}
                        {careers.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                {careers.slice(0, 3).map((career, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm"
                                    >
                                        {career.title} ({career.match_percentage}%)
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            {skills.length > 0 && (
                <section className="max-w-6xl mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Code className="w-6 h-6 text-purple-400" />
                        Skills
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {skills.map((skill, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
                            >
                                <div className="font-medium text-white">{skill.name}</div>
                                <div className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    {skill.proficiency_level}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
                <section className="max-w-6xl mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-purple-400" />
                        Projects
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all group"
                            >
                                {project.image_url && (
                                    <div className="aspect-video bg-slate-800 relative overflow-hidden">
                                        <Image
                                            src={project.image_url}
                                            alt={project.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-semibold text-white">{project.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                        {project.description}
                                    </p>
                                    {project.technologies?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {project.technologies.slice(0, 4).map((tech, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {project.project_url && (
                                        <a
                                            href={project.project_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-3 inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
                                        >
                                            View Project <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certificates Section */}
            {certificates.length > 0 && (
                <section className="max-w-6xl mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Award className="w-6 h-6 text-purple-400" />
                        Certificates
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert) => (
                            <div
                                key={cert.id}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
                            >
                                <h3 className="font-semibold text-white">{cert.title}</h3>
                                <p className="text-sm text-gray-400">{cert.issuer}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(cert.issue_date).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long'
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t border-white/10 mt-12">
                <div className="max-w-6xl mx-auto px-4 py-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Portfolio dibuat dengan ❤️ menggunakan{' '}
                        <a href="/" className="text-purple-400 hover:text-purple-300">
                            CareerPath.id
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    )
}
