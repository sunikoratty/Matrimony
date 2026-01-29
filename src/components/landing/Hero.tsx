'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-20">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero_symbolic.png"
                    alt="Traditional Indian Matrimony"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Advanced Gradient Overlay for better legibility and aesthetics */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
                <div className="absolute inset-0 bg-rose-900/10 mix-blend-overlay" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <div>
                        <motion.span
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-6 py-2 rounded-full bg-rose-600/30 text-rose-100 backdrop-blur-xl font-semibold text-sm border border-white/20 uppercase tracking-[0.2em] mb-6"
                        >
                            #1 Trusted Matrimony Platform
                        </motion.span>
                        <h1 className="text-6xl lg:text-[10rem] font-bold text-white leading-[0.9] font-serif drop-shadow-2xl">
                            Find Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                                Soulmate
                            </span>
                        </h1>
                    </div>

                    <p className="text-xl lg:text-2xl text-rose-50/90 max-w-3xl leading-relaxed mx-auto font-light drop-shadow-lg">
                        Where tradition meets modern matching. <br className="hidden md:block" />
                        Connecting verified hearts with elegance and trust.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 pt-10 justify-center items-center">
                        <Link
                            href="/register"
                            className="group relative px-12 py-5 bg-rose-600 text-white rounded-full font-bold shadow-2xl hover:bg-rose-700 transition-all overflow-hidden"
                        >
                            <span className="relative z-10">Join Free Today</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Link>
                        <Link
                            href="/login"
                            className="px-12 py-5 bg-white/5 backdrop-blur-xl text-white border-2 border-white/40 rounded-full font-bold hover:bg-white/10 transition-all hover:border-white/60"
                        >
                            Member Login
                        </Link>
                    </div>

                    {/* Simple Scroll Indicator */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="pt-16 hidden lg:block"
                    >
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto flex justify-center p-1">
                            <div className="w-1 h-2 bg-white/60 rounded-full" />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
