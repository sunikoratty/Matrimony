const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting data cleanup...');
    
    // Find all users who are NOT ADMIN
    const usersToDelete = await prisma.user.findMany({
        where: {
            role: {
                not: 'ADMIN'
            }
        },
        select: { id: true }
    });

    const userIds = usersToDelete.map(u => u.id);
    console.log(`Found ${userIds.length} users to delete.`);

    if (userIds.length === 0) {
        console.log('No profiles to delete.');
        return;
    }

    // Delete all Interests involving these users
    const deletedInterests = await prisma.interest.deleteMany({
        where: {
            OR: [
                { senderId: { in: userIds } },
                { targetId: { in: userIds } }
            ]
        }
    });
    console.log(`Deleted ${deletedInterests.count} interests.`);

    // Delete all ContactViews involving these users
    const deletedContactViews = await prisma.contactView.deleteMany({
        where: {
            OR: [
                { viewerId: { in: userIds } },
                { targetId: { in: userIds } }
            ]
        }
    });
    console.log(`Deleted ${deletedContactViews.count} contact views.`);

    // Delete all Profiles for these users
    const deletedProfiles = await prisma.profile.deleteMany({
        where: {
            userId: { in: userIds }
        }
    });
    console.log(`Deleted ${deletedProfiles.count} profiles.`);

    // Delete the Users
    const deletedUsers = await prisma.user.deleteMany({
        where: {
            id: { in: userIds }
        }
    });
    console.log(`Deleted ${deletedUsers.count} users.`);

    console.log('Cleanup complete!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
