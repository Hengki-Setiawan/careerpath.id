import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { currentPassword, newPassword } = await request.json()

        if (!currentPassword || !newPassword) {
            return NextResponse.json({
                success: false,
                error: 'Current password and new password are required'
            }, { status: 400 })
        }

        if (newPassword.length < 8) {
            return NextResponse.json({
                success: false,
                error: 'New password must be at least 8 characters'
            }, { status: 400 })
        }

        // Verify current password by re-authenticating
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: currentPassword
        })

        if (signInError) {
            return NextResponse.json({
                success: false,
                error: 'Password saat ini tidak benar'
            }, { status: 400 })
        }

        // Update to new password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (updateError) {
            return NextResponse.json({
                success: false,
                error: 'Gagal mengubah password: ' + updateError.message
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: 'Password berhasil diubah'
        })

    } catch (error) {
        console.error('Error changing password:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to change password' },
            { status: 500 }
        )
    }
}
