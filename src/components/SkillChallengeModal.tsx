'use client'

import { useState, useEffect } from 'react'
import {
    X,
    Target,
    Trophy,
    Clock,
    CheckCircle,
    Star,
    Zap,
    BookOpen,
    Video,
    Mic,
    Code,
    Users,
    Loader2,
    ExternalLink,
    Sparkles
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface Skill {
    id: string
    name: string
    category: string
    description: string
    icon_name: string
    importance: string
}

interface SkillChallengeModalProps {
    skill: Skill | null
    isOpen: boolean
    onClose: () => void
    onComplete: (skillId: string) => Promise<void>
}

// Weekly challenges for different skill types
const SKILL_CHALLENGES: Record<string, { title: string; challenges: { task: string; xp: number; icon: React.ElementType }[] }> = {
    'default': {
        title: 'Tantangan Mingguan',
        challenges: [
            { task: 'Tonton 1 video tutorial tentang skill ini (15 menit)', xp: 10, icon: Video },
            { task: 'Baca 1 artikel atau dokumentasi terkait', xp: 15, icon: BookOpen },
            { task: 'Praktikkan skill ini selama 30 menit', xp: 25, icon: Zap },
        ]
    },
    'Public Speaking': {
        title: 'Tantangan Public Speaking',
        challenges: [
            { task: 'Rekam dirimu bicara 1 menit tentang hobi', xp: 20, icon: Mic },
            { task: 'Presentasikan sesuatu ke teman/keluarga', xp: 30, icon: Users },
            { task: 'Tonton dan analisis 1 TED Talk', xp: 15, icon: Video },
        ]
    },
    'JavaScript': {
        title: 'Tantangan JavaScript',
        challenges: [
            { task: 'Selesaikan 3 coding challenge di LeetCode/HackerRank', xp: 30, icon: Code },
            { task: 'Buat 1 mini project (to-do app, calculator)', xp: 50, icon: Zap },
            { task: 'Baca dokumentasi MDN selama 20 menit', xp: 15, icon: BookOpen },
        ]
    },
    'React': {
        title: 'Tantangan React',
        challenges: [
            { task: 'Buat 1 komponen React yang reusable', xp: 30, icon: Code },
            { task: 'Implementasi state management dengan hooks', xp: 40, icon: Zap },
            { task: 'Tonton tutorial React dari YouTube', xp: 15, icon: Video },
        ]
    },
    'Figma': {
        title: 'Tantangan Figma',
        challenges: [
            { task: 'Redesign 1 halaman dari app favorit', xp: 35, icon: Zap },
            { task: 'Buat Design System sederhana', xp: 40, icon: Target },
            { task: 'Ikuti tutorial Figma 30 menit', xp: 20, icon: Video },
        ]
    },
    'Communication': {
        title: 'Tantangan Komunikasi',
        challenges: [
            { task: 'Tulis email profesional ke dosen/mentor', xp: 20, icon: BookOpen },
            { task: 'Praktikkan active listening di 3 percakapan', xp: 25, icon: Users },
            { task: 'Rekam diri menjelaskan konsep kompleks', xp: 30, icon: Mic },
        ]
    },
    'Critical Thinking': {
        title: 'Tantangan Critical Thinking',
        challenges: [
            { task: 'Analisis pro-kontra dari 1 isu terkini', xp: 25, icon: BookOpen },
            { task: 'Selesaikan 5 logic puzzle', xp: 30, icon: Zap },
            { task: 'Debat dengan teman tentang topik netral', xp: 35, icon: Users },
        ]
    },
}

// Learning resources
const LEARNING_RESOURCES = [
    { name: 'YouTube', url: 'https://youtube.com/results?search_query=', icon: Video },
    { name: 'Google', url: 'https://google.com/search?q=tutorial+', icon: BookOpen },
    { name: 'Coursera', url: 'https://coursera.org/search?query=', icon: Star },
]

export default function SkillChallengeModal({ skill, isOpen, onClose, onComplete }: SkillChallengeModalProps) {
    const [isCompleting, setIsCompleting] = useState(false)
    const [completedChallenges, setCompletedChallenges] = useState<number[]>([])
    const [showSuccess, setShowSuccess] = useState(false)

    // Get challenges for this skill
    const challengeData = skill
        ? (SKILL_CHALLENGES[skill.name] || SKILL_CHALLENGES['default'])
        : SKILL_CHALLENGES['default']

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setCompletedChallenges([])
            setShowSuccess(false)
        }
    }, [isOpen])

    // Toggle challenge completion
    const toggleChallenge = (index: number) => {
        if (completedChallenges.includes(index)) {
            setCompletedChallenges(completedChallenges.filter(i => i !== index))
        } else {
            setCompletedChallenges([...completedChallenges, index])
        }
    }

    // Calculate XP earned
    const totalXP = completedChallenges.reduce((sum, idx) => {
        return sum + (challengeData.challenges[idx]?.xp || 0)
    }, 0)

    // Handle skill completion
    const handleComplete = async () => {
        if (!skill) return

        setIsCompleting(true)
        try {
            await onComplete(skill.id)

            // Show success state
            setShowSuccess(true)

            // Trigger confetti!
            const duration = 3000
            const animationEnd = Date.now() + duration
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

            function randomInRange(min: number, max: number) {
                return Math.random() * (max - min) + min
            }

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now()
                if (timeLeft <= 0) {
                    return clearInterval(interval)
                }
                const particleCount = 50 * (timeLeft / duration)

                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ['#8B5CF6', '#6366F1', '#EC4899', '#10B981', '#F59E0B'],
                })
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ['#8B5CF6', '#6366F1', '#EC4899', '#10B981', '#F59E0B'],
                })
            }, 250)

            // Close modal after animation
            setTimeout(() => {
                onClose()
            }, 3500)
        } catch (error) {
            console.error('Failed to complete skill:', error)
        } finally {
            setIsCompleting(false)
        }
    }

    if (!isOpen || !skill) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                {/* Success State */}
                {showSuccess ? (
                    <div className="p-12 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <Trophy className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Luar Biasa! 🎉
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Kamu berhasil menguasai <strong>{skill.name}</strong>!
                        </p>
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-bold text-lg">
                            <Zap className="w-5 h-5" />
                            +{totalXP > 0 ? totalXP : 50} XP
                        </div>
                        <p className="mt-6 text-sm text-gray-500">
                            Progress kariermu telah diperbarui!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                                    <Target className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-violet-200 text-sm">Skill Challenge</p>
                                    <h2 className="text-2xl font-bold">{skill.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${skill.category === 'Hard Skill'
                                                ? 'bg-blue-400/30 text-blue-100'
                                                : 'bg-pink-400/30 text-pink-100'
                                            }`}>
                                            {skill.category}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${skill.importance === 'Essential'
                                                ? 'bg-red-400/30 text-red-100'
                                                : skill.importance === 'Important'
                                                    ? 'bg-orange-400/30 text-orange-100'
                                                    : 'bg-gray-400/30 text-gray-100'
                                            }`}>
                                            {skill.importance}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Description */}
                            {skill.description && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-gray-600 text-sm">{skill.description}</p>
                                </div>
                            )}

                            {/* Weekly Challenges */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    {challengeData.title}
                                </h3>

                                <div className="space-y-3">
                                    {challengeData.challenges.map((challenge, index) => {
                                        const isCompleted = completedChallenges.includes(index)
                                        const IconComponent = challenge.icon

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => toggleChallenge(index)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${isCompleted
                                                        ? 'bg-green-50 border-green-300'
                                                        : 'bg-white border-gray-200 hover:border-violet-300 hover:bg-violet-50'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCompleted
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {isCompleted ? (
                                                        <CheckCircle className="w-5 h-5" />
                                                    ) : (
                                                        <IconComponent className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-medium ${isCompleted ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                                                        {challenge.task}
                                                    </p>
                                                </div>
                                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium shrink-0 ${isCompleted
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    <Zap className="w-3 h-3" />
                                                    {challenge.xp} XP
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* XP Summary */}
                                {completedChallenges.length > 0 && (
                                    <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Total XP yang didapat:</span>
                                            <div className="flex items-center gap-2 text-lg font-bold text-yellow-600">
                                                <Star className="w-5 h-5" />
                                                {totalXP} XP
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Learning Resources */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-blue-500" />
                                    Sumber Belajar
                                </h3>
                                <div className="flex gap-2">
                                    {LEARNING_RESOURCES.map((resource) => {
                                        const IconComponent = resource.icon
                                        return (
                                            <a
                                                key={resource.name}
                                                href={`${resource.url}${encodeURIComponent(skill.name)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                                            >
                                                <IconComponent className="w-4 h-4" />
                                                {resource.name}
                                                <ExternalLink className="w-3 h-3 opacity-50" />
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 p-6 bg-white border-t border-gray-100">
                            <button
                                onClick={handleComplete}
                                disabled={isCompleting}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                            >
                                {isCompleting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Saya Sudah Menguasai Skill Ini!
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-3">
                                Skill akan ditandai sebagai &quot;Beginner&quot; dan progress kariermu akan diperbarui
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
