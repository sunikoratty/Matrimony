import React, { useState, useEffect } from 'react';
import LandingPageContent from '@/components/landing/LandingPageContent';
import CircularLoader from '@/components/ui/CircularLoader';

export default function HomePage() {
    const [data, setData] = useState({ user: null, brides: [], grooms: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [user, brides, grooms] = await Promise.all([
                    fetch('/api/profile').then(r => r.json()),
                    fetch('/api/public-profiles?gender=FEMALE').then(r => r.json()),
                    fetch('/api/public-profiles?gender=MALE').then(r => r.json()),
                ]);
                setData({ user, brides, grooms });
            } catch (error) {
                console.error("Failed to fetch home page data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <CircularLoader size="lg" />
            </div>
        );
    }

    return <LandingPageContent {...data} />;
}
