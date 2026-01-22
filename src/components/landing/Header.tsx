'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

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

                {!isLoggedIn && (
                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link href="/login" className="text-sm sm:text-base text-slate-600 hover:text-rose-600 font-medium transition-colors">
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base bg-rose-600 hover:bg-rose-700 text-white rounded-full font-medium transition-all shadow-lg shadow-rose-200"
                        >
                            Register Free
                        </Link>
                    </div>
                )}
                {isLoggedIn && (
                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link href="/profile/view" className="text-sm sm:text-base text-slate-600 hover:text-rose-600 font-medium transition-colors">
                            My Profile
                        </Link>
                        <form action={async () => {
                            // Dynamically import to avoid server/client boundary issues if simple action fails
                            const { signOut } = await import('@/lib/auth-actions')
                            await signOut()
                        }}>
                            <button className="text-sm px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </motion.header>
    )
}
