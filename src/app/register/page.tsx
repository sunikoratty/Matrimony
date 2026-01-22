'use client'

import { useState } from 'react'

import { registerUser } from '@/lib/user-actions'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Sparkles } from 'lucide-react'

export default function Register() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image Board */}
            <div className="hidden lg:block lg:w-1/2 relative bg-rose-50">
                <div className="absolute inset-0 bg-rose-900/30 z-10" />
                <Image
                    src="/images/CoupleImage2.jpg"
                    alt="Wedding Couple"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-0 left-0 p-8 z-20">
                    <div className="flex items-center gap-2 text-white">
                        <Heart className="text-white fill-white" size={28} />
                        <span className="text-2xl font-bold">Kalyanam</span>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium mb-4 border border-white/30">
                        <Sparkles size={14} />
                        <span>Find your soulmate today</span>
                    </div>
                    <h2 className="text-4xl font-serif font-bold mb-4">Begin Your Journey.</h2>
                    <p className="text-lg text-rose-100 max-w-md">
                        "Where love happens, dreams come true. Join thousands of happy couples who found their forever here."
                    </p>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="max-w-md w-full py-8">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-rose-600 transition-colors mb-6 text-sm font-medium">
                            &larr; Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Create Account</h1>
                        <p className="text-slate-500">Fill in your details to start finding matches.</p>
                    </div>

                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        if (loading) return
                        setLoading(true)
                        setError('')

                        const formData = new FormData(e.currentTarget)
                        const res = await registerUser(formData)

                        if (res?.error) {
                            setError(res.error)
                            setLoading(false)
                        }
                    }} className="space-y-5">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <input name="name" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-slate-50 focus:bg-white" placeholder="e.g. John Doe" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+91</span>
                                    <input name="mobile" required pattern="[0-9]{10}" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-slate-50 focus:bg-white" placeholder="98765 43210" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                                    <div className="relative">
                                        <select name="gender" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-slate-50 focus:bg-white appearance-none cursor-pointer">
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                                    <div className="relative">
                                        <select name="country" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-slate-50 focus:bg-white appearance-none cursor-pointer">
                                            <option value="INDIA">India</option>
                                            <option value="CANADA">Canada</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mother Tongue</label>
                                <input name="motherTongue" required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-slate-50 focus:bg-white" placeholder="e.g. Malayalam" />
                            </div>
                        </div>

                        {error && <p className="text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}

                        <button disabled={loading} className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 transform hover:-translate-y-0.5 mt-4">
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account? {' '}
                            <Link href="/login" className="text-rose-600 font-semibold hover:text-rose-700 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
