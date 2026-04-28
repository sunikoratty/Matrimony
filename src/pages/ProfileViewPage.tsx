import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CircularLoader from '@/components/ui/CircularLoader'
import Header from '@/components/landing/Header'
import MatchesList from '@/components/user/MatchesList'

export default function ProfileViewPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Support all parameters from search section
    const mode = searchParams.get('mode') || 'recommended';
    const gender = searchParams.get('gender');
    const age = searchParams.get('age');
    const religion = searchParams.get('religion');
    const caste = searchParams.get('caste');
    const dosham = searchParams.get('dosham');
    const denomination = searchParams.get('denomination');

    const [user, setUser] = useState<any>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [matchesLoading, setMatchesLoading] = useState(false);

    // Fetch everything
    useEffect(() => {
        const fetchData = async () => {
            // If it's the first load, 'loading' is already true
            if (!loading) {
                setMatchesLoading(true);
                setMatches([]);
                setUnlockedIds([]);
            }
            
            try {
                // 1. Get user profile
                const u = await fetch('/api/profile').then(r => r.json());
                setUser(u);
                
                // Note: Guests (u === null) are allowed to browse via this page now
                // but we might want to redirect registered users to setup if needed
                if (u && !u.isProfileCompleted) {
                    navigate('/profile/setup');
                    return;
                }

                // 2. Get matches with all filters
                const params = new URLSearchParams(searchParams);
                if (!params.get('mode')) params.set('mode', 'recommended');
                
                const query = params.toString();
                const res = await fetch(`/api/matches?${query}`).then(r => r.json());
                
                setMatches(res.matches || []);
                setUnlockedIds(res.unlockedIds || []);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
                setMatchesLoading(false);
            }
        };
        fetchData();
    }, [searchParams, navigate]); // Trigger on any search param change

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <CircularLoader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Header user={user} />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mt-4">
                        <MatchesList
                            matches={matches}
                            currentUser={user || { isPaid: false, country: 'INDIA' }}
                            isGuest={!user}
                            unlockedIds={unlockedIds}
                            layout="cards"
                            isLoadingMatches={matchesLoading}
                            gender={gender as any}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
