import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                                ❤️Match
                            </span>
                        </Link>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            Connecting hearts with trust and tradition. Your journey to a perfect partner starts here.
                        </p>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-rose-500 transition-colors">About Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/privacy" className="hover:text-rose-500 transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-rose-500 transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/security" className="hover:text-rose-500 transition-colors">Security</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Contact</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 text-lg">📧</span>
                                <a href="mailto:suwytechllp@gmail.com" className="hover:text-rose-500 transition-colors break-all">
                                    suwytechllp@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-0.5 text-lg">📞</span>
                                <div>
                                    <p className="font-medium text-slate-300 mb-1">+91 9037246845</p>
                                    <p className="text-xs text-slate-500">Available Mon-Sat, 9AM - 6PM IST</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-600">
                    <p>© {new Date().getFullYear()} ❤️Match Matrimony. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
