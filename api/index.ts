import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
import { z } from 'zod';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import twilio from 'twilio';

dotenv.config();

const app = express();

// --- Razorpay Setup ---
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// --- Twilio Setup ---
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_SERVICE_SID;
const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;
const FORCE_MOCK = true;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://matrimony-web-app.vercel.app'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- Helpers ---
function getEighteenYearsAgo() {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 18)
    return date
}

// --- Auth Middleware ---
const authMiddleware = (req: any, res: any, next: any) => {
    const userSession = req.cookies['user_session'];
    if (!userSession) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = userSession;
    next();
};

// --- Routes ---

// Health Check
app.get('/api/health', (req, res) => {
    console.log('Health check called');
    res.json({ status: 'ok', environment: 'vercel' });
});

// Auth & OTP
app.post('/api/otp/send', async (req, res) => {
    const { mobile } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { mobile } });
        if (!user || user.role !== 'USER') {
            return res.status(404).json({ error: 'User not registered' });
        }

        if (FORCE_MOCK || !client || !verifySid) {
            console.log(`[MOCK OTP] for ${mobile} is 123456`);
            return res.json({ success: true, mock: true });
        }

        const verification = await client.verify.v2.services(verifySid)
            .verifications.create({ to: mobile, channel: 'sms' });
        res.json({ success: verification.status === 'pending' });
    } catch (e: any) {
        res.json({ success: true, mock: true, error: e.message });
    }
});

app.post('/api/otp/verify', async (req, res) => {
    const { mobile, code } = req.body;
    let success = false;

    if (FORCE_MOCK || code === '123456') {
        success = code === '123456';
    } else if (client && verifySid) {
        try {
            const check = await client.verify.v2.services(verifySid)
                .verificationChecks.create({ to: mobile, code });
            success = check.status === 'approved';
        } catch (e) { success = false; }
    }

    if (success) {
        const user = await prisma.user.findUnique({ where: { mobile } });
        if (!user || user.role !== 'USER') return res.status(404).json({ error: 'User not found' });

        res.cookie('user_session', user.id, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 7 * 1000,
            path: '/',
            sameSite: 'none'
        });
        return res.json({ success: true });
    }
    res.status(400).json({ error: 'Invalid OTP' });
});

app.post('/api/register', async (req, res) => {
    try {
        const { name, mobile, gender, motherTongue, country = 'INDIA' } = req.body;
        
        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { mobile } });
        if (existingUser) {
            return res.status(400).json({ error: 'Mobile number already registered' });
        }

        // 2. Create User and empty Profile
        const user = await prisma.user.create({
            data: {
                name,
                mobile,
                gender,
                motherTongue,
                country,
                profile: {
                    create: {} // Create an empty profile linked to the user
                }
            }
        });

        // 3. Set Session Cookie
        res.cookie('user_session', user.id, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 7 * 1000,
            path: '/',
            sameSite: 'none'
        });

        res.json({ success: true, userId: user.id });
    } catch (e) {
        console.error('Registration Error:', e);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

app.post('/api/auth/signout', (req, res) => {
    res.clearCookie('user_session');
    res.json({ success: true });
});

// User & Profile
app.get('/api/profile', async (req, res) => {
    const userSession = req.cookies['user_session'];
    if (!userSession) return res.json(null);
    try {
        const user = await prisma.user.findUnique({
            where: { id: userSession },
            include: {
                profile: true,
                _count: {
                    select: {
                        receivedInterests: { where: { status: 'PENDING' } },
                        sentInterests: {
                            where: { status: { in: ['ACCEPTED', 'REJECTED'] }, isSeenBySender: false }
                        }
                    }
                }
            }
        });
        res.json(user ? { ...user, isPaid: true } : null);
    } catch (e) { res.status(500).json({ error: 'DB Error' }); }
});

app.get('/api/profile/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: { profile: true }
        });
        if (!user) return res.status(404).json({ error: 'Profile not found' });
        res.json(user);
    } catch (e) { res.status(500).json({ error: 'DB Error' }); }
});

app.post('/api/profile/update', authMiddleware, async (req: any, res) => {
    try {
        const { bio, dob, religion, caste, denomination, dosham, currentResidence, photoUrl, email, location, occupation, birthStar, qualification, consent, maritalStatus } = req.body;
        
        if (email) {
            await prisma.user.update({ where: { id: req.userId }, data: { email } });
        }

        // Use upsert-like behavior to ensure profile exists
        const profileData = {
            bio, 
            dob: dob ? new Date(dob) : undefined, 
            religion, caste, denomination, dosham,
            currentResidence, location, occupation, birthStar, qualification, 
            consent: consent === 'on' || consent === true || consent === 'true', 
            photoUrl, 
            maritalStatus
        };

        await prisma.profile.upsert({
            where: { userId: req.userId },
            update: profileData as any,
            create: { ...profileData, userId: req.userId } as any
        });

        const isComplete = !!(dob && religion && currentResidence && location && qualification && photoUrl && maritalStatus);
        if (isComplete) {
            await prisma.user.update({ where: { id: req.userId }, data: { isProfileCompleted: true } });
        }

        res.json({ success: true });
    } catch (e) {
        console.error('Profile Update Error:', e);
        res.status(500).json({ error: 'Update failed' });
    }
});

// Matches
app.get('/api/matches', async (req, res) => {
    const userSession = req.cookies['user_session'];
    const { mode = 'broad', skip = 0, take = 20, id, gender, age, religion, caste, dosham, denomination } = req.query;

    try {
        const eighteenYearsAgo = getEighteenYearsAgo();
        const baseCriteria: any = {
            role: 'USER', 
            status: 'ACTIVE', 
            isProfileCompleted: true,
            ...(id ? { id: id as string } : {}),
            ...(gender ? { gender: gender as any } : {}),
            profile: { 
                maritalStatus: { not: 'MARRIED' },
                ...(religion ? { religion: religion as string } : {}),
                ...(caste ? { caste: caste as string } : {}),
                ...(dosham === 'No' ? { 
                    OR: [
                        { dosham: null },
                        { dosham: '' },
                        { dosham: 'No' }
                    ]
                } : dosham === 'Yes' ? {
                    AND: [
                        { dosham: { not: null } },
                        { dosham: { not: '' } },
                        { dosham: { not: 'No' } }
                    ]
                } : {}),
                ...(denomination ? { denomination: denomination as string } : {}),
            }
        };

        if (age && typeof age === 'string') {
            const [min, max] = age.split('-').map(Number);
            if (min && max) {
                const now = new Date();
                const minDate = new Date(now.getFullYear() - max - 1, now.getMonth(), now.getDate());
                const maxDate = new Date(now.getFullYear() - min, now.getMonth(), now.getDate());
                baseCriteria.profile.dob = { gte: minDate, lte: maxDate };
            }
        } else {
            baseCriteria.profile.dob = { lte: eighteenYearsAgo };
        }

        if (!userSession) {
            const matches = await prisma.user.findMany({
                where: baseCriteria,
                include: { profile: true },
                skip: Number(skip), take: Number(take),
                orderBy: { createdAt: 'desc' }
            });
            return res.json({ matches, isGuest: true, currentUser: { isPaid: false } });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: userSession },
            include: { profile: true }
        });
        if (!currentUser) return res.status(404).json({ error: 'User not found' });
        
        const finalCriteria = { ...baseCriteria };

        // Always show opposite gender unless explicitly filtered
        if (!gender) {
            finalCriteria.gender = currentUser.gender === 'MALE' ? 'FEMALE' : 'MALE';
        }

        // For recommended mode, filter by the current user's religion (if not already filtered)
        if (mode === 'recommended' && !religion && (currentUser as any).profile?.religion) {
            finalCriteria.profile = {
                ...finalCriteria.profile,
                religion: (currentUser as any).profile.religion,
            };
        }

        const matches = await prisma.user.findMany({
            where: finalCriteria,
            include: { profile: true },
            skip: Number(skip), take: Number(take),
            orderBy: { createdAt: 'desc' }
        });

        res.json({ matches, currentUser: { ...currentUser, isPaid: true } });
    } catch (e) { 
        res.status(500).json({ error: 'DB Error' }); 
    }
});

app.get('/api/public-profiles', async (req, res) => {
    const { gender, limit = 10 } = req.query;
    try {
        const eighteenYearsAgo = getEighteenYearsAgo();
        const profiles = await prisma.user.findMany({
            where: {
                role: 'USER',
                status: 'ACTIVE',
                isProfileCompleted: true,
                ...(gender ? { gender: gender as any } : {}),
                profile: {
                    maritalStatus: { not: 'MARRIED' },
                    dob: { lte: eighteenYearsAgo }
                }
            },
            include: { profile: true },
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
        });
        res.json(profiles);
    } catch (e) { res.status(500).json({ error: 'DB Error' }); }
});

// Interests
app.post('/api/interests/send', authMiddleware, async (req: any, res) => {
    const { targetId } = req.body;
    try {
        await prisma.interest.upsert({
            where: { senderId_targetId: { senderId: req.userId, targetId } },
            update: { status: 'PENDING', isSeenBySender: false },
            create: { senderId: req.userId, targetId, status: 'PENDING' }
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Failed to send interest' }); }
});

app.get('/api/interests/received', authMiddleware, async (req: any, res) => {
    try {
        const interests = await prisma.interest.findMany({
            where: { targetId: req.userId, status: 'PENDING' },
            include: { sender: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(interests);
    } catch (e) { res.status(500).json({ error: 'DB Error' }); }
});

app.get('/api/interests/sent-updates', authMiddleware, async (req: any, res) => {
    try {
        const interests = await prisma.interest.findMany({
            where: { senderId: req.userId, status: { in: ['ACCEPTED', 'REJECTED'] } },
            include: { target: { include: { profile: true } } },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(interests);
    } catch (e) { res.status(500).json({ error: 'DB Error' }); }
});

app.post('/api/interests/mark-seen', authMiddleware, async (req: any, res) => {
    try {
        await prisma.interest.updateMany({
            where: { senderId: req.userId, status: { in: ['ACCEPTED', 'REJECTED'] }, isSeenBySender: false },
            data: { isSeenBySender: true }
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'DB Error' }); }
});

app.post('/api/interests/respond', authMiddleware, async (req: any, res) => {
    const { interestId, status } = req.body;
    try {
        await prisma.interest.update({
            where: { id: interestId, targetId: req.userId },
            data: { status }
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Update failed' }); }
});

app.get('/api/interests/status/:targetId', authMiddleware, async (req: any, res) => {
    try {
        const interest = await prisma.interest.findFirst({
            where: { senderId: req.userId, targetId: req.params.targetId }
        });
        res.json(interest ? { status: interest.status } : null);
    } catch (e) { res.status(500).json({ error: 'DB Error' }); }
});

// Payments
app.post('/api/payments/create-order', authMiddleware, async (req: any, res) => {
    const { amount } = req.body;
    try {
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: `rcpt_${req.userId.slice(0, 8)}_${Date.now()}`,
        });
        res.json({ success: true, orderId: order.id, amount: order.amount });
    } catch (e) { res.status(500).json({ error: 'Payment failed' }); }
});

app.post('/api/payments/verify', authMiddleware, async (req: any, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString()).digest('hex');

    if (expectedSignature === razorpay_signature) {
        await prisma.user.update({ where: { id: req.userId }, data: { isPaid: true } });
        return res.json({ success: true });
    }
    res.status(400).json({ error: 'Invalid signature' });
});

// Admin Middleware
const adminMiddleware = async (req: any, res: any, next: any) => {
    const adminSession = req.cookies['admin_session'];
    if (!adminSession) return res.status(401).json({ error: 'Unauthorized' });
    const admin = await prisma.user.findUnique({ where: { id: adminSession } });
    if (!admin || admin.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    req.adminId = adminSession;
    next();
};

// Admin Routes
app.post('/api/admin/login', async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { mobile: identifier }],
                role: 'ADMIN',
            },
        });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.cookie('admin_session', user.id, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 1000,
            path: '/',
            sameSite: 'none'
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Login failed' }); }
});

app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('admin_session');
    res.json({ success: true });
});

app.get('/api/admin/users', adminMiddleware, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            orderBy: { createdAt: 'desc' },
            include: { profile: true },
        });
        res.json(users);
    } catch (e) { res.status(500).json({ error: 'DB Error' }); }
});

app.post('/api/admin/users/:id/toggle-paid', adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { currentStatus } = req.body;
    try {
        await prisma.user.update({
            where: { id },
            data: { isPaid: !currentStatus },
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Update failed' }); }
});

app.post('/api/admin/users/:id/status', adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await prisma.user.update({
            where: { id },
            data: { status },
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Update failed' }); }
});

app.put('/api/admin/users/:id', adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { profile, ...userData } = req.body;
    try {
        await prisma.$transaction(async (tx) => {
            await tx.user.update({ where: { id }, data: userData });
            if (profile) {
                await tx.profile.upsert({
                    where: { userId: id },
                    create: { ...profile, userId: id },
                    update: profile,
                });
            }
        });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Update failed' }); }
});

export default app;
