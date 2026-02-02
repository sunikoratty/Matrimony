import { getProfileById, getProfile, hasUnlockedContact, unlockContact } from '@/lib/user-actions'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/landing/Header'
import MembershipSection from '@/components/user/MembershipSection'
import { revalidatePath } from 'next/cache'
import { ArrowLeft } from 'lucide-react'

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

    // Check if contact is unlocked (only relevant if not own profile and user is paid)
    const isUnlocked = isOwnProfile || (isLoggedIn && isPaid && await hasUnlockedContact(currentUser.id, viewedUser.id))

    async function handleUnlock() {
        'use server'
        if (!currentUser || !viewedUser) return
        const result = await unlockContact(viewedUser.id)
        if ('success' in result) {
            revalidatePath(`/profile/${viewedUser.id}`)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header user={currentUser} />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Back Link */}
                    <div className="mb-6">
                        <Link
                            href={`/matches?gender=${viewedUser.gender}`}
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors font-medium text-sm group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Profile
                        </Link>
                    </div>

                    {/* Profile Header with Background Image */}
                    <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                        <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
                            <img src="/images/CoupleImage3.png" className="w-full h-full object-cover blur-[2px] opacity-40" alt="background" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                        </div>
                        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start pt-16">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex-shrink-0 relative z-10">
                                {viewedUser.profile?.photoUrl ? (
                                    <img src={viewedUser.profile.photoUrl} alt={viewedUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-3xl">
                                        {viewedUser.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 w-full text-center md:text-left">
                                <div className="flex flex-col sm:flex-row justify-between items-center md:items-start gap-4">
                                    <div className="max-w-full">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words leading-tight">
                                            {viewedUser.name}
                                        </h1>
                                        <p className="text-slate-500 mt-1">
                                            {viewedUser.gender} • {age ? `${age} yrs` : 'Age not set'} • {viewedUser.profile?.religion || 'Religion not set'}
                                        </p>
                                    </div>
                                    {isOwnProfile && (
                                        <Link href="/profile/setup" className="w-full sm:w-auto px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium inline-block">
                                            Edit Profile
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Contact Information</p>
                                        <div className="space-y-2">
                                            {isUnlocked ? (
                                                <>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Mobile</p>
                                                        <p className="font-medium text-slate-700">{viewedUser.mobile}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Email</p>
                                                        <p className="font-medium text-slate-700">{viewedUser.email || 'Email not set'}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="mt-2">
                                                    {isPaid ? (
                                                        <form action={handleUnlock}>
                                                            <button
                                                                type="submit"
                                                                className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-all"
                                                            >
                                                                Unlock Contact Details
                                                            </button>
                                                        </form>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-slate-400 mt-1">
                                                            <span className="text-sm italic">Locked - Premium Only</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Location</p>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-xs text-slate-400">City</p>
                                                <p className="font-medium text-slate-700">{viewedUser.profile?.location || 'City not set'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">Residence</p>
                                                <p className="font-medium text-slate-700">{viewedUser.profile?.currentResidence || viewedUser.country}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 md:col-span-2">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Personal & Professional Details</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                            <div>
                                                <p className="text-xs text-slate-400">Marital Status</p>
                                                <p className="font-medium text-slate-700 capitalize">{viewedUser.profile?.maritalStatus?.toLowerCase() || 'Not set'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">Mother Tongue</p>
                                                <p className="font-medium text-slate-700">{viewedUser.motherTongue}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">Qualification</p>
                                                <p className="font-medium text-slate-700">{viewedUser.profile?.qualification || 'Not set'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">Occupation</p>
                                                <p className="font-medium text-slate-700">{viewedUser.profile?.occupation || 'Not set'}</p>
                                            </div>

                                            {/* Religion Specific Fields */}
                                            {viewedUser.profile?.religion === 'Hindu' && (
                                                <>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Caste</p>
                                                        <p className="font-medium text-slate-700">{viewedUser.profile?.caste || 'Not set'}</p>
                                                    </div>
                                                    {viewedUser.profile?.dosham && (
                                                        <div>
                                                            <p className="text-xs text-slate-400">Dosham</p>
                                                            <p className="font-medium text-slate-700">{viewedUser.profile.dosham}</p>
                                                        </div>
                                                    )}
                                                    {viewedUser.profile?.birthStar && (
                                                        <div>
                                                            <p className="text-xs text-slate-400">Birth Star</p>
                                                            <p className="font-medium text-slate-700">{viewedUser.profile.birthStar}</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {viewedUser.profile?.religion === 'Christian' && (
                                                <div>
                                                    <p className="text-xs text-slate-400">Denomination</p>
                                                    <p className="font-medium text-slate-700">{viewedUser.profile?.denomination || 'Not set'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">About</p>
                                    {isUnlocked ? (
                                        <p className="text-slate-600 leading-relaxed">
                                            {viewedUser.profile?.bio || 'No bio added yet.'}
                                        </p>
                                    ) : (
                                        <div className="mt-2">
                                            {isPaid ? (
                                                <p className="text-slate-400 italic text-sm">Please unlock contact details to see full bio.</p>
                                            ) : (
                                                <p className="text-slate-400 italic text-sm">Upgrade to premium to read full bio.</p>
                                            )}
                                        </div>
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
                                isProfileComplete={!!currentUser?.isProfileCompleted}
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
