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
        return { error: 'Invalid formulation data. Please check all fields.' }
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
                profile: {
                    create: {}
                }
            },
        })

            // Auto login
            ; (await cookies()).set('user_session', user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            })
    } catch (e: any) {
        if (e.message?.includes('NEXT_REDIRECT')) throw e
        console.error('Registration error:', e)
        if (e.code === 'P2002') {
            return { error: 'Mobile number already registered.' }
        }
        return { error: `Registration failed: ${e.message || 'Unknown error'}` }
    }
    redirect('/profile/view')
}

export async function sendOTP(mobile: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { mobile }
    })

    if (!user) {
        return { error: 'User not registered-Please register first', success: false }
    }

    // Mock OTP
    console.log(`OTP for ${mobile} is 123456`)
    return { success: true, otp: '123456' } // In real app, don't return OTP
}

export async function verifyOTP(mobile: string, otp: string) {
    if (otp === '123456') {
        const user = await prisma.user.findUnique({
            where: { mobile }
        })

        if (!user) {
            return { error: 'User not found. Please register.' }
        }

        ; (await cookies()).set('user_session', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })
        return { success: true }
    }
    return { error: 'Invalid OTP' }
}

export async function updateProfile(formData: FormData) {
    const userSession = (await cookies()).get('user_session')?.value
    if (!userSession) return { error: 'Unauthorized' }

    const bio = formData.get('bio') as string
    const dob = formData.get('dob') as string
    const religion = formData.get('religion') as string
    const caste = formData.get('caste') as string
    const currentResidence = formData.get('currentResidence') as string
    const photoUrl = formData.get('photoUrl') as string // Base64

    const email = formData.get('email') as string
    const location = formData.get('location') as string
    const occupation = formData.get('occupation') as string
    const consent = formData.get('consent') === 'on'

    try {
        // Update User email if provided
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
                consent,
                photoUrl,
                maritalStatus: formData.get('maritalStatus') as string,
            }
        })
    } catch (e: any) {
        if (e.message?.includes('NEXT_REDIRECT')) throw e
        console.error(e)
        return { error: 'Update failed' }
    }
    redirect('/profile/view')
}

export async function getProfileById(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        include: { profile: true }
    })
    return user
}

export async function getProfile() {
    const userSession = (await cookies()).get('user_session')?.value
    if (!userSession) return null

    return await prisma.user.findUnique({
        where: { id: userSession },
        include: { profile: true }
    })
}
