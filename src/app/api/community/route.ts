import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get community posts
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const limit = parseInt(searchParams.get('limit') || '20')

        let query = supabase
            .from('community_posts')
            .select(`
                *,
                author:profiles!community_posts_user_id_fkey(full_name, avatar_url),
                likes_count:community_likes(count),
                comments_count:community_comments(count)
            `)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (category && category !== 'all') {
            query = query.eq('category', category)
        }

        const { data: posts, error } = await query

        if (error) {
            // If table doesn't exist yet, return empty
            return NextResponse.json({ success: true, posts: [] })
        }

        return NextResponse.json({ success: true, posts: posts || [] })
    } catch (error) {
        console.error('Community posts error:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 })
    }
}

// POST - Create a community post
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { title, content, category } = await request.json()

        if (!title || !content) {
            return NextResponse.json({ success: false, error: 'Title and content required' }, { status: 400 })
        }

        const validCategories = ['career', 'learning', 'job-market', 'mental-health', 'success-story', 'general']
        const postCategory = validCategories.includes(category) ? category : 'general'

        const { data: post, error } = await supabase
            .from('community_posts')
            .insert({
                user_id: user.id,
                title,
                content,
                category: postCategory,
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 400 })
        }

        return NextResponse.json({ success: true, post })
    } catch (error) {
        console.error('Create post error:', error)
        return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 })
    }
}
