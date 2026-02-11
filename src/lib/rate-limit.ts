/**
 * Simple in-memory rate limiter
 * No external dependencies needed
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key)
        }
    }
}, 60000) // Clean every minute

export interface RateLimitConfig {
    windowMs: number      // Time window in milliseconds
    maxRequests: number   // Max requests per window
}

export interface RateLimitResult {
    success: boolean
    remaining: number
    resetTime: number
    retryAfter?: number
}

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = { windowMs: 60000, maxRequests: 60 }
): RateLimitResult {
    const now = Date.now()
    const key = identifier

    let entry = rateLimitStore.get(key)

    // If no entry or expired, create new one
    if (!entry || entry.resetTime < now) {
        entry = {
            count: 1,
            resetTime: now + config.windowMs
        }
        rateLimitStore.set(key, entry)
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetTime: entry.resetTime
        }
    }

    // Increment count
    entry.count++

    // Check if over limit
    if (entry.count > config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetTime: entry.resetTime,
            retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        }
    }

    return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime
    }
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
    // Standard API: 60 requests per minute
    api: (ip: string) => rateLimit(`api:${ip}`, { windowMs: 60000, maxRequests: 60 }),

    // Auth endpoints: 10 requests per minute (more strict)
    auth: (ip: string) => rateLimit(`auth:${ip}`, { windowMs: 60000, maxRequests: 10 }),

    // AI endpoints: 20 requests per minute (expensive operations)
    ai: (ip: string) => rateLimit(`ai:${ip}`, { windowMs: 60000, maxRequests: 20 }),

    // Admin endpoints: 100 requests per minute (trusted)
    admin: (ip: string) => rateLimit(`admin:${ip}`, { windowMs: 60000, maxRequests: 100 }),
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
        ...(result.retryAfter && { 'Retry-After': result.retryAfter.toString() })
    }
}
