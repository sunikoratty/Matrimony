import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Maximize2 } from 'lucide-react'
import Header from '@/components/landing/Header'
import InterestButton from '@/components/user/InterestButton'
import MembershipSection from '@/components/user/MembershipSection'
import { getProfileById, getProfile, unlockContact } from '@/lib/user-actions'
import { getInterestStatus } from '@/lib/interest-actions'
import CircularLoader from '@/components/ui/CircularLoader'

export default function ProfileByIdPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [viewedUser, setViewedUser] = useState<any>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [interestStatus, setInterestStatus] = useState<any>(null)
    const [isUnlocked, setIsUnlocked] = useState(false)
    const guestCtaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return
            setLoading(true)
            try {
                const [vUser, cUser] = await Promise.all([
                    getProfileById(id),
                    getProfile()
                ])

                if (!vUser) {
                    navigate('/matches')
                    return
                }

                setViewedUser(vUser)
                setCurrentUser(cUser)

                if (cUser) {
                    const response = await getInterestStatus(id)
                    setInterestStatus(response?.status || null)
                    setIsUnlocked(cUser.id === vUser.id || !!cUser) // TEMPORARY: Always unlock for logged-in users
                }
            } catch (error) {
                console.error("Failed to fetch profile", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id, navigate])

    const handleUnlock = async () => {
        if (!viewedUser) return
        
        if (!isLoggedIn) {
            guestCtaRef.current?.scrollIntoView({ behavior: 'smooth' })
            return
        }

        const result = await unlockContact(viewedUser.id)
        if ('success' in result) {
            setIsUnlocked(true)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CircularLoader size="lg" />
            </div>
        )
    }

    if (!viewedUser) return null

    const age = viewedUser.profile?.dob
        ? new Date().getFullYear() - new Date(viewedUser.profile.dob).getFullYear()
        : null

    const isLoggedIn = !!currentUser
    const isOwnProfile = currentUser?.id === viewedUser.id
    const isPaid = true // TEMPORARY BYPASS

    return (
        <div className="min-h-screen">
            <Header user={currentUser} />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <Link
                            to={isLoggedIn ? "/profile/view" : "/"}
                            className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors font-medium text-sm group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            {isLoggedIn ? "Back to Profiles" : "Back to Home"}
                        </Link>
                    </div>

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
                                    <div className="flex gap-3">
                                        {isOwnProfile ? (
                                            <Link to="/profile/setup" className="w-full sm:w-auto px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium inline-block">
                                                Edit Profile
                                            </Link>
                                        ) : isLoggedIn && (
                                            <InterestButton
                                                targetId={viewedUser.id}
                                                initialStatus={interestStatus}
                                                isProfileCompleted={!!currentUser.isProfileCompleted}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Contact Information</p>
                                        <div className="space-y-2">
                                            {isUnlocked ? (
                                                <>
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">Mobile</p>
                                                        <p className="text-xl font-bold text-slate-900 tracking-wide">{viewedUser.mobile}</p>
                                                    </div>
                                                    <div className="mt-4">
                                                        <p className="text-xs text-slate-400 mb-1">Email</p>
                                                        <p className="text-base font-semibold text-rose-600">{viewedUser.email || 'Email not set'}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="mt-2">
                                                    {isPaid ? (
                                                        <button
                                                            onClick={handleUnlock}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-all"
                                                        >
                                                            Unlock Contact Details
                                                        </button>
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
                                                    {viewedUser.profile?.thalakkuriUrl && (
                                                        <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
                                                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Thalakkuri / Horoscope</p>
                                                            <div 
                                                                className="relative w-32 h-40 bg-slate-100 rounded-xl border-2 border-slate-200 overflow-hidden cursor-pointer group"
                                                                onClick={() => window.open(viewedUser.profile.thalakkuriUrl, '_blank')}
                                                            >
                                                                {viewedUser.profile.thalakkuriUrl.includes('application/pdf') || viewedUser.profile.thalakkuriUrl.endsWith('.pdf') ? (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                                                        <FileText size={32} className="text-rose-500 mb-2" />
                                                                        <span className="text-[10px] font-bold text-slate-500 uppercase">PDF Document</span>
                                                                    </div>
                                                                ) : (
                                                                    <img 
                                                                        src={viewedUser.profile.thalakkuriUrl} 
                                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                                                        alt="Thalakkuri" 
                                                                    />
                                                                )}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <Maximize2 size={24} className="text-white" />
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 mt-2 italic font-medium">Click to view full document</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {(viewedUser.profile?.religion === 'Christian' || viewedUser.profile?.religion === 'Muslim') && (
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
                        <div ref={guestCtaRef} className="mt-12 bg-rose-50 p-10 rounded-3xl border border-rose-100 text-center shadow-sm">
                            <h2 className="text-2xl font-serif font-bold text-rose-900 mb-3">Interested in {viewedUser.name}?</h2>
                            <p className="text-rose-700 mb-8 max-w-md mx-auto">"Join our community today to connect with your perfect match and view full profile details."</p>
                            <div className="flex justify-center gap-4">
                                <Link to="/login" className="px-8 py-3 bg-white text-rose-600 rounded-xl font-bold border border-rose-200 hover:bg-rose-50 transition-all">
                                    Login
                                </Link>
                                <Link to="/register" className="px-8 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg transition-all hover:-translate-y-0.5">
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
