import { getProfile } from '@/lib/user-actions'
import { getMatches } from '@/lib/match-actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/landing/Header'
import MembershipSection from '@/components/user/MembershipSection'
import MatchesList from '@/components/user/MatchesList'

export default async function ProfileView({
    searchParams
}: {
    searchParams: Promise<{ mode?: 'broad' | 'matching' }>
}) {
    const { mode = 'recommended' } = await searchParams
    const user = await getProfile()

    if (!user) {
        redirect('/login')
    }

    const matchesResult = await getMatches(mode, 0, 20)
    const matches = 'matches' in matchesResult ? matchesResult.matches : []
    const age = user.profile?.dob
        ? new Date().getFullYear() - new Date(user.profile.dob).getFullYear()
        : null

    // Check if critical matching details are present
    const isProfileComplete = !!user.isProfileCompleted

    if (!isProfileComplete) {
        redirect('/profile/setup')
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header user={user} />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Hide Logged-in User Profile - Temporary Comment out per request */}
                    {/* 
                    {!isProfileComplete && (
                        ... reminder card ...
                    )}

                    <div className="relative bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12">
                        ... profile header ...
                    </div>
                    */}

                    {/* Temporary Commented out Membership Section */}
                    {/* <MembershipSection isPaid={user.isPaid} country={user.country} isProfileComplete={isProfileComplete} /> */}

                    {/* Discovery Sections */}
                    <div className="mt-4">
                        <MatchesList
                            matches={matches || []}
                            currentUser={{
                                isPaid: true, // Force true for display
                                country: user.country || 'INDIA'
                            } as any}
                            unlockedIds={matchesResult.unlockedIds as string[]}
                            layout="cards" // Changed to cards for better visibility
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
