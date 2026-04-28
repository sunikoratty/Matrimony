

import { useState, useEffect } from 'react'
import { createOrder, verifyPayment } from '@/lib/payment-actions'
import { CreditCard, Globe, X, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/Toast'
import CircularLoader from '@/components/ui/CircularLoader'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function PaymentModal({ isOpen, onClose, country }: { isOpen: boolean, onClose: () => void, country: string }) {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    // Logic: Force Razorpay for both India and Canada
    const gateway = 'Razorpay'
    const price = country === 'INDIA' ? '100' : '5'
    const currency = country === 'INDIA' ? 'INR' : 'CAD'

    async function handlePayment() {
        console.log('Payment Button Clicked. Gateway:', gateway, 'Price:', price, 'Currency:', currency)

        if (!window.Razorpay) {
            console.error('Razorpay SDK not loaded')
            showToast('Payment system is still loading. Please wait a few seconds and try again.', 'error')
            return
        }

        setLoading(true)

        try {
            console.log('Initiating createOrder on server...')
            const res = await createOrder(Number(price), currency)
            console.log('Server Response:', res)

            if (res.error) {
                console.error('Order Creation Failed:', res.error)
                showToast(`Order Error: ${res.error}`, 'error')
                setLoading(false)
                return
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: res.amount,
                currency: currency,
                name: 'True Match',
                description: 'Premium Membership Payment',
                order_id: res.orderId,
                handler: async function (response: any) {
                    console.log('Razorpay Handler Response:', response)
                    const verification = await verifyPayment(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature
                    )

                    if (verification.success) {
                        showToast('Payment Successful! Your account is now Premium.', 'success')
                        onClose()
                        window.location.reload()
                    } else {
                        console.error('Verification Error:', verification.error)
                        showToast(verification.error || 'Payment Verification Failed!', 'error')
                        // Even if verification failed on our server, if the payment was actually made, 
                        // we should probably let the user close the modal.
                        onClose()
                    }
                    setLoading(false)
                },
                theme: {
                    color: '#e11d48',
                },
                modal: {
                    ondismiss: function () {
                        console.log('Payment Modal Dismissed')
                        setLoading(false)
                    }
                }
            }

            console.log('Opening Razorpay Modal with options:', { ...options, key: '***' })
            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            console.error('Payment Error (Catch):', error)
            showToast('Something went wrong. Please check your console for details.', 'error')
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

                {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_test_') && (
                    <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase mb-2">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                            Test Mode Active
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] text-amber-600 uppercase font-bold mb-1">Domestic Card (Test):</p>
                                <p className="text-[10px] text-amber-700 leading-tight">
                                    <code className="font-bold bg-white px-1 rounded">5267 3181 8797 5449</code><br />
                                    Exp: <code className="font-bold">12/30</code> | CVV: <code className="font-bold">123</code>
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-amber-600 uppercase font-bold mb-1">Domestic RuPay:</p>
                                <p className="text-[10px] text-amber-700 leading-tight">
                                    <code className="font-bold bg-white px-1 rounded">6070 1200 0000 0000</code><br />
                                    OTP for all: <code className="font-bold">123456</code>
                                </p>
                            </div>
                        </div>
                        <p className="mt-3 text-[9px] text-amber-600 italic">Tip: Type the digits manually without spaces if copy-paste fails.</p>
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <CircularLoader size="sm" color="white" />
                            <span>Processing...</span>
                        </div>
                    ) : `Pay Now`}
                </button>

                {loading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
                        <CircularLoader size="lg" />
                    </div>
                )}

                <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <Lock size={12} /> Secure 256-bit SSL Encrypted
                </p>
                <p className="text-[10px] text-center text-slate-400 mt-2 italic px-4 leading-tight">
                    Note: International cards may require "International Payments" to be enabled in your Razorpay dashboard.
                </p>
            </div>
        </div>
    )
}
