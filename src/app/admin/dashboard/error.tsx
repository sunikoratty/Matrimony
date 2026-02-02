'use client'

import { useEffect } from 'react'
import ErrorState from '@/components/ui/ErrorState'
import { useToast } from '@/components/ui/Toast'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const { showToast } = useToast()

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Dashboard Error:', error)

        // Show a toast with a meaningful message
        if (error.message.includes('Can\'t reach database server')) {
            showToast('Unable to connect to the database. Please check your connection.', 'error')
        } else {
            showToast('An unexpected error occurred.', 'error')
        }
    }, [error, showToast])

    const isConnectionError = error.message.includes('Can\'t reach database server')

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <ErrorState
                title={isConnectionError ? 'Server Not Reached' : 'Something went wrong'}
                message={
                    isConnectionError
                        ? 'We were unable to reach the database server. Please ensure the server is running and try again.'
                        : 'There was an error loading the dashboard data. Please try refreshing the page.'
                }
                onRetry={() => reset()}
            />
        </div>
    )
}
