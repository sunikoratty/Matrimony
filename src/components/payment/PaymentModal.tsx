'use client'

import { useState } from 'react'
import { processPayment } from '@/lib/payment-actions'
import { CreditCard, Globe, X, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PaymentModal({ isOpen, onClose, country }: { isOpen: boolean, onClose: () => void, country: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Logic: India -> Razorpay, Others -> Stripe
    const gateway = country === 'INDIA' ? 'Razorpay' : 'Stripe'
    const price = country === 'INDIA' ? '₹999' : '$29.99'

    async function handlePayment() {
        setLoading(true)
        // Simulate delay
        await new Promise(r => setTimeout(r, 1500))
        await processPayment(gateway)
        setLoading(false)
        onClose()
        router.refresh()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className="relative bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} className="text-slate-500" />
                </button>

                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-4">
                        <CreditCard size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Unlock Premium</h2>
                    <p className="text-slate-500">View unlimited profiles & contacts</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Globe size={18} className="text-slate-400" />
                        <span className="font-medium text-slate-700">{country === 'INDIA' ? 'India' : 'International'} Plan</span>
                    </div>
                    <span className="text-xl font-bold text-rose-600">{price}</span>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                >
                    {loading ? 'Processing Securely...' : `Pay with ${gateway}`}
                </button>

                <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <Lock size={12} /> Secure 256-bit SSL Encrypted
                </p>
            </div>
        </div>
    )
}
