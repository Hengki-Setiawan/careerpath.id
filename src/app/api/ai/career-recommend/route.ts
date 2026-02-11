import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

// Career database
const CAREERS_DB = [
    {
        id: '1',
        title: 'Data Analyst',
        industry: 'Technology',
        salaryRange: { min: 6000000, max: 12000000 },
        demand: 'Very High',
        requiredSkills: ['SQL', 'Python', 'Data Visualization', 'Statistics', 'Excel'],
        description: 'Menganalisis data untuk mendukung keputusan bisnis'
    },
    {
        id: '2',
        title: 'Software Engineer',
        industry: 'Technology',
        salaryRange: { min: 8000000, max: 20000000 },
        demand: 'Very High',
        requiredSkills: ['JavaScript', 'Python', 'Git', 'Problem Solving', 'System Design'],
        description: 'Membangun dan memelihara aplikasi software'
    },
    {
        id: '3',
        title: 'UI/UX Designer',
        industry: 'Design',
        salaryRange: { min: 5000000, max: 15000000 },
        demand: 'High',
        requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Visual Design', 'Communication'],
        description: 'Merancang pengalaman pengguna yang intuitif'
    },
    {
        id: '4',
        title: 'Digital Marketing Specialist',
        industry: 'Marketing',
        salaryRange: { min: 4000000, max: 10000000 },
        demand: 'High',
        requiredSkills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics', 'Copywriting'],
        description: 'Mengelola strategi marketing digital'
    },
    {
        id: '5',
        title: 'Product Manager',
        industry: 'Technology',
        salaryRange: { min: 10000000, max: 25000000 },
        demand: 'High',
        requiredSkills: ['Product Strategy', 'Data Analysis', 'Communication', 'Project Management', 'User Research'],
        description: 'Memimpin pengembangan produk dari ideasi hingga launch'
    },
    {
        id: '6',
        title: 'Business Analyst',
        industry: 'Consulting',
        salaryRange: { min: 6000000, max: 14000000 },
        demand: 'Medium',
        requiredSkills: ['Excel', 'SQL', 'Communication', 'Problem Solving', 'Documentation'],
        description: 'Menjembatani kebutuhan bisnis dengan solusi teknis'
    }
]

function calculateMatchScore(userSkills: string[], requiredSkills: string[]): number {
    if (!userSkills.length || !requiredSkills.length) return 50

    const normalizedUserSkills = userSkills.map(s => s.toLowerCase())
    const normalizedRequired = requiredSkills.map(s => s.toLowerCase())

    let matches = 0
    for (const skill of normalizedRequired) {
        if (normalizedUserSkills.some(us => us.includes(skill) || skill.includes(us))) {
            matches++
        }
    }

    return Math.round((matches / requiredSkills.length) * 100)
}

export async function POST(request: NextRequest) {
    try {
        const { userProfile } = await request.json()

        const userSkills = userProfile.skills || []
        const major = userProfile.major || ''
        const interests = userProfile.interests || []

        // Calculate match for each career
        const careerMatches = CAREERS_DB.map(career => {
            const skillMatch = calculateMatchScore(userSkills, career.requiredSkills)

            // Bonus for relevant major
            let majorBonus = 0
            if (major.toLowerCase().includes('informatika') || major.toLowerCase().includes('komputer')) {
                if (['Software Engineer', 'Data Analyst'].includes(career.title)) majorBonus = 10
            }
            if (major.toLowerCase().includes('design') || major.toLowerCase().includes('seni')) {
                if (career.title === 'UI/UX Designer') majorBonus = 15
            }
            if (major.toLowerCase().includes('marketing') || major.toLowerCase().includes('bisnis')) {
                if (['Digital Marketing Specialist', 'Business Analyst'].includes(career.title)) majorBonus = 10
            }

            return {
                ...career,
                matchScore: Math.min(skillMatch + majorBonus, 99),
                missingSkills: career.requiredSkills.filter(
                    (rs: string) => !userSkills.some((us: string) => us.toLowerCase().includes(rs.toLowerCase()))
                )
            }
        }).sort((a, b) => b.matchScore - a.matchScore)

        // AI enhancement for reasoning
        let aiRecommendations = null
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'Kamu adalah AI Career Advisor CareerPath.id. Berikan reasoning singkat (max 2 kalimat) untuk rekomendasi karir, dalam Bahasa Indonesia.'
                    },
                    {
                        role: 'user',
                        content: `User dengan jurusan "${major}", skills: ${userSkills.join(', ')}. 
Top 3 career match: ${careerMatches.slice(0, 3).map(c => c.title).join(', ')}.
Berikan reasoning singkat kenapa career ini cocok untuk user.`
                    }
                ],
                model: 'llama-3.1-8b-instant',
                temperature: 0.7,
                max_tokens: 300
            })
            aiRecommendations = completion.choices[0]?.message?.content
        } catch (e) {
            console.log('AI reasoning skipped')
        }

        return NextResponse.json({
            success: true,
            recommendations: careerMatches.slice(0, 5).map((career, idx) => ({
                rank: idx + 1,
                career: {
                    id: career.id,
                    title: career.title,
                    industry: career.industry,
                    description: career.description,
                    salaryRange: career.salaryRange,
                    demand: career.demand,
                    requiredSkills: career.requiredSkills
                },
                matchScore: career.matchScore,
                missingSkills: career.missingSkills,
                estimatedReadyTime: career.missingSkills.length <= 1 ? '1-2 bulan' :
                    career.missingSkills.length <= 3 ? '3-4 bulan' : '5-6 bulan'
            })),
            aiInsight: aiRecommendations || 'Berdasarkan profil dan skill kamu, kami merekomendasikan karir di atas yang paling sesuai dengan potensimu.'
        })

    } catch (error) {
        console.error('Career recommendation error:', error)

        return NextResponse.json({
            success: true,
            recommendations: CAREERS_DB.slice(0, 3).map((career, idx) => ({
                rank: idx + 1,
                career,
                matchScore: 70 - (idx * 5),
                missingSkills: career.requiredSkills.slice(0, 2),
                estimatedReadyTime: '3-4 bulan'
            })),
            aiInsight: 'Lengkapi profil dan skill untuk rekomendasi yang lebih akurat.'
        })
    }
}
