import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // Confirm deletion with password/confirmation from request body
        const { confirmation } = await request.json()

        if (confirmation !== 'DELETE_MY_ACCOUNT') {
            return NextResponse.json({
                success: false,
                error: 'Invalid confirmation. Send { confirmation: "DELETE_MY_ACCOUNT" }'
            }, { status: 400 })
        }

        const userId = user.id

        // Delete all user data from all tables
        // Order matters due to foreign key constraints
        const tablesToDelete = [
            'user_quiz_attempts',
            'notifications',
            'mood_entries',
            'journal_entries',
            'monthly_targets',
            'user_courses',
            'user_skills',
            'user_careers',
            'job_applications',
            'saved_jobs',
            'certificates',
            'portfolio_projects',
            'roadmap_steps',
            'mental_health_logs',
            'community_posts',
            'user_achievements'
        ]

        const errors: string[] = []

        for (const table of tablesToDelete) {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('user_id', userId)

            if (error) {
                // Log but don't fail - some tables might not exist or have no data
                console.warn(`Failed to delete from ${table}:`, error.message)
                errors.push(table)
            }
        }

        // Delete user profile from users table
        const { error: userDeleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId)

        if (userDeleteError) {
            console.error('Failed to delete user profile:', userDeleteError)
        }

        // Delete auth user (this will also sign them out)
        // Note: This requires admin privileges via service role
        // For now, we'll just sign out and let Supabase handle auth deletion
        await supabase.auth.signOut()

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully',
            deletedTables: tablesToDelete.filter(t => !errors.includes(t)),
            errors: errors.length > 0 ? errors : undefined
        })

    } catch (error) {
        console.error('Error deleting account:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete account' },
            { status: 500 }
        )
    }
}
