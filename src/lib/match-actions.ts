'use server'

import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function getMatches(mode: 'broad' | 'matching' = 'broad', guestGender?: 'MALE' | 'FEMALE') {
    const userSession = (await cookies()).get('user_session')?.value

    // Guest Mode
    if (!userSession) {
        const matches = await prisma.user.findMany({
            where: {
                role: 'USER',
                gender: guestGender || 'FEMALE', // Default to female if not specified, but landing page will pass it
                status: 'ACTIVE',
                profile: {
                    maritalStatus: {
                        not: 'MARRIED'
                    }
                }
            },
            include: { profile: true },
            take: 20
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

    // Base criteria: Same Country, Opposite Gender, Active User, Not Married
    const baseCriteria: any = {
        role: 'USER',
        gender: matchGender,
        country: matchCountry,
        status: 'ACTIVE',
        profile: {
            maritalStatus: {
                not: 'MARRIED'
            }
        }
    }

    let matches: any[] = []

    if (mode === 'matching') {
        const profile = currentUser.profile
        const religion = profile?.religion
        const caste = profile?.caste

        // 1. Try Most Strict: Country + Religion + Caste (if provided)
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
                include: { profile: true }
            })

            // 2. Fallback: If Caste was provided but no matches found, try Religion only
            if (matches.length === 0 && caste) {
                const religionCriteria = {
                    ...baseCriteria,
                    profile: {
                        ...baseCriteria.profile,
                        religion
                    }
                }
                matches = await prisma.user.findMany({
                    where: religionCriteria,
                    include: { profile: true }
                })
            }
        } else {
            // No religion set, fall back to broad but within country
            matches = await prisma.user.findMany({
                where: baseCriteria,
                include: { profile: true }
            })
        }
    } else {
        // Broad Mode: Just Country + Opposite Gender
        matches = await prisma.user.findMany({
            where: baseCriteria,
            include: { profile: true }
        })
    }

    return {
        matches,
        currentUser: { isPaid: currentUser.isPaid, country: currentUser.country }
    }
}

export async function getPublicProfiles(gender?: 'MALE' | 'FEMALE', limit: number = 4) {
    const matches = await prisma.user.findMany({
        where: {
            role: 'USER',
            status: 'ACTIVE',
            ...(gender ? { gender } : {}),
            profile: {
                maritalStatus: {
                    not: 'MARRIED'
                }
            }
        },
        include: { profile: true },
        take: limit,
        orderBy: { createdAt: 'desc' }
    })

    return matches
}
