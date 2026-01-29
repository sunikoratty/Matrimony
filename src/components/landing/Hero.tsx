'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
    return (
        <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/images/hero_symbolic.png"
                    alt="Traditional Hearts"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-rose-600/20 text-rose-100 backdrop-blur-md font-medium text-sm border border-rose-400/30">
                        #1 Trusted Matrimony App
                    </span>
                    <h1 className="text-5xl lg:text-8xl font-bold text-white leading-tight font-serif">
                        Find Your <br />
                        <span className="text-rose-400">Soulmate</span>
                    </h1>
                    <p className="text-xl text-rose-50 max-w-2xl leading-relaxed mx-auto">
                        Experience the perfect blend of tradition and technology.
                        Connecting hearts from Kerala to Canada with trust and elegance.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 pt-8 justify-center">
                        <Link
                            href="/register"
                            className="px-10 py-4 bg-rose-600 text-white rounded-full font-bold shadow-2xl hover:bg-rose-700 transition-all transform hover:scale-105"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            href="/login"
                            className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-full font-bold hover:bg-white/20 transition-all"
                        >
                            Member Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
