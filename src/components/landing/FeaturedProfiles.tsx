import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import AgeDisplay from '../ui/AgeDisplay'

type Profile = {
    id: string
    name: string
    gender: string
    country: string
    profile: {
        photoUrl?: string | null
        dob?: Date | null
        religion?: string | null
        location?: string | null
        qualification?: string | null
    }
}

export default function FeaturedProfiles({
    title,
    subtitle,
    profiles,
    gender,
    userGender
}: {
    title: string,
    subtitle: string,
    profiles: any[],
    gender: 'MALE' | 'FEMALE',
    userGender?: string
}) {
    // Determine the target gender for the "View All" link
    // Rule: Logged-in users always go to the opposite of THEIR gender.
    // Guests keep the gender from the prop.
    const targetGender = userGender
        ? (userGender === 'MALE' ? 'FEMALE' : 'MALE')
        : gender;
    return (
        <section className="py-32 px-4 bg-slate-50 relative overflow-hidden">
            {/* Decorative background bloom */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-rose-100/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <div className="w-12 h-1.5 bg-rose-600 mb-6 rounded-full" />
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">{title}</h2>
                        <p className="text-slate-500 text-xl font-light leading-relaxed">{subtitle}</p>
                    </div>
                    <Link
                        to={`/matches?gender=${targetGender}`}
                        className="text-rose-600 font-bold hover:text-rose-700 transition-colors flex items-center gap-2 group"
                    >
                        View All {gender === 'FEMALE' ? 'Brides' : 'Grooms'}
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {profiles.map((user, index) => {


                        const locationText = user.country === 'INDIA'
                            ? (user.profile?.location || 'Location N/A')
                            : (user.country === 'CANADA' ? 'Canada' : user.country)

                        return (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                            >
                                <Link to={`/matches?gender=${targetGender}`}>
                                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-xl group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 bg-slate-100">
                                         {user.profile?.photoUrl ? (
                                             <img
                                                 src={user.profile.photoUrl}
                                                 alt={user.name}
                                                 className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-1000"
                                             />
                                         ) : (
                                             <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                 <User size={64} />
                                             </div>
                                         )}
                                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                         
                                         <div className="absolute bottom-0 left-0 right-0 p-8">
                                             <p className="text-white font-serif text-3xl font-bold mb-1">{user.name}</p>
                                             <p className="text-rose-300 text-xs font-bold uppercase tracking-widest mb-3">
                                                 {user.profile?.qualification || 'Qualification N/A'}
                                             </p>
                                             <div className="flex items-center gap-3 text-white/80 text-sm font-medium">
                                                 <span>{locationText}</span>
                                                 <span className="w-1 h-1 bg-white/40 rounded-full" />
                                                 <AgeDisplay dob={user.profile?.dob} />
                                             </div>
                                         </div>
                                     </div>
                                 </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
