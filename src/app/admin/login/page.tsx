'use client'

import { useState } from 'react'

import { adminLogin } from '@/lib/actions'
import { RocketIcon, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError('')

        const res = await adminLogin(formData)

        if (res?.error) {
            setError(res.error)
            setLoading(false)
        }
        // If success, redirect happens in action
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center mb-4 text-white">
                        <RocketIcon size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
                    <p className="text-slate-500 mt-2">Secure access for management</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email / Mobile</label>
                        <input
                            name="identifier"
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                            placeholder="admin@matrimony.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={18} />}
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    )
}
