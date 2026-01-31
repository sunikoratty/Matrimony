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

    return (
        <div className="min-h-screen bg-slate-50">
            <Header isLoggedIn={true} />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header with Background Image */}
                    <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
                            <img src="/images/CoupleImage3.png" className="w-full h-full object-cover blur-[2px] opacity-40" alt="background" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                        </div>
                        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start pt-16">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex-shrink-0 relative z-10">
                                {user.profile?.photoUrl ? (
                                    <img src={user.profile.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-3xl">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 w-full text-center md:text-left">
                                <div className="flex flex-col sm:flex-row justify-between items-center md:items-start gap-4">
                                    <div className="max-w-full">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words leading-tight">
                                            {user.name}
                                        </h1>
                                        <p className="text-slate-500 mt-1">
                                            {user.gender} • {age ? `${age} yrs` : 'Age not set'} • {user.profile?.religion || 'Religion not set'}
                                        </p>
                                    </div>
                                    <Link
                                        href="/profile/setup"
                                        className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 whitespace-nowrap inline-block"
                                    >
                                        Edit Profile
                                    </Link>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Contact</p>
                                        <p className="font-medium">{user.mobile}</p>
                                        <p className="text-sm text-slate-500">{user.email || 'Email not set'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Location</p>
                                        <p className="font-medium">{user.profile?.location || 'City not set'}</p>
                                        <p className="text-sm text-slate-500">{user.profile?.currentResidence || user.country}</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">About</p>
                                    <p className="text-slate-600 leading-relaxed">
                                        {user.profile?.bio || 'No bio added yet.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Membership Status & Payment - Separate Section */}
                    {!user.isPaid && (
                        <div className="mt-8">
                            <MembershipSection
                                isPaid={user.isPaid}
                                country={user.country || 'INDIA'}
                                isProfileComplete={isProfileComplete}
                            />
                        </div>
                    )}

                    {isProfileComplete && (
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                            <MatchesList
                                matches={matchesResult.matches as any[]}
                                currentUser={{
                                    isPaid: user.isPaid,
                                    country: user.country || 'INDIA'
                                } as any}
                                unlockedIds={matchesResult.unlockedIds as string[]}
                                layout="simple"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
