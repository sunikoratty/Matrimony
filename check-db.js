const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const totalUsers = await prisma.user.count();
        const completedUsers = await prisma.user.count({
            where: { isProfileCompleted: true }
        });
        const usersWithProfiles = await prisma.user.findMany({
            include: { profile: true }
        });
        const stats = usersWithProfiles.map(u => ({
            name: u.name,
            hasProfile: !!u.profile,
            dob: u.profile?.dob,
            religion: u.profile?.religion,
            hasPhoto: !!u.profile?.photoUrl,
            isProfileCompleted: u.isProfileCompleted
        }));
        console.log(JSON.stringify(stats, null, 2));
    } catch (err) {
        console.error('Error checking database:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
