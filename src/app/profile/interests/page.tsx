
import { getReceivedInterests, getInterestUpdates, respondToInterest } from '@/lib/interest-actions'
import { getProfile } from '@/lib/user-actions'
import Header from '@/components/landing/Header'
import Link from 'next/link'
import { Check, X, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import MarkSeenTrigger from '@/components/user/MarkSeenTrigger'

export const metadata = {
    title: 'Interests - True Match',
    description: 'View and manage your interest requests.'
}

export default async function InterestsPage() {
    const user = await getProfile()
    if (!user) redirect('/login')

    const [receivedInterests, sentUpdates] = await Promise.all([
        getReceivedInterests(),
        getInterestUpdates()
    ])

    return (
        <div className="min-h-screen bg-slate-50">
            <Header user={user ? JSON.parse(JSON.stringify(user)) : null} />
            <MarkSeenTrigger />

            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Back Button */}
                    <Link
                        href="/profile/view"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors font-medium text-sm mb-4"
                    >
                        <ArrowLeft size={16} />
                        Back to Profile
                    </Link>

                    {/* Received Requests Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Received Requests</h2>
                            {receivedInterests.length > 0 && (
                                <span className="bg-rose-100 text-rose-700 font-semibold px-3 py-1 rounded-full text-sm">
                                    {receivedInterests.length} New
                                </span>
                            )}
                        </div>

                        {receivedInterests.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
                                <p className="text-slate-500">No pending received requests.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {receivedInterests.map((interest) => (
                                    <div key={interest.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center">
                                        <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                            {interest.sender.profile?.photoUrl ? (
                                                <img
                                                    src={interest.sender.profile.photoUrl}
                                                    alt={interest.sender.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-2xl">
                                                    {interest.sender.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="font-bold text-lg text-slate-900 mb-1">{interest.sender.name}</h3>
                                            <p className="text-slate-500 text-sm mb-3">
                                                {interest.sender.profile?.currentResidence || 'Location not specified'}
                                            </p>
                                            <Link
                                                href={`/profile/${interest.sender.id}`}
                                                className="text-rose-600 font-semibold text-sm hover:underline"
                                            >
                                                View Full Profile
                                            </Link>
                                        </div>
                                        <div className="flex gap-3">
                                            <form action={async () => {
                                                'use server'
                                                await respondToInterest(interest.id, 'ACCEPTED')
                                            }}>
                                                <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors shadow-sm shadow-green-200">
                                                    <Check size={18} /> Accept
                                                </button>
                                            </form>
                                            <form action={async () => {
                                                'use server'
                                                await respondToInterest(interest.id, 'REJECTED')
                                            }}>
                                                <button className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-50 transition-colors">
                                                    <X size={18} /> Reject
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Sent Updates Section */}
                    {sentUpdates.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">My Requests Status</h2>
                            </div>
                            <div className="grid gap-4">
                                {sentUpdates.map((interest) => (
                                    <div key={interest.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center">
                                        <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 opacity-80">
                                            {interest.target.profile?.photoUrl ? (
                                                <img
                                                    src={interest.target.profile.photoUrl}
                                                    alt={interest.target.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
                                                    {interest.target.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg text-slate-900">{interest.target.name}</h3>
                                                {interest.status === 'ACCEPTED' ? (
                                                    <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                        <CheckCircle size={12} /> Accepted
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                                        <XCircle size={12} /> Rejected
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-sm">
                                                {interest.status === 'ACCEPTED'
                                                    ? 'accepted your interest request!'
                                                    : 'declined your interest request.'}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/profile/${interest.target.id}`}
                                            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </div>
        </div>
    )
}
