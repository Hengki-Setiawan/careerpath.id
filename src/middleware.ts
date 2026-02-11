import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { rateLimiters } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Apply rate limiting to API routes
    if (pathname.startsWith('/api/')) {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown'

        let result

        // Stricter limits for auth routes
        if (pathname.startsWith('/api/auth') || pathname.includes('change-password') || pathname.includes('delete')) {
            result = rateLimiters.auth(ip)
        }
        // Strict limits for AI routes
        else if (pathname.startsWith('/api/ai/')) {
            result = rateLimiters.ai(ip)
        }
        // Admin routes
        else if (pathname.startsWith('/api/admin/')) {
            result = rateLimiters.admin(ip)
        }
        // General API rate limit
        else {
            result = rateLimiters.api(ip)
        }

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: 'Terlalu banyak request. Coba lagi nanti.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(result.retryAfter || 60),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
                    }
                }
            )
        }
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
