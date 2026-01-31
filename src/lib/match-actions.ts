'use server'

import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function getMatches(
    mode: 'broad' | 'matching' | 'recommended' = 'broad',
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

        if (mode === 'matching' || mode === 'recommended') {
            const profile = currentUser.profile as any
            const religion = profile?.religion?.trim()
            const caste = profile?.caste?.trim()
            const dosham = profile?.dosham as string | undefined
            const denomination = profile?.denomination as string | undefined

            console.log(`[Matchmaking] User: ${currentUser.name} (${currentUser.mobile}), Religion: '${religion}', Mode: ${mode}`)

            if (religion && religion !== 'N/A') {
                // Determine priority conditions based on religion
                const religionConditions: any[] = []

                if (religion === 'Hindu') {
                    if (dosham?.trim()) {
                        religionConditions.push({ religion, dosham: dosham.trim() })
                    }
                    if (caste?.trim()) {
                        religionConditions.push({ religion, caste: caste.trim() })
                    }
                    religionConditions.push({ religion })
                } else if (religion === 'Christian') {
                    if (denomination?.trim()) {
                        religionConditions.push({ religion, denomination: denomination.trim() })
                    }
                    religionConditions.push({ religion })
                } else {
                    // Muslim or any other specific religion
                    religionConditions.push({ religion })
                }

                // Strictly filter by chosen gender, status, AND the prioritized religion criteria
                matches = await prisma.user.findMany({
                    where: {
                        ...baseCriteria,
                        profile: {
                            ...baseCriteria.profile, // Contains maritalStatus filter
                            OR: religionConditions
                        }
                    },
                    include: { profile: true },
                    skip,
                    take,
                    orderBy: { createdAt: 'desc' }
                })

                console.log(`[Matchmaking] Found ${matches.length} strict matches for ${religion}`)

                // For 'recommended' mode, if we don't have enough matches, add broad ones
                if (mode === 'recommended' && matches.length < take) {
                    const matchedIds = matches.map(m => m.id)
                    const broadTake = take - matches.length

                    console.log(`[Matchmaking] Appending up to ${broadTake} broader matches for Hybrid Recommended view`)

                    const broaderMatches = await prisma.user.findMany({
                        where: {
                            ...baseCriteria,
                            id: { notIn: matchedIds }
                        },
                        include: { profile: true },
                        take: broadTake,
                        orderBy: { createdAt: 'desc' }
                    })
                    matches = [...matches, ...broaderMatches]
                }
            } else {
                // No religion set on profile - broad matching is the only fallback
                console.log(`[Matchmaking] No valid religion found, falling back to broad matches`)
                matches = await prisma.user.findMany({
                    where: baseCriteria,
                    include: { profile: true },
                    skip,
                    take,
                    orderBy: { createdAt: 'desc' }
                })
            }
        } else {
            // Broad mode - strictly base criteria (gender, country, status, completed)
            console.log(`[Matchmaking] Mode is 'broad' - ignoring religion completely`)
            matches = await prisma.user.findMany({
                where: baseCriteria,
                include: { profile: true },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
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
