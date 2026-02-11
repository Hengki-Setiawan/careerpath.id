// ============================================
// CareerPath.id Database Types
// Auto-generated types matching Supabase schema
// ============================================

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// Enum Types
export type SkillCategory = 'Hard Skill' | 'Soft Skill'
export type SkillImportance = 'Essential' | 'Important' | 'Nice to Have'
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
export type MoodType = 'Very Bad' | 'Bad' | 'Neutral' | 'Good' | 'Very Good'
export type JobType = 'Full-time' | 'Part-time' | 'Freelance' | 'Internship' | 'Remote'
export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Lead/Manager'
export type DemandLevel = 'Low' | 'Medium' | 'High' | 'Very High'

// ============================================
// Table Types
// ============================================

export interface User {
    id: string
    full_name: string | null
    university: string | null
    major: string | null
    semester: number | null
    avatar_url: string | null
    bio: string | null
    phone: string | null
    city: string | null
    total_xp: number
    current_level: number
    current_streak: number
    last_activity_at: string
    created_at: string
    updated_at: string
}

export interface Career {
    id: string
    title: string
    description: string | null
    salary_range_min: number | null
    salary_range_max: number | null
    industry: string | null
    job_type: JobType | null
    experience_level: ExperienceLevel | null
    demand_level: DemandLevel | null
    growth_outlook: string | null
    icon_name: string | null
    color: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Skill {
    id: string
    name: string
    category: SkillCategory
    description: string | null
    icon_name: string | null
    learning_resources: Json | null
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface CareerSkill {
    id: string
    career_id: string
    skill_id: string
    importance: SkillImportance
    created_at: string
}

export interface UserSkill {
    id: string
    user_id: string
    skill_id: string
    proficiency_level: ProficiencyLevel
    progress_percentage: number
    hours_practiced: number
    notes: string | null
    started_at: string
    last_practiced_at: string | null
    created_at: string
    updated_at: string
}

export interface MentalHealthLog {
    id: string
    user_id: string
    gad7_score: number | null
    mood: MoodType | null
    energy_level: number | null
    stress_level: number | null
    sleep_hours: number | null
    notes: string | null
    activities: string[] | null
    gratitude: string[] | null
    created_at: string
}

export interface UserCareer {
    id: string
    user_id: string
    career_id: string
    is_primary: boolean
    match_percentage: number
    notes: string | null
    created_at: string
    updated_at: string
}

// ============================================
// Insert Types (for creating new records)
// ============================================

export interface UserInsert {
    id: string
    full_name?: string | null
    university?: string | null
    major?: string | null
    semester?: number | null
    avatar_url?: string | null
    bio?: string | null
    phone?: string | null
    city?: string | null
}

export interface UserSkillInsert {
    user_id: string
    skill_id: string
    proficiency_level?: ProficiencyLevel
    progress_percentage?: number
    hours_practiced?: number
    notes?: string | null
}

export interface MentalHealthLogInsert {
    user_id: string
    gad7_score?: number | null
    mood?: MoodType | null
    energy_level?: number | null
    stress_level?: number | null
    sleep_hours?: number | null
    notes?: string | null
    activities?: string[] | null
    gratitude?: string[] | null
}

export interface UserCareerInsert {
    user_id: string
    career_id: string
    is_primary?: boolean
    notes?: string | null
}

// ============================================
// Update Types (for updating records)
// ============================================

export interface UserUpdate {
    full_name?: string | null
    university?: string | null
    major?: string | null
    semester?: number | null
    avatar_url?: string | null
    bio?: string | null
    phone?: string | null
    city?: string | null
}

export interface UserSkillUpdate {
    proficiency_level?: ProficiencyLevel
    progress_percentage?: number
    hours_practiced?: number
    notes?: string | null
    last_practiced_at?: string | null
}

// ============================================
// Extended Types (with relations)
// ============================================

export interface CareerWithSkills extends Career {
    career_skills: (CareerSkill & { skill: Skill })[]
}

export interface UserSkillWithDetails extends UserSkill {
    skill: Skill
}

export interface UserCareerWithDetails extends UserCareer {
    career: CareerWithSkills
}

export interface UserProfile extends User {
    user_skills: UserSkillWithDetails[]
    user_careers: UserCareerWithDetails[]
}

// ============================================
// GAD-7 Score Interpretation
// ============================================

export type AnxietySeverity = 'Minimal' | 'Mild' | 'Moderate' | 'Severe'

export function interpretGAD7Score(score: number): AnxietySeverity {
    if (score <= 4) return 'Minimal'
    if (score <= 9) return 'Mild'
    if (score <= 14) return 'Moderate'
    return 'Severe'
}

export function getGAD7Recommendation(severity: AnxietySeverity): string {
    switch (severity) {
        case 'Minimal':
            return 'Kondisi baik! Terus jaga kesehatan mentalmu dengan aktivitas positif.'
        case 'Mild':
            return 'Ada sedikit gejala kecemasan. Coba teknik relaksasi dan mindfulness.'
        case 'Moderate':
            return 'Pertimbangkan untuk berbicara dengan konselor atau psikolog.'
        case 'Severe':
            return 'Sangat disarankan untuk berkonsultasi dengan profesional kesehatan mental.'
    }
}

// ============================================
// Database Schema Type (for Supabase client)
// ============================================

export interface Database {
    public: {
        Tables: {
            users: {
                Row: User
                Insert: UserInsert
                Update: UserUpdate
            }
            careers: {
                Row: Career
                Insert: Omit<Career, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Career, 'id' | 'created_at' | 'updated_at'>>
            }
            skills: {
                Row: Skill
                Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>
            }
            career_skills: {
                Row: CareerSkill
                Insert: Omit<CareerSkill, 'id' | 'created_at'>
                Update: Partial<Omit<CareerSkill, 'id' | 'created_at'>>
            }
            user_skills: {
                Row: UserSkill
                Insert: UserSkillInsert
                Update: UserSkillUpdate
            }
            mental_health_logs: {
                Row: MentalHealthLog
                Insert: MentalHealthLogInsert
                Update: Partial<MentalHealthLogInsert>
            }
            user_careers: {
                Row: UserCareer
                Insert: UserCareerInsert
                Update: Partial<UserCareerInsert>
            }
        }
        Functions: {
            calculate_career_match: {
                Args: { p_user_id: string; p_career_id: string }
                Returns: number
            }
        }
    }
}
