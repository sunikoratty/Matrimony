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
    const matchesResult = await getMatches('broad', gender)

    if ('error' in matchesResult) {
        return <div className="p-20 text-center">{matchesResult.error}</div>
    }

    const { matches, currentUser, isGuest } = matchesResult
    // Use default country if not present (should be present for registered users)
    const userWithCountry = { ...currentUser, country: currentUser.country || 'INDIA' }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header isLoggedIn={!isGuest} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <MatchesList matches={matches} currentUser={userWithCountry} isGuest={isGuest} />
            </div>
        </div>
    )
}
