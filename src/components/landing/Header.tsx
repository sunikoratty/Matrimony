'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { signOut } from '@/lib/user-actions'

import { User as UserIcon } from 'lucide-react'

export default function Header({ user }: { user?: any }) {
    const isLoggedIn = !!user

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                        ❤️Match
                    </span>
                </Link>

                <div className="flex items-center gap-4 sm:gap-6">
                    {isLoggedIn ? (
                        <>
                            <Link href="/profile/interests" className="relative p-2 text-slate-400 hover:text-rose-600 transition-colors group" title="Interest Requests">
                                <Heart size={24} className="group-hover:fill-rose-50" />
                                {(user._count?.receivedInterests > 0 || user._count?.sentInterests > 0) && (
                                    <span className="absolute top-0 right-0 h-5 w-5 bg-rose-600 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                                        {(user._count?.receivedInterests || 0) + (user._count?.sentInterests || 0)}
                                    </span>
                                )}
                            </Link>
                            <Link href="/profile/view" className="flex items-center gap-2 group">
                                <div className="h-10 w-10 rounded-full border-2 border-rose-100 overflow-hidden bg-rose-50 flex items-center justify-center group-hover:border-rose-300 transition-all">
                                    {user.profile?.photoUrl ? (
                                        <img
                                            src={user.profile.photoUrl}
                                            alt={user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-rose-400">
                                            {user.gender === 'FEMALE' ? (
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                                                    <path d="M12 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                                                </svg>
                                            ) : (
                                                <UserIcon size={24} />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <span className="hidden sm:block font-medium text-slate-700 group-hover:text-rose-600 transition-colors">
                                    {user.name.split(' ')[0]}
                                </span>
                            </Link>
                            <button
                                onClick={async () => {
                                    await signOut()
                                }}
                                className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-all text-sm"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="font-medium hover:text-rose-600 transition-colors uppercase text-sm tracking-wider">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-6 py-2 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.header>
    )
}
