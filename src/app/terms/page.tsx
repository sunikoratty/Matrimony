import Header from '@/components/landing/Header'
import { getProfile } from '@/lib/user-actions'
import Link from 'next/link'

export const metadata = {
    title: 'Terms of Service - Match',
    description: 'Terms and conditions for using our platform.'
}

export default async function TermsPage() {
    const user = await getProfile()

    return (
        <div className="min-h-screen bg-slate-50">
            <Header user={user} />

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12">
                        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-rose-600 transition-colors mb-6 font-medium group">
                            <span className="mr-2 group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Terms of Service</h1>
                        <p className="text-slate-500 mb-8">By registering and using our matrimony platform, you agree to the following terms:</p>

                        <div className="space-y-8 text-slate-700">

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Platform Usage</h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li>The platform is intended only for lawful matrimonial purposes</li>
                                    <li>Users must provide accurate and genuine information</li>
                                    <li>Fake, misleading, or inappropriate content may lead to account suspension</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Our Role</h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li>Our responsibility is limited to providing profile information to registered users</li>
                                    <li>We do not guarantee matches, compatibility, or outcomes</li>
                                    <li>We do not participate in personal communications, meetings, or decisions</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">User Responsibility</h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li>Any communication, meeting, or relationship formed after profile sharing is entirely between users</li>
                                    <li>The platform is not responsible for disputes, misunderstandings, or future consequences</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Future Events</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Any events, agreements, or issues arising after profile exchange are the sole responsibility of the concerned parties.
                                </p>
                            </section>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
