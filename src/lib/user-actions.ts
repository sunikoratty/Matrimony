'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { sendOTPCode, verifyOTPCode } from './sms-utils'

const RegisterSchema = z.object({
    name: z.string().min(2),
    countryCode: z.string().startsWith('+'),
    mobile: z.string().regex(/^[0-9]{10}$/, 'Indian mobile number must be exactly 10 digits'),
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

    const { mobile: rawMobile, countryCode, name, gender, motherTongue, country } = result.data
    const mobile = `${countryCode}${rawMobile}`

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
        return { success: true }
    } catch (e: any) {
        if (e.message?.includes('NEXT_REDIRECT')) throw e
        console.error('Registration error:', e.message)
        if (e.code === 'P2002') {
            return { error: 'Mobile number already registered.' }
        }
        return { error: `Registration failed. Please try again later.` }
    }
}

export async function sendOTP(mobile: string) {
    try {
        const user = await prisma.user.findUnique({ where: { mobile } })
        if (!user) return { error: 'User not registered. Please register first', success: false }

        const res = await sendOTPCode(mobile)
        if (res.success) {
            return { success: true }
        } else {
            return { error: res.error || 'Failed to send OTP', success: false }
        }
    } catch (e) {
        console.error('Error in sendOTP:', e)
        return { error: 'Database connection failed. Please try again.', success: false }
    }
}

export async function verifyOTP(mobile: string, otp: string) {
    const res = await verifyOTPCode(mobile, otp)
    if (res.success) {
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
    return { error: res.error || 'Invalid OTP' }
}

export async function signOut() {
    const cookieStore = await cookies()
    cookieStore.delete('user_session')
    redirect('/')
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
        const denomination = formData.get('denomination') as string
        const dosham = formData.get('dosham') as string
        const currentResidence = formData.get('currentResidence') as string
        const photoUrl = formData.get('photoUrl') as string
        const email = formData.get('email') as string
        const location = formData.get('location') as string
        const occupation = formData.get('occupation') as string
        const birthStar = formData.get('birthStar') as string
        const qualification = formData.get('qualification') as string
        const consent = formData.get('consent') === 'on'
        const maritalStatus = formData.get('maritalStatus') as string

        // Check for profile completion (as per user request: qualification mandatory, occupation optional)
        const isComplete = !!(
            bio?.trim() &&
            dob &&
            religion?.trim() &&
            currentResidence &&
            location?.trim() &&
            qualification?.trim() &&
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
                denomination,
                dosham,
                currentResidence,
                location,
                occupation,
                birthStar,
                qualification,
                consent,
                photoUrl,
                maritalStatus,
            } as any
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

        const user = await prisma.user.findUnique({
            where: { id: userSession },
            include: {
                profile: true,
                _count: {
                    select: {
                        receivedInterests: {
                            where: { status: 'PENDING' }
                        },
                        sentInterests: {
                            where: {
                                status: { in: ['ACCEPTED', 'REJECTED'] },
                                isSeenBySender: false
                            }
                        }
                    }
                }
            }
        })

        if (user) {
            return {
                ...user,
                isPaid: true // TEMPORARY BYPASS: Always treat as paid for viewing sensitive info
            }
        }
        return null;
    } catch (error) {
        console.warn('Database connection failed in getProfile')
        return null
    }
}

export async function unlockContact(targetId: string) {
    try {
        const cookieStore = await cookies()
        const userSession = cookieStore.get('user_session')?.value
        if (!userSession) return { error: 'Unauthorized' }

        const currentUser = await prisma.user.findUnique({ where: { id: userSession } })
        if (!currentUser?.isPaid) {
            return { error: 'Only premium members can unlock contact details.' }
        }

        await (prisma as any).contactView.upsert({
            where: {
                viewerId_targetId: {
                    viewerId: userSession,
                    targetId: targetId
                }
            },
            update: {},
            create: {
                viewerId: userSession,
                targetId: targetId
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Error in unlockContact:', error)
        return { error: 'Failed to unlock contact. Please try again.' }
    }
}

export async function hasUnlockedContact(viewerId: string, targetId: string) {
    try {
        const view = await (prisma as any).contactView.findUnique({
            where: {
                viewerId_targetId: {
                    viewerId,
                    targetId
                }
            }
        })
        return !!view
    } catch (error) {
        return false
    }
}
