import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createTransaction } from '@/lib/midtrans'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { plan, consultationId } = await request.json()

        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()

        // Define pricing
        const PLANS: Record<string, { name: string; price: number; id: string }> = {
            consultation: {
                name: 'Konsultasi Karir/Psikolog (60 min)',
                price: 99000,
                id: 'CONSULT-60'
            },
            premium_monthly: {
                name: 'CareerPath Premium - Bulanan',
                price: 49000,
                id: 'PREMIUM-M'
            },
            premium_yearly: {
                name: 'CareerPath Premium - Tahunan',
                price: 399000,
                id: 'PREMIUM-Y'
            },
            mentor_session: {
                name: 'Sesi Mentoring Industri (60 min)',
                price: 149000,
                id: 'MENTOR-60'
            }
        }

        const selectedPlan = PLANS[plan]
        if (!selectedPlan) {
            return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 })
        }

        const orderId = `CP-${plan.toUpperCase()}-${user.id.slice(0, 8)}-${Date.now()}`

        const transaction = await createTransaction({
            orderId,
            grossAmount: selectedPlan.price,
            customerName: profile?.full_name || 'User',
            customerEmail: user.email || '',
            itemName: selectedPlan.name,
            itemId: selectedPlan.id,
            itemPrice: selectedPlan.price,
            itemQuantity: 1
        })

        // Store in DB (table may not exist yet)
        try {
            await supabase.from('payments').insert({
                user_id: user.id,
                order_id: orderId,
                plan_type: plan,
                amount: selectedPlan.price,
                status: 'pending',
                snap_token: transaction.token,
                consultation_id: consultationId || null,
                created_at: new Date().toISOString()
            })
        } catch {
            // Table might not exist yet, payment still works
        }

        return NextResponse.json({
            success: true,
            token: transaction.token,
            redirect_url: transaction.redirect_url,
            order_id: orderId,
            plan: selectedPlan
        })
    } catch (error) {
        console.error('Payment create error:', error)
        return NextResponse.json({ success: false, error: 'Failed to create payment' }, { status: 500 })
    }
}
