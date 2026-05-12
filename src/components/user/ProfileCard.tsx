

import { Lock, Smartphone, Mail, MapPin, Heart, FileText, Maximize2 } from 'lucide-react'
import { Link } from 'react-router-dom'
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
        denomination?: string | null
        currentResidence?: string | null
        dob?: Date | null
        occupation?: string | null
        qualification?: string | null
        location?: string | null
        thalakkuriUrl?: string | null
    }
    mobile: string
    email: string | null
    receivedInterests?: { status: string }[]
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

    const hasSentInterest = profile.receivedInterests && profile.receivedInterests.some(i => i.status === 'PENDING');

    return (
        <div
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full"
        >
            {/* Clickable Area for Profile Details */}
            <Link to={`/profile/${profile.id}`} className="block relative">
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

                    {/* {!isPaid && (
                        <div className="absolute inset-0 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <p className="px-4 py-2 bg-black/60 text-white rounded-full text-xs font-semibold backdrop-blur-md border border-white/20">
                                Upgrade to View Full Photo
                            </p>
                        </div>
                    )} */}
                </div>

                <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-full">
                            <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                                {profile.name}, <AgeDisplay dob={profile.profile.dob} />
                            </h3>
                            <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mt-1 truncate">
                                {profile.profile.qualification || 'Qualification N/A'}
                                {profile.profile.occupation ? ` • ${profile.profile.occupation}` : ''}
                            </p>
                        </div>
                        <Heart size={18} className={`${hasSentInterest ? 'fill-rose-500 text-rose-500' : 'text-slate-300 group-hover:text-rose-400'} transition-colors flex-shrink-0 ml-2`} />
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-slate-600 font-medium">
                            {profile.profile.religion || 'Religion N/A'} • {(profile.profile.religion === 'Muslim' || profile.profile.religion === 'Christian') 
                                ? (profile.profile.denomination || 'Denomination N/A') 
                                : (profile.profile.caste || 'Caste N/A')}
                        </p>
                        {profile.profile.religion === 'Hindu' && (profile.profile.dosham || profile.profile.birthStar) && (
                            <p className="text-[11px] text-slate-400 font-medium italic">
                                {profile.profile.dosham ? `Dosham: ${profile.profile.dosham}` : ''}
                                {profile.profile.dosham && profile.profile.birthStar ? ' • ' : ''}
                                {profile.profile.birthStar ? `Star: ${profile.profile.birthStar}` : ''}
                            </p>
                        )}
                        {profile.profile.religion?.toLowerCase() === 'hindu' && profile.profile.thalakkuriUrl && (
                            <div 
                                className="relative w-16 h-20 mt-2 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden cursor-pointer group"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(profile.profile.thalakkuriUrl!, '_blank');
                                }}
                            >
                                {profile.profile.thalakkuriUrl.includes('application/pdf') || profile.profile.thalakkuriUrl.includes('data:application/pdf') ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-1">
                                        <FileText size={16} className="text-rose-500 mb-0.5" />
                                        <span className="text-[7px] font-bold text-slate-500 uppercase">PDF</span>
                                    </div>
                                ) : (
                                    <img 
                                        src={profile.profile.thalakkuriUrl} 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                                        alt="Thalakkuri" 
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 size={12} className="text-white" />
                                </div>
                            </div>
                        )}
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
                    {true ? ( // TEMPORARY BYPASS
                        <div className="text-center">
                            <Link to={`/profile/${profile.id}`} className="inline-block px-6 py-2 bg-rose-50 text-rose-600 text-sm font-bold rounded-full hover:bg-rose-100 transition-colors">
                                View Full Profile
                            </Link>
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
                                        to={`/pricing?interested_in=${encodeURIComponent(profile.name)}`}
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
