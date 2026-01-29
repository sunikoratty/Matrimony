'use server'

import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function createOrder(amount: number, currency: string = 'INR') {
    const userSession = (await cookies()).get('user_session')?.value
    if (!userSession) return { error: 'Unauthorized' }

    try {
        const order = await razorpay.orders.create({
            amount: amount * 100, // Amount in paise/cents
            currency: currency,
            receipt: `rcpt_${userSession.slice(0, 8)}_${Date.now()}`,
        })

        return { success: true, orderId: order.id, amount: order.amount }
    } catch (error) {
        console.error('Razorpay Error:', error)
        return { error: 'Failed to create order' }
    }
}

export async function verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
) {
    const userSession = (await cookies()).get('user_session')?.value
    if (!userSession) return { error: 'Unauthorized' }

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
        try {
            await prisma.user.update({
                where: { id: userSession },
                data: { isPaid: true }
            })
            return { success: true }
        } catch (dbError) {
            console.error('Database Error during payment verification:', dbError)
            return {
                success: false,
                error: 'Payment received but database update failed. Please contact support.',
                paymentId: razorpay_payment_id
            }
        }
    } else {
        return { error: 'Invalid signature' }
    }
}
