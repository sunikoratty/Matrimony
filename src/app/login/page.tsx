'use client'

import { useState } from 'react'

import { sendOTP, verifyOTP } from '@/lib/user-actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
            router.push('/profile/view') // Or dashboard
        } else {
            setError(res.error || 'Invalid OTP')
        }
    }

    return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                <Link href="/" className="mb-4 inline-block text-slate-500 hover:text-rose-600 text-sm">&larr; Back to Home</Link>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                <p className="text-slate-500 mb-6">Login with your mobile number</p>

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                            <input
                                autoFocus
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required pattern="[0-9]{10}"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                                placeholder="e.g. 9876543210"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button disabled={loading} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-colors">
                            {loading ? 'Sending OTP...' : 'Get OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Enter OTP</label>
                            <input
                                autoFocus
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 text-center text-2xl tracking-widest"
                                placeholder="••••••"
                            />
                            <p className="text-xs text-slate-500 mt-2 text-center">
                                OTP sent to {mobile}
                            </p>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button disabled={loading} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-colors">
                            {loading ? 'Verifying...' : 'Login'}
                        </button>

                    </form>
                )}

                <div className="mt-6 text-center text-sm text-slate-500">
                    New user? <Link href="/register" className="text-rose-600 hover:underline">Register here</Link>
                </div>
            </div>
        </div>
    )
}
