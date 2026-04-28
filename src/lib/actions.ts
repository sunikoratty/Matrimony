// Client-side wrappers for Admin Actions

export async function adminLogin(formData: FormData) {
    const data = Object.fromEntries(formData.entries())
    try {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}

export async function adminLogout() {
    try {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/admin/login';
    } catch (e) {
        console.error("Logout failed", e);
    }
}

export async function getUsers() {
    try {
        const res = await fetch('/api/admin/users').then(r => r.json());
        return res;
    } catch (e) {
        return [];
    }
}

export async function togglePaidStatus(userId: string, currentStatus: boolean) {
    try {
        await fetch(`/api/admin/users/${userId}/toggle-paid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentStatus })
        });
    } catch (e) {
        console.error("Toggle paid failed", e);
    }
}

export async function updateUserStatus(userId: string, status: string) {
    try {
        await fetch(`/api/admin/users/${userId}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
    } catch (e) {
        console.error("Update status failed", e);
    }
}

export async function adminUpdateUser(userId: string, data: any) {
    try {
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}
