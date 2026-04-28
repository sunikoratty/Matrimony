import React, { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import Header from '@/components/landing/Header'
import MatchesList from '@/components/user/MatchesList'
import { ArrowLeft } from 'lucide-react'

export default function MatchesPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                // Build query string from searchParams
                const query = searchParams.toString();
                const [matchesRes, profileRes] = await Promise.all([
                    fetch(`/api/matches?${query}`).then(r => r.json()),
                    fetch('/api/profile').then(r => r.json())
                ]);

                if (matchesRes.error) {
                    console.error(matchesRes.error);
                } else {
                    setData({
                        matches: matchesRes.matches,
                        currentUser: matchesRes.currentUser,
                        isGuest: matchesRes.isGuest,
                        unlockedIds: matchesRes.unlockedIds || [],
                        user: profileRes
                    });

                    // Safety check: Registered users must complete profile before browsing
                    if (!matchesRes.isGuest && profileRes && !profileRes.isProfileCompleted) {
                        navigate('/profile/setup');
                    }
                }
            } catch (error) {
                console.error("Failed to fetch matches", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return <div className="p-20 text-center">Failed to load matches.</div>;

    const { matches, currentUser, isGuest, unlockedIds, user } = data;
    const gender = searchParams.get('gender') as 'MALE' | 'FEMALE' | undefined;

    return (
        <div className="min-h-screen">
            <Header user={user} />
            <div className="pt-20">
                {/* Hero Section */}
                <div className="relative h-64 sm:h-80 bg-rose-900 overflow-hidden mb-8">
                    <picture className="w-full h-full block">
                        <source media="(min-width: 640px)" srcSet="/images/KeralaCoupleLarge.png" />
                        <img
                            src="/images/KeralaCouple.png"
                            alt="Matches Banner"
                            className="w-full h-full object-cover object-top"
                        />
                    </picture>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <Link
                            to="/"
                            className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs sm:text-sm font-medium z-10 hover:bg-black/40"
                        >
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                        <div className="max-w-2xl relative z-10 mt-8 sm:mt-0">
                            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">Discover Your Match.</h1>
                            <p className="text-rose-100/90 text-sm sm:text-lg font-light drop-shadow-md">
                                "Handpicked profiles curated just for you. Your forever begins here."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <MatchesList
                        matches={matches || []}
                        currentUser={currentUser}
                        isGuest={isGuest}
                        gender={gender || undefined}
                        unlockedIds={unlockedIds}
                    />
                </div>
            </div>
        </div>
    )
}
