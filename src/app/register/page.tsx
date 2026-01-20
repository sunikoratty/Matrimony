'use client'

import { useState } from 'react'

import { registerUser } from '@/lib/user-actions'
import Link from 'next/link'

export default function Register() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')



    return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                <Link href="/" className="mb-4 inline-block text-slate-500 hover:text-rose-600 text-sm">&larr; Back to Home</Link>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
                <p className="text-slate-500 mb-6">Start your journey to find love.</p>

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
                }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input name="name" required className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500" placeholder="e.g. John Doe" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                        <input name="mobile" required pattern="[0-9]{10}" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500" placeholder="e.g. 9876543210" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                            <select name="gender" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500">
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                            <select name="country" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500">
                                <option value="INDIA">India</option>
                                <option value="CANADA">Canada</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mother Tongue</label>
                        <input name="motherTongue" required className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500" placeholder="e.g. Malayalam" />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button disabled={loading} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-colors">
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Already have an account? <Link href="/login" className="text-rose-600 hover:underline">Login here</Link>
                </div>
            </div>
        </div>
    )
}
