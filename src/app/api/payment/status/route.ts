import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTransactionStatus } from '@/lib/midtrans'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const orderId = searchParams.get('order_id')

        if (orderId) {
            // Check specific order
            const status = await getTransactionStatus(orderId)
            return NextResponse.json({ success: true, status })
        }

        // Get user payment history
        const { data: payments } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20)

        // Get premium status
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_premium, premium_expires_at')
            .eq('id', user.id)
            .single()

        return NextResponse.json({
            success: true,
            payments: payments || [],
            premium: {
                is_active: profile?.is_premium || false,
                expires_at: profile?.premium_expires_at || null
            }
        })
    } catch (error) {
        console.error('Payment status error:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch status' }, { status: 500 })
    }
}
