import Link from 'next/link'
import Header from '@/components/landing/Header'
import { getProfile } from '@/lib/user-actions'

export const metadata = {
    title: 'About Us - Match',
    description: 'Learn more about our mission to bring genuine profiles together.'
}

export default async function AboutPage() {
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
                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-8 text-center">About Us</h1>

                        <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                            <p>
                                We are a trusted matrimony platform created to help individuals and families find suitable life partners in a simple, secure, and respectful way. Our goal is to bring genuine profiles together and make the search for a compatible match easier and more meaningful.
                            </p>

                            <p>
                                We focus on providing accurate profile details to registered users so they can connect based on shared values, preferences, and expectations. Our platform acts as a bridge that enables introductions, while the decisions and communications between members remain entirely their own.
                            </p>

                            <div className="bg-rose-50 p-6 rounded-xl border border-rose-100 my-8">
                                <p className="font-medium text-rose-800 italic text-center">
                                    "We believe marriage is a lifelong journey, and our role is limited to helping you take the first step by discovering the right profiles. Trust, transparency, and user responsibility are the pillars on which our platform is built."
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <Link href="/register" className="px-8 py-3 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">
                                Start Your Journey
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
