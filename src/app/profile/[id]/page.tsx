import { getProfileById, getProfile } from '@/lib/user-actions'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/landing/Header'
import MembershipSection from '@/components/user/MembershipSection'

export default async function ProfileByIdView({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const [viewedUser, currentUser] = await Promise.all([
        getProfileById(id),
        getProfile()
    ])

    if (!viewedUser) {
        notFound()
    }

    const age = viewedUser.profile?.dob
        ? new Date().getFullYear() - new Date(viewedUser.profile.dob).getFullYear()
        : null

    const isPaid = currentUser?.isPaid || false
    const isLoggedIn = !!currentUser
    const isOwnProfile = currentUser?.id === viewedUser.id

    return (
        <div className="min-h-screen bg-slate-50">
            <Header isLoggedIn={isLoggedIn} />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Profile Header with Background Image (Synced with /profile/view) */}
                    <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
                            <img src="/images/CoupleImage.png" className="w-full h-full object-cover blur-[2px] opacity-40" alt="background" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                        </div>
                        <div className="relative p-8 flex flex-col md:flex-row gap-8 items-start pt-16">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex-shrink-0">
                                {viewedUser.profile?.photoUrl ? (
                                    <img src={viewedUser.profile.photoUrl} alt={viewedUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-3xl">
                                        {viewedUser.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900">{viewedUser.name}</h1>
                                        <p className="text-slate-500">
                                            {viewedUser.gender} • {age ? `${age} yrs` : 'Age not set'} • {viewedUser.profile?.religion || 'Religion not set'}
                                        </p>
                                    </div>
                                    {isOwnProfile && (
                                        <Link href="/profile/setup" className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
                                            Edit Profile
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Contact</p>
                                        {(isPaid || isOwnProfile) ? (
                                            <>
                                                <p className="font-medium">{viewedUser.mobile}</p>
                                                <p className="text-sm text-slate-500">{viewedUser.email || 'Email not set'}</p>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-400 mt-1">
                                                <span className="text-sm italic">Locked - Premium Only</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Location</p>
                                        <p className="font-medium">{viewedUser.profile?.location || 'City not set'}</p>
                                        <p className="text-sm text-slate-500">{viewedUser.profile?.currentResidence || viewedUser.country}</p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">About</p>
                                    {(isPaid || isOwnProfile) ? (
                                        <p className="text-slate-600 leading-relaxed">
                                            {viewedUser.profile?.bio || 'No bio added yet.'}
                                        </p>
                                    ) : (
                                        <p className="text-slate-400 italic text-sm">Upgrade to premium to read full bio.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Separate Section for Membership/Account actions */}
                    {isLoggedIn && !isOwnProfile && !isPaid && (
                        <div className="mt-8">
                            <MembershipSection
                                isPaid={false}
                                country={currentUser?.country || 'INDIA'}
                                isProfileComplete={true}
                            />
                        </div>
                    )}

                    {!isLoggedIn && (
                        <div className="mt-12 bg-rose-50 p-10 rounded-3xl border border-rose-100 text-center shadow-sm">
                            <h2 className="text-2xl font-serif font-bold text-rose-900 mb-3">Interested in {viewedUser.name}?</h2>
                            <p className="text-rose-700 mb-8 max-w-md mx-auto">"Join our community today to connect with your perfect match and view full profile details."</p>
                            <div className="flex justify-center gap-4">
                                <Link href="/login" className="px-8 py-3 bg-white text-rose-600 rounded-xl font-bold border border-rose-200 hover:bg-rose-50 transition-all">
                                    Login
                                </Link>
                                <Link href="/register" className="px-8 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg transition-all hover:-translate-y-0.5">
                                    Register Free
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
