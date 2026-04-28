// Client-side wrappers for Auth Actions

export async function getSession() {
    try {
        const res = await fetch('/api/profile').then(r => r.json());
        return res;
    } catch (e) {
        return null;
    }
}
