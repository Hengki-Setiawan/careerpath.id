import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface SkillData {
    id: string
    name: string
    category: string
    description: string | null
    icon_name: string | null
}

interface UserSkillRow {
    id: string
    proficiency_level: string
    progress_percentage: number
    hours_practiced: number
    notes: string | null
    started_at: string
    last_practiced_at: string | null
    skill: SkillData | null
}

// GET - Fetch user's skills
export async function GET() {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user's skills with skill details
        const { data: userSkills, error } = await supabase
            .from('user_skills')
            .select(`
        id,
        proficiency_level,
        progress_percentage,
        hours_practiced,
        notes,
        started_at,
        last_practiced_at,
        skill:skills (
          id,
          name,
          category,
          description,
          icon_name
        )
      `)
            .eq('user_id', user.id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Transform data
        const skills = (userSkills as unknown as UserSkillRow[])?.map((us) => ({
            userSkillId: us.id,
            skillId: us.skill?.id,
            name: us.skill?.name,
            category: us.skill?.category,
            description: us.skill?.description,
            icon_name: us.skill?.icon_name,
            proficiency_level: us.proficiency_level,
            progress_percentage: us.progress_percentage,
            hours_practiced: us.hours_practiced,
            notes: us.notes,
            started_at: us.started_at,
            last_practiced_at: us.last_practiced_at,
        })) || []

        return NextResponse.json({
            skills,
            totalSkills: skills.length
        })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

// POST - Add a new skill to user
export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { skill_id, proficiency_level = 'Beginner', progress_percentage = 0 } = body

        if (!skill_id) {
            return NextResponse.json({ error: 'skill_id is required' }, { status: 400 })
        }

        // Insert new user skill
        const { data, error } = await supabase
            .from('user_skills')
            .insert({
                user_id: user.id,
                skill_id,
                proficiency_level,
                progress_percentage,
                started_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'Skill sudah ditambahkan sebelumnya' }, { status: 409 })
            }
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

// DELETE - Remove a skill from user
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const skillId = searchParams.get('skill_id')

        if (!skillId) {
            return NextResponse.json({ error: 'skill_id is required' }, { status: 400 })
        }

        const { error } = await supabase
            .from('user_skills')
            .delete()
            .eq('user_id', user.id)
            .eq('skill_id', skillId)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
