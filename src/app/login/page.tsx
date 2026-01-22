'use client'

import { useState } from 'react'
import { sendOTP, verifyOTP } from '@/lib/user-actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'

export default function Login() {
    const router = useRouter()
    const [step, setStep] = useState(1) // 1: Mobile, 2: OTP
    const [mobile, setMobile] = useState('')
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSendOTP(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        const res = await sendOTP(mobile)
        setLoading(false)
        if (res.success) {
            setStep(2)
        } else {
            // @ts-ignore
            setError(res.error || 'Failed to send OTP')
        }
    }

    async function handleVerifyOTP(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        const res = await verifyOTP(mobile, otp)
        setLoading(false)
        if (res.success) {
            router.push('/profile/view')
        } else {
            setError(res.error || 'Invalid OTP')
        }
    }

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image Board */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div className="absolute inset-0 bg-rose-900/40 z-10" />
                <Image
                    src="/images/CoupleImage1.jpg"
                    alt="Happy Couple"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2 mb-4">
                        <Heart className="text-rose-500 fill-rose-500" size={32} />
                        <span className="text-3xl font-bold">Kalyanam</span>
                    </div>
                    <h2 className="text-4xl font-serif font-bold mb-4">Starts Here.</h2>
                    <p className="text-lg text-rose-100 max-w-md">
                        "A successful marriage requires falling in love many times, always with the same person."
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="max-w-md w-full">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-rose-600 transition-colors mb-6 text-sm font-medium">
                            &larr; Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Welcome Back</h1>
                        <p className="text-slate-500">Please enter your details to sign in.</p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+91</span>
                                    <input
                                        autoFocus
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        required pattern="[0-9]{10}"
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-slate-50 focus:bg-white"
                                        placeholder="98765 43210"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}
                            <button disabled={loading} className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 transform hover:-translate-y-0.5">
                                {loading ? 'Sending OTP...' : 'Get OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Enter OTP</label>
                                <input
                                    autoFocus
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-slate-50 focus:bg-white text-center text-2xl tracking-[0.5em] font-medium"
                                    placeholder="••••••"
                                    maxLength={6}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-slate-500">
                                        Sent to +91 {mobile}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-xs text-rose-600 hover:underline font-medium"
                                    >
                                        Change Number
                                    </button>
                                </div>
                            </div>
                            {error && <p className="text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}
                            <button disabled={loading} className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 transform hover:-translate-y-0.5">
                                {loading ? 'Verifying...' : 'Sign In'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Don't have an account? {' '}
                            <Link href="/register" className="text-rose-600 font-semibold hover:text-rose-700 hover:underline">
                                Register Free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
