import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ProfileSetupForm from '@/components/user/ProfileSetupForm'

export default function ProfileSetupPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile').then(r => r.json());
                if (!res) {
                    navigate('/login');
                } else {
                    setUser(res);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image Board */}
            <div className="hidden lg:block lg:w-1/3 relative bg-rose-50">
                <div className="absolute inset-0 bg-rose-900/20 z-10" />
                <img
                    src="/images/CoupleImage3.png"
                    alt="Wedding Couple"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <h2 className="text-3xl font-serif font-bold mb-4">Perfect Your Profile.</h2>
                    <p className="text-rose-100">
                        "Your profile is the first step to your new beginning. Let's make it shine."
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-2/3 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
                <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Edit Profile <span className="text-slate-400 font-normal ml-2">({user.name})</span>
                        </h1>
                        <Link to="/profile/view" className="text-slate-500 hover:text-rose-600 font-medium text-sm">
                            &larr; Back to Profile
                        </Link>
                    </div>
                    <p className="text-slate-500 mb-8">Update your details to find better matches.</p>

                    <ProfileSetupForm user={user} />
                </div>
            </div>
        </div>
    )
}
