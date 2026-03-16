'use server'

import { prisma } from './db'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSession() {
    const cookieStore = await cookies()
    return cookieStore.get('user_session')?.value
}

function getEighteenYearsAgo() {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 18)
    return date
}

export async function sendInterest(targetId: string) {
    const userId = await getSession()
    if (!userId) throw new Error('Unauthorized')

    // Create or Update Interest (to allow resending after rejection)
    await prisma.interest.upsert({
        where: {
            senderId_targetId: {
                senderId: userId,
                targetId: targetId
            }
        },
        update: {
            status: 'PENDING',
            isSeenBySender: false
        },
        create: {
            senderId: userId,
            targetId: targetId,
            status: 'PENDING'
        }
    })

    revalidatePath(`/profile/${targetId}`)
    return { success: true }
}

export async function getInterestStatus(targetId: string) {
    const userId = await getSession()
    if (!userId) return null

    const interest = await prisma.interest.findUnique({
        where: {
            senderId_targetId: {
                senderId: userId,
                targetId: targetId
            }
        }
    })

    return interest?.status || null
}

export async function getReceivedInterests() {
    const userId = await getSession()
    if (!userId) return []

    const eighteenYearsAgo = getEighteenYearsAgo()
    const interests = await prisma.interest.findMany({
        where: {
            targetId: userId,
            status: 'PENDING',
            sender: {
                profile: {
                    dob: { lte: eighteenYearsAgo }
                }
            }
        },
        include: {
            sender: {
                include: {
                    profile: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return interests
}

export async function getInterestUpdates() {
    const userId = await getSession()
    if (!userId) return []

    // Fetch sent interests that are accepted or rejected
    const eighteenYearsAgo = getEighteenYearsAgo()
    const interests = await prisma.interest.findMany({
        where: {
            senderId: userId,
            status: {
                in: ['ACCEPTED', 'REJECTED']
            },
            target: {
                profile: {
                    dob: { lte: eighteenYearsAgo }
                }
            }
        },
        include: {
            target: {
                include: {
                    profile: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })

    return interests
}

export async function markInterestsAsSeen() {
    const userId = await getSession()
    if (!userId) return

    await prisma.interest.updateMany({
        where: {
            senderId: userId,
            status: {
                in: ['ACCEPTED', 'REJECTED']
            },
            isSeenBySender: false
        },
        data: {
            isSeenBySender: true
        }
    })

    revalidatePath('/profile/interests')
    revalidatePath('/') // To update header badge
}

export async function respondToInterest(interestId: string, status: 'ACCEPTED' | 'REJECTED') {
    const userId = await getSession()
    if (!userId) throw new Error('Unauthorized')

    await prisma.interest.update({
        where: {
            id: interestId,
            targetId: userId // Ensure ownership
        },
        data: {
            status
        }
    })

    revalidatePath('/profile/interests')
    return { success: true }
}
