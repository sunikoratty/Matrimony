import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SearchSection() {
    const navigate = useNavigate()
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
        params.set('mode', 'recommended')
        if (searchData.gender) params.set('gender', searchData.gender)
        if (searchData.age) params.set('age', searchData.age)
        if (searchData.religion) {
            params.set('religion', searchData.religion === 'Others' ? searchData.customReligion.trim() : searchData.religion)
        }
        if (searchData.caste) params.set('caste', searchData.caste)
        if (searchData.dosham) params.set('dosham', searchData.dosham)
        if (searchData.denomination) params.set('denomination', searchData.denomination)

        navigate(`/matches?${params.toString()}`)
    }

    return (
        <section className="relative -mt-8 sm:-mt-16 mb-12 z-20 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 sm:p-10"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                        <Search size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Advanced Search</h3>
                        <p className="text-sm text-slate-500">Find your compatible match with precision</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Looking for</label>
                        <select
                            value={searchData.gender}
                            onChange={(e) => setSearchData({ ...searchData, gender: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="FEMALE">Bride</option>
                            <option value="MALE">Groom</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Age Range</label>
                        <select
                            value={searchData.age}
                            onChange={(e) => setSearchData({ ...searchData, age: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Any Age</option>
                            <option value="18-25">18 - 25</option>
                            <option value="26-30">26 - 30</option>
                            <option value="31-35">31 - 35</option>
                            <option value="36-40">36 - 40</option>
                            <option value="41-50">41 - 50</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Religion</label>
                        <select
                            value={searchData.religion}
                            onChange={(e) => setSearchData({ ...searchData, religion: e.target.value, caste: '', dosham: '', denomination: '' })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Any Religion</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Christian">Christian</option>
                            <option value="Muslim">Muslim</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div>
                        <button
                            onClick={handleSearch}
                            className="w-full h-[54px] bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Search size={20} />
                            Search Now
                        </button>
                    </div>
                </div>

                {/* Additional Filters row */}
                {(searchData.religion === 'Hindu' || searchData.religion === 'Christian' || searchData.religion === 'Others') && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {searchData.religion === 'Hindu' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Caste</label>
                                    <select
                                        value={searchData.caste}
                                        onChange={(e) => setSearchData({ ...searchData, caste: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                    >
                                        <option value="">Select Caste</option>
                                        <option value="Nair">Nair</option>
                                        <option value="Ezhava">Ezhava</option>
                                        <option value="Brahmin">Brahmin</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Dosham</label>
                                    <select
                                        value={searchData.dosham}
                                        onChange={(e) => setSearchData({ ...searchData, dosham: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                    >
                                        <option value="">Any</option>
                                        <option value="No">No Dosham</option>
                                        <option value="Yes">Has Dosham</option>
                                    </select>
                                </div>
                            </>
                        )}
                        {searchData.religion === 'Christian' && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Denomination</label>
                                <select
                                    value={searchData.denomination}
                                    onChange={(e) => setSearchData({ ...searchData, denomination: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                >
                                    <option value="">Select Denomination</option>
                                    <option value="Latin Catholic">Latin Catholic</option>
                                    <option value="Roman Catholic">Roman Catholic</option>
                                    <option value="Syro Malabar">Syro Malabar</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        )}
                        {searchData.religion === 'Others' && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Type Religion</label>
                                <input
                                    type="text"
                                    value={searchData.customReligion}
                                    onChange={(e) => setSearchData({ ...searchData, customReligion: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                    placeholder="Enter religion"
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </section>
    )
}
