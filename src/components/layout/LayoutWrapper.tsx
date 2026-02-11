'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // Routes that should NOT have the public Navbar/Footer
    const isDashboard = pathname?.startsWith('/dashboard')
    const isAdmin = pathname?.startsWith('/admin')
    const isAuth = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/onboarding')

    // Auth pages usually have their own layout or use a simplified one, 
    // but often we want to keep Navbar for them unless specified otherwise.
    // user request was specifically about Dashboard Footer overlap.

    const shouldHideLayout = isDashboard || isAdmin

    return (
        <>
            {!shouldHideLayout && <Navbar />}
            <main id="main-content" className={`flex-1 ${!shouldHideLayout ? 'pt-16' : ''}`} role="main">
                {children}
            </main>
            {!shouldHideLayout && <Footer />}
        </>
    )
}
