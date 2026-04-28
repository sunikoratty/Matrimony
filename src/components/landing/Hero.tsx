import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/Toast'
import { Heart } from 'lucide-react'

const IMAGES = [
    '/kerala_marriage_1.png',
    '/kerala_marriage_2.png',
    '/kerala_marriage_3.png'
]

export default function Hero({ user }: { user?: any }) {
    const { showToast } = useToast()
    const [currentImage, setCurrentImage] = useState(0)
    const isLoggedIn = user && (user.id || user.name);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % IMAGES.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="relative min-h-screen w-full flex flex-col lg:flex-row bg-white">
            {/* Left Content Section */}
            <div className="w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 py-20 lg:py-32 z-10 flex items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 w-full"
                >
                    <div>
                        <motion.span
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-4 py-1.5 rounded-full text-rose-600 bg-rose-50 font-bold text-xs uppercase tracking-widest mb-6 border border-rose-100"
                        >
                            #1 Trusted Kerala Matrimony
                        </motion.span>
                        <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-slate-900 leading-tight font-serif">
                            Find Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500">
                                Perfect Match
                            </span>
                        </h1>
                    </div>

                    <p className="text-lg lg:text-2xl text-slate-600 max-w-xl leading-relaxed font-light">
                        Connecting hearts with tradition and modern excellence. 
                        Join thousands of verified profiles finding their soulmates every day.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    to="/register"
                                    className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-bold shadow-2xl shadow-rose-200 hover:bg-rose-700 transition-all uppercase tracking-widest text-sm text-center"
                                >
                                    Join Free Today
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-10 py-5 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all uppercase tracking-widest text-sm text-center shadow-sm"
                                >
                                    Member Login
                                </Link>
                            </>
                        ) : (
                            <Link
                                to="/matches"
                                className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-bold shadow-2xl shadow-rose-200 hover:bg-rose-700 transition-all uppercase tracking-widest text-sm text-center"
                            >
                                Go to Matches
                            </Link>
                        )}
                    </div>

                </motion.div>
            </div>
            {/* Center Heart Icon */}
            <div className="absolute left-1/2 top-[calc(100%-400px)] sm:top-[calc(100%-600px)] lg:top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full shadow-2xl">
                <Heart className="w-8 h-8 lg:w-10 lg:h-10 text-rose-500 fill-rose-500" />
            </div>

            {/* Right Slider Section */}
            <div className="w-full lg:w-1/2 h-[400px] sm:h-[600px] lg:h-screen relative overflow-hidden bg-slate-100">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={IMAGES[currentImage]}
                            alt="Kerala Wedding"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay to blend with left side on desktop */}
                        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Slider Indicators */}
                <div className="absolute bottom-12 right-12 flex gap-3 z-20">
                    {IMAGES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentImage(i)}
                            className={`h-2 transition-all duration-700 rounded-full ${
                                currentImage === i ? 'w-12 bg-rose-600' : 'w-3 bg-white/40 hover:bg-white'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
