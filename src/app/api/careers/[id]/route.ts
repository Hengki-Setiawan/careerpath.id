import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface SkillData {
    id: string
    name: string
    category: string
    description: string | null
    icon_name: string | null
}

interface CareerSkillRow {
    id: string
    importance: string
    skill: SkillData | null
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        // Get career details
        const { data: career, error: careerError } = await supabase
            .from('careers')
            .select('*')
            .eq('id', id)
            .single()

        if (careerError) {
            return NextResponse.json({ error: careerError.message }, { status: 404 })
        }

        // Get required skills for this career with skill details
        const { data: careerSkills, error: skillsError } = await supabase
            .from('career_skills')
            .select(`
        id,
        importance,
        skill:skills (
          id,
          name,
          category,
          description,
          icon_name
        )
      `)
            .eq('career_id', id)

        if (skillsError) {
            return NextResponse.json({ error: skillsError.message }, { status: 500 })
        }

        // Transform data to flatten skill info
        const requiredSkills = (careerSkills as unknown as CareerSkillRow[])?.map((cs) => ({
            id: cs.skill?.id,
            name: cs.skill?.name,
            category: cs.skill?.category,
            description: cs.skill?.description,
            icon_name: cs.skill?.icon_name,
            importance: cs.importance,
        })) || []

        return NextResponse.json({
            career,
            requiredSkills,
            totalSkills: requiredSkills.length
        })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
