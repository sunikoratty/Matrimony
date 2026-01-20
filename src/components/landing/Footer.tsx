export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Kalyanam</h3>
                        <p className="text-sm">Connecting hearts across India and Canada with trust and tradition.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Contact</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Security</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Social</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Instagram</li>
                            <li>Facebook</li>
                            <li>Twitter</li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-800 text-center text-xs">
                    © 2026 Kalyanam Matrimony. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
