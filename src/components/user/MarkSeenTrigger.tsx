

import { useEffect } from 'react'
import { markInterestsAsSeen } from '@/lib/interest-actions'

export default function MarkSeenTrigger() {
    useEffect(() => {
        markInterestsAsSeen()
    }, [])

    return null
}
