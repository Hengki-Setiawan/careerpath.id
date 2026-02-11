import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// LinkedIn OAuth flow
// Register app: https://www.linkedin.com/developers/apps
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || ''
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || ''
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'https://careerpath.id'}/api/integrations/linkedin/callback`

// GET - Redirect to LinkedIn OAuth
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'connect') {
        // Step 1: Redirect user to LinkedIn authorization
        const scope = encodeURIComponent('openid profile email')
        const state = Math.random().toString(36).substring(7)
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=${scope}`

        return NextResponse.redirect(authUrl)
    }

    // Default: return LinkedIn integration status
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('linkedin_url, linkedin_connected')
        .eq('id', user.id)
        .single()

    return NextResponse.json({
        success: true,
        linkedin: {
            connected: profile?.linkedin_connected || false,
            url: profile?.linkedin_url || null,
            client_id_configured: !!LINKEDIN_CLIENT_ID
        }
    })
}

// POST - Save LinkedIn profile URL manually or disconnect
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { action, linkedinUrl } = await request.json()

        if (action === 'disconnect') {
            await supabase
                .from('profiles')
                .update({
                    linkedin_url: null,
                    linkedin_connected: false,
                    linkedin_data: null
                })
                .eq('id', user.id)

            return NextResponse.json({ success: true, message: 'LinkedIn disconnected' })
        }

        // Manual connect via URL
        if (linkedinUrl) {
            const urlPattern = /linkedin\.com\/in\//i
            if (!urlPattern.test(linkedinUrl)) {
                return NextResponse.json({ success: false, error: 'Invalid LinkedIn URL' }, { status: 400 })
            }

            await supabase
                .from('profiles')
                .update({
                    linkedin_url: linkedinUrl,
                    linkedin_connected: true
                })
                .eq('id', user.id)

            return NextResponse.json({ success: true, message: 'LinkedIn connected' })
        }

        return NextResponse.json({ success: false, error: 'No action specified' }, { status: 400 })
    } catch (error) {
        console.error('LinkedIn integration error:', error)
        return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 })
    }
}
