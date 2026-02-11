import { z } from 'zod'

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter')
})

export const registerSchema = z.object({
    full_name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string()
        .min(8, 'Password minimal 8 karakter')
        .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
        .regex(/[0-9]/, 'Password harus mengandung angka'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword']
})

// ============================================
// PROFILE SCHEMAS
// ============================================

export const profileUpdateSchema = z.object({
    full_name: z.string().min(2).max(100).optional(),
    bio: z.string().max(500, 'Bio maksimal 500 karakter').optional(),
    city: z.string().max(100).optional(),
    university: z.string().max(200).optional(),
    major: z.string().max(200).optional(),
    phone: z.string().regex(/^(\+62|62|0)[0-9]{8,13}$/, 'Nomor telepon tidak valid').optional().or(z.literal('')),
    linkedin_url: z.string().url('URL LinkedIn tidak valid').optional().or(z.literal('')),
    website_url: z.string().url('URL tidak valid').optional().or(z.literal(''))
})

// ============================================
// CONTACT FORM SCHEMA
// ============================================

export const contactFormSchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
    email: z.string().email('Email tidak valid'),
    subject: z.string().min(3, 'Subjek minimal 3 karakter').max(200),
    message: z.string().min(10, 'Pesan minimal 10 karakter').max(2000, 'Pesan maksimal 2000 karakter')
})

// ============================================
// CAREER & SKILL SCHEMAS
// ============================================

export const skillUpdateSchema = z.object({
    skill_id: z.string().uuid('ID skill tidak valid'),
    proficiency_level: z.number().min(1).max(5),
    progress_percentage: z.number().min(0).max(100).optional()
})

export const careerTargetSchema = z.object({
    career_id: z.string().uuid('ID karir tidak valid'),
    is_primary: z.boolean().optional()
})

// ============================================
// MOOD & JOURNAL SCHEMAS
// ============================================

export const moodEntrySchema = z.object({
    mood_level: z.number().min(1, 'Mood minimal 1').max(5, 'Mood maksimal 5'),
    energy_level: z.number().min(1).max(5).optional(),
    stress_level: z.number().min(1).max(5).optional(),
    notes: z.string().max(1000, 'Catatan maksimal 1000 karakter').optional()
})

export const journalEntrySchema = z.object({
    title: z.string().min(1, 'Judul wajib diisi').max(200),
    content: z.string().min(10, 'Konten minimal 10 karakter').max(5000),
    mood_tag: z.enum(['happy', 'sad', 'anxious', 'motivated', 'tired', 'neutral']).optional()
})

// ============================================
// JOB APPLICATION SCHEMA
// ============================================

export const jobApplicationSchema = z.object({
    job_id: z.string().uuid('ID lowongan tidak valid'),
    cover_letter: z.string().max(3000, 'Cover letter maksimal 3000 karakter').optional(),
    resume_url: z.string().url('URL resume tidak valid').optional()
})

// ============================================
// ADMIN SCHEMAS
// ============================================

export const adminCourseSchema = z.object({
    title: z.string().min(3).max(200),
    description: z.string().max(2000).optional(),
    provider: z.string().max(100),
    url: z.string().url('URL tidak valid').optional(),
    duration_hours: z.number().min(0).max(1000).optional(),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
    skills_taught: z.array(z.string()).optional(),
    is_free: z.boolean().optional()
})

export const adminCareerSchema = z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(2000).optional(),
    industry: z.string().max(100),
    salary_min: z.number().min(0).optional(),
    salary_max: z.number().min(0).optional(),
    demand_level: z.enum(['low', 'medium', 'high', 'very_high']).optional()
})

export const adminSkillSchema = z.object({
    name: z.string().min(2).max(100),
    category: z.string().max(100).optional(),
    description: z.string().max(500).optional()
})

// ============================================
// BULK UPLOAD SCHEMA
// ============================================

export const bulkUploadRowSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    category: z.string().optional()
}).passthrough() // Allow extra fields

// ============================================
// HELPER: Validate and return errors
// ============================================

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean
    data?: T
    errors?: string[]
} {
    const result = schema.safeParse(data)
    if (result.success) {
        return { success: true, data: result.data }
    }
    return {
        success: false,
        errors: result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`)
    }
}

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type SkillUpdateInput = z.infer<typeof skillUpdateSchema>
export type MoodEntryInput = z.infer<typeof moodEntrySchema>
export type JournalEntryInput = z.infer<typeof journalEntrySchema>
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>
