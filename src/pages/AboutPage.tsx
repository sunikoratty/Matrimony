import React from 'react'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import { motion } from 'framer-motion'
import { Heart, Shield, Users, Award } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero section */}
                    <div className="text-center mb-20">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-6"
                        >
                            Our Journey to <br/>
                            <span className="text-rose-600">Connecting Hearts</span>
                        </motion.h1>
                        <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-light">
                            True Match is Kerala's premier matrimony platform, dedicated to helping individuals find their 
                            perfect life partners through a blend of traditional values and modern technology.
                        </p>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-12 mb-32">
                        <div className="bg-rose-50 p-12 rounded-[3rem]">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                To provide a secure, trusted, and elegant platform for the Kerala community worldwide to find 
                                meaningful life partnerships, while respecting and upholding our rich cultural heritage.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-12 rounded-[3rem]">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Vision</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                To become the world's most trusted destination for Malayali matrimony, where every success story 
                                is a testament to our commitment to trust, integrity, and marital bliss.
                            </p>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Why Choose True Match?</h2>
                        <div className="w-16 h-1 bg-rose-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Shield className="text-rose-600" size={32} />, title: 'Verified Profiles', desc: 'Every profile goes through a rigorous manual verification process.' },
                            { icon: <Heart className="text-rose-600" size={32} />, title: 'Deep Compatibility', desc: 'Our matching algorithm considers cultural and personal values.' },
                            { icon: <Users className="text-rose-600" size={32} />, title: 'Community Focused', desc: 'Tailored specifically for the diverse needs of the Kerala community.' },
                            { icon: <Award className="text-rose-600" size={32} />, title: 'Premium Support', desc: 'Dedicated customer success team to help you on your journey.' },
                        ].map((item, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all text-center group"
                            >
                                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
