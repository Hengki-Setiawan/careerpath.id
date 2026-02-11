import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// MFA enrollment and verification for admin users
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
            return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
        }

        const { action, factorId, code } = await request.json()

        if (action === 'enroll') {
            // Start MFA enrollment with TOTP
            const { data, error } = await supabase.auth.mfa.enroll({
                factorType: 'totp',
                friendlyName: 'CareerPath Admin TOTP'
            })

            if (error) {
                return NextResponse.json({ success: false, error: error.message }, { status: 400 })
            }

            return NextResponse.json({
                success: true,
                factor_id: data.id,
                qr_code: data.totp.qr_code,
                secret: data.totp.secret,
                uri: data.totp.uri,
                message: 'Scan QR code dengan Google Authenticator atau app sejenis'
            })
        }

        if (action === 'verify') {
            if (!factorId || !code) {
                return NextResponse.json({ success: false, error: 'Factor ID and code required' }, { status: 400 })
            }

            // Create challenge
            const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
                factorId
            })

            if (challengeError) {
                return NextResponse.json({ success: false, error: challengeError.message }, { status: 400 })
            }

            // Verify the code
            const { error: verifyError } = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challenge.id,
                code
            })

            if (verifyError) {
                return NextResponse.json({ success: false, error: 'Invalid code. Coba lagi.' }, { status: 400 })
            }

            return NextResponse.json({ success: true, message: 'MFA enabled successfully!' })
        }

        if (action === 'unenroll') {
            if (!factorId) {
                return NextResponse.json({ success: false, error: 'Factor ID required' }, { status: 400 })
            }

            const { error } = await supabase.auth.mfa.unenroll({ factorId })
            if (error) {
                return NextResponse.json({ success: false, error: error.message }, { status: 400 })
            }

            return NextResponse.json({ success: true, message: 'MFA disabled' })
        }

        if (action === 'list') {
            const { data, error } = await supabase.auth.mfa.listFactors()
            if (error) {
                return NextResponse.json({ success: false, error: error.message }, { status: 400 })
            }

            return NextResponse.json({
                success: true,
                factors: data.totp || [],
                mfa_enabled: (data.totp?.length || 0) > 0
            })
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
    } catch (error) {
        console.error('MFA error:', error)
        return NextResponse.json({ success: false, error: 'MFA operation failed' }, { status: 500 })
    }
}
