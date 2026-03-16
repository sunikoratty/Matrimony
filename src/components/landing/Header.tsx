'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { signOut } from '@/lib/user-actions'
import { useState, useRef, useEffect } from 'react'
import { Heart, User as UserIcon, ChevronDown, LogOut } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function Header({ user }: { user?: any }) {
    const { showToast } = useToast()
    const isLoggedIn = !!user
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-1.5 group">
                    <Heart size={24} className="text-rose-600 fill-rose-600" />
                    <span className="text-2xl font-serif font-bold bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
                        True Match
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

                            {/* Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 group focus:outline-none"
                                >
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
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-rose-50 overflow-hidden py-2"
                                    >
                                        <Link
                                            href="/profile/setup"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Update Profile
                                        </Link>

                                        <div className="h-px bg-rose-50 my-1" />

                                        <button
                                            onClick={async () => {
                                                setIsDropdownOpen(false)
                                                await signOut()
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                                        >
                                            <LogOut size={18} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4 sm:gap-6">
                            <button 
                                onClick={() => showToast('You are already logged in. Kindly logout to perform this operation.', 'error')}
                                className="font-medium hover:text-rose-600 transition-colors uppercase text-sm tracking-wider"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => showToast('You are already logged in. Kindly logout to perform this operation.', 'error')}
                                className="px-6 py-2 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                            >
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.header>
    )
}
