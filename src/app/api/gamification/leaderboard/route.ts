import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const range = searchParams.get('range') || 'all'

        // Build query for leaderboard
        let query = supabase
            .from('users')
            .select('id, full_name, avatar_url, total_xp, level')
            .order('total_xp', { ascending: false })
            .limit(50)

        // For time-based ranges, we'd ideally have XP history
        // For now, just use the total_xp from users table
        const { data: users, error } = await query

        if (error) throw error

        // Map to leaderboard format
        const leaderboard = (users || []).map((u, idx) => ({
            rank: idx + 1,
            user_id: u.id,
            full_name: u.full_name || 'Anonymous',
            avatar_url: u.avatar_url,
            total_xp: u.total_xp || 0,
            level: u.level || Math.floor((u.total_xp || 0) / 500) + 1,
            badges: 0 // Could be enriched with achievements count
        }))

        // Enrich with badge counts
        for (const entry of leaderboard.slice(0, 10)) {
            const { count } = await supabase
                .from('user_achievements')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', entry.user_id)
            entry.badges = count || 0
        }

        // Find current user's rank
        const myRank = leaderboard.find(e => e.user_id === user.id)

        return NextResponse.json({
            success: true,
            leaderboard,
            myRank: myRank || null,
            totalParticipants: leaderboard.length,
            range
        })

    } catch (error) {
        console.error('Error fetching leaderboard:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch leaderboard' },
            { status: 500 }
        )
    }
}
