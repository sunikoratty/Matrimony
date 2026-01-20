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
    matches,
    currentUser,
    isGuest = false
}: {
    matches: any[],
    currentUser: any,
    isGuest?: boolean
}) {
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {matches.map(profile => (
                    <Link key={profile.id} href={`/profile/${profile.id}`}>
                        <ProfileCard
                            profile={profile}
                            isPaid={currentUser.isPaid}
                        />
                    </Link>
                ))}

                {matches.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-slate-400 text-lg">No matches found yet.</p>
                    </div>
                )}
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                country={userCountry}
            />
        </>
    )
}
