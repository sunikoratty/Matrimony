'use server'

import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function getMatches(
    mode: 'broad' | 'matching' = 'broad',
    skip: number = 0,
    take: number = 20,
    guestGender?: 'MALE' | 'FEMALE'
) {
    try {
        const cookieStore = await cookies()
        const userSession = cookieStore.get('user_session')?.value

        // Guest Mode
        if (!userSession) {
            const matches = await prisma.user.findMany({
                where: {
                    role: 'USER',
                    gender: guestGender || 'FEMALE',
                    status: 'ACTIVE',
                    isProfileCompleted: true, // Show only completed profiles
                    profile: {
                        maritalStatus: { not: 'MARRIED' }
                    }
                },
                include: { profile: true },
                skip,
                take
            })
            return { matches, currentUser: { isPaid: false, country: 'INDIA' }, isGuest: true }
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: userSession },
            include: { profile: true }
        })

        if (!currentUser) return { error: 'User not found' }

        const matchGender = currentUser.gender === 'MALE' ? 'FEMALE' : 'MALE'
        const matchCountry = currentUser.country

        const baseCriteria: any = {
            role: 'USER',
            gender: matchGender,
            country: matchCountry,
            status: 'ACTIVE',
            isProfileCompleted: true, // Only show completed profiles
            profile: {
                maritalStatus: { not: 'MARRIED' }
            }
        }

        let matches: any[] = []

        if (mode === 'matching') {
            const profile = currentUser.profile
            const religion = profile?.religion
            const caste = profile?.caste

            if (religion) {
                const strictCriteria = {
                    ...baseCriteria,
                    profile: {
                        ...baseCriteria.profile,
                        religion,
                        ...(caste ? { caste } : {})
                    }
                }

                matches = await prisma.user.findMany({
                    where: strictCriteria,
                    include: { profile: true },
                    skip,
                    take
                })

                if (matches.length < take && caste) {
                    const religionCriteria = {
                        ...baseCriteria,
                        profile: {
                            ...baseCriteria.profile,
                            religion
                        }
                    }
                    const additionalMatches = await prisma.user.findMany({
                        where: religionCriteria,
                        include: { profile: true },
                        skip: Math.max(0, skip - matches.length),
                        take: take - matches.length
                    })
                    matches = [...matches, ...additionalMatches]
                }
            } else {
                matches = await prisma.user.findMany({
                    where: baseCriteria,
                    include: { profile: true },
                    skip,
                    take
                })
            }
        } else {
            matches = await prisma.user.findMany({
                where: baseCriteria,
                include: { profile: true },
                skip,
                take
            })
        }

        return {
            matches,
            currentUser: { isPaid: currentUser.isPaid, country: currentUser.country }
        }
    } catch (error) {
        console.warn('Database connection failed in getMatches')
        return { matches: [], currentUser: { isPaid: false, country: 'INDIA' }, isGuest: true, error: 'Database connection failed' }
    }
}

export async function getPublicProfiles(gender?: 'MALE' | 'FEMALE', limit: number = 10, random: boolean = false) {
    try {
        const commonCriteria = {
            role: 'USER', // Ensure only USER role profiles are shown
            status: 'ACTIVE',
            isProfileCompleted: true, // Only show completed profiles
            ...(gender ? { gender } : {}),
            profile: {
                maritalStatus: { not: 'MARRIED' }
            }
        }

        if (random) {
            const profiles = await prisma.user.findMany({
                where: commonCriteria,
                include: { profile: true },
                take: 50
            })

            return profiles.sort(() => Math.random() - 0.5).slice(0, limit)
        }

        return await prisma.user.findMany({
            where: commonCriteria,
            include: { profile: true },
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        console.warn('Database connection failed in getPublicProfiles')
        return []
    }
}
