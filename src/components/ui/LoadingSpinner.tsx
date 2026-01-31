'use client'

import React from 'react'

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <div className="relative w-32 h-32">
                {/* Decorative Beads with Animation */}
                <div className="absolute inset-[-10px] rounded-full border border-dashed border-rose-300/30 animate-[spin_10s_linear_infinite]" />

                {/* Outer Glow */}
                <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-2xl animate-pulse" />

                {/* Main Mangalsutra Image */}
                <div className="relative z-10 w-full h-full p-4 animate-[bounce_3s_ease-in-out_infinite]">
                    <img
                        src="/images/mangalsutra.png"
                        alt="Loading..."
                        className="w-full h-full object-contain filter drop-shadow-md"
                    />
                </div>

                {/* Circular Loading Rings */}
                <div className="absolute inset-0 rounded-full border-4 border-rose-100 border-t-rose-600 animate-spin" />
                <div className="absolute inset-2 rounded-full border border-orange-200 border-b-orange-500 animate-[spin_2s_linear_infinite_reverse]" />
            </div>

            <div className="text-center">
                <p className="text-rose-600 font-serif font-bold text-lg tracking-wide animate-pulse mb-1">Connecting Souls</p>
                <div className="flex justify-center gap-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
