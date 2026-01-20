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

    // Don't show age to guests or use the same logic
    const age = viewedUser.profile?.dob
        ? new Date().getFullYear() - new Date(viewedUser.profile.dob).getFullYear()
        : null

    const isPaid = currentUser?.isPaid || false
    const isLoggedIn = !!currentUser

    // Critical details for matching section (usually for current user, but here we just check profile completeness of the viewed user to see if it's a valid matchable profile)
    const isProfileComplete = !!(viewedUser.profile?.dob && viewedUser.profile?.religion)

    return (
        <div className="min-h-screen bg-slate-50">
            <Header isLoggedIn={isLoggedIn} />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex-shrink-0">
                            {(isPaid && viewedUser.profile?.photoUrl) ? (
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
                                {currentUser?.id === viewedUser.id && (
                                    <Link href="/profile/setup" className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
                                        Edit Profile
                                    </Link>
                                )}
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Contact</p>
                                    {isPaid ? (
                                        <>
                                            <p className="font-medium">{viewedUser.mobile}</p>
                                            <p className="text-sm text-slate-500">{viewedUser.email || 'Email not set'}</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">Locked - Premium Only</p>
                                    )}
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Location</p>
                                    <p className="font-medium">{viewedUser.profile?.location || 'City not set'}</p>
                                    <p className="text-sm text-slate-500">{viewedUser.profile?.currentResidence || viewedUser.country}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">About</p>
                                <p className="text-slate-600 leading-relaxed">
                                    {viewedUser.profile?.bio || 'No bio added yet.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Show subscribe section only if viewing someone else and not paid */}
                    {isLoggedIn && !isPaid && currentUser?.id !== viewedUser.id && (
                        <MembershipSection
                            isPaid={false}
                            country={currentUser.country || 'INDIA'}
                            isProfileComplete={true}
                        />
                    )}

                    {!isLoggedIn && (
                        <div className="mt-8 bg-rose-50 p-8 rounded-2xl border border-rose-100 text-center">
                            <h2 className="text-xl font-bold text-rose-900 mb-2">Interested in {viewedUser.name}?</h2>
                            <p className="text-rose-700 mb-6">Register or Login to express interest and view full contact details.</p>
                            <div className="flex justify-center gap-4">
                                <Link href="/login" className="px-6 py-2 bg-white text-rose-600 rounded-lg font-bold border border-rose-200 hover:bg-rose-50">
                                    Login
                                </Link>
                                <Link href="/register" className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 shadow-lg">
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
