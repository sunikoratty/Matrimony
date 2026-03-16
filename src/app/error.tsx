'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCcw, Home, Heart } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service if needed
        console.error('Application Crash:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 flex items-center justify-center p-6 sm:p-12">
            <div className="max-w-2xl w-full text-center space-y-12">
                {/* Visual Section */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    <div className="relative z-10 w-64 h-64 mx-auto rounded-full overflow-hidden shadow-2xl shadow-rose-200 border-8 border-white">
                        <img 
                            src="/images/heart-repair.png" 
                            alt="Heart Repairing" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Decorative Elements */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl -z-10" 
                    />
                </motion.div>

                {/* Text Section */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 leading-tight">
                            Mending a <span className="text-rose-600">Broken Heart</span>...
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-600 max-w-lg mx-auto mt-6 font-light leading-relaxed">
                            We've encountered a small heartbeat skip. Our team of specialists is already on it. Please give it another try.
                        </p>
                    </motion.div>
                </div>

                {/* Actions Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <button
                        onClick={reset}
                        className="group flex items-center gap-3 px-10 py-5 bg-rose-600 text-white rounded-full font-bold shadow-xl shadow-rose-200 hover:bg-rose-700 hover:scale-105 transition-all w-full sm:w-auto justify-center"
                    >
                        <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="uppercase tracking-widest text-sm">Try Again</span>
                    </button>
                    
                    <Link
                        href="/"
                        className="group flex items-center gap-3 px-10 py-5 bg-white text-slate-700 border border-slate-100 rounded-full font-bold shadow-lg hover:bg-slate-50 transition-all w-full sm:w-auto justify-center"
                    >
                        <Home size={20} className="text-rose-500" />
                        <span className="uppercase tracking-widest text-sm text-slate-600">Go Home</span>
                    </Link>
                </motion.div>

                {/* Footer Quote */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1 }}
                    className="flex items-center justify-center gap-2 text-slate-400 text-sm italic font-light"
                >
                    <Heart size={14} className="fill-slate-400" />
                    <span>"The best thing to hold onto in life is each other."</span>
                </motion.div>
            </div>
        </div>
    )
}
