import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkAdminAccess, logAdminAction } from '../route'

// GET - List all skills
export async function GET(request: Request) {
    const { authorized, error } = await checkAdminAccess()

    if (!authorized) {
        return NextResponse.json({ error }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    const supabase = await createClient()

    let query = supabase
        .from('skills')
        .select('*')
        .order('name', { ascending: true })

    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

    if (category && category !== 'all') {
        query = query.eq('category', category)
    }

    const { data: skills, error: queryError } = await query

    if (queryError) {
        return NextResponse.json({ error: queryError.message }, { status: 500 })
    }

    return NextResponse.json({ skills })
}

// POST - Create new skill
export async function POST(request: Request) {
    const { authorized, error, user: admin } = await checkAdminAccess()

    if (!authorized || !admin) {
        return NextResponse.json({ error }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createClient()

    const { data, error: insertError } = await supabase
        .from('skills')
        .insert(body)
        .select()
        .single()

    if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    await logAdminAction(admin.id, 'CREATE_SKILL', 'skill', data.id, body, request)

    return NextResponse.json({ success: true, data })
}

// PATCH - Update skill
export async function PATCH(request: Request) {
    const { authorized, error, user: admin } = await checkAdminAccess()

    if (!authorized || !admin) {
        return NextResponse.json({ error }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error: updateError } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    await logAdminAction(admin.id, 'UPDATE_SKILL', 'skill', id, updates, request)

    return NextResponse.json({ success: true, data })
}

// DELETE - Delete skill
export async function DELETE(request: Request) {
    const { authorized, error, user: admin } = await checkAdminAccess()

    if (!authorized || !admin) {
        return NextResponse.json({ error }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error: deleteError } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

    if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    await logAdminAction(admin.id, 'DELETE_SKILL', 'skill', id, {}, request)

    return NextResponse.json({ success: true })
}
