'use client'

import { useState } from 'react'
import PaymentModal from '@/components/payment/PaymentModal'

export default function MembershipSection({ isPaid, country, isProfileComplete }: { isPaid: boolean, country: string, isProfileComplete: boolean }) {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)

    if (!isProfileComplete) {
        return (
            <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                <p className="text-blue-800 font-medium">Please complete your profile to see matches and upgrade options.</p>
            </div>
        )
    }

    if (isPaid) return null;

    return (
        <>
            <div className="mt-8 bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center text-center sm:text-left flex-col sm:flex-row gap-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Membership Status</h2>
                        <p className="text-rose-100">
                            {isPaid ? 'You are a Premium Member' : 'Upgrade to Premium to view contact details of matches'}
                        </p>
                    </div>
                    {!isPaid && (
                        <button
                            onClick={() => setIsPaymentOpen(true)}
                            className="px-6 py-3 bg-white text-rose-600 rounded-lg font-bold shadow-lg hover:bg-rose-50 transition-colors"
                        >
                            Upgrade Now
                        </button>
                    )}
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                country={country}
            />
        </>
    )
}
