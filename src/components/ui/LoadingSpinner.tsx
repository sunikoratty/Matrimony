

import React from 'react'

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-10 w-10 border-4',
        lg: 'h-16 w-16 border-4'
    }

    return (
        <div className="flex items-center justify-center p-4">
            <div className={`${sizeClasses[size]} border-rose-500 border-t-transparent rounded-full animate-spin`} />
        </div>
    )
}
