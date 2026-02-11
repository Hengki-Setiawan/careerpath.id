'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Compass, GraduationCap, Building2, BookOpen, User, ArrowRight, ArrowLeft, Loader2, Sparkles,
    Target, BarChart3, Brain, Heart, Calendar, CheckCircle, Star, Briefcase, TrendingUp
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Data constants
const UNIVERSITIES = [
    'Universitas Hasanuddin',
    'Universitas Negeri Makassar',
    'Universitas Muslim Indonesia',
    'Universitas Muhammadiyah Makassar',
    'Universitas Bosowa',
    'STIE Nobel Indonesia',
    'Politeknik Negeri Ujung Pandang',
    'Universitas Fajar',
    'Universitas Atma Jaya Makassar',
    'Universitas Kristen Indonesia Paulus',
    'Universitas Islam Makassar',
    'STIMIK Dipanegara Makassar',
    'Lainnya'
]

const MAJORS = [
    'Teknik Informatika',
    'Sistem Informasi',
    'Ilmu Komputer',
    'Teknik Elektro',
    'Teknik Industri',
    'Manajemen',
    'Akuntansi',
    'Ekonomi Pembangunan',
    'Ilmu Komunikasi',
    'Hukum',
    'Psikologi',
    'Kedokteran',
    'Farmasi',
    'Keperawatan',
    'Arsitektur',
    'Desain Komunikasi Visual',
    'Sastra Inggris',
    'Hubungan Internasional',
    'Administrasi Bisnis',
    'Pendidikan',
    'Lainnya'
]

const STATUS_OPTIONS = [
    { id: 'mahasiswa', label: 'Mahasiswa Aktif', icon: GraduationCap, description: 'Sedang kuliah dan mencari arah karier' },
    { id: 'fresh_grad', label: 'Fresh Graduate', icon: Target, description: 'Baru lulus, siap masuk dunia kerja' },
    { id: 'pencari_kerja', label: 'Pencari Kerja', icon: Briefcase, description: 'Sedang aktif mencari pekerjaan' },
    { id: 'pindah_karier', label: 'Career Switcher', icon: TrendingUp, description: 'Ingin pindah ke bidang baru' },
]

const CAREER_INTERESTS = [
    { id: 'tech', label: 'Technology', icon: '💻', careers: ['Software Developer', 'Data Analyst', 'UI/UX Designer'] },
    { id: 'creative', label: 'Creative', icon: '🎨', careers: ['Graphic Designer', 'Content Creator', 'Video Editor'] },
    { id: 'business', label: 'Business', icon: '📈', careers: ['Digital Marketer', 'Product Manager', 'Business Analyst'] },
    { id: 'finance', label: 'Finance', icon: '💰', careers: ['Financial Analyst', 'Accountant', 'Investment Analyst'] },
    { id: 'healthcare', label: 'Healthcare', icon: '🏥', careers: ['Health Educator', 'Medical Professional', 'Researcher'] },
    { id: 'education', label: 'Education', icon: '📚', careers: ['Teacher', 'Tutor', 'Educational Content Creator'] },
]

const SKILLS_LIST = [
    // Technical
    { id: 'programming', name: 'Programming/Coding', category: 'technical' },
    { id: 'data_analysis', name: 'Data Analysis', category: 'technical' },
    { id: 'design', name: 'UI/UX Design', category: 'technical' },
    { id: 'excel', name: 'Excel/Spreadsheet', category: 'technical' },
    { id: 'social_media', name: 'Social Media Management', category: 'technical' },
    { id: 'video_editing', name: 'Video Editing', category: 'technical' },
    // Soft Skills
    { id: 'communication', name: 'Communication', category: 'soft' },
    { id: 'problem_solving', name: 'Problem Solving', category: 'soft' },
    { id: 'teamwork', name: 'Teamwork', category: 'soft' },
    { id: 'leadership', name: 'Leadership', category: 'soft' },
    { id: 'time_management', name: 'Time Management', category: 'soft' },
    { id: 'creativity', name: 'Creativity', category: 'soft' },
]

const ANXIETY_LEVELS = [
    { value: 1, label: 'Tenang', emoji: '😌', description: 'Saya merasa tenang tentang karier' },
    { value: 2, label: 'Sedikit Cemas', emoji: '🤔', description: 'Kadang kepikiran tapi tidak mengganggu' },
    { value: 3, label: 'Cukup Cemas', emoji: '😟', description: 'Sering merasa khawatir tentang masa depan' },
    { value: 4, label: 'Sangat Cemas', emoji: '😰', description: 'Kecemasan sering mengganggu aktivitas' },
]

const STEP_INFO = [
    { title: 'Status', subtitle: 'Kamu saat ini...', icon: User },
    { title: 'Data Diri', subtitle: 'Kenalan dulu, yuk!', icon: GraduationCap },
    { title: 'Kampus', subtitle: 'Kamu kuliah di mana?', icon: Building2 },
    { title: 'Minat Karier', subtitle: 'Bidang apa yang menarik?', icon: Target },
    { title: 'Self-Assessment', subtitle: 'Nilai kemampuanmu', icon: BarChart3 },
    { title: 'Kesehatan Mental', subtitle: 'Bagaimana perasaanmu?', icon: Heart },
    { title: 'Rekomendasi AI', subtitle: 'Karier yang cocok untukmu', icon: Sparkles },
    { title: 'Skill Gap', subtitle: 'Skill yang perlu dikembangkan', icon: TrendingUp },
    { title: 'Learning Path', subtitle: 'Roadmap belajarmu', icon: BookOpen },
    { title: 'Target Bulanan', subtitle: 'Komitmen bulan ini', icon: Calendar },
]

interface CareerRecommendation {
    title: string
    matchScore: number
    description: string
    skills: string[]
    salary: string
}

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [isGeneratingAI, setIsGeneratingAI] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [aiRecommendations, setAIRecommendations] = useState<CareerRecommendation[]>([])

    // Form data
    const [formData, setFormData] = useState({
        // Step 1: Status
        status: '',
        // Step 2: Personal
        fullName: '',
        // Step 3: University
        university: '',
        customUniversity: '',
        major: '',
        customMajor: '',
        semester: 1,
        // Step 4: Career Interest
        careerInterests: [] as string[],
        // Step 5: Skills Assessment
        skills: {} as Record<string, number>, // skill_id: level (1-5)
        // Step 6: Mental Health
        anxietyLevel: 0,
        careerConcerns: '',
        // Step 7: AI Recommendations (display only)
        selectedCareer: '',
        // Step 8: Skill Gap (display only)
        // Step 9: Learning Path (display only)
        // Step 10: Monthly Target
        monthlyLearningGoal: 10, // hours per week
        monthlyJobApplications: 5,
        targetDate: '',
    })

    // Check auth
    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            if (profile?.university && profile?.major) {
                router.push('/dashboard')
                return
            }

            if (user.user_metadata?.full_name) {
                setFormData(prev => ({ ...prev, fullName: user.user_metadata.full_name }))
            }

            setIsChecking(false)
        }

        checkUser()
    }, [router])

    // Generate AI recommendations when reaching step 7
    useEffect(() => {
        if (step === 7 && aiRecommendations.length === 0) {
            generateAIRecommendations()
        }
    }, [step])

    const generateAIRecommendations = async () => {
        setIsGeneratingAI(true)
        try {
            // Build profile data for AI
            const profileData = {
                major: formData.major === 'Lainnya' ? formData.customMajor : formData.major,
                skills: Object.entries(formData.skills)
                    .filter(([, level]) => level >= 3)
                    .map(([skillId]) => SKILLS_LIST.find(s => s.id === skillId)?.name || skillId),
                interests: formData.careerInterests.map(id =>
                    CAREER_INTERESTS.find(i => i.id === id)?.label || id
                ),
                status: formData.status
            }

            // Call real AI API
            const response = await fetch('/api/ai/career-recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            })

            if (!response.ok) {
                throw new Error('AI API call failed')
            }

            const data = await response.json()

            // Transform API response to component format
            const recommendations: CareerRecommendation[] = data.recommendations?.slice(0, 3).map((rec: {
                career: string
                matchScore: number
                reasoning: string
                requiredSkills: string[]
                salaryRange?: { min: number, max: number }
            }) => ({
                title: rec.career,
                matchScore: rec.matchScore,
                description: rec.reasoning || 'Karier yang cocok dengan profilmu',
                skills: rec.requiredSkills?.slice(0, 4) || [],
                salary: rec.salaryRange ? `Rp ${(rec.salaryRange.min / 1000).toFixed(0)}-${(rec.salaryRange.max / 1000).toFixed(0)} Juta` : 'Rp 6-25 Juta'
            })) || []

            // Fallback if AI returns empty
            if (recommendations.length === 0) {
                recommendations.push(
                    { title: 'Software Developer', matchScore: 85, description: 'Membangun aplikasi dan sistem software', skills: ['JavaScript', 'React', 'Node.js'], salary: 'Rp 8-30 Juta' },
                    { title: 'Data Analyst', matchScore: 78, description: 'Menganalisis data untuk insight bisnis', skills: ['Python', 'SQL', 'Excel'], salary: 'Rp 7-25 Juta' },
                    { title: 'UI/UX Designer', matchScore: 72, description: 'Merancang pengalaman pengguna yang intuitif', skills: ['Figma', 'UI Design', 'UX Research'], salary: 'Rp 6-20 Juta' }
                )
            }

            setAIRecommendations(recommendations)
        } catch (err) {
            console.error('AI error:', err)
            // Fallback recommendations
            setAIRecommendations([
                { title: 'Software Developer', matchScore: 85, description: 'Membangun aplikasi dan sistem software', skills: ['JavaScript', 'React', 'Node.js'], salary: 'Rp 8-30 Juta' },
                { title: 'Data Analyst', matchScore: 78, description: 'Menganalisis data untuk insight bisnis', skills: ['Python', 'SQL', 'Excel'], salary: 'Rp 7-25 Juta' },
                { title: 'UI/UX Designer', matchScore: 72, description: 'Merancang pengalaman pengguna yang intuitif', skills: ['Figma', 'UI Design', 'UX Research'], salary: 'Rp 6-20 Juta' }
            ])
        } finally {
            setIsGeneratingAI(false)
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            const university = formData.university === 'Lainnya' ? formData.customUniversity : formData.university
            const major = formData.major === 'Lainnya' ? formData.customMajor : formData.major

            const { error: updateError } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    full_name: formData.fullName,
                    university,
                    major,
                    semester: formData.semester,
                    updated_at: new Date().toISOString()
                })

            if (updateError) {
                setError('Gagal menyimpan data. Silakan coba lagi.')
                console.error(updateError)
                return
            }

            // Save mental health log
            if (formData.anxietyLevel > 0) {
                await supabase.from('mental_health_logs').insert({
                    user_id: user.id,
                    gad7_score: formData.anxietyLevel * 5, // Simple mapping
                    notes: formData.careerConcerns,
                })
            }

            // Save selected career
            if (formData.selectedCareer) {
                const { data: career } = await supabase
                    .from('careers')
                    .select('id')
                    .eq('title', formData.selectedCareer)
                    .single()

                if (career) {
                    await supabase.from('user_careers').insert({
                        user_id: user.id,
                        career_id: career.id,
                        is_primary: true,
                        match_percentage: aiRecommendations.find(r => r.title === formData.selectedCareer)?.matchScore || 0
                    })
                }
            }

            router.push('/dashboard')
        } catch {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setIsLoading(false)
        }
    }

    const nextStep = () => { if (step < 10) setStep(step + 1) }
    const prevStep = () => { if (step > 1) setStep(step - 1) }

    const canProceed = () => {
        switch (step) {
            case 1: return formData.status !== ''
            case 2: return formData.fullName !== ''
            case 3: return formData.university !== '' && formData.major !== ''
            case 4: return formData.careerInterests.length > 0
            case 5: return Object.keys(formData.skills).length >= 3
            case 6: return formData.anxietyLevel > 0
            case 7: return formData.selectedCareer !== ''
            case 8: return true
            case 9: return true
            case 10: return formData.monthlyLearningGoal > 0
            default: return true
        }
    }

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Memuat...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <Compass className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Selamat Datang di CareerPath.id! 🎉
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                        {STEP_INFO[step - 1].subtitle} (Langkah {step} dari 10)
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Mulai</span>
                        <span>{Math.round((step / 10) * 100)}%</span>
                        <span>Selesai</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-cyan-600 transition-all duration-500"
                            style={{ width: `${(step / 10) * 100}%` }}
                        />
                    </div>

                    {/* Step Indicators */}
                    <div className="flex justify-between mt-4">
                        {STEP_INFO.map((info, idx) => {
                            const Icon = info.icon
                            const isActive = idx + 1 === step
                            const isComplete = idx + 1 < step

                            return (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isComplete ? 'bg-green-500 text-white' :
                                        isActive ? 'bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-lg' :
                                            'bg-gray-200 text-gray-400'
                                        }`}>
                                        {isComplete ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-indigo-500/5 p-6 sm:p-8 border border-gray-100">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Status Selection */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <User className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Status Kamu</h2>
                                    <p className="text-sm text-gray-500">Pilih yang paling sesuai</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {STATUS_OPTIONS.map((option) => {
                                    const Icon = option.icon
                                    const isSelected = formData.status === option.id

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => setFormData({ ...formData, status: option.id })}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all ${isSelected
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className={`font-semibold ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
                                                    {option.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 ml-13">{option.description}</p>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Personal Info */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Data Diri</h2>
                                    <p className="text-sm text-gray-500">Kenalan dulu, yuk!</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Masukkan nama lengkap"
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: University & Major */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-cyan-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Kampus & Jurusan</h2>
                                    <p className="text-sm text-gray-500">Latar belakang pendidikanmu</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Universitas</label>
                                    <select
                                        value={formData.university}
                                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 bg-white"
                                    >
                                        <option value="">Pilih universitas...</option>
                                        {UNIVERSITIES.map((uni) => (
                                            <option key={uni} value={uni}>{uni}</option>
                                        ))}
                                    </select>
                                </div>

                                {formData.university === 'Lainnya' && (
                                    <input
                                        type="text"
                                        value={formData.customUniversity}
                                        onChange={(e) => setFormData({ ...formData, customUniversity: e.target.value })}
                                        placeholder="Ketik nama universitas"
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900"
                                    />
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Jurusan</label>
                                    <select
                                        value={formData.major}
                                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900 bg-white"
                                    >
                                        <option value="">Pilih jurusan...</option>
                                        {MAJORS.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                {formData.major === 'Lainnya' && (
                                    <input
                                        type="text"
                                        value={formData.customMajor}
                                        onChange={(e) => setFormData({ ...formData, customMajor: e.target.value })}
                                        placeholder="Ketik nama jurusan"
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-900"
                                    />
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                            <button
                                                key={sem}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, semester: sem })}
                                                className={`w-12 h-12 rounded-xl font-medium transition-all ${formData.semester === sem
                                                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {sem}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Career Interest */}
                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Minat Karier</h2>
                                    <p className="text-sm text-gray-500">Pilih bidang yang menarik (bisa lebih dari satu)</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {CAREER_INTERESTS.map((interest) => {
                                    const isSelected = formData.careerInterests.includes(interest.id)

                                    return (
                                        <button
                                            key={interest.id}
                                            onClick={() => {
                                                const newInterests = isSelected
                                                    ? formData.careerInterests.filter(i => i !== interest.id)
                                                    : [...formData.careerInterests, interest.id]
                                                setFormData({ ...formData, careerInterests: newInterests })
                                            }}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all ${isSelected
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">{interest.icon}</span>
                                                <span className={`font-semibold ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>
                                                    {interest.label}
                                                </span>
                                                {isSelected && <CheckCircle className="w-5 h-5 text-purple-500 ml-auto" />}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {interest.careers.join(', ')}
                                            </p>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 5: Skills Self-Assessment */}
                    {step === 5 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Self-Assessment</h2>
                                    <p className="text-sm text-gray-500">Nilai kemampuanmu (1-5 bintang, min. 3 skill)</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {SKILLS_LIST.map((skill) => (
                                    <div key={skill.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                        <span className="font-medium text-gray-700">{skill.name}</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        skills: { ...formData.skills, [skill.id]: level }
                                                    })}
                                                    className="p-1"
                                                >
                                                    <Star
                                                        className={`w-6 h-6 transition-colors ${(formData.skills[skill.id] || 0) >= level
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-sm text-gray-500 mt-4 text-center">
                                {Object.keys(formData.skills).length}/3 skill dinilai (minimum)
                            </p>
                        </div>
                    )}

                    {/* Step 6: Mental Health Check */}
                    {step === 6 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-pink-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Kesehatan Mental</h2>
                                    <p className="text-sm text-gray-500">Bagaimana perasaanmu tentang karier?</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {ANXIETY_LEVELS.map((level) => {
                                    const isSelected = formData.anxietyLevel === level.value

                                    return (
                                        <button
                                            key={level.value}
                                            onClick={() => setFormData({ ...formData, anxietyLevel: level.value })}
                                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${isSelected
                                                ? 'border-pink-500 bg-pink-50'
                                                : 'border-gray-200 hover:border-pink-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{level.emoji}</span>
                                                <div>
                                                    <span className={`font-semibold ${isSelected ? 'text-pink-700' : 'text-gray-900'}`}>
                                                        {level.label}
                                                    </span>
                                                    <p className="text-sm text-gray-500">{level.description}</p>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Apa yang paling membuatmu khawatir? (opsional)
                                    </label>
                                    <textarea
                                        value={formData.careerConcerns}
                                        onChange={(e) => setFormData({ ...formData, careerConcerns: e.target.value })}
                                        placeholder="Ceritakan kekhawatiranmu..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all text-gray-900 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 7: AI Career Recommendations */}
                    {step === 7 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Rekomendasi AI</h2>
                                    <p className="text-sm text-gray-500">Karier yang cocok berdasarkan profilmu</p>
                                </div>
                            </div>

                            {isGeneratingAI ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 relative">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-ping opacity-20" />
                                        <div className="relative w-full h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                                            <Brain className="w-8 h-8 text-white animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 font-medium">AI sedang menganalisis profilmu...</p>
                                    <p className="text-sm text-gray-500 mt-1">Mencari karier yang paling cocok</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {aiRecommendations.map((rec, idx) => {
                                        const isSelected = formData.selectedCareer === rec.title

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setFormData({ ...formData, selectedCareer: rec.title })}
                                                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${isSelected
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-indigo-300'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className={`font-bold text-lg ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
                                                            {rec.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">{rec.description}</p>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${rec.matchScore >= 90 ? 'bg-green-100 text-green-700' :
                                                        rec.matchScore >= 80 ? 'bg-blue-100 text-blue-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {rec.matchScore}% Match
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap mt-3">
                                                    {rec.skills.map((skill, i) => (
                                                        <span key={i} className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    💰 Gaji: {rec.salary}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 8: Skill Gap Analysis */}
                    {step === 8 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Skill Gap Analysis</h2>
                                    <p className="text-sm text-gray-500">Skill yang perlu kamu kembangkan untuk {formData.selectedCareer}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                                    <h4 className="font-semibold text-red-700 mb-2">🔴 Essential (Harus Dikuasai)</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Figma', 'UI Design', 'UX Research'].map((skill) => (
                                            <span key={skill} className="px-3 py-1 rounded-lg bg-white text-red-700 text-sm font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                    <h4 className="font-semibold text-amber-700 mb-2">🟡 Important (Sangat Dianjurkan)</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Communication', 'Creativity', 'Critical Thinking'].map((skill) => (
                                            <span key={skill} className="px-3 py-1 rounded-lg bg-white text-amber-700 text-sm font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
                                    <h4 className="font-semibold text-green-700 mb-2">🟢 Nice to Have (Nilai Plus)</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Prototyping', 'Design System'].map((skill) => (
                                            <span key={skill} className="px-3 py-1 rounded-lg bg-white text-green-700 text-sm font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 9: Learning Roadmap Preview */}
                    {step === 9 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Learning Roadmap</h2>
                                    <p className="text-sm text-gray-500">Path belajarmu untuk menjadi {formData.selectedCareer}</p>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500" />

                                <div className="space-y-6">
                                    {[
                                        { month: 'Bulan 1-2', title: 'Foundation', skills: ['UI Design Basics', 'Figma Fundamentals'], status: 'current' },
                                        { month: 'Bulan 3-4', title: 'Intermediate', skills: ['UX Research', 'Prototyping'], status: 'upcoming' },
                                        { month: 'Bulan 5-6', title: 'Advanced', skills: ['Design System', 'Portfolio Project'], status: 'upcoming' },
                                    ].map((phase, idx) => (
                                        <div key={idx} className="relative pl-10">
                                            <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${phase.status === 'current'
                                                ? 'bg-indigo-600 border-indigo-600'
                                                : 'bg-white border-gray-300'
                                                }`} />

                                            <div className={`p-4 rounded-xl ${phase.status === 'current'
                                                ? 'bg-indigo-50 border border-indigo-200'
                                                : 'bg-gray-50'
                                                }`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm font-medium text-indigo-600">{phase.month}</span>
                                                    {phase.status === 'current' && (
                                                        <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs">
                                                            Mulai dari sini
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-bold text-gray-900">{phase.title}</h4>
                                                <div className="flex gap-2 mt-2 flex-wrap">
                                                    {phase.skills.map((skill) => (
                                                        <span key={skill} className="px-2 py-1 rounded-lg bg-white text-gray-600 text-xs border">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 10: Monthly Target Setting */}
                    {step === 10 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Target Bulan Ini</h2>
                                    <p className="text-sm text-gray-500">Komitmen untuk pengembangan kariermu</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        🎯 Jam Belajar per Minggu
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {[5, 10, 15, 20].map((hours) => (
                                            <button
                                                key={hours}
                                                onClick={() => setFormData({ ...formData, monthlyLearningGoal: hours })}
                                                className={`px-6 py-3 rounded-xl font-medium transition-all ${formData.monthlyLearningGoal === hours
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {hours} jam
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        📝 Target Lamaran per Bulan
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {[0, 5, 10, 20].map((apps) => (
                                            <button
                                                key={apps}
                                                onClick={() => setFormData({ ...formData, monthlyJobApplications: apps })}
                                                className={`px-6 py-3 rounded-xl font-medium transition-all ${formData.monthlyJobApplications === apps
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {apps === 0 ? 'Belum' : `${apps} lamaran`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles className="w-5 h-5 text-emerald-600" />
                                        <span className="font-bold text-gray-900">Ringkasan Profilmu</span>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                        <div><strong>Status:</strong> {STATUS_OPTIONS.find(s => s.id === formData.status)?.label}</div>
                                        <div><strong>Nama:</strong> {formData.fullName}</div>
                                        <div><strong>Kampus:</strong> {formData.university === 'Lainnya' ? formData.customUniversity : formData.university}</div>
                                        <div><strong>Jurusan:</strong> {formData.major === 'Lainnya' ? formData.customMajor : formData.major}</div>
                                        <div><strong>Karier Target:</strong> {formData.selectedCareer}</div>
                                        <div><strong>Target Belajar:</strong> {formData.monthlyLearningGoal} jam/minggu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={step === 1}
                            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Kembali
                        </button>

                        {step < 10 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={!canProceed() || isGeneratingAI}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                            >
                                Lanjut
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Selesai & Mulai!
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
