import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.upsert({
        where: { mobile: '9999999999' },
        update: { password: 'admin' },
        create: {
            name: 'Admin',
            mobile: '9999999999',
            email: 'admin@matrimony.com',
            password: 'admin',
            gender: 'MALE',
            motherTongue: 'English',
            country: 'INDIA',
            role: 'ADMIN',
            isPaid: true,
            profile: {
                create: {
                    bio: 'System Administrator',
                    religion: 'N/A',
                    caste: 'N/A',
                    currentResidence: 'Kerala, India',
                }
            }
        },
    })
    console.log({ admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
