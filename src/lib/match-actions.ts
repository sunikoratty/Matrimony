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
            const dosham = profile?.dosham as string | undefined
            const denomination = profile?.denomination as string | undefined

            if (religion === 'Hindu') {
                // Hindu Priority Logic:
                // 1. Same Religion + Same Dosham (if available)
                // 2. Same Religion + Same Caste (if available)
                // 3. Same Religion

                const conditions = []

                // Priority 1: Religion + Dosham
                if (dosham) {
                    conditions.push({ ...baseCriteria.profile, religion, dosham })
                }

                // Priority 2: Religion + Caste
                if (caste) {
                    conditions.push({ ...baseCriteria.profile, religion, caste })
                }

                // Priority 3: Religion only
                conditions.push({ ...baseCriteria.profile, religion })

                matches = await prisma.user.findMany({
                    where: {
                        ...baseCriteria,
                        OR: conditions.map(profileCond => ({ profile: profileCond }))
                    },
                    include: { profile: true },
                    skip,
                    take
                })
            } else if (religion === 'Christian') {
                // Christian Priority Logic:
                // 1. Same Religion + Same Denomination (if available)
                // 2. Same Religion

                const conditions = []

                // Priority 1: Religion + Denomination
                if (denomination) {
                    conditions.push({ ...baseCriteria.profile, religion, denomination })
                }

                // Priority 2: Religion only
                conditions.push({ ...baseCriteria.profile, religion })

                matches = await prisma.user.findMany({
                    where: {
                        ...baseCriteria,
                        OR: conditions.map(profileCond => ({ profile: profileCond }))
                    },
                    include: { profile: true },
                    skip,
                    take
                })
            } else if (religion === 'Muslim') {
                // Muslim logic: Just same religion
                matches = await prisma.user.findMany({
                    where: {
                        ...baseCriteria,
                        profile: {
                            ...baseCriteria.profile,
                            religion
                        }
                    },
                    include: { profile: true },
                    skip,
                    take
                })
            } else {
                // Fallback for other/no religion
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
                take: limit
            })

            return profiles
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
