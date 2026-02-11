import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get user's saved jobs and applications
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || 'applications' // 'applications' or 'saved'

        if (type === 'saved') {
            const { data: saved, error } = await supabase
                .from('saved_jobs')
                .select('*, job:jobs(*)')
                .eq('user_id', user.id)
                .order('saved_at', { ascending: false })

            if (error) {
                return NextResponse.json({ success: true, jobs: [] })
            }
            return NextResponse.json({ success: true, jobs: saved || [] })
        }

        // Default: applications
        const { data: applications, error } = await supabase
            .from('job_applications')
            .select('*, job:jobs(*)')
            .eq('user_id', user.id)
            .order('applied_at', { ascending: false })

        if (error) {
            return NextResponse.json({ success: true, applications: [] })
        }

        return NextResponse.json({ success: true, applications: applications || [] })
    } catch (error) {
        console.error('Job applications error:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 })
    }
}

// POST - Apply to a job or save a job
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { action, jobId, notes, coverLetter } = await request.json()

        if (!jobId) {
            return NextResponse.json({ success: false, error: 'Job ID required' }, { status: 400 })
        }

        if (action === 'save') {
            const { error } = await supabase
                .from('saved_jobs')
                .upsert({
                    user_id: user.id,
                    job_id: jobId,
                    saved_at: new Date().toISOString()
                }, { onConflict: 'user_id,job_id' })

            if (error) {
                return NextResponse.json({ success: false, error: error.message }, { status: 400 })
            }
            return NextResponse.json({ success: true, message: 'Job saved' })
        }

        if (action === 'unsave') {
            await supabase
                .from('saved_jobs')
                .delete()
                .eq('user_id', user.id)
                .eq('job_id', jobId)

            return NextResponse.json({ success: true, message: 'Job unsaved' })
        }

        // Default: apply
        const { error } = await supabase
            .from('job_applications')
            .insert({
                user_id: user.id,
                job_id: jobId,
                status: 'applied',
                notes: notes || null,
                cover_letter: coverLetter || null,
                applied_at: new Date().toISOString()
            })

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ success: false, error: 'Already applied to this job' }, { status: 409 })
            }
            return NextResponse.json({ success: false, error: error.message }, { status: 400 })
        }

        return NextResponse.json({ success: true, message: 'Application submitted' })
    } catch (error) {
        console.error('Job action error:', error)
        return NextResponse.json({ success: false, error: 'Failed to process action' }, { status: 500 })
    }
}

// PATCH - Update application status
export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { applicationId, status, notes } = await request.json()

        if (!applicationId || !status) {
            return NextResponse.json({ success: false, error: 'Application ID and status required' }, { status: 400 })
        }

        const validStatuses = ['applied', 'reviewing', 'interview', 'offered', 'rejected', 'withdrawn']
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 })
        }

        const { error } = await supabase
            .from('job_applications')
            .update({ status, notes, updated_at: new Date().toISOString() })
            .eq('id', applicationId)
            .eq('user_id', user.id)

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 400 })
        }

        return NextResponse.json({ success: true, message: 'Application updated' })
    } catch (error) {
        console.error('Update application error:', error)
        return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 })
    }
}
