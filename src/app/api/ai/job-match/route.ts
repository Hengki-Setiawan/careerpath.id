import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Interface to match the database schema
interface Job {
    id: string
    title: string
    company: string
    location: string
    job_type: string
    salary_min: number
    salary_max: number
    skills_required: string[]
    skills_preferred: string[]
    experience_years: number
    posted_date: string
    description: string
}

// Interface for the matching algorithm
interface MatchJob {
    id: string
    title: string
    company: string
    location: string
    type: string
    salaryMin: number
    salaryMax: number
    requiredSkills: string[]
    preferredSkills: string[]
    experienceYears: number
    postedDate: string
    description: string
}

interface MatchResult {
    job: MatchJob
    matchScore: number
    skillMatch: {
        matching: string[]
        missing: string[]
        bonus: string[]
    }
    readinessScore: number
    recommendation: string
}

function calculateJobMatch(
    userSkills: string[],
    userExperience: number,
    userLocation: string,
    job: MatchJob
): MatchResult {
    const normalizedUserSkills = userSkills.map(s => s.toLowerCase())
    const jobRequiredSkills = job.requiredSkills || []
    const jobPreferredSkills = job.preferredSkills || []

    // Calculate required skills match (60% weight)
    const matchingRequired = jobRequiredSkills.filter(
        rs => normalizedUserSkills.some(us => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us))
    )
    const missingRequired = jobRequiredSkills.filter(
        rs => !normalizedUserSkills.some(us => us.includes(rs.toLowerCase()) || rs.toLowerCase().includes(us))
    )

    // Avoid division by zero
    const requiredScore = jobRequiredSkills.length > 0
        ? (matchingRequired.length / jobRequiredSkills.length) * 60
        : 60

    // Calculate preferred skills match (20% weight)
    const matchingPreferred = jobPreferredSkills.filter(
        ps => normalizedUserSkills.some(us => us.includes(ps.toLowerCase()) || ps.toLowerCase().includes(us))
    )

    // Avoid division by zero
    const preferredScore = jobPreferredSkills.length > 0
        ? (matchingPreferred.length / jobPreferredSkills.length) * 20
        : 0

    // Experience match (10% weight)
    const expMatch = userExperience >= job.experienceYears ? 10 :
        userExperience >= job.experienceYears - 1 ? 5 : 0

    // Location preference (10% weight)
    const locationMatch = job.location === 'Remote' ? 10 :
        job.location.toLowerCase().includes(userLocation.toLowerCase()) || userLocation.toLowerCase().includes(job.location.toLowerCase()) ? 10 : 5

    const totalScore = Math.round(requiredScore + preferredScore + expMatch + locationMatch)

    // Calculate readiness
    const readiness = missingRequired.length === 0 ? 100 :
        missingRequired.length === 1 ? 85 :
            missingRequired.length === 2 ? 70 :
                Math.max(50, 100 - (missingRequired.length * 15))

    // Generate recommendation
    let recommendation = ''
    if (readiness >= 90) {
        recommendation = 'Sangat cocok! Langsung apply sekarang.'
    } else if (readiness >= 75) {
        recommendation = `Hampir siap! Fokus pelajari ${missingRequired[0]} untuk tingkatkan peluang.`
    } else if (readiness >= 60) {
        recommendation = `Butuh persiapan. Pelajari ${missingRequired.slice(0, 2).join(' dan ')} dulu.`
    } else {
        recommendation = 'Simpan untuk target masa depan. Fokus bangun skill dulu.'
    }

    return {
        job,
        matchScore: totalScore,
        skillMatch: {
            matching: matchingRequired,
            missing: missingRequired,
            bonus: matchingPreferred
        },
        readinessScore: readiness,
        recommendation
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userProfile, filters } = await request.json()
        const supabase = await createClient()

        const userSkills = userProfile?.skills || []
        const userExperience = userProfile?.experienceYears || 0
        // Default location to Makassar if not specified, matching our target audience
        const userLocation = userProfile?.location || 'Makassar'

        // Fetch jobs from Supabase
        let query = supabase
            .from('jobs')
            .select('*')
            .eq('is_active', true)

        // Apply filters to DB query where possible to reduce data
        if (filters?.type && filters.type !== 'Semua') {
            query = query.eq('job_type', filters.type)
        }

        if (filters?.minSalary) {
            query = query.gte('salary_max', filters.minSalary)
        }

        const { data: jobsData, error } = await query

        if (error) throw error

        // Map DB jobs to MatchJob interface
        const jobs: MatchJob[] = (jobsData || []).map((j: Job) => ({
            id: j.id,
            title: j.title,
            company: j.company,
            location: j.location || '',
            type: j.job_type || 'Full-time',
            salaryMin: j.salary_min || 0,
            salaryMax: j.salary_max || 0,
            requiredSkills: j.skills_required || [],
            preferredSkills: j.skills_preferred || [],
            experienceYears: j.experience_years || 0,
            postedDate: j.posted_date,
            description: j.description || ''
        }))

        // Filter by location in JS (since DB location might be vague "Jakarta" and user "Jakarta Selatan")
        // and handle "Remote" logic
        let filteredJobs = jobs
        if (filters?.location) {
            const filterLoc = filters.location.toLowerCase()
            filteredJobs = filteredJobs.filter(j =>
                j.location.toLowerCase().includes(filterLoc) ||
                j.location === 'Remote'
            )
        }

        // Calculate match for each job
        const matchedJobs = filteredJobs.map(job =>
            calculateJobMatch(userSkills, userExperience, userLocation, job)
        ).sort((a, b) => b.matchScore - a.matchScore)

        // Categorize jobs
        const quickWins = matchedJobs.filter(j => j.readinessScore >= 80 && j.matchScore >= 70)
        const goodMatches = matchedJobs.filter(j => j.readinessScore >= 60 && j.matchScore >= 60)
        const futureTargets = matchedJobs.filter(j => j.readinessScore < 60 && j.matchScore >= 50)

        return NextResponse.json({
            success: true,
            totalJobs: matchedJobs.length,
            summary: {
                quickWins: quickWins.length,
                goodMatches: goodMatches.length,
                futureTargets: futureTargets.length,
                avgMatchScore: matchedJobs.length > 0 ? Math.round(matchedJobs.reduce((s, j) => s + j.matchScore, 0) / matchedJobs.length) : 0
            },
            jobs: matchedJobs.map(m => ({
                ...m.job,
                matchScore: m.matchScore,
                readinessScore: m.readinessScore,
                skillMatch: m.skillMatch,
                recommendation: m.recommendation,
                salary: `Rp ${(m.job.salaryMin / 1000000).toFixed(0)}-${(m.job.salaryMax / 1000000).toFixed(0)} juta`
            })),
            insight: quickWins.length > 0
                ? `Ada ${quickWins.length} lowongan yang sangat cocok untukmu. Apply sekarang!`
                : goodMatches.length > 0
                    ? `${goodMatches.length} lowongan butuh sedikit persiapan. Fokus skill yang kurang.`
                    : 'Terus tingkatkan skill untuk unlock more opportunities!'
        })

    } catch (error) {
        console.error('Job matching error:', error)

        return NextResponse.json({
            success: false,
            error: 'Failed to match jobs',
            jobs: []
        }, { status: 500 })
    }
}
