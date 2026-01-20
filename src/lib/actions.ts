'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const LoginSchema = z.object({
    identifier: z.string().min(1, 'Email or Mobile is required'),
    password: z.string().min(1, 'Password is required'),
})

export async function adminLogin(formData: FormData) {
    const data = Object.fromEntries(formData.entries())
    const result = LoginSchema.safeParse(data)

    if (!result.success) {
        return { error: 'Invalid input' }
    }

    const { identifier, password } = result.data

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { mobile: identifier },
            ],
            role: 'ADMIN',
        },
    })

    // Simple password check (In production use bcrypt)
    if (!user || user.password !== password) {
        return { error: 'Invalid credentials' }
    }

    // Create session (Simple cookie)
    ; (await cookies()).set('admin_session', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    })

    redirect('/admin/dashboard')
}

export async function adminLogout() {
    ; (await cookies()).delete('admin_session')
    redirect('/admin/login')
}

export async function togglePaidStatus(userId: string, currentStatus: boolean) {
    // Add auth check here realistically
    await prisma.user.update({
        where: { id: userId },
        data: { isPaid: !currentStatus },
    })
    // revalidatePath('/admin/dashboard') // If used
}

export async function updateUserStatus(userId: string, status: string) {
    await prisma.user.update({
        where: { id: userId },
        data: { status }, // ACTIVE, BLOCKED, DELETED
    })
}

export async function getUsers() {
    return await prisma.user.findMany({
        where: { role: 'USER' },
        orderBy: { createdAt: 'desc' },
        include: { profile: true },
    })
}
