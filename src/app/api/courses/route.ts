import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data: courses, error } = await supabase
            .from('courses')
            .select(`
        *,
        skill:skills(id, name, category)
      `)
            .eq('is_active', true)
            .order('is_featured', { ascending: false })
            .order('rating', { ascending: false })

        if (error) {
            console.error('Error fetching courses:', error)
            return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
        }

        return NextResponse.json({ courses })
    } catch (error) {
        console.error('Courses API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
