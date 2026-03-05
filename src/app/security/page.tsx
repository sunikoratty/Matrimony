import Header from '@/components/landing/Header'
import { getProfile } from '@/lib/user-actions'
import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Security - True Match',
    description: 'Our commitment to data protection and platform security.'
}

export default async function SecurityPage() {
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
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-rose-600 h-8 w-8" />
                            <h1 className="text-3xl font-serif font-bold text-slate-900">Security</h1>
                        </div>

                        <p className="text-slate-500 mb-8">We take reasonable measures to protect user data and maintain platform security.</p>

                        <div className="space-y-8 text-slate-700">

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Security Measures</h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                                    <li>Controlled access to profiles for registered users only</li>
                                    <li>Secure systems to store and manage user information</li>
                                    <li>Regular monitoring to prevent unauthorized access</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">Limitations</h2>
                                <p className="text-slate-600 leading-relaxed">
                                    While we strive to protect your information, no digital platform can guarantee complete security. Users are advised to exercise caution while sharing personal or sensitive details.
                                </p>
                            </section>

                            <section>
                                <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
                                    <h2 className="text-xl font-bold text-rose-900 mb-3">User Awareness</h2>
                                    <p className="text-rose-800 mb-3">We encourage users to:</p>
                                    <ul className="list-disc pl-5 space-y-2 text-rose-700">
                                        <li>Verify profiles independently</li>
                                        <li>Avoid sharing financial or highly sensitive information</li>
                                        <li>Report suspicious activity immediately</li>
                                    </ul>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
