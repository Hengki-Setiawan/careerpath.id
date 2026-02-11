import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkAdminAccess, logAdminAction } from '../route'

// GET - List all careers
export async function GET(request: Request) {
    const { authorized, error } = await checkAdminAccess()

    if (!authorized) {
        return NextResponse.json({ error }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const supabase = await createClient()

    let query = supabase
        .from('careers')
        .select('*')
        .order('title', { ascending: true })

    if (search) {
        query = query.or(`title.ilike.%${search}%,industry.ilike.%${search}%`)
    }

    const { data: careers, error: queryError } = await query

    if (queryError) {
        return NextResponse.json({ error: queryError.message }, { status: 500 })
    }

    return NextResponse.json({ careers })
}

// POST - Create new career
export async function POST(request: Request) {
    const { authorized, error, user: admin } = await checkAdminAccess()

    if (!authorized || !admin) {
        return NextResponse.json({ error }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createClient()

    const { data, error: insertError } = await supabase
        .from('careers')
        .insert(body)
        .select()
        .single()

    if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    await logAdminAction(admin.id, 'CREATE_CAREER', 'career', data.id, body, request)

    return NextResponse.json({ success: true, data })
}

// PATCH - Update career
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
        .from('careers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    await logAdminAction(admin.id, 'UPDATE_CAREER', 'career', id, updates, request)

    return NextResponse.json({ success: true, data })
}

// DELETE - Delete career
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
        .from('careers')
        .delete()
        .eq('id', id)

    if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    await logAdminAction(admin.id, 'DELETE_CAREER', 'career', id, {}, request)

    return NextResponse.json({ success: true })
}
