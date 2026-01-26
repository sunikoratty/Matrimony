'use client'

import React from 'react'
import { WifiOff } from 'lucide-react'

export default function ConnectionError() {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-rose-50 rounded-3xl border border-rose-100 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-500">
                <WifiOff size={32} />
            </div>
            <h3 className="text-xl font-bold text-rose-900">Connecting to our heart-base...</h3>
            <p className="text-rose-700 leading-relaxed">
                Our database is currently taking a short nap. Please wait a few moments and click retry to continue your search for a soulmate.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-md"
            >
                Retry Connection
            </button>
        </div>
    )
}
