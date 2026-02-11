import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkAdminAccess, logAdminAction } from '../route'

// GET - List all users with pagination and search
export async function GET(request: Request) {
    const { authorized, error, user } = await checkAdminAccess()

    if (!authorized) {
        return NextResponse.json({ error }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''

    const offset = (page - 1) * limit
    const supabase = await createClient()

    let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,university.ilike.%${search}%,major.ilike.%${search}%`)
    }

    if (role && role !== 'all') {
        query = query.eq('role', role)
    }

    const { data: users, error: queryError, count } = await query

    if (queryError) {
        return NextResponse.json({ error: queryError.message }, { status: 500 })
    }

    // Get auth emails for users
    // Note: In production, you'd use Supabase Admin API for this

    return NextResponse.json({
        users,
        pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
        },
    })
}

// PATCH - Update user (role, profile, etc.)
export async function PATCH(request: Request) {
    const { authorized, error, user: admin } = await checkAdminAccess()

    if (!authorized || !admin) {
        return NextResponse.json({ error }, { status: 401 })
    }

    const body = await request.json()
    const { userId, updates } = body

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if trying to update role (only super_admin can do this)
    if (updates.role) {
        const { data: adminProfile } = await supabase
            .from('users')
            .select('role')
            .eq('id', admin.id)
            .single()

        if (adminProfile?.role !== 'super_admin') {
            return NextResponse.json({ error: 'Only super_admin can change roles' }, { status: 403 })
        }
    }

    const { data, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Log action
    await logAdminAction(admin.id, 'UPDATE_USER', 'user', userId, updates, request)

    return NextResponse.json({ success: true, data })
}

// DELETE - Delete user
export async function DELETE(request: Request) {
    const { authorized, error, user: admin } = await checkAdminAccess()

    if (!authorized || !admin) {
        return NextResponse.json({ error }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Prevent deleting self
    if (userId === admin.id) {
        return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check target user role
    const { data: targetUser } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

    // Only super_admin can delete admins
    if (targetUser?.role === 'admin' || targetUser?.role === 'super_admin') {
        const { data: adminProfile } = await supabase
            .from('users')
            .select('role')
            .eq('id', admin.id)
            .single()

        if (adminProfile?.role !== 'super_admin') {
            return NextResponse.json({ error: 'Only super_admin can delete admin users' }, { status: 403 })
        }
    }

    const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

    if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Log action
    await logAdminAction(admin.id, 'DELETE_USER', 'user', userId, {}, request)

    return NextResponse.json({ success: true })
}
