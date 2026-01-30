import dynamic from 'next/dynamic'
import { getProfile } from '@/lib/user-actions'
import { getPublicProfiles } from '@/lib/match-actions'

const LandingPageContent = dynamic(() => import('@/components/landing/LandingPageContent'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
})

export default async function Home() {
    const user = await getProfile()
    const brides = await getPublicProfiles('FEMALE', 10, true)
    const grooms = await getPublicProfiles('MALE', 10, true)

    return (
        <LandingPageContent
            isLoggedIn={!!user}
            brides={brides}
            grooms={grooms}
        />
    )
}
