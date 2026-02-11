import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()

        // Test 1: Check if we can connect to Supabase
        const { data: authData, error: authError } = await supabase.auth.getSession()

        // Test 2: Check if we can query the database (try to list tables)
        const { data: careersData, error: careersError } = await supabase
            .from('careers')
            .select('count')
            .limit(1)

        const { data: skillsData, error: skillsError } = await supabase
            .from('skills')
            .select('count')
            .limit(1)

        const results = {
            success: true,
            timestamp: new Date().toISOString(),
            tests: {
                connection: {
                    status: 'ok',
                    message: 'Berhasil terhubung ke Supabase'
                },
                auth: {
                    status: authError ? 'error' : 'ok',
                    message: authError ? authError.message : 'Auth service aktif',
                    hasSession: !!authData?.session
                },
                database: {
                    careers: {
                        status: careersError ? 'error' : 'ok',
                        message: careersError?.message || 'Tabel careers tersedia',
                        errorCode: careersError?.code
                    },
                    skills: {
                        status: skillsError ? 'error' : 'ok',
                        message: skillsError?.message || 'Tabel skills tersedia',
                        errorCode: skillsError?.code
                    }
                }
            },
            recommendations: [] as string[]
        }

        // Add recommendations based on errors
        if (careersError?.code === '42P01') {
            results.recommendations.push('Tabel "careers" belum ada. Jalankan SQL migration di Supabase SQL Editor.')
        }
        if (skillsError?.code === '42P01') {
            results.recommendations.push('Tabel "skills" belum ada. Jalankan SQL migration di Supabase SQL Editor.')
        }

        return NextResponse.json(results)
    } catch (error) {
        return NextResponse.json({
            success: false,
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
            recommendations: [
                'Pastikan NEXT_PUBLIC_SUPABASE_URL sudah benar di .env.local',
                'Pastikan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah benar di .env.local',
                'Restart dev server setelah mengubah .env.local'
            ]
        }, { status: 500 })
    }
}
