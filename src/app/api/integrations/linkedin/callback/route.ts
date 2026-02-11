import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || ''
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || ''
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || 'https://careerpath.id'}/api/integrations/linkedin/callback`

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
            return NextResponse.redirect(new URL('/dashboard/settings?linkedin=error', request.url))
        }

        if (!code) {
            return NextResponse.redirect(new URL('/dashboard/settings?linkedin=no-code', request.url))
        }

        // Exchange code for access token
        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                client_id: LINKEDIN_CLIENT_ID,
                client_secret: LINKEDIN_CLIENT_SECRET
            })
        })

        if (!tokenRes.ok) {
            return NextResponse.redirect(new URL('/dashboard/settings?linkedin=token-error', request.url))
        }

        const tokenData = await tokenRes.json()
        const accessToken = tokenData.access_token

        // Get LinkedIn profile
        const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })

        const linkedinProfile = profileRes.ok ? await profileRes.json() : null

        // Save to database
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            await supabase
                .from('profiles')
                .update({
                    linkedin_connected: true,
                    linkedin_url: linkedinProfile?.profile_url || null,
                    linkedin_data: {
                        name: linkedinProfile?.name,
                        email: linkedinProfile?.email,
                        picture: linkedinProfile?.picture,
                        connected_at: new Date().toISOString()
                    }
                })
                .eq('id', user.id)
        }

        return NextResponse.redirect(new URL('/dashboard/settings?linkedin=success', request.url))
    } catch (error) {
        console.error('LinkedIn callback error:', error)
        return NextResponse.redirect(new URL('/dashboard/settings?linkedin=error', request.url))
    }
}
