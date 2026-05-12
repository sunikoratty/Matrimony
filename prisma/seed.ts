import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { mobile: '9037246845' },
    update: {},
    create: {
      name: 'Admin User',
      mobile: '9037246845',
      password: 'admin',
      role: 'ADMIN',
      gender: 'MALE',
      motherTongue: 'Malayalam',
      country: 'INDIA',
    },
  })

  console.log('Admin user created:', admin.mobile)

  // Create some sample users
  const users = [
    {
      name: 'Rahul Nair',
      mobile: '+919999999991',
      gender: 'MALE',
      motherTongue: 'Malayalam',
      country: 'INDIA',
      profile: {
        create: {
          religion: 'Hindu',
          caste: 'Nair',
          maritalStatus: 'NEVER_MARRIED',
          qualification: 'B.Tech',
          location: 'Kochi, Kerala',
          occupation: 'Software Engineer',
          dob: new Date('1995-05-20'),
          bio: 'Looking for a compatible partner.',
          consent: true,
        },
      },
    },
    {
      name: 'Priya Sharma',
      mobile: '+919999999992',
      gender: 'FEMALE',
      motherTongue: 'Malayalam',
      country: 'INDIA',
      profile: {
        create: {
          religion: 'Hindu',
          caste: 'Brahmin',
          maritalStatus: 'NEVER_MARRIED',
          qualification: 'MBA',
          location: 'Trivandrum, Kerala',
          occupation: 'Marketing Manager',
          dob: new Date('1997-08-15'),
          bio: 'Family oriented and career focused.',
          consent: true,
        },
      },
    },
  ]

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { mobile: u.mobile },
      update: {},
      create: {
        ...u,
        isProfileCompleted: true,
      },
    })
    console.log(`Created user: ${user.name}`)
  }

  console.log('Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
