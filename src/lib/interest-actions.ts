// Client-side wrappers for Interest Actions

export async function sendInterest(targetId: string) {
    try {
        const res = await fetch('/api/interests/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetId })
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}

export async function getReceivedInterests() {
    try {
        const res = await fetch('/api/interests/received').then(r => r.json());
        return res;
    } catch (e) {
        return [];
    }
}

export async function getInterestUpdates() {
    try {
        const res = await fetch('/api/interests/sent-updates').then(r => r.json());
        return res;
    } catch (e) {
        return [];
    }
}

export async function respondToInterest(interestId: string, status: 'ACCEPTED' | 'REJECTED') {
    try {
        const res = await fetch('/api/interests/respond', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interestId, status })
        }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}

export async function markInterestsAsSeen() {
    try {
        const res = await fetch('/api/interests/mark-seen', { method: 'POST' }).then(r => r.json());
        return res;
    } catch (e) {
        return { error: 'Connection failed' };
    }
}
export async function getInterestStatus(targetId: string) {
    try {
        const res = await fetch(`/api/interests/status/${targetId}`).then(r => r.json());
        return res;
    } catch (e) {
        return null;
    }
}
