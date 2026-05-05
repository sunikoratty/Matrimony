import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Filter, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SearchFilters({ currentUser }: { currentUser: any }) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isOpen, setIsOpen] = useState(false)

    const [searchData, setSearchData] = useState({
        gender: searchParams.get('gender') || (currentUser?.gender === 'MALE' ? 'FEMALE' : 'MALE'),
        age: searchParams.get('age') || '',
        religion: searchParams.get('religion') || '',
        caste: searchParams.get('caste') || '',
        dosham: searchParams.get('dosham') || '',
        birthStar: searchParams.get('birthStar') || '',
        denomination: searchParams.get('denomination') || ''
    })

    // Logic for No Religion -> No Caste
    useEffect(() => {
        if (searchData.religion === 'No Religion') {
            setSearchData(prev => ({ ...prev, caste: 'No Caste' }))
        }
    }, [searchData.religion])

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams)
        params.set('mode', 'search')
        if (searchData.gender) params.set('gender', searchData.gender)
        if (searchData.age) params.set('age', searchData.age)
        if (searchData.religion) params.set('religion', searchData.religion)
        else params.delete('religion')
        
        if (searchData.caste) params.set('caste', searchData.caste)
        else params.delete('caste')

        if (searchData.dosham) params.set('dosham', searchData.dosham)
        else params.delete('dosham')

        if (searchData.birthStar) params.set('birthStar', searchData.birthStar)
        else params.delete('birthStar')

        if (searchData.denomination) params.set('denomination', searchData.denomination)
        else params.delete('denomination')

        navigate(`?${params.toString()}`)
        setIsOpen(false)
    }

    const clearFilters = () => {
        setSearchData({
            gender: currentUser?.gender === 'MALE' ? 'FEMALE' : 'MALE',
            age: '',
            religion: '',
            caste: '',
            dosham: '',
            birthStar: '',
            denomination: ''
        })
        navigate('?')
    }

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                        <Search size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Find Your Match</h3>
                        <p className="text-xs text-slate-500">Filter profiles by your preferences</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {searchParams.toString() && (
                        <button 
                            onClick={clearFilters}
                            className="text-xs font-medium text-slate-400 hover:text-rose-600 px-3 py-2 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            isOpen ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <Filter size={16} />
                        {isOpen ? 'Close Filters' : 'Filters'}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl p-6 shadow-xl shadow-slate-200/50 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Looking for</label>
                                    <select
                                        value={searchData.gender}
                                        disabled={!!currentUser}
                                        onChange={(e) => setSearchData({ ...searchData, gender: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                                    >
                                        <option value="FEMALE">Bride</option>
                                        <option value="MALE">Groom</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Age Range</label>
                                    <select
                                        value={searchData.age}
                                        onChange={(e) => setSearchData({ ...searchData, age: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none cursor-pointer"
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
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Religion</label>
                                    <select
                                        value={searchData.religion}
                                        onChange={(e) => setSearchData({ ...searchData, religion: e.target.value, caste: '', dosham: '', denomination: '' })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Any Religion</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Christian">Christian</option>
                                        <option value="Muslim">Muslim</option>
                                        <option value="No Religion">No Religion</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>


                            </div>

                            {/* Conditional Filters */}
                            {(searchData.religion === 'Hindu' || searchData.religion === 'Christian' || searchData.religion === 'Muslim' || searchData.religion === 'No Religion') && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
                                >
                                    {(searchData.religion === 'Hindu' || searchData.religion === 'No Religion') && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Caste</label>
                                            <select
                                                value={searchData.caste}
                                                disabled={searchData.religion === 'No Religion'}
                                                onChange={(e) => setSearchData({ ...searchData, caste: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all disabled:opacity-50"
                                            >
                                                <option value="">Select Caste</option>
                                                <option value="No Caste">No Caste</option>
                                                <option value="Nair">Nair</option>
                                                <option value="Ezhava">Ezhava</option>
                                                <option value="Brahmin">Brahmin</option>
                                                <option value="Others">Others</option>
                                            </select>
                                        </div>
                                    )}

                                    {searchData.religion === 'Hindu' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dosham</label>
                                                <select
                                                    value={searchData.dosham}
                                                    onChange={(e) => setSearchData({ ...searchData, dosham: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                                >
                                                    <option value="">Any</option>
                                                    <option value="No">No Dosham</option>
                                                    <option value="Yes">Has Dosham</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Birth Star</label>
                                                <input
                                                    value={searchData.birthStar || ''}
                                                    onChange={(e) => setSearchData({ ...searchData, birthStar: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                                    placeholder="e.g. Rohini"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {(searchData.religion === 'Christian' || searchData.religion === 'Muslim') && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Denomination</label>
                                            <select
                                                value={searchData.denomination}
                                                onChange={(e) => setSearchData({ ...searchData, denomination: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                            >
                                                <option value="">Select Denomination</option>
                                                {searchData.religion === 'Christian' ? (
                                                    <>
                                                        <option value="Latin Catholic">Latin Catholic</option>
                                                        <option value="Roman Catholic">Roman Catholic</option>
                                                        <option value="Syro Malabar">Syro Malabar</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="Shia">Shia</option>
                                                        <option value="Sunni">Sunni</option>
                                                        <option value="Intercaste">Intercaste</option>
                                                    </>
                                                )}
                                                <option value="Others">Others</option>
                                            </select>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            <div className="flex justify-end pt-6 border-t border-slate-100">
                                <button
                                    onClick={handleSearch}
                                    className="px-10 h-[46px] bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
