'use client'

import { Lock, Smartphone, Mail, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'

type Profile = {
    id: string
    name: string
    country: string
    profile: {
        photoUrl?: string | null
        bio?: string | null
        religion?: string | null
        caste?: string | null
        currentResidence?: string | null
        dob?: Date | null
        occupation?: string | null
        qualification?: string | null
        location?: string | null
    }
    mobile: string
    email: string | null
}

export default function ProfileCard({
    profile,
    isPaid,
    isUnlocked = false,
    onUnlock
}: {
    profile: Profile,
    isPaid: boolean,
    isUnlocked?: boolean,
    onUnlock?: () => void
}) {
    // console.log(`[ProfileCard] Profile: ${profile.name}, isUnlocked: ${isUnlocked}`)
    const age = profile.profile.dob
        ? new Date().getFullYear() - new Date(profile.profile.dob).getFullYear()
        : 'N/A'

    const locationText = profile.country === 'INDIA'
        ? (profile.profile.location || 'Location N/A')
        : (profile.country === 'CANADA' ? 'Canada' : profile.country)

    return (
        <div
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow relative"
        >
            {/* Clickable Area for Profile Details */}
            <Link href={`/profile/${profile.id}`} className="block">
                {/* Photo Area */}
                <div className="h-64 bg-slate-100 relative overflow-hidden group">
                    {profile.profile.photoUrl ? (
                        <img src={profile.profile.photoUrl} alt={profile.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-rose-50 text-rose-300 font-bold text-4xl">
                            {profile.name.charAt(0)}
                        </div>
                    )}

                    {!isPaid && (
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="px-4 py-2 bg-black/60 text-white rounded-full text-xs font-semibold">
                                Upgrade to View Full Photo
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{profile.name}, {age}</h3>
                            <p className="text-xs font-semibold text-rose-600 mb-2 uppercase tracking-wider">{profile.profile.qualification || 'Qualification N/A'}</p>
                        </div>
                        <ExternalLink size={16} className="text-slate-300 mt-1" />
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{profile.profile.religion || 'Religion N/A'} • {locationText}</p>
                </div>
            </Link>

            {/* Contact Reveal Area - Persistent at the bottom */}
            <div className="px-5 pb-5 pt-0">
                {isUnlocked ? (
                    <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Smartphone size={14} className="text-green-600" />
                            <span>{profile.mobile}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-blue-600" />
                            <span>{profile.email || 'No Email'}</span>
                        </div>
                        {profile.profile.occupation && (
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-slate-400" />
                                <span>{profile.profile.occupation}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`${isPaid ? 'bg-rose-50 border-rose-100' : 'bg-orange-50 border-orange-100'} p-4 rounded-lg border text-center transition-colors`}>
                        {isPaid ? (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onUnlock?.();
                                    }}
                                    className="w-full py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-all shadow-sm shadow-rose-100 mb-2"
                                >
                                    Unlock Now
                                </button>
                                <p className="text-[10px] text-rose-600 font-medium">Click to view contact details</p>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-center mb-2 text-orange-400">
                                    <Lock size={18} />
                                </div>
                                <p className="text-xs font-bold text-orange-800 mb-1">Contact Locked</p>
                                <p className="text-[10px] text-orange-600 font-medium italic">Premium Required</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
