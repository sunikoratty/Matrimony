import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '@/components/landing/Header'
import MatchesList from '@/components/user/MatchesList'

export default function ProfileViewPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'recommended';

    const [user, setUser] = useState<any>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [matchesLoading, setMatchesLoading] = useState(false);

    // Fetch user once on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const u = await fetch('/api/profile').then(r => r.json());
                if (!u) { navigate('/login'); return; }
                if (!u.isProfileCompleted) { navigate('/profile/setup'); return; }
                setUser(u);
            } catch (error) {
                console.error("Failed to fetch user", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    // Re-fetch matches whenever mode changes
    useEffect(() => {
        if (!user) return; // wait until user is loaded
        const fetchMatches = async () => {
            setMatchesLoading(true);
            try {
                const res = await fetch(`/api/matches?mode=${mode}`).then(r => r.json());
                setMatches(res.matches || []);
                setUnlockedIds(res.unlockedIds || []);
            } catch (error) {
                console.error("Failed to fetch matches", error);
            } finally {
                setMatchesLoading(false);
            }
        };
        fetchMatches();
    }, [mode, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen">
            <Header user={user} />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mt-4">
                        <MatchesList
                            matches={matches}
                            currentUser={{
                                isPaid: true,
                                country: user.country || 'INDIA'
                            }}
                            unlockedIds={unlockedIds}
                            layout="cards"
                            isLoadingMatches={matchesLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
