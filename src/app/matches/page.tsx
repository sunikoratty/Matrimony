import { getMatches } from '@/lib/match-actions'
import ProfileCard from '@/components/user/ProfileCard'
import Header from '@/components/landing/Header'
import { redirect } from 'next/navigation'
import MatchesList from '@/components/user/MatchesList'

export default async function MatchesPage({
    searchParams
}: {
    searchParams: Promise<{ gender?: 'MALE' | 'FEMALE' }>
}) {
    const { gender } = await searchParams
    const matchesResult = await getMatches('broad', 0, 20, gender)

    if ('error' in matchesResult) {
        return <div className="p-20 text-center">{matchesResult.error}</div>
    }

    const { matches, currentUser, isGuest } = matchesResult
    // Use default country if not present (should be present for registered users)
    const userWithCountry = { ...currentUser, country: currentUser.country || 'INDIA' }

    return (
        <div className="min-h-screen bg-white">
            <Header isLoggedIn={!isGuest} />
            <div className="pt-20">
                {/* Hero Section */}
                <div className="relative h-64 sm:h-80 bg-rose-900 overflow-hidden mb-8">
                    <img
                        src="/images/CoupleImage4.png"
                        alt="Matches"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">Discover Your Match.</h1>
                            <p className="text-rose-100 text-lg">
                                "Handpicked profiles curated just for you. Your forever begins here."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <MatchesList matches={matches} currentUser={userWithCountry} isGuest={isGuest} gender={gender} />
                </div>
            </div>
        </div>
    )
}
