const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            include: { profile: true }
        });

        console.log(`Checking ${users.length} users...`);

        for (const user of users) {
            const p = user.profile;
            const isComplete = !!(
                p &&
                p.dob &&
                p.religion &&
                p.photoUrl
            );

            if (isComplete && !user.isProfileCompleted) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { isProfileCompleted: true }
                });
                console.log(`Marked ${user.name} as completed.`);
            } else {
                console.log(`Skipping ${user.name} (Complete: ${isComplete}, Flag already set: ${user.isProfileCompleted})`);
            }
        }

        console.log('Update finished.');
    } catch (err) {
        console.error('Error updating profiles:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
