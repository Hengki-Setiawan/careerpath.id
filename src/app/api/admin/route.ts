import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Check if current user is admin
export async function checkAdminAccess() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { authorized: false, error: 'Unauthorized', user: null }
    }

    const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, full_name, role')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return { authorized: false, error: 'User not found', user: null }
    }

    if (profile.role !== 'admin' && profile.role !== 'super_admin') {
        return { authorized: false, error: 'Forbidden - Admin access required', user: null }
    }

    return { authorized: true, error: null, user: { ...profile, email: user.email } }
}

// Log admin action
export async function logAdminAction(
    adminId: string,
    action: string,
    targetType: string,
    targetId?: string,
    details?: Record<string, unknown>,
    request?: Request
) {
    const supabase = await createClient()

    await supabase.from('admin_audit_logs').insert({
        admin_id: adminId,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        ip_address: request?.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request?.headers.get('user-agent') || 'unknown',
    })
}

// GET - Dashboard stats
export async function GET() {
    const { authorized, error, user } = await checkAdminAccess()

    if (!authorized) {
        return NextResponse.json({ error }, { status: 401 })
    }

    const supabase = await createClient()

    // Get various stats
    const [
        usersResult,
        careersResult,
        skillsResult,
        logsResult,
        messagesResult,
        postsResult,
    ] = await Promise.all([
        supabase.from('users').select('id, created_at, role', { count: 'exact' }),
        supabase.from('careers').select('id', { count: 'exact' }),
        supabase.from('skills').select('id', { count: 'exact' }),
        supabase.from('mental_health_logs').select('id', { count: 'exact' }),
        supabase.from('contact_messages').select('id, status', { count: 'exact' }).eq('status', 'new'),
        supabase.from('blog_posts').select('id', { count: 'exact' }),
    ])

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: newUsersCount } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .gte('created_at', sevenDaysAgo.toISOString())

    // Get user role breakdown
    const adminCount = usersResult.data?.filter(u => u.role === 'admin' || u.role === 'super_admin').length || 0
    const regularCount = usersResult.data?.filter(u => u.role === 'user' || !u.role).length || 0

    return NextResponse.json({
        stats: {
            totalUsers: usersResult.count || 0,
            newUsersThisWeek: newUsersCount || 0,
            adminUsers: adminCount,
            regularUsers: regularCount,
            totalCareers: careersResult.count || 0,
            totalSkills: skillsResult.count || 0,
            totalMentalHealthLogs: logsResult.count || 0,
            unreadMessages: messagesResult.count || 0,
            totalBlogPosts: postsResult.count || 0,
        },
        admin: user,
    })
}
