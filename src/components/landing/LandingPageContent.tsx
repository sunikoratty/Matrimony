'use client'

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
