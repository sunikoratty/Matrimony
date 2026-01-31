'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Hero() {
    const router = useRouter()
    const [searchData, setSearchData] = useState({
        age: '',
        religion: '',
        caste: '',
        dosham: '',
        denomination: ''
    })

    const handleSearch = () => {
        const params = new URLSearchParams()
        params.set('mode', 'recommended') // Default search behavior
        if (searchData.age) params.set('age', searchData.age)
        if (searchData.religion) params.set('religion', searchData.religion)
        if (searchData.caste) params.set('caste', searchData.caste)
        if (searchData.dosham) params.set('dosham', searchData.dosham)
        if (searchData.denomination) params.set('denomination', searchData.denomination)

        router.push(`/matches?${params.toString()}`)
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-20">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/KeralaCouple.png"
                    alt="Traditional Indian Matrimony"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Clearer view - removed overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
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

                    {/* Search Section */}
                    <div className="mt-16 max-w-5xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-2xl p-4 sm:p-6 rounded-3xl border border-white/20 shadow-2xl">
                            <h3 className="text-white text-lg font-bold mb-4 flex items-center justify-center gap-2">
                                <Search className="w-5 h-5 text-rose-400" />
                                Search Profile
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                {/* Age Filter */}
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-bold text-rose-200 uppercase tracking-widest pl-1">Age Range</label>
                                    <select
                                        value={searchData.age}
                                        onChange={(e) => setSearchData({ ...searchData, age: e.target.value })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-slate-900">Any Age</option>
                                        <option value="18-25" className="bg-slate-900">18 - 25</option>
                                        <option value="26-30" className="bg-slate-900">26 - 30</option>
                                        <option value="31-35" className="bg-slate-900">31 - 35</option>
                                        <option value="36-40" className="bg-slate-900">36 - 40</option>
                                        <option value="41-50" className="bg-slate-900">41 - 50</option>
                                        <option value="51-70" className="bg-slate-900">51 - 70</option>
                                    </select>
                                </div>

                                {/* Religion Filter */}
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-bold text-rose-200 uppercase tracking-widest pl-1">Religion</label>
                                    <select
                                        value={searchData.religion}
                                        onChange={(e) => setSearchData({ ...searchData, religion: e.target.value, caste: '', dosham: '', denomination: '' })}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-slate-900">Any Religion</option>
                                        <option value="Hindu" className="bg-slate-900">Hindu</option>
                                        <option value="Christian" className="bg-slate-900">Christian</option>
                                        <option value="Muslim" className="bg-slate-900">Muslim</option>
                                        <option value="Sikh" className="bg-slate-900">Sikh</option>
                                        <option value="Other" className="bg-slate-900">Other</option>
                                    </select>
                                </div>

                                {/* Conditional Hindu Fields */}
                                {searchData.religion === 'Hindu' && (
                                    <>
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-xs font-bold text-rose-200 uppercase tracking-widest pl-1">Caste</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Nair, Ezhava"
                                                value={searchData.caste}
                                                onChange={(e) => setSearchData({ ...searchData, caste: e.target.value })}
                                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-white/30"
                                            />
                                        </div>
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-xs font-bold text-rose-200 uppercase tracking-widest pl-1">Dosham</label>
                                            <select
                                                value={searchData.dosham}
                                                onChange={(e) => setSearchData({ ...searchData, dosham: e.target.value })}
                                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-slate-900">Any</option>
                                                <option value="No" className="bg-slate-900">No Dosham</option>
                                                <option value="Yes" className="bg-slate-900">Has Dosham</option>
                                                <option value="Don't Know" className="bg-slate-900">Don't Know</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Conditional Christian Fields */}
                                {searchData.religion === 'Christian' && (
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-xs font-bold text-rose-200 uppercase tracking-widest pl-1">Denomination</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Catholic, Pentecostal"
                                            value={searchData.denomination}
                                            onChange={(e) => setSearchData({ ...searchData, denomination: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-white/30"
                                        />
                                    </div>
                                )}

                                {/* Search Button */}
                                <div className={searchData.religion === 'Hindu' ? "lg:col-span-4 mt-2" : searchData.religion === 'Christian' ? "" : "lg:col-span-2"}>
                                    <button
                                        onClick={handleSearch}
                                        className="w-full h-[50px] bg-gradient-to-r from-rose-600 to-orange-500 text-white rounded-xl font-bold shadow-xl hover:shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Search size={18} />
                                        Find Your Soulmate
                                    </button>
                                </div>
                            </div>
                        </div>
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
