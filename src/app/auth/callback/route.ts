import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/onboarding'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Check if user has completed onboarding
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Check if user profile exists and has basic info
                const { data: profile } = await supabase
                    .from('users')
                    .select('university, major')
                    .eq('id', user.id)
                    .single()

                // If profile is complete, go to dashboard, otherwise go to onboarding
                if (profile?.university && profile?.major) {
                    return NextResponse.redirect(`${origin}/dashboard`)
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
