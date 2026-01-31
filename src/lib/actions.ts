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

export async function adminUpdateUser(userId: string, data: any) {
    const { profile, ...userData } = data

    // Sanitize User fields
    if (userData.email === '') userData.email = null

    try {
        await prisma.$transaction(async (tx) => {
            // Update User fields
            await tx.user.update({
                where: { id: userId },
                data: userData,
            })

            // Update or Create Profile fields
            if (profile) {
                // Handle optional fields that might be empty strings
                const processedProfile = { ...profile }

                if (processedProfile.dob === '' || !processedProfile.dob) {
                    processedProfile.dob = null
                } else {
                    processedProfile.dob = new Date(processedProfile.dob)
                }

                // Convert other empty strings to null for cleanliness if they are optional
                const fieldsToNullify = ['bio', 'religion', 'caste', 'denomination', 'dosham', 'birthStar', 'currentResidence', 'location', 'occupation', 'qualification']
                fieldsToNullify.forEach(field => {
                    if (processedProfile[field] === '') {
                        processedProfile[field] = null
                    }
                })

                await tx.profile.upsert({
                    where: { userId },
                    create: {
                        ...processedProfile,
                        userId,
                    },
                    update: processedProfile,
                })
            }
        })
        return { success: true }
    } catch (error: any) {
        console.error('Admin user update failed:', error)
        return { error: error.message || 'Failed to update user' }
    }
}
