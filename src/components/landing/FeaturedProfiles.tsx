'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'

type Profile = {
    id: string
    name: string
    gender: string
    profile: {
        photoUrl?: string | null
        dob?: Date | null
    }
}

export default function FeaturedProfiles({
    title,
    subtitle,
    profiles,
    gender
}: {
    title: string,
    subtitle: string,
    profiles: any[],
    gender: 'MALE' | 'FEMALE'
}) {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{title}</h2>
                        <p className="text-slate-500">{subtitle}</p>
                    </div>
                    <Link
                        href={`/matches?gender=${gender}`}
                        className="text-rose-600 font-semibold hover:text-rose-700 transition-colors flex items-center gap-1"
                    >
                        View All {gender === 'FEMALE' ? 'Brides' : 'Grooms'} &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {profiles.map((user, index) => {
                        const age = user.profile?.dob
                            ? new Date().getFullYear() - new Date(user.profile.dob).getFullYear()
                            : null

                        return (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                            >
                                <Link href={`/matches?gender=${gender}`}>
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:shadow-xl transition-all">
                                        {user.profile?.photoUrl ? (
                                            <img
                                                src={user.profile.photoUrl}
                                                alt={user.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                <User size={64} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                                        {user.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm">
                                        {age ? `${age} yrs` : 'Age not set'}
                                    </p>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
