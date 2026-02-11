import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Check admin role
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
        }

        const startTime = Date.now()

        // Check database connectivity
        let dbStatus = 'healthy'
        let dbLatency = 0
        try {
            const dbStart = Date.now()
            const { error } = await supabase.from('users').select('id', { count: 'exact', head: true })
            dbLatency = Date.now() - dbStart
            if (error) dbStatus = 'degraded'
        } catch {
            dbStatus = 'down'
        }

        // Check auth service
        let authStatus = 'healthy'
        try {
            const { error } = await supabase.auth.getUser()
            if (error) authStatus = 'degraded'
        } catch {
            authStatus = 'down'
        }

        // Get table counts
        const [usersCount, coursesCount, jobsCount, logsCount] = await Promise.all([
            supabase.from('users').select('id', { count: 'exact', head: true }),
            supabase.from('courses').select('id', { count: 'exact', head: true }),
            supabase.from('jobs').select('id', { count: 'exact', head: true }),
            supabase.from('admin_audit_logs').select('id', { count: 'exact', head: true })
        ])

        // Get recent errors from audit logs
        const { data: recentLogs } = await supabase
            .from('admin_audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

        const totalLatency = Date.now() - startTime

        return NextResponse.json({
            success: true,
            health: {
                status: dbStatus === 'healthy' && authStatus === 'healthy' ? 'healthy' : 'degraded',
                timestamp: new Date().toISOString(),
                uptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'N/A',
                services: {
                    database: { status: dbStatus, latency: `${dbLatency}ms` },
                    auth: { status: authStatus },
                    api: { status: 'healthy', latency: `${totalLatency}ms` }
                },
                tables: {
                    users: usersCount.count || 0,
                    courses: coursesCount.count || 0,
                    jobs: jobsCount.count || 0,
                    auditLogs: logsCount.count || 0
                },
                recentLogs: recentLogs || [],
                environment: process.env.NODE_ENV || 'development',
                version: '1.0.0'
            }
        })

    } catch (error) {
        console.error('Health check error:', error)
        return NextResponse.json({
            success: false,
            health: {
                status: 'error',
                timestamp: new Date().toISOString(),
                error: 'Health check failed'
            }
        }, { status: 500 })
    }
}
