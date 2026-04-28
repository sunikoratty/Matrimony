import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['error'], // Only log errors
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Retries a database operation with exponential backoff
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error: any) {
            lastError = error;
            // Retry on connection issues, timeouts, or specific Prisma errors
            const isTransient = 
                error.message?.includes('connection') || 
                error.message?.includes('timeout') || 
                error.code === 'P2024' || // Connection timeout
                error.code === 'P1001';   // Can't reach DB server

            if (!isTransient || i === maxRetries - 1) throw error;
            
            console.warn(`DB Operation failed (attempt ${i + 1}/${maxRetries}). Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
    throw lastError;
}
