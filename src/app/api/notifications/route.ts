import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20)

        if (error) throw error

        // Count unread
        const unreadCount = notifications.filter(n => !n.is_read).length

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount
        })

    } catch (error) {
        console.error('Error fetching notifications:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        // Check if admin or system key used (for now just check auth user)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { userId, title, message, type, link } = body

        if (!userId || !title || !message) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                title,
                message,
                type: type || 'info',
                link,
                is_read: false
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, notification: data })

    } catch (error) {
        console.error('Error creating notification:', error)
        return NextResponse.json({ success: false, error: 'Failed to create notification' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { id, markAllRead } = body

        if (markAllRead) {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false)

            if (error) throw error
            return NextResponse.json({ success: true, message: 'All marked as read' })
        }

        if (id) {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id)
                .eq('user_id', user.id)

            if (error) throw error
            return NextResponse.json({ success: true, message: 'Marked as read' })
        }

        return NextResponse.json({ success: false, error: 'Missing id or markAllRead' }, { status: 400 })

    } catch (error) {
        console.error('Error updating notification:', error)
        return NextResponse.json({ success: false, error: 'Failed to update notification' }, { status: 500 })
    }
}
