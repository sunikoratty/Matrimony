'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Heart, Lock, UserPlus } from 'lucide-react'

export default function PricingPage() {
    const searchParams = useSearchParams()
    const interestedIn = searchParams.get('interested_in')

    return (
        <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-rose-100 p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-rose-600 mb-4 shadow-sm">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-slate-900">
                        {interestedIn ? `Interested in ${interestedIn}?` : 'Unlock Profile Access'}
                    </h1>
                </div>

                <div className="p-8">
                    <p className="text-slate-600 text-center mb-8 leading-relaxed">
                        Join our community today to connect with your perfect match and view full profile details.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/register"
                            className="block w-full py-3.5 bg-rose-600 text-white text-center font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 flex items-center justify-center gap-2"
                        >
                            <UserPlus size={20} />
                            Register Free
                        </Link>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-100"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">Already a member?</span>
                            </div>
                        </div>

                        <Link
                            href="/login"
                            className="block w-full py-3.5 bg-white border-2 border-slate-100 text-slate-700 text-center font-bold rounded-xl hover:border-rose-200 hover:text-rose-600 transition-all"
                        >
                            Login
                        </Link>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
