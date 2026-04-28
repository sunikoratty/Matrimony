

import { useEffect, Suspense } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/Toast'

function WarningHandler() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { showToast } = useToast()

    useEffect(() => {
        const warn = searchParams.get('warn')
        if (warn === 'already_logged_in') {
            showToast('You are already logged in. Kindly logout to perform this operation.', 'error')
            
            // Remove the warning from URL without refreshing
            const params = new URLSearchParams(searchParams.toString())
            params.delete('warn')
            const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '')
            window.history.replaceState({}, '', newUrl)
        }
    }, [searchParams, showToast])

    return null
}

export default function AuthWarningHandler() {
    return (
        <Suspense fallback={null}>
            <WarningHandler />
        </Suspense>
    )
}
