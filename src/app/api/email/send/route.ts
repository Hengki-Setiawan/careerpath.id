import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Email templates
const templates = {
    welcome: (name: string) => ({
        subject: `Selamat Datang di CareerPath.id, ${name}! 🚀`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Selamat Datang!</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 16px 16px;">
                    <p style="font-size: 16px; color: #374151;">Hai <strong>${name}</strong>,</p>
                    <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                        Terima kasih sudah bergabung di CareerPath.id! Platform AI-powered career guidance 
                        yang akan membantumu menemukan karir impianmu.
                    </p>
                    <div style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Langkah Selanjutnya:</h3>
                        <ol style="color: #6b7280; font-size: 14px; line-height: 1.8;">
                            <li>Lengkapi profil dan onboarding</li>
                            <li>Dapatkan rekomendasi karir dari AI</li>
                            <li>Mulai belajar dan track skill-mu</li>
                        </ol>
                    </div>
                    <a href="https://careerpath.id/dashboard" 
                        style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; 
                        border-radius: 8px; text-decoration: none; font-weight: bold;">
                        Mulai Sekarang →
                    </a>
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
                        © 2026 CareerPath.id | Unsubscribe
                    </p>
                </div>
            </div>
        `
    }),

    notification_digest: (name: string, notifications: string[]) => ({
        subject: `📬 ${notifications.length} Notifikasi Baru - CareerPath.id`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; border-radius: 16px 16px 0 0;">
                    <h2 style="color: white; margin: 0;">📬 Ringkasan Notifikasi</h2>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 16px 16px;">
                    <p style="color: #374151;">Hai <strong>${name}</strong>, berikut notifikasi terbaru:</p>
                    <div style="background: white; padding: 16px; border-radius: 12px;">
                        ${notifications.map(n => `
                            <div style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                                <p style="color: #374151; margin: 0; font-size: 14px;">• ${n}</p>
                            </div>
                        `).join('')}
                    </div>
                    <a href="https://careerpath.id/dashboard" 
                        style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; 
                        border-radius: 8px; text-decoration: none; margin-top: 16px; font-size: 14px;">
                        Lihat Dashboard
                    </a>
                </div>
            </div>
        `
    }),

    monthly_report: (name: string, stats: { skills: number; courses: number; score: number }) => ({
        subject: `📊 Laporan Bulanan - CareerPath.id`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; border-radius: 16px 16px 0 0;">
                    <h2 style="color: white; margin: 0;">📊 Laporan Bulanan</h2>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 16px 16px;">
                    <p style="color: #374151;">Hai <strong>${name}</strong>, ini ringkasan progressmu bulan ini:</p>
                    <div style="display: flex; gap: 12px; margin: 20px 0;">
                        <div style="flex: 1; background: white; padding: 16px; border-radius: 12px; text-align: center;">
                            <p style="font-size: 28px; font-weight: bold; color: #6366f1; margin: 0;">${stats.skills}</p>
                            <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0;">Skills Updated</p>
                        </div>
                        <div style="flex: 1; background: white; padding: 16px; border-radius: 12px; text-align: center;">
                            <p style="font-size: 28px; font-weight: bold; color: #10b981; margin: 0;">${stats.courses}</p>
                            <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0;">Courses Done</p>
                        </div>
                        <div style="flex: 1; background: white; padding: 16px; border-radius: 12px; text-align: center;">
                            <p style="font-size: 28px; font-weight: bold; color: #f59e0b; margin: 0;">${stats.score}%</p>
                            <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0;">Career Match</p>
                        </div>
                    </div>
                    <a href="https://careerpath.id/dashboard/evaluation" 
                        style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; 
                        border-radius: 8px; text-decoration: none; font-size: 14px;">
                        Lihat Detail Evaluasi
                    </a>
                </div>
            </div>
        `
    })
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { type, recipientEmail, recipientName, data } = await request.json()

        if (!type || !templates[type as keyof typeof templates]) {
            return NextResponse.json({
                success: false,
                error: 'Invalid email type. Valid types: welcome, notification_digest, monthly_report'
            }, { status: 400 })
        }

        // Generate the email content based on type
        let emailContent
        switch (type) {
            case 'welcome':
                emailContent = templates.welcome(recipientName || 'User')
                break
            case 'notification_digest':
                emailContent = templates.notification_digest(recipientName || 'User', data?.notifications || [])
                break
            case 'monthly_report':
                emailContent = templates.monthly_report(recipientName || 'User', data?.stats || { skills: 0, courses: 0, score: 0 })
                break
            default:
                return NextResponse.json({ success: false, error: 'Unknown template' }, { status: 400 })
        }

        // In production, integrate with email service (Resend, SendGrid, etc.)
        // For now, return the generated template
        return NextResponse.json({
            success: true,
            message: 'Email template generated successfully',
            email: {
                to: recipientEmail || user.email,
                subject: emailContent.subject,
                html: emailContent.html
            },
            note: 'Email service integration pending. Template is ready for Resend/SendGrid.'
        })

    } catch (error) {
        console.error('Email error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate email' },
            { status: 500 }
        )
    }
}
