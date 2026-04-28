import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/landing/Header'
import MatchesList from '@/components/user/MatchesList'

export default function ProfileViewPage() {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [user, matchesRes] = await Promise.all([
                    fetch('/api/profile').then(r => r.json()),
                    fetch('/api/matches?mode=recommended').then(r => r.json())
                ]);

                if (!user) {
                    navigate('/login');
                    return;
                }

                if (!user.isProfileCompleted) {
                    navigate('/profile/setup');
                    return;
                }

                setData({
                    user,
                    matches: matchesRes.matches || [],
                    unlockedIds: matchesRes.unlockedIds || []
                });
            } catch (error) {
                console.error("Failed to fetch profile data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    const { user, matches, unlockedIds } = data;

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
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
