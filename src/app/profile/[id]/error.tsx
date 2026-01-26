'use client'

import ConnectionError from '@/components/ui/ConnectionError'

export default function Error() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <ConnectionError />
        </div>
    )
}
