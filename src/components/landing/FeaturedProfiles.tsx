'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import AgeDisplay from '../ui/AgeDisplay'

type Profile = {
    id: string
    name: string
    gender: string
    country: string
    profile: {
        photoUrl?: string | null
        dob?: Date | null
        religion?: string | null
        location?: string | null
        qualification?: string | null
    }
}

export default function FeaturedProfiles({
    title,
    subtitle,
    profiles,
    gender,
    userGender
}: {
    title: string,
    subtitle: string,
    profiles: any[],
    gender: 'MALE' | 'FEMALE',
    userGender?: string
}) {
    // Determine the target gender for the "View All" link
    // Rule: Logged-in users always go to the opposite of THEIR gender.
    // Guests keep the gender from the prop.
    const targetGender = userGender
        ? (userGender === 'MALE' ? 'FEMALE' : 'MALE')
        : gender;
    return (
        <section className="py-24 px-4 bg-white relative overflow-hidden">
            {/* Decorative background bloom */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">{title}</h2>
                        <p className="text-slate-500 text-lg font-light">{subtitle}</p>
                    </div>
                    <Link
                        href={`/matches?gender=${targetGender}`}
                        className="text-rose-600 font-bold hover:text-rose-700 transition-colors flex items-center gap-2 group"
                    >
                        View All {gender === 'FEMALE' ? 'Brides' : 'Grooms'}
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {profiles.map((user, index) => {


                        const locationText = user.country === 'INDIA'
                            ? (user.profile?.location || 'Location N/A')
                            : (user.country === 'CANADA' ? 'Canada' : user.country)

                        return (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                            >
                                <Link href={`/matches?gender=${targetGender}`}>
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                                        {user.profile?.photoUrl ? (
                                            <img
                                                src={user.profile.photoUrl}
                                                alt={user.name}
                                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                <User size={64} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <p className="text-white font-serif text-2xl font-bold">{user.name}</p>
                                                <p className="text-rose-200 text-sm font-medium">{locationText}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                                            {user.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <span className="font-semibold text-rose-600">
                                                <AgeDisplay dob={user.profile?.dob} />
                                            </span>
                                            <span>•</span>
                                            <span>{user.profile?.religion || 'Religion N/A'}</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">
                                            {user.profile?.qualification || 'Qualification N/A'}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
