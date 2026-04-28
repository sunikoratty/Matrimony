// Client-side wrappers for Match Actions

export async function getMatches(
    mode: 'broad' | 'matching' | 'recommended' = 'broad',
    skip: number = 0,
    take: number = 20,
    gender?: 'MALE' | 'FEMALE',
    filters?: any
) {
    try {
        const queryParams = new URLSearchParams({
            mode,
            skip: skip.toString(),
            take: take.toString(),
            ...(gender ? { gender } : {}),
            ...filters
        });
        const res = await fetch(`/api/matches?${queryParams.toString()}`).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed', matches: [] };
    }
}

export async function getPublicProfiles(gender?: 'MALE' | 'FEMALE', limit: number = 10, random: boolean = false) {
    try {
        const queryParams = new URLSearchParams({
            limit: limit.toString(),
            random: random.toString(),
            ...(gender ? { gender } : {})
        });
        const res = await fetch(`/api/public-profiles?${queryParams.toString()}`).then(r => r.json());
        return res;
    } catch (e) {
        return [];
    }
}
