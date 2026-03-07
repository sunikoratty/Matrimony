import { getProfile } from '@/lib/user-actions'
import { getMatches } from '@/lib/match-actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/landing/Header'
import MembershipSection from '@/components/user/MembershipSection'
import MatchesList from '@/components/user/MatchesList'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MatchesPage({
    searchParams
}: {
    searchParams: Promise<{
        gender?: 'MALE' | 'FEMALE',
        mode?: 'broad' | 'recommended',
        age?: string,
        religion?: string,
        caste?: string,
        dosham?: string,
        denomination?: string
    }>
}) {
    const {
        gender,
        mode = 'recommended',
        age,
        religion,
        caste,
        dosham,
        denomination
    } = await searchParams

    // Parse age (expecting "min-max" or single value)
    let minAge: number | undefined
    let maxAge: number | undefined
    if (age) {
        if (age.includes('-')) {
            const parts = age.split('-')
            minAge = parseInt(parts[0])
            maxAge = parseInt(parts[1])
        } else {
            minAge = parseInt(age)
            maxAge = minAge
        }
    }

    const matchesResult = await getMatches(mode as any, 0, 20, gender, {
        minAge,
        maxAge,
        religion,
        caste,
        dosham,
        denomination
    })

    if ('error' in matchesResult) {
        return <div className="p-20 text-center">{matchesResult.error}</div>
    }

    const { matches, currentUser, isGuest } = matchesResult

    // For Header avatar
    const user = await getProfile()

    // Safety check: Registered users must complete profile before browsing
    if (!isGuest && user && !user.isProfileCompleted) {
        redirect('/profile/setup')
    }

    // Use default country if not present (should be present for registered users)
    const userWithCountry = { ...currentUser, country: currentUser.country || 'INDIA' }

    return (
        <div className="min-h-screen">
            <Header user={user} />
            <div className="pt-20">
                {/* Hero Section */}
                <div className="relative h-64 sm:h-80 bg-rose-900 overflow-hidden mb-8">
                    <picture className="w-full h-full block">
                        <source media="(min-width: 640px)" srcSet="/images/KeralaCoupleLarge.png" />
                        <img
                            src="/images/KeralaCouple.png"
                            alt="Matches Banner"
                            className="w-full h-full object-cover object-top"
                        />
                    </picture>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <Link
                            href="/"
                            className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs sm:text-sm font-medium z-10 hover:bg-black/40"
                        >
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                        <div className="max-w-2xl relative z-10 mt-8 sm:mt-0">
                            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">Discover Your Match.</h1>
                            <p className="text-rose-100/90 text-sm sm:text-lg font-light drop-shadow-md">
                                "Handpicked profiles curated just for you. Your forever begins here."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <MatchesList
                        matches={matches ? JSON.parse(JSON.stringify(matches)) : []}
                        currentUser={userWithCountry ? JSON.parse(JSON.stringify(userWithCountry)) : null}
                        isGuest={isGuest}
                        gender={gender}
                        unlockedIds={matchesResult.unlockedIds as string[]}
                    />
                </div>
            </div>
        </div>
    )
}
