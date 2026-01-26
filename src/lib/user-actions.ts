'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const RegisterSchema = z.object({
    name: z.string().min(2),
    mobile: z.string().min(10),
    gender: z.string(),
    motherTongue: z.string(),
    country: z.string(),
})

export async function registerUser(formData: FormData) {
    const data = Object.fromEntries(formData.entries())
    const result = RegisterSchema.safeParse(data)

    if (!result.success) {
        console.error('Validation error:', result.error.flatten())
        return { error: 'Invalid data. Please check all fields.' }
    }

    const { mobile, name, gender, motherTongue, country } = result.data

    try {
        const user = await prisma.user.create({
            data: {
                name,
                mobile,
                gender,
                motherTongue,
                country,
                role: 'USER',
                status: 'ACTIVE',
                profile: { create: {} }
            },
        })

        const cookieStore = await cookies()
        cookieStore.set('user_session', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })
    } catch (e: any) {
        if (e.message?.includes('NEXT_REDIRECT')) throw e
        console.error('Registration error:', e.message)
        if (e.code === 'P2002') {
            return { error: 'Mobile number already registered.' }
        }
        return { error: `Registration failed. Please try again later.` }
    }
    redirect('/profile/view')
}

export async function sendOTP(mobile: string) {
    try {
        const user = await prisma.user.findUnique({ where: { mobile } })
        if (!user) return { error: 'User not registered. Please register first', success: false }
        console.log(`OTP for ${mobile} is 123456`)
        return { success: true, otp: '123456' }
    } catch (e) {
        console.error('Error in sendOTP:', e)
        return { error: 'Database connection failed. Please try again.', success: false }
    }
}

export async function verifyOTP(mobile: string, otp: string) {
    if (otp === '123456') {
        try {
            const user = await prisma.user.findUnique({ where: { mobile } })
            if (!user) return { error: 'User not found. Please register.' }

            const cookieStore = await cookies()
            cookieStore.set('user_session', user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            })
        } catch (e) {
            console.error('Error in verifyOTP:', e)
            return { error: 'Verification failed due to database error.' }
        }
        redirect('/profile/view')
    }
    return { error: 'Invalid OTP' }
}

export async function updateProfile(formData: FormData) {
    try {
        const cookieStore = await cookies()
        const userSession = cookieStore.get('user_session')?.value
        if (!userSession) return { error: 'Unauthorized' }

        const bio = formData.get('bio') as string
        const dob = formData.get('dob') as string
        const religion = formData.get('religion') as string
        const caste = formData.get('caste') as string
        const currentResidence = formData.get('currentResidence') as string
        const photoUrl = formData.get('photoUrl') as string
        const email = formData.get('email') as string
        const location = formData.get('location') as string
        const occupation = formData.get('occupation') as string
        const birthStar = formData.get('birthStar') as string
        const consent = formData.get('consent') === 'on'
        const maritalStatus = formData.get('maritalStatus') as string

        // Check for profile completion (all fields mandatory as per user request)
        const isComplete = !!(
            bio?.trim() &&
            dob &&
            religion?.trim() &&
            currentResidence &&
            location?.trim() &&
            occupation?.trim() &&
            photoUrl &&
            consent &&
            maritalStatus
        )

        if (email) {
            await prisma.user.update({
                where: { id: userSession },
                data: { email }
            })
        }

        await prisma.profile.update({
            where: { userId: userSession },
            data: {
                bio,
                dob: dob ? new Date(dob) : undefined,
                religion,
                caste,
                currentResidence,
                location,
                occupation,
                birthStar,
                consent,
                photoUrl,
                maritalStatus,
            }
        })

        if (isComplete) {
            await prisma.user.update({
                where: { id: userSession },
                data: { isProfileCompleted: true }
            })
        }
    } catch (e: any) {
        if (e.message?.includes('NEXT_REDIRECT')) throw e
        console.error('Update profile error:', e.message)
        return { error: 'Update failed. Check your connection.' }
    }
    redirect('/profile/view')
}

export async function getProfileById(id: string) {
    try {
        return await prisma.user.findUnique({
            where: { id },
            include: { profile: true }
        })
    } catch (error) {
        console.warn('Database connection failed in getProfileById')
        return null
    }
}

export async function getProfile() {
    try {
        const cookieStore = await cookies()
        const userSession = cookieStore.get('user_session')?.value
        if (!userSession) return null

        return await prisma.user.findUnique({
            where: { id: userSession },
            include: { profile: true }
        })
    } catch (error) {
        console.warn('Database connection failed in getProfile')
        return null
    }
}
