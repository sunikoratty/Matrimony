'use server'

import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function getMatches(
    mode: 'broad' | 'matching' | 'recommended' = 'broad',
    skip: number = 0,
    take: number = 20,
    guestGender?: 'MALE' | 'FEMALE',
    filters?: {
        minAge?: number,
        maxAge?: number,
        religion?: string,
        caste?: string,
        dosham?: string,
        denomination?: string
    }
) {
    try {
        const cookieStore = await cookies()
        const userSession = cookieStore.get('user_session')?.value

        // Guest Mode
        if (!userSession) {
            console.log(`[Matchmaking] Guest Mode - fetching all ${guestGender || 'FEMALE'}s globally`)

            // Age to DOB translation
            let dobFilter = {}
            if (filters?.minAge || filters?.maxAge) {
                const now = new Date()
                const maxDob = filters.minAge ? new Date(now.getFullYear() - filters.minAge, now.getMonth(), now.getDate()) : undefined
                const minDob = filters.maxAge ? new Date(now.getFullYear() - (filters.maxAge + 1), now.getMonth(), now.getDate() + 1) : undefined

                dobFilter = {
                    ...(minDob ? { gte: minDob } : {}),
                    ...(maxDob ? { lte: maxDob } : {})
                }
            }

            const matches = await prisma.user.findMany({
                where: {
                    role: 'USER',
                    gender: guestGender || 'FEMALE',
                    status: 'ACTIVE',
                    isProfileCompleted: true,
                    profile: {
                        maritalStatus: { not: 'MARRIED' },
                        ...(filters?.religion ? { religion: filters.religion } : {}),
                        ...(filters?.caste ? { caste: filters.caste } : {}),
                        ...(filters?.dosham ? { dosham: filters.dosham } : {}),
                        ...(filters?.denomination ? { denomination: filters.denomination } : {}),
                        ...(Object.keys(dobFilter).length > 0 ? { dob: dobFilter } : {})
                    }
                },
                include: { profile: true },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            })
            return {
                matches,
                currentUser: { isPaid: false, country: 'INDIA' },
                isGuest: true,
                unlockedIds: []
            }
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: userSession },
            include: { profile: true }
        })

        if (!currentUser) return { error: 'User not found' }

        // EXCLUSIVE RULE: For logged-in users, ALWAYS show the opposite gender.
        // Even if they click a "Brides" link, if they are female, they must see "Grooms" (Males).
        // This confirms "clicking View All Brides -> should display the Profiles of Males only in matches?gender=MALE"
        const matchGender = currentUser.gender === 'MALE' ? 'FEMALE' : 'MALE'
        // const matchCountry = currentUser.country // Removed from baseCriteria

        const baseCriteria: any = {
            role: 'USER',
            gender: matchGender,
            status: 'ACTIVE',
            isProfileCompleted: true, // Only show completed profiles
            profile: {
                maritalStatus: { not: 'MARRIED' }
            }
        }

        let matches: any[] = []

        if (mode === 'matching' || mode === 'recommended') {
            const profile = currentUser.profile as any

            // Priority: Search Filters > Profile Defaults
            const religion = filters?.religion || profile?.religion?.trim()
            const caste = filters?.caste || profile?.caste?.trim()
            const dosham = filters?.dosham || profile?.dosham as string | undefined
            const denomination = filters?.denomination || profile?.denomination as string | undefined

            // Age Filter for User Mode
            let dobFilter = {}
            if (filters?.minAge || filters?.maxAge) {
                const now = new Date()
                const maxDob = filters.minAge ? new Date(now.getFullYear() - filters.minAge, now.getMonth(), now.getDate()) : undefined
                const minDob = filters.maxAge ? new Date(now.getFullYear() - (filters.maxAge + 1), now.getMonth(), now.getDate() + 1) : undefined
                dobFilter = {
                    ...(minDob ? { gte: minDob } : {}),
                    ...(maxDob ? { lte: maxDob } : {})
                }
            }

            console.log(`[Matchmaking] User: ${currentUser.name}, Mode: ${mode}, Religion Filter: '${religion}'`)

            if (religion && religion !== 'N/A') {
                const religionConditions: any[] = []

                if (religion === 'Hindu') {
                    if (dosham?.trim()) religionConditions.push({ religion, dosham: dosham.trim() })
                    if (caste?.trim()) religionConditions.push({ religion, caste: caste.trim() })
                    religionConditions.push({ religion })
                } else if (religion === 'Christian') {
                    if (denomination?.trim()) religionConditions.push({ religion, denomination: denomination.trim() })
                    religionConditions.push({ religion })
                } else {
                    religionConditions.push({ religion })
                }

                matches = await prisma.user.findMany({
                    where: {
                        ...baseCriteria,
                        profile: {
                            ...baseCriteria.profile,
                            OR: religionConditions,
                            ...(Object.keys(dobFilter).length > 0 ? { dob: dobFilter } : {})
                        }
                    },
                    include: { profile: true },
                    skip,
                    take,
                    orderBy: { createdAt: 'desc' }
                })

                console.log(`[Matchmaking] Found ${matches.length} strict global matches for ${religion}`)

                // FALLBACK REMOVED: We no longer append broader matches in recommended mode
            } else {
                // No religion set on profile - return broad global matches
                console.log(`[Matchmaking] No valid religion found, fetching broad matches`)
                matches = await prisma.user.findMany({
                    where: baseCriteria,
                    include: { profile: true },
                    skip,
                    take,
                    orderBy: { createdAt: 'desc' }
                })
            }
        } else {
            // Broad mode - strictly base criteria (gender, role, status, completed)
            // NO country/religion filter here - shows ALL profiles of opposite gender globally
            console.log(`[Matchmaking] Mode is 'broad' - matching all ${matchGender}s globally`)
            matches = await prisma.user.findMany({
                where: baseCriteria,
                include: { profile: true },
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            })
        }

        const unlockedIdsSet = new Set(
            currentUser.id ? await (prisma as any).contactView.findMany({
                where: { viewerId: currentUser.id },
                select: { targetId: true }
            }).then((views: any[]) => views.map((v: any) => v.targetId as string)) : []
        )

        const matchesWithUnlockStatus = matches.map(m => ({
            ...m,
            isUnlocked: unlockedIdsSet.has(m.id)
        }))

        console.log(`[UnlockCheck] User: ${currentUser.mobile}, Total Matches: ${matches.length}, Unlocked Count: ${unlockedIdsSet.size}`)

        return {
            matches: matchesWithUnlockStatus,
            currentUser: { isPaid: currentUser.isPaid, country: currentUser.country },
            unlockedIds: Array.from(unlockedIdsSet) // Keep for backward compatibility if needed
        }
    } catch (error) {
        console.warn('Database connection failed in getMatches:', error)
        return { matches: [], currentUser: { isPaid: false, country: 'INDIA' }, isGuest: true, error: 'Database connection failed', unlockedIds: [] }
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
