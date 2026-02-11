import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { data: certificates, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', user.id)
            .order('issue_date', { ascending: false })

        if (error) throw error

        return NextResponse.json({ success: true, certificates })

    } catch (error) {
        console.error('Error fetching certificates:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch certificates' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, issuer, issue_date, expiry_date, credential_id, credential_url, image_url, skill_tags } = body

        // Validate required fields
        if (!title || !issuer || !issue_date) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        const { data: certificate, error } = await supabase
            .from('certificates')
            .insert({
                user_id: user.id,
                title,
                issuer,
                issue_date,
                expiry_date,
                credential_id,
                credential_url,
                image_url,
                skill_tags: skill_tags || [],
                is_verified: false // Default to false, can be verified later by AI or Admin
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, certificate })

    } catch (error) {
        console.error('Error creating certificate:', error)
        return NextResponse.json({ success: false, error: 'Failed to create certificate' }, { status: 500 })
    }
}
