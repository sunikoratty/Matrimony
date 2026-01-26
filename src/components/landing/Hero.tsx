'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Shield, Users, HeartHandshake } from 'lucide-react'

const cards = [
    { id: 1, title: 'Trusted Profiles', icon: <Shield className="text-emerald-500" />, desc: '100% Verified Users' },
    { id: 2, title: 'Perfect Match', icon: <HeartHandshake className="text-rose-500" />, desc: 'AI Powered Matching' },
    { id: 3, title: 'India & Canada', icon: <Users className="text-blue-500" />, desc: 'Cross-border Connections' },
]

export default function Hero() {
    return (
        <div className="relative min-h-screen pt-20 pb-12 overflow-hidden bg-orange-50/30">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-100/20 blur-3xl -z-10 rounded-l-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col lg:flex-row items-center gap-12 mt-12">

                {/* Text Section */}
                <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 font-medium text-sm mb-4 border border-rose-200">
                            #1 Trusted Matrimony App
                        </span>
                        <h1 className="text-4xl lg:text-7xl font-bold text-slate-900 leading-tight font-serif">
                            Find Your Soulmate <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">
                                With Tradition
                            </span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-xl leading-relaxed mx-auto lg:mx-0">
                            Experience the perfect blend of tradition and technology.
                            Connecting hearts from Kerala to Canada with trust and elegance.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start"
                    >
                        <button className="px-8 py-4 bg-rose-600 text-white rounded-full font-semibold shadow-xl shadow-rose-200 hover:bg-rose-700 hover:shadow-rose-300 transition-all transform hover:-translate-y-1 w-full sm:w-auto">
                            Find Your Match
                        </button>
                        <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold shadow-sm hover:bg-slate-50 transition-all w-full sm:w-auto">
                            View Success Stories
                        </button>
                    </motion.div>

                    {/* Draggable Cards Area */}
                    <div className="pt-12 flex gap-4 justify-center lg:justify-start flex-wrap hidden sm:flex">
                        {/* Abstract placement of features */}
                        {cards.slice(0, 2).map((card, i) => (
                            <motion.div
                                key={card.id}
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? -2 : 2 }}
                                dragElastic={0.2}
                                className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100 w-48 cursor-grab active:cursor-grabbing"
                            >
                                <div className="mb-3 p-2 bg-slate-50 rounded-lg inline-block">{card.icon}</div>
                                <h3 className="font-bold text-slate-800">{card.title}</h3>
                                <p className="text-xs text-slate-500">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Hero Image Section */}
                <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        {/* Main Image Frame (Arch/Cultural Shape) */}
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                            <Image
                                src="/images/hero_symbolic.png"
                                alt="Symbolic Matrimony Hearts"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Floating Elements (Thali or Decor) */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-yellow-200"
                        >
                            <span className="text-2xl">✨</span>
                        </motion.div>
                    </motion.div>

                    {/* Decorative Pattern Behind */}
                    <div className="absolute top-10 left-10 w-full h-full border-2 border-rose-200 rounded-[3rem] -z-10 translate-x-4 translate-y-4" />
                </div>

            </div>
        </div>
    )
}
