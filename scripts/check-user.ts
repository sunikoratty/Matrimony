import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const mobile = process.argv[2]
    if (!mobile) {
        console.log('Please provide a mobile number: npx tsx scripts/check-user.ts +91...')
        return
    }

    console.log(`Checking data for user: ${mobile}`)
    const user = await prisma.user.findUnique({
        where: { mobile },
        include: { profile: true }
    })

    if (!user) {
        console.log('User not found.')
    } else {
        console.log('User ID:', user.id)
        console.log('Name:', user.name)
        console.log('Gender:', user.gender)
        console.log('Country:', user.country)
        console.log('Profile Data:')
        console.log(' - Religion:', `'${(user as any).profile?.religion}'`)
        console.log(' - Denomination:', `'${(user as any).profile?.denomination}'`)
        console.log(' - Caste:', `'${(user as any).profile?.caste}'`)
        console.log(' - isProfileCompleted:', user.isProfileCompleted)
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
