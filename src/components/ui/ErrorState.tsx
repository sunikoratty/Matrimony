

import React, { useEffect } from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { useToast } from './Toast'

interface ErrorStateProps {
    title?: string
    message: string
    onRetry?: () => void
}

const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Server Error',
    message,
    onRetry
}) => {
    const { showToast } = useToast()

    useEffect(() => {
        showToast(message, 'error')
    }, [message, showToast])

    const handleRetry = () => {
        if (onRetry) {
            onRetry()
        } else {
            window.location.reload()
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="text-rose-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-500 max-w-md mb-8">
                {message}
            </p>
            <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium active:scale-95"
            >
                <RefreshCcw size={18} />
                Try Again
            </button>
        </div>
    )
}

export default ErrorState
