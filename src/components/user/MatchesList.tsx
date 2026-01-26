'use client'

import { useState } from 'react'
import ProfileCard from '@/components/user/ProfileCard'
import PaymentModal from '@/components/payment/PaymentModal'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

type Profile = {
    id: string
    name: string
    profile: {
        photoUrl?: string | null
        bio?: string | null
        religion?: string | null
        caste?: string | null
        currentResidence?: string | null
        dob?: Date | null
    }
    mobile: string
    email: string | null
    country?: string // Needed for payment gateway logic
}

export default function MatchesList({
    matches: initialMatches,
    currentUser,
    isGuest = false,
    layout = 'cards',
    gender
}: {
    matches: any[],
    currentUser: any,
    isGuest?: boolean,
    layout?: 'cards' | 'simple',
    gender?: 'MALE' | 'FEMALE'
}) {
    const [allMatches, setAllMatches] = useState(initialMatches)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(initialMatches.length >= 20)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()
    const currentMode = searchParams.get('mode') || 'broad'

    const userCountry = currentUser.country || 'INDIA'

    const setMode = (mode: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('mode', mode)
        router.push(`?${params.toString()}`)
    }

    const handleLoadMore = async () => {
        setLoading(true)
        try {
            const { getMatches } = await import('@/lib/match-actions')
            const nextSkip = page * 20
            const result = await getMatches(currentMode as any, nextSkip, 20, gender)

            if ('matches' in result && result.matches) {
                const newMatches = result.matches as any[]
                setAllMatches(prev => [...(prev || []), ...newMatches])
                setPage(prev => prev + 1)
                setHasMore(newMatches.length >= 20)
            }
        } catch (error) {
            console.error('Failed to load more matches:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        {currentMode === 'matching' ? 'Your Matching Profiles' : 'Recommended Matches'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {currentMode === 'matching' ? 'Strict matches based on your profile' : ''}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMode('broad')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentMode === 'broad'
                            ? 'bg-rose-600 text-white shadow-lg'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                            }`}
                    >
                        All Profiles
                    </button>
                    {!isGuest && (
                        <button
                            onClick={() => setMode('matching')}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentMode === 'matching'
                                ? 'bg-rose-600 text-white shadow-lg'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                                }`}
                        >
                            Matching Profiles
                        </button>
                    )}
                </div>
            </div>

            <div className={layout === 'simple' ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"}>
                {allMatches.map(profile => (
                    <Link key={profile.id} href={`/profile/${profile.id}`}>
                        {layout === 'simple' ? (
                            <div className="flex items-center gap-6 p-4 bg-white rounded-xl border border-slate-100 hover:border-rose-200 transition-all hover:shadow-sm">
                                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                                    {profile.profile.photoUrl ? (
                                        <img src={profile.profile.photoUrl} className="w-full h-full object-cover" alt={profile.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-rose-300 font-bold text-xl">
                                            {profile.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900">{profile.name}</h3>
                                    <p className="text-sm text-slate-500">
                                        {profile.profile.religion || 'Religion N/A'} • {profile.profile.currentResidence || 'Location N/A'}
                                    </p>
                                    <p className="text-xs text-rose-600 font-medium mt-1">View Profile &rarr;</p>
                                </div>
                            </div>
                        ) : (
                            <ProfileCard
                                profile={profile}
                                isPaid={currentUser.isPaid}
                            />
                        )}
                    </Link>
                ))}
            </div>

            {allMatches.length === 0 && (
                <div className="py-20 text-center">
                    <p className="text-slate-400 text-lg">No matches found yet.</p>
                </div>
            )}

            {hasMore && (
                <div className="mt-12 text-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="px-8 py-3 bg-white border-2 border-rose-600 text-rose-600 rounded-full font-bold hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {loading ? 'Loading...' : 'Load More Profiles'}
                    </button>
                </div>
            )}

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                country={userCountry}
            />
        </>
    )
}
