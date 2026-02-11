import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Sign out from current session
        const { error } = await supabase.auth.signOut({ scope: 'global' })

        if (error) {
            return NextResponse.json(
                { success: false, error: 'Failed to logout from all devices' },
                { status: 500 }
            )
        }

        // Log the action (silent fail)
        try {
            const supabaseAdmin = await createClient()
            await supabaseAdmin.from('admin_audit_logs').insert({
                action: 'logout_all_devices',
                user_id: user.id,
                details: { ip: request.headers.get('x-forwarded-for') || 'unknown' }
            })
        } catch { /* silent fail for logging */ }

        return NextResponse.json({
            success: true,
            message: 'Berhasil logout dari semua perangkat'
        })

    } catch (error) {
        console.error('Logout all devices error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to logout from all devices' },
            { status: 500 }
        )
    }
}
