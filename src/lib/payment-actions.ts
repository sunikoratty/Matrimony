'use server'

import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function processPayment(gateway: string) {
    const userSession = (await cookies()).get('user_session')?.value
    if (!userSession) return { error: 'Unauthorized' }

    // Simulate API call to Razorpay/Stripe
    console.log(`Processing payment via ${gateway} for user ${userSession}`)

    // On Success
    await prisma.user.update({
        where: { id: userSession },
        data: { isPaid: true }
    })

    return { success: true }
}
