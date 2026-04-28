import React from 'react'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">Terms of Service</h1>
                    <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using True Match, you agree to be bound by these Terms of Service. If you do 
                                not agree to these terms, you may not use the service.
                            </p>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Eligibility</h2>
                            <p>
                                You must be at least 18 years old to use this service. By using True Match, you represent and 
                                warrant that you have the right, authority, and capacity to enter into this agreement.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Member Conduct</h2>
                            <p>
                                You are solely responsible for your interactions with other members. You agree not to use the 
                                service for any illegal or unauthorized purpose.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Premium Membership</h2>
                            <p>
                                Premium features are subject to payment. All fees are non-refundable unless required by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Termination</h2>
                            <p>
                                We reserve the right to terminate or suspend your account at our sole discretion, without notice, 
                                for conduct that we believe violates these Terms of Service.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
