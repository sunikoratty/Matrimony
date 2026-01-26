'use client'

import React from 'react'

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="relative w-24 h-24">
                <img
                    src="/images/mangalsutra.png"
                    alt="Loading..."
                    className="w-full h-full object-contain animate-spin-slow"
                />
                <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
            </div>
            <p className="text-rose-600 font-medium animate-pulse">Connecting hearts...</p>
        </div>
    )
}
