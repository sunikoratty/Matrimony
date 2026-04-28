import React from 'react'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">Privacy Policy</h1>
                    <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Introduction</h2>
                            <p>
                                True Match is committed to protecting your personal information. This Privacy Policy explains how 
                                we collect, use, and share your personal data when you use our matrimony platform.
                            </p>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Information We Collect</h2>
                            <p>
                                We collect information that you provide directly to us, such as your name, contact details, 
                                photos, date of birth, religion, caste, and other profile details necessary for matching.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. How We Use Your Information</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>To provide and maintain our matching services.</li>
                                <li>To facilitate connections between members.</li>
                                <li>To verify your identity and prevent fraud.</li>
                                <li>To send you important notifications and updates.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Data Security</h2>
                            <p>
                                We implement industry-standard security measures to protect your data. However, no method of 
                                transmission over the internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at suwytechllp@gmail.com.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
