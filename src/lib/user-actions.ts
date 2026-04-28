// Client-side wrappers for User Actions
import { z } from 'zod'

export async function registerUser(formData: FormData) {
    const data = Object.fromEntries(formData.entries())
    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}

export async function sendOTP(mobile: string) {
    try {
        const res = await fetch('/api/otp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile })
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}

export async function verifyOTP(mobile: string, otp: string) {
    try {
        const res = await fetch('/api/otp/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, code: otp })
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}

export async function signOut() {
    try {
        await fetch('/api/auth/signout', { method: 'POST' });
        window.location.href = '/';
    } catch (e) {
        console.error("Signout failed", e);
    }
}

export async function updateProfile(formData: FormData) {
    const data = Object.fromEntries(formData.entries())
    try {
        const res = await fetch('/api/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}

export async function getProfile() {
    try {
        const res = await fetch('/api/profile').then(r => r.json());
        return res;
    } catch (e) {
        return null;
    }
}

export async function getProfileById(id: string) {
    try {
        const res = await fetch(`/api/profile/${id}`).then(r => r.json());
        return res;
    } catch (e) {
        return null;
    }
}

export async function unlockContact(targetId: string) {
    try {
        const res = await fetch('/api/interests/unlock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetId })
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}
