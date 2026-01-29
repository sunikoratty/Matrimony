'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { signOut } from '@/lib/user-actions'

export default function Header({ isLoggedIn }: { isLoggedIn?: boolean }) {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
                    <Heart className="text-rose-600 fill-rose-600 w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                        Kalyanam
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    {isLoggedIn ? (
                        <>
                            <Link href="/profile/view" className="font-medium hover:text-rose-600 transition-colors">
                                Profile
                            </Link>
                            <button
                                onClick={async () => {
                                    await signOut()
                                }}
                                className="px-5 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
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
