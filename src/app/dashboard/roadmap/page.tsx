'use client'

import { useState } from 'react'
import {
    Map, ChevronRight, CheckCircle, Circle, Lock, Play, Star, Sparkles,
    Clock, Target, Book, Trophy, Zap
} from 'lucide-react'

interface RoadmapStep {
    id: string
    month: number
    title: string
    description: string
    skills: string[]
    courses: { name: string; duration: string; completed: boolean }[]
    status: 'completed' | 'current' | 'locked'
    milestone?: string
}

const ROADMAP_STEPS: RoadmapStep[] = [
    {
        id: '1',
        month: 1,
        title: 'Foundation',
        description: 'Bangun dasar yang kuat dengan skill fundamental',
        skills: ['Python Basics', 'SQL Basics', 'Excel'],
        courses: [
            { name: 'Python for Data Analysis', duration: '15 jam', completed: true },
            { name: 'SQL Fundamentals', duration: '10 jam', completed: true },
            { name: 'Advanced Excel', duration: '8 jam', completed: false }
        ],
        status: 'completed',
        milestone: 'Foundation Certificate 🎓'
    },
    {
        id: '2',
        month: 2,
        title: 'Core Skills',
        description: 'Kuasai skill inti yang dibutuhkan industry',
        skills: ['Data Visualization', 'Tableau', 'Statistics'],
        courses: [
            { name: 'Data Visualization Mastery', duration: '12 jam', completed: true },
            { name: 'Tableau Complete Guide', duration: '10 jam', completed: false },
            { name: 'Statistics for Data Science', duration: '14 jam', completed: false }
        ],
        status: 'current'
    },
    {
        id: '3',
        month: 3,
        title: 'Advanced & Portfolio',
        description: 'Level up dengan advanced skills dan build portfolio',
        skills: ['Machine Learning Basics', 'Power BI', 'Portfolio Project'],
        courses: [
            { name: 'Introduction to ML', duration: '16 jam', completed: false },
            { name: 'Power BI Dashboard', duration: '8 jam', completed: false },
            { name: 'Capstone Project', duration: '20 jam', completed: false }
        ],
        status: 'locked',
        milestone: 'Job Ready Certificate 🚀'
    },
    {
        id: '4',
        month: 4,
        title: 'Job Preparation',
        description: 'Persiapan interview dan apply ke lowongan impian',
        skills: ['Interview Skills', 'Resume Optimization', 'Networking'],
        courses: [
            { name: 'Data Analyst Interview Prep', duration: '6 jam', completed: false },
            { name: 'Resume & Portfolio Review', duration: '4 jam', completed: false },
            { name: 'LinkedIn Optimization', duration: '3 jam', completed: false }
        ],
        status: 'locked',
        milestone: 'Career Ready! 🎯'
    }
]

export default function RoadmapPage() {
    const [roadmap] = useState<RoadmapStep[]>(ROADMAP_STEPS)
    const [selectedStep, setSelectedStep] = useState<string | null>('2')

    // Calculate overall progress
    const totalCourses = roadmap.flatMap(s => s.courses).length
    const completedCourses = roadmap.flatMap(s => s.courses).filter(c => c.completed).length
    const progressPercentage = Math.round((completedCourses / totalCourses) * 100)

    const currentStep = roadmap.find(s => s.status === 'current')

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Map className="w-7 h-7 text-indigo-600" />
                        Learning Roadmap
                    </h1>
                    <p className="text-gray-500 mt-1">Jalur pembelajaran personalized untuk karirmu</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Overall Progress</p>
                        <p className="text-lg font-bold text-indigo-600">{progressPercentage}%</p>
                    </div>
                    <div className="w-24 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">AI Insight</h3>
                        <p className="text-white/90 text-sm">
                            Dengan pace saat ini, kamu akan menyelesaikan roadmap dalam <strong>3.5 bulan</strong>
                            (lebih cepat 2 minggu dari rata-rata). Fokus selesaikan Tableau course minggu ini
                            untuk tetap on track! 🚀
                        </p>
                    </div>
                </div>
            </div>

            {/* Roadmap Timeline */}
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-6">
                    {roadmap.map((step, idx) => (
                        <div key={step.id} className="relative flex gap-6">
                            {/* Timeline node */}
                            <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${step.status === 'completed' ? 'bg-green-100' :
                                    step.status === 'current' ? 'bg-indigo-100' :
                                        'bg-gray-100'
                                }`}>
                                {step.status === 'completed' ? (
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                ) : step.status === 'current' ? (
                                    <Play className="w-8 h-8 text-indigo-600" />
                                ) : (
                                    <Lock className="w-7 h-7 text-gray-400" />
                                )}
                            </div>

                            {/* Step Card */}
                            <div
                                className={`flex-1 bg-white rounded-2xl border p-6 cursor-pointer transition-all ${selectedStep === step.id ? 'border-indigo-300 shadow-lg' : 'border-gray-100 hover:border-gray-200'
                                    } ${step.status === 'locked' ? 'opacity-60' : ''}`}
                                onClick={() => step.status !== 'locked' && setSelectedStep(step.id)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${step.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                step.status === 'current' ? 'bg-indigo-100 text-indigo-700' :
                                                    'bg-gray-100 text-gray-500'
                                            }`}>
                                            Bulan {step.month}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 mt-2">{step.title}</h3>
                                        <p className="text-gray-600 text-sm">{step.description}</p>
                                    </div>
                                    {step.milestone && (
                                        <div className="text-right">
                                            <Trophy className="w-5 h-5 text-amber-500 inline" />
                                            <p className="text-xs text-gray-500 mt-1">{step.milestone}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {step.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Courses (expanded) */}
                                {selectedStep === step.id && (
                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <h4 className="text-sm font-medium text-gray-700">Courses:</h4>
                                        {step.courses.map((course, cIdx) => (
                                            <div key={cIdx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                {course.completed ? (
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-300" />
                                                )}
                                                <div className="flex-1">
                                                    <p className={`text-sm font-medium ${course.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                        {course.name}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {course.duration}
                                                </span>
                                                {!course.completed && step.status !== 'locked' && (
                                                    <button className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700">
                                                        Start
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Progress bar */}
                                {step.status !== 'locked' && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Progress</span>
                                            <span>{step.courses.filter(c => c.completed).length}/{step.courses.length} courses</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${step.status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'
                                                    }`}
                                                style={{
                                                    width: `${(step.courses.filter(c => c.completed).length / step.courses.length) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                    <Book className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
                    <p className="text-xs text-gray-500">Courses Done</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                    <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">48</p>
                    <p className="text-xs text-gray-500">Jam Belajar</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                    <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">450</p>
                    <p className="text-xs text-gray-500">XP Earned</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                    <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">2</p>
                    <p className="text-xs text-gray-500">Milestones</p>
                </div>
            </div>
        </div>
    )
}
