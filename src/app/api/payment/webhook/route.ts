import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for webhook (no user auth context)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const {
            order_id,
            transaction_status,
            fraud_status,
            gross_amount,
            status_code,
            signature_key,
            payment_type
        } = body

        // Verify signature
        const crypto = require('crypto')
        const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
        const expectedSignature = crypto.createHash('sha512')
            .update(order_id + status_code + gross_amount + serverKey)
            .digest('hex')

        if (signature_key !== expectedSignature) {
            console.error('Invalid Midtrans signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
        }

        // Map Midtrans status to our status
        let paymentStatus = 'pending'
        if (transaction_status === 'capture' || transaction_status === 'settlement') {
            paymentStatus = fraud_status === 'accept' || !fraud_status ? 'paid' : 'challenge'
        } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
            paymentStatus = 'failed'
        } else if (transaction_status === 'pending') {
            paymentStatus = 'pending'
        } else if (transaction_status === 'refund' || transaction_status === 'partial_refund') {
            paymentStatus = 'refunded'
        }

        // Update payment record
        const { data: payment } = await supabase
            .from('payments')
            .update({
                status: paymentStatus,
                payment_type: payment_type || null,
                midtrans_response: body,
                updated_at: new Date().toISOString()
            })
            .eq('order_id', order_id)
            .select('user_id, plan_type, consultation_id')
            .single()

        // If payment successful, activate feature
        if (paymentStatus === 'paid' && payment) {
            if (payment.plan_type === 'premium_monthly' || payment.plan_type === 'premium_yearly') {
                const durationDays = payment.plan_type === 'premium_yearly' ? 365 : 30
                const expiresAt = new Date()
                expiresAt.setDate(expiresAt.getDate() + durationDays)

                await supabase
                    .from('profiles')
                    .update({
                        is_premium: true,
                        premium_expires_at: expiresAt.toISOString()
                    })
                    .eq('id', payment.user_id)

                // Create notification
                try {
                    await supabase.from('notifications').insert({
                        user_id: payment.user_id,
                        type: 'success',
                        title: '🎉 Premium Aktif!',
                        message: `Selamat! Akun Premium kamu telah aktif hingga ${expiresAt.toLocaleDateString('id-ID')}.`,
                        created_at: new Date().toISOString()
                    })
                } catch { /* ignore */ }
            }

            if (payment.plan_type === 'consultation' && payment.consultation_id) {
                try {
                    await supabase
                        .from('consultation_bookings')
                        .update({ payment_status: 'paid' })
                        .eq('id', payment.consultation_id)
                } catch { /* ignore */ }

                try {
                    await supabase.from('notifications').insert({
                        user_id: payment.user_id,
                        type: 'success',
                        title: '✅ Pembayaran Konsultasi Berhasil',
                        message: 'Konsultasi kamu telah dikonfirmasi. Cek jadwal di menu Konsultasi.',
                        created_at: new Date().toISOString()
                    })
                } catch { /* ignore */ }
            }
        }

        return NextResponse.json({ success: true, status: paymentStatus })
    } catch (error) {
        console.error('Payment webhook error:', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
