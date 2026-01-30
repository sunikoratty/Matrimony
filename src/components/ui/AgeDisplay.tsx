'use client'

import { useState, useEffect } from 'react'

export default function AgeDisplay({ dob }: { dob: string | Date | null | undefined }) {
    const [age, setAge] = useState<number | null>(null)

    useEffect(() => {
        if (dob) {
            const birthDate = new Date(dob)
            const today = new Date()
            let calculatedAge = today.getFullYear() - birthDate.getFullYear()
            const m = today.getMonth() - birthDate.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--
            }
            setAge(calculatedAge)
        }
    }, [dob])

    if (!age) return <span>Age N/A</span>
    return <span>{age} yrs</span>
}
