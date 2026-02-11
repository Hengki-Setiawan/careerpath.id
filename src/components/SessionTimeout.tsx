'use client'

import { useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const WARNING_BEFORE_MS = 5 * 60 * 1000   // Warning 5 min before

interface SessionTimeoutProps {
    children: React.ReactNode
}

export default function SessionTimeout({ children }: SessionTimeoutProps) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const warningRef = useRef<NodeJS.Timeout | null>(null)

    const handleLogout = useCallback(async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/login?expired=true'
    }, [])

    const showWarning = useCallback(() => {
        const shouldContinue = window.confirm(
            'Sesi kamu akan berakhir dalam 5 menit karena tidak ada aktivitas. Klik OK untuk melanjutkan.'
        )
        if (shouldContinue) {
            resetTimer()
        }
    }, [])

    const resetTimer = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (warningRef.current) clearTimeout(warningRef.current)

        warningRef.current = setTimeout(showWarning, SESSION_TIMEOUT_MS - WARNING_BEFORE_MS)
        timeoutRef.current = setTimeout(handleLogout, SESSION_TIMEOUT_MS)
    }, [showWarning, handleLogout])

    useEffect(() => {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart']

        const handleActivity = () => resetTimer()

        events.forEach(event => window.addEventListener(event, handleActivity))
        resetTimer()

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity))
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            if (warningRef.current) clearTimeout(warningRef.current)
        }
    }, [resetTimer])

    return <>{children}</>
}
