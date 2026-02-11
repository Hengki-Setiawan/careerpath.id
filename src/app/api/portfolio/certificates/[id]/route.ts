import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: certificateId } = await params
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Get the certificate first to find the file path (if any)
        const { data: certificate, error: fetchError } = await supabase
            .from('certificates')
            .select('image_url')
            .eq('id', certificateId)
            .eq('user_id', user.id)
            .single()

        if (fetchError || !certificate) {
            return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 })
        }

        // 2. Delete from Database
        const { error: deleteError } = await supabase
            .from('certificates')
            .delete()
            .eq('id', certificateId)
            .eq('user_id', user.id)

        if (deleteError) throw deleteError

        // 3. Delete from Storage (if image_url exists and is in our bucket)
        // Assumption: image_url format is typically public URL. 
        // We need to extract the path. For now, we skip auto-delete from storage to avoid accidental deletion of shared resources
        // or complex path parsing. Can be added as an enhancement.

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error deleting certificate:', error)
        return NextResponse.json({ success: false, error: 'Failed to delete certificate' }, { status: 500 })
    }
}
