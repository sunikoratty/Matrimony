'use client'

import { useState, useEffect } from 'react'
import { calculateAge } from '@/lib/utils'

export default function AgeDisplay({ dob }: { dob: string | Date | null | undefined }) {
    const [age, setAge] = useState<number | null>(null)

    useEffect(() => {
        setAge(calculateAge(dob))
    }, [dob])

    if (!age) return <span>Age N/A</span>
    return <span>{age} yrs</span>
}
