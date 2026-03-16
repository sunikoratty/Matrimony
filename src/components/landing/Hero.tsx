'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

export default function Hero({ user }: { user?: any }) {
    const { showToast } = useToast()
    const router = useRouter()
    const [searchData, setSearchData] = useState({
        gender: 'FEMALE',
        age: '',
        religion: '',
        customReligion: '',
        caste: '',
        dosham: '',
        denomination: ''
    })

    const handleSearch = () => {
        const params = new URLSearchParams()
        params.set('mode', 'recommended') // Default search behavior
        if (searchData.gender) params.set('gender', searchData.gender)
        if (searchData.age) params.set('age', searchData.age)
        if (searchData.religion) {
            params.set('religion', searchData.religion === 'Others' ? searchData.customReligion.trim() : searchData.religion)
        }
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
                    className="object-cover object-top" // Prioritize faces
                    priority
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
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
                            className="inline-block px-6 py-2 rounded-full text-white bg-white/10 backdrop-blur-xl font-medium text-sm border border-white/20 uppercase tracking-[0.2em] mb-6"
                        >
                            #1 Trusted Matrimony Platform
                        </motion.span>
                        <h1 className="text-6xl lg:text-[10rem] font-bold text-white leading-[0.9] font-serif drop-shadow-2xl">
                            Find Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                                Soulmate
                            </span>
                        </h1>
                    </div>

                    <p className="text-xl lg:text-2xl text-white/90 max-w-3xl leading-relaxed mx-auto font-light drop-shadow-xl font-serif italic">
                        Where tradition meets modern matching. <br className="hidden md:block" />
                        Connecting verified hearts with elegance and trust.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 pt-10 justify-center items-center">
                        {user ? (
                            <>
                                <button
                                    onClick={() => showToast('You are already logged in. Kindly logout to perform this operation.', 'error')}
                                    className="group relative px-12 py-5 bg-rose-600 text-white rounded-full font-bold shadow-2xl hover:bg-rose-700 transition-all overflow-hidden"
                                >
                                    <span className="relative z-10 uppercase tracking-widest text-sm">Join Free Today</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </button>
                                <button
                                    onClick={() => showToast('You are already logged in. Kindly logout to perform this operation.', 'error')}
                                    className="px-12 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/30 rounded-full font-bold hover:bg-white/20 transition-all uppercase tracking-widest text-sm"
                                >
                                    Member Login
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="group relative px-12 py-5 bg-rose-600 text-white rounded-full font-bold shadow-2xl hover:bg-rose-700 transition-all overflow-hidden"
                                >
                                    <span className="relative z-10 uppercase tracking-widest text-sm">Join Free Today</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-12 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/30 rounded-full font-bold hover:bg-white/20 transition-all uppercase tracking-widest text-sm"
                                >
                                    Member Login
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Search Section */}
                    <div className="mt-16 max-w-5xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/20 shadow-2xl">
                            <h3 className="text-white text-lg font-bold mb-4 flex items-center justify-center gap-2 font-serif">
                                <Search className="w-5 h-5 text-rose-300" />
                                Search Profile
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                {/* Gender Filter */}
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-bold text-rose-100 uppercase tracking-widest pl-1">I am looking for</label>
                                    <select
                                        value={searchData.gender}
                                        onChange={(e) => setSearchData({ ...searchData, gender: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer hover:bg-black/50"
                                    >
                                        <option value="FEMALE" className="bg-slate-900">Bride</option>
                                        <option value="MALE" className="bg-slate-900">Groom</option>
                                    </select>
                                </div>

                                {/* Age Filter */}
                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-bold text-rose-100 uppercase tracking-widest pl-1">Age Range</label>
                                    <select
                                        value={searchData.age}
                                        onChange={(e) => setSearchData({ ...searchData, age: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer hover:bg-black/50"
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
                                    <label className="text-xs font-bold text-rose-100 uppercase tracking-widest pl-1">Religion</label>
                                    <select
                                        value={searchData.religion}
                                        onChange={(e) => setSearchData({ ...searchData, religion: e.target.value, caste: '', dosham: '', denomination: '' })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer hover:bg-black/50"
                                    >
                                        <option value="" className="bg-slate-900">Any Religion</option>
                                        <option value="Hindu" className="bg-slate-900">Hindu</option>
                                        <option value="Christian" className="bg-slate-900">Christian</option>
                                        <option value="Muslim" className="bg-slate-900">Muslim</option>
                                        <option value="Others" className="bg-slate-900">Others</option>
                                    </select>
                                </div>

                                {/* Custom Religion Field */}
                                {searchData.religion === 'Others' && (
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-xs font-bold text-rose-100 uppercase tracking-widest pl-1">Custom Religion</label>
                                        <input
                                            type="text"
                                            value={searchData.customReligion}
                                            onChange={(e) => setSearchData({ ...searchData, customReligion: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all placeholder:text-slate-400"
                                            placeholder="Type religion"
                                        />
                                    </div>
                                )}

                                {/* Conditional Hindu Fields */}
                                {searchData.religion === 'Hindu' && (
                                    <>
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-xs font-bold text-rose-100 uppercase tracking-widest pl-1">Caste</label>
                                            <select
                                                value={searchData.caste}
                                                onChange={(e) => setSearchData({ ...searchData, caste: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer hover:bg-black/50"
                                            >
                                                <option value="" className="bg-slate-900">Select Caste</option>
                                                <option value="Nair" className="bg-slate-900">Nair</option>
                                                <option value="Ezhava" className="bg-slate-900">Ezhava</option>
                                                <option value="Vishwakarma" className="bg-slate-900">Vishwakarma</option>
                                                <option value="Brahmin" className="bg-slate-900">Brahmin</option>
                                                <option value="Pulaya" className="bg-slate-900">Pulaya</option>
                                                <option value="Vettuva" className="bg-slate-900">Vettuva</option>
                                                <option value="Kaniyan" className="bg-slate-900">Kaniyan</option>
                                                <option value="Dheevara" className="bg-slate-900">Dheevara</option>
                                                <option value="Others" className="bg-slate-900">Others</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5 text-left">
                                            <label className="text-xs font-bold text-rose-100 uppercase tracking-widest pl-1">Dosham</label>
                                            <select
                                                value={searchData.dosham}
                                                onChange={(e) => setSearchData({ ...searchData, dosham: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer hover:bg-black/50"
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
                                        <label className="text-xs font-bold text-rose-100 uppercase tracking-widest pl-1">Denomination</label>
                                        <select
                                            value={searchData.denomination}
                                            onChange={(e) => setSearchData({ ...searchData, denomination: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer hover:bg-black/50"
                                        >
                                            <option value="" className="bg-slate-900">Select Denomination</option>
                                            <option value="Latin Catholic" className="bg-slate-900">Latin Catholic</option>
                                            <option value="Roman Catholic" className="bg-slate-900">Roman Catholic</option>
                                            <option value="Syro Malabar" className="bg-slate-900">Syro Malabar</option>
                                            <option value="Syrian Catholic" className="bg-slate-900">Syrian Catholic</option>
                                            <option value="Syro Malankara" className="bg-slate-900">Syro Malankara</option>
                                            <option value="Pentecost" className="bg-slate-900">Pentecost</option>
                                            <option value="Others" className="bg-slate-900">Others</option>
                                        </select>
                                    </div>
                                )}

                                {/* Search Button */}
                                <div className={searchData.religion === 'Hindu' || searchData.religion === 'Others' ? "lg:col-span-4 mt-2" : searchData.religion === 'Christian' ? "" : "lg:col-span-2"}>
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

                </motion.div>
            </div>
        </div>
    )
}
