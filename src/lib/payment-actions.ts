// Client-side wrappers for Payment Actions

export async function createOrder(amount: number, currency: string = 'INR') {
    try {
        const res = await fetch('/api/payments/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}

export async function verifyPayment(orderId: string, paymentId: string, signature: string) {
    try {
        const res = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, paymentId, signature })
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}
