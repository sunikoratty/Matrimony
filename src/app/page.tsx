import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import Footer from '@/components/landing/Footer'
import FeaturedProfiles from '@/components/landing/FeaturedProfiles'

import { getProfile } from '@/lib/user-actions'
import { getPublicProfiles } from '@/lib/match-actions'

export default async function Home() {
    const user = await getProfile()
    const brides = await getPublicProfiles('FEMALE', 10, true)
    const grooms = await getPublicProfiles('MALE', 10, true)

    return (
        <div className="min-h-screen font-sans text-slate-900 bg-white selection:bg-rose-100 selection:text-rose-900">
            <Header isLoggedIn={!!user} />
            <main>
                <Hero />

                <FeaturedProfiles
                    title="Featured Brides"
                    subtitle="Explore a random selection of beautiful brides looking for their life partners"
                    profiles={brides}
                    gender="FEMALE"
                />

                <FeaturedProfiles
                    title="Featured Grooms"
                    subtitle="Discover eligible grooms randomly selected from various backgrounds and professions"
                    profiles={grooms}
                    gender="MALE"
                />
            </main>
            <Footer />
        </div>
    )
}
