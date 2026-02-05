'use client'

import { useState } from 'react'
import { sendInterest } from '@/lib/interest-actions'
import { Heart, Loader2, Check } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface InterestButtonProps {
    targetId: string
    initialStatus: string | null
    isPaid: boolean
}

export default function InterestButton({ targetId, initialStatus, isPaid }: InterestButtonProps) {
    const [status, setStatus] = useState<string | null>(initialStatus)
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()

    const handleSendInterest = async () => {
        if (!isPaid) {
            showToast('Please upgrade to Premium to send interest requests.', 'error')
            return
        }

        setLoading(true)
        try {
            await sendInterest(targetId)
            setStatus('PENDING')
        } catch (error) {
            console.error('Failed to send interest', error)
            showToast('Something went wrong. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'ACCEPTED') {
        return (
            <div className="flex items-center gap-2 justify-center px-6 py-3 bg-green-100 text-green-700 rounded-full font-bold">
                <Check size={20} />
                <span>Interest Accepted</span>
            </div>
        )
    }

    if (status === 'PENDING') {
        return (
            <div className="flex items-center gap-2 justify-center px-6 py-3 bg-rose-100 text-rose-700 rounded-full font-bold cursor-default">
                <Check size={20} />
                <span>Request Sent</span>
            </div>
        )
    }

    return (
        <button
            onClick={handleSendInterest}
            disabled={loading}
            className="flex items-center gap-2 justify-center px-6 py-3 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all shadow-lg hover:shadow-rose-200 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
        >
            {loading ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <Heart size={20} className="fill-current" />
            )}
            <span>Interested In</span>
        </button>
    )
}
