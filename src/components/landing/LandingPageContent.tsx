'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Footer from '@/components/landing/Footer'
import FeaturedProfiles from '@/components/landing/FeaturedProfiles'

export default function LandingPageContent({
    isLoggedIn,
    brides,
    grooms
}: {
    isLoggedIn: boolean,
    brides: any[],
    grooms: any[]
}) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Return a stable skeleton/loading state during hydration
    if (!mounted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Header isLoggedIn={isLoggedIn} />
            <main>
                <Hero />
                <FeaturedProfiles
                    title="Featured Brides"
                    subtitle="Explore a selection of beautiful brides looking for their life partners"
                    profiles={brides}
                    gender="FEMALE"
                />
                <FeaturedProfiles
                    title="Featured Grooms"
                    subtitle="Discover eligible grooms selected from various backgrounds and professions"
                    profiles={grooms}
                    gender="MALE"
                />
            </main>
            <Footer />
        </div>
    )
}
