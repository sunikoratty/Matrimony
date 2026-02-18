'use client'

import { Lock, Smartphone, Mail, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import AgeDisplay from '../ui/AgeDisplay'

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
    const locationText = profile.country === 'INDIA'
        ? (profile.profile.location || 'Location N/A')
        : (profile.country === 'CANADA' ? 'Canada' : profile.country)

    return (
        <div
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full"
        >
            {/* Clickable Area for Profile Details */}
            <Link href={`/profile/${profile.id}`} className="block relative">
                {/* Photo Area */}
                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                    {profile.profile.photoUrl ? (
                        <img
                            src={profile.profile.photoUrl}
                            alt={profile.name}
                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-rose-50 text-rose-300 font-serif font-bold text-5xl">
                            {profile.name.charAt(0)}
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {!isPaid && (
                        <div className="absolute inset-0 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <p className="px-4 py-2 bg-black/60 text-white rounded-full text-xs font-semibold backdrop-blur-md border border-white/20">
                                Upgrade to View Full Photo
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-full">
                            <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                                {profile.name}, <AgeDisplay dob={profile.profile.dob} />
                            </h3>
                            <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mt-1">
                                {profile.profile.qualification || 'Qualification N/A'}
                            </p>
                        </div>
                        <ExternalLink size={16} className="text-slate-300 group-hover:text-rose-400 transition-colors flex-shrink-0 ml-2" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-slate-600 font-medium">
                            {profile.profile.religion || 'Religion N/A'} • {profile.profile.caste || 'Caste N/A'}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin size={14} />
                            {locationText}
                        </p>
                    </div>
                </div>
            </Link>

            {/* Contact Reveal Area - Persistent at the bottom */}
            <div className="px-5 pb-5 pt-0 mt-auto">
                <div className="border-t border-slate-100 pt-4">
                    {isUnlocked ? (
                        <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2">
                                <Smartphone size={14} className="text-rose-600" />
                                <span className="font-medium">{profile.mobile}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-rose-600" />
                                <span className="truncate">{profile.email || 'No Email'}</span>
                            </div>
                            {profile.profile.occupation && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-slate-400" />
                                    <span>{profile.profile.occupation}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`${isPaid ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-50 border-slate-100'} p-4 rounded-xl border text-center transition-colors`}>
                            {isPaid ? (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onUnlock?.();
                                        }}
                                        className="w-full py-2.5 bg-rose-600 text-white text-sm font-bold rounded-lg hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 mb-2"
                                    >
                                        Unlock Contact Info
                                    </button>
                                    <p className="text-[10px] text-rose-600 font-medium uppercase tracking-wider">Premium Member Benefit</p>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex justify-center text-slate-400">
                                        <Lock size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">Contact Locked</p>
                                    <Link
                                        href={`/pricing?interested_in=${encodeURIComponent(profile.name)}`}
                                        className="text-[11px] text-rose-600 hover:underline font-semibold block"
                                    >
                                        Upgrade to Unlock
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
