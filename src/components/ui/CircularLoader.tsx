import React from 'react'

export default function CircularLoader({ size = 'md', color = 'rose' }: { size?: 'sm' | 'md' | 'lg', color?: string }) {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-10 w-10 border-4',
        lg: 'h-16 w-16 border-4'
    }

    const colorClasses: Record<string, string> = {
        rose: 'border-rose-500',
        white: 'border-white/30'
    }

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizeClasses[size]} ${colorClasses[color] || 'border-rose-500'} border-t-transparent rounded-full animate-spin`} />
        </div>
    )
}
