

import { useState, useEffect } from 'react'
import ProfileCard from '@/components/user/ProfileCard'
import PaymentModal from '@/components/payment/PaymentModal'
import { Link } from 'react-router-dom'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '@/components/ui/Toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import CircularLoader from '@/components/ui/CircularLoader'
import { Search } from 'lucide-react'

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

const STABLE_EMPTY_ARRAY: any[] = []

export default function MatchesList({
    matches: initialMatches,
    currentUser,
    isGuest = false,
    layout = 'cards',
    gender,
    unlockedIds: initialUnlockedIds = STABLE_EMPTY_ARRAY,
    isLoadingMatches = false
}: {
    matches: any[],
    currentUser: any,
    isGuest?: boolean,
    layout?: 'cards' | 'simple',
    gender?: 'MALE' | 'FEMALE',
    unlockedIds?: string[],
    isLoadingMatches?: boolean
}) {
    const { showToast } = useToast()
    const [allMatches, setAllMatches] = useState(initialMatches)
    const [unlockedIds, setUnlockedIds] = useState<string[]>(initialUnlockedIds)
    const [page, setPage] = useState(1)

    console.log(`[MatchesList] initialUnlockedIds:`, initialUnlockedIds)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(initialMatches.length >= 20)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const currentMode = searchParams.get('mode') || 'recommended'
    
    // Check if any actual search filters are applied
    const hasSearchFilters = searchParams.has('age') || 
                             searchParams.has('religion') || 
                             searchParams.has('caste') || 
                             searchParams.has('dosham') || 
                             searchParams.has('denomination') ||
                             currentMode === 'search';

    // Sync state when props change (parent re-fetched matches)
    useEffect(() => {
        setAllMatches(initialMatches)
        setUnlockedIds(initialUnlockedIds)
        setPage(1)
        setHasMore(initialMatches.length >= 20)
    }, [initialMatches, initialUnlockedIds])

    const userCountry = currentUser.country || 'INDIA'

    const setMode = (mode: string) => {
        if (mode === currentMode) return
        const params = new URLSearchParams(searchParams)
        params.set('mode', mode)
        navigate(`?${params.toString()}`)
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

                if ('unlockedIds' in result && result.unlockedIds) {
                    const newUnlocked = result.unlockedIds as string[]
                    setUnlockedIds(prev => Array.from(new Set([...prev, ...newUnlocked])))
                }

                setPage(prev => prev + 1)
                setHasMore(newMatches.length >= 20)
            }
        } catch (error) {
            console.error('Failed to load more matches:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUnlock = async (targetId: string) => {
        try {
            const { unlockContact } = await import('@/lib/user-actions')
            const result = await unlockContact(targetId)
            if ('success' in result) {
                setUnlockedIds(prev => [...prev, targetId])
                showToast('Contact unlocked successfully!', 'success')
            } else if ('error' in result) {
                showToast(result.error, 'error')
            }
        } catch (error) {
            console.error('Unlock failed:', error)
        }
    }

    return (
        <>
            {!isGuest && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {currentMode === 'match_religion' ? 'Matching Your Religion' :
                                currentMode === 'recommended' ? 'Recommended Matches' : 
                                currentMode === 'search' ? 'Your Search Result' : 'All Profiles'}
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {currentMode === 'recommended' ? 'Strict matches based on your profile' : 
                             currentMode === 'match_religion' ? 'Profiles from your religion' : 
                             currentMode === 'search' ? 'Profiles matching your custom filters' : 'Exploring all eligible members'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMode('recommended')}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentMode === 'recommended'
                                ? 'bg-rose-600 text-white shadow-lg'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                                }`}
                        >
                            Recommended
                        </button>

                        <button
                            onClick={() => setMode('match_religion')}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentMode === 'match_religion'
                                ? 'bg-rose-600 text-white shadow-lg'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                                }`}
                        >
                            Match Religion
                        </button>

                        <button
                            onClick={() => setMode('broad')}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentMode === 'broad'
                                ? 'bg-rose-600 text-white shadow-lg'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                                }`}
                        >
                            Browse All
                        </button>

                        {hasSearchFilters && (
                            <button
                                onClick={() => setMode('search')}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentMode === 'search'
                                    ? 'bg-rose-600 text-white shadow-lg'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
                                    }`}
                            >
                                Your Search Result
                            </button>
                        )}
                    </div>
                </div>
            )}

            {isLoadingMatches ? (
                <div className="flex items-center justify-center py-20">
                    <CircularLoader size="lg" />
                </div>
            ) : (
                <>
                    <div className={layout === 'simple' ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"}>
                        {allMatches.map(profile => (
                            <div key={profile.id}>
                                {layout === 'simple' ? (
                                    <Link to={`/profile/${profile.id}`}>
                                        <div className="flex items-center gap-6 p-4 bg-white rounded-xl border border-slate-100 hover:border-rose-200 transition-all hover:shadow-sm">
                                            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                                                {profile.profile.photoUrl ? (
                                                    <img src={profile.profile.photoUrl} className="w-full h-full object-cover object-top" alt={profile.name} />
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
                                    </Link>
                                ) : (
                                    <ProfileCard
                                        profile={profile}
                                        isPaid={currentUser.isPaid}
                                        isUnlocked={profile.isUnlocked || unlockedIds.includes(profile.id)}
                                        onUnlock={() => handleUnlock(profile.id)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {allMatches.length === 0 && (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                <Search size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Profiles Found</h3>
                            <p className="text-slate-500 max-w-sm mb-8">
                                We couldn't find any profiles matching your specific search criteria. Try broadening your filters or exploring all profiles.
                            </p>
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(window.location.search);
                                    params.delete('religion');
                                    params.delete('caste');
                                    params.delete('age');
                                    params.delete('dosham');
                                    params.delete('denomination');
                                    navigate(`?${params.toString()}`);
                                }}
                                className="px-8 py-3 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}

                    {hasMore && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-8 py-3 bg-white border-2 border-rose-600 text-rose-600 rounded-full font-bold hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <CircularLoader size="sm" color="rose" />
                                        <span>Loading...</span>
                                    </div>
                                ) : (
                                    'Load More Profiles'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}


            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                country={userCountry}
            />
        </>
    )
}
