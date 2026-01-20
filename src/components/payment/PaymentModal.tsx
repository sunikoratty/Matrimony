'use client'

import { useState, useEffect } from 'react'
import { createOrder, verifyPayment } from '@/lib/payment-actions'
import { CreditCard, Globe, X, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function PaymentModal({ isOpen, onClose, country }: { isOpen: boolean, onClose: () => void, country: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    // Logic: India -> Razorpay, Others -> Stripe (Stripe not implemented yet)
    const gateway = country === 'INDIA' ? 'Razorpay' : 'Stripe'
    const price = country === 'INDIA' ? '999' : '29.99'
    const currency = country === 'INDIA' ? 'INR' : 'USD'

    async function handlePayment() {
        if (gateway === 'Stripe') {
            alert('International payments via Stripe coming soon!')
            return
        }

        setLoading(true)

        try {
            const res = await createOrder(Number(price))

            if (res.error) {
                alert(res.error)
                setLoading(false)
                return
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use Next.js public env
                amount: res.amount,
                currency: currency,
                name: 'Kalyanam Matrimony',
                description: 'Premium Membership Payment',
                order_id: res.orderId,
                handler: async function (response: any) {
                    const verification = await verifyPayment(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature
                    )

                    if (verification.success) {
                        alert('Payment Successful! Your account is now Premium.')
                        onClose()
                        router.refresh()
                    } else {
                        alert('Payment Verification Failed!')
                    }
                    setLoading(false)
                },
                prefill: {
                    name: '', // Optional: can be passed from props
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#e11d48', // rose-600
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false)
                    }
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            console.error('Payment Error:', error)
            alert('Something went wrong. Please try again.')
            setLoading(false)
        }
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
                    <span className="text-xl font-bold text-rose-600">{country === 'INDIA' ? '₹' : '$'}{price}</span>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                >
                    {loading ? 'Processing...' : `Pay Now`}
                </button>

                <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <Lock size={12} /> Secure 256-bit SSL Encrypted
                </p>
            </div>
        </div>
    )
}
