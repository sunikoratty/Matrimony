import React from 'react'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import { ShieldCheck, Lock, Eye, CheckCircle } from 'lucide-react'

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6">Our Commitment to Security</h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            At True Match, your safety and privacy are our top priorities. We use state-of-the-art technology 
                            and manual oversight to keep your experience secure.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-20">
                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <ShieldCheck className="text-rose-600 mb-6" size={40} />
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Manual Verification</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Every single profile uploaded to True Match is manually reviewed by our expert team. We verify 
                                contact numbers and identity markers to ensure a genuine community.
                            </p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <Lock className="text-rose-600 mb-6" size={40} />
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Encryption</h2>
                            <p className="text-slate-600 leading-relaxed">
                                All your personal data and interactions are encrypted using 256-bit SSL technology. Your private 
                                communication stays private.
                            </p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <Eye className="text-rose-600 mb-6" size={40} />
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy Controls</h2>
                            <p className="text-slate-600 leading-relaxed">
                                You have total control over who sees your photos and contact information. Our "Request Interest" 
                                system ensures you only share details when you want to.
                            </p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                            <CheckCircle className="text-rose-600 mb-6" size={40} />
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Safe Payments</h2>
                            <p className="text-slate-600 leading-relaxed">
                                We partner with Razorpay to provide secure, PCI-DSS compliant payment gateways. We never store 
                                your card details on our servers.
                            </p>
                        </div>
                    </div>

                    <div className="bg-rose-600 rounded-[3rem] p-12 text-center text-white">
                        <h2 className="text-3xl font-serif font-bold mb-4">See Something Suspicious?</h2>
                        <p className="text-rose-100 mb-8 max-w-xl mx-auto">
                            Help us keep True Match safe. If you encounter any fake profiles or suspicious activity, report 
                            it immediately to our safety team.
                        </p>
                        <button className="bg-white text-rose-600 px-8 py-4 rounded-xl font-bold hover:bg-rose-50 transition-colors uppercase tracking-widest text-sm">
                            Report a Concern
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
