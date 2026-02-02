import Header from '@/components/landing/Header'
import { getProfile } from '@/lib/user-actions'
import Link from 'next/link'

export const metadata = {
    title: 'Privacy Policy - Match',
    description: 'How we collect, use, and protect your personal information.'
}

export default async function PrivacyPage() {
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
                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Privacy Policy</h1>
                        <p className="text-slate-500 mb-8">Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.</p>

                        <div className="space-y-8 text-slate-700">

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Information We Collect</h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li>Personal details such as name, age, gender, contact details, and preferences provided during registration</li>
                                    <li>Profile information voluntarily submitted by users</li>
                                    <li>Basic technical information for app or website functionality</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">How We Use Your Information</h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li>To create and display user profiles to registered members only</li>
                                    <li>To help users discover suitable matches</li>
                                    <li>To maintain and improve platform functionality</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Information Sharing</h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li>Profile details are visible only to registered users of the platform</li>
                                    <li>We do not sell or rent your personal data to third parties</li>
                                    <li>Information is shared strictly for matrimony-related purposes</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">User Responsibility</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Once profile details are shared and communication begins between users, any further interaction, decision, or outcome is the sole responsibility of the involved parties.
                                </p>
                            </section>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
