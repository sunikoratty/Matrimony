import { getProfile } from '@/lib/user-actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileSetupForm from '@/components/user/ProfileSetupForm'

export default async function ProfileSetup() {
    const user = await getProfile()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Edit Profile <span className="text-slate-400 font-normal ml-2">({user.name})</span>
                    </h1>
                    <Link href="/profile/view" className="text-slate-500 hover:text-rose-600 font-medium text-sm">
                        &larr; Back to Profile
                    </Link>
                </div>
                <p className="text-slate-500 mb-8">Update your details to find better matches.</p>

                <ProfileSetupForm user={user} />
            </div>
        </div>
    )
}
