'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/user-actions'
import { Camera } from 'lucide-react'
import Link from 'next/link'

export default function ProfileSetupForm({ user }: { user: any }) {
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(user.profile?.photoUrl || '')

    // Date Logic
    const defaultDate = user.profile?.dob ? new Date(user.profile.dob) : null
    const [day, setDay] = useState(defaultDate ? defaultDate.getDate() : '')
    const [month, setMonth] = useState(defaultDate ? defaultDate.getMonth() + 1 : '')
    const [year, setYear] = useState(defaultDate ? defaultDate.getFullYear() : '')

    const days = Array.from({ length: 31 }, (_, i) => i + 1)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 80 }, (_, i) => currentYear - 18 - i)

    async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <form action={async (formData) => {
            if (!preview) {
                alert('Please upload a photo to complete your profile.')
                return
            }
            setLoading(true)
            const res = await updateProfile(formData)
            setLoading(false)
            if (res?.error) {
                alert(res.error)
            }
        }} className="space-y-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full bg-slate-100 overflow-hidden mb-4 border-2 border-slate-200">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-slate-400">
                            <Camera size={32} />
                        </div>
                    )}
                    <input type="hidden" name="photoUrl" value={preview} />
                </div>
                <label className="cursor-pointer px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
                    Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                    <div className="grid grid-cols-3 gap-2">
                        <select
                            value={day} onChange={(e) => setDay(e.target.value)} required
                            className="px-2 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 bg-white appearance-auto"
                        >
                            <option value="">Day</option>
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select
                            value={month} onChange={(e) => setMonth(e.target.value)} required
                            className="px-2 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 bg-white appearance-auto"
                        >
                            <option value="">Month</option>
                            {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                        </select>
                        <select
                            value={year} onChange={(e) => setYear(e.target.value)} required
                            className="px-2 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 bg-white appearance-auto"
                        >
                            <option value="">Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    {/* Hidden input to pass value to server action */}
                    <input type="hidden" name="dob" value={day && month && year ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Residence Country *</label>
                    <select
                        name="currentResidence"
                        required
                        defaultValue={user.profile?.currentResidence || user.country}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="INDIA">India</option>
                        {/* <option value="CANADA">Canada</option> */}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Present Location (City and State) *</label>
                    <input
                        name="location"
                        required
                        defaultValue={user.profile?.location || ''}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="e.g. Mumbai, Maharashtra"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email ID *</label>
                    <input
                        name="email"
                        type="email"
                        required
                        defaultValue={user.email || ''}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="e.g. user@example.com"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status *</label>
                    <select
                        name="maritalStatus"
                        required
                        defaultValue={user.profile?.maritalStatus || 'UNMARRIED'}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="UNMARRIED">Unmarried</option>
                        <option value="MARRIED">Married</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Religion *</label>
                    <input
                        name="religion"
                        required
                        defaultValue={user.profile?.religion || ''}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="e.g. Hindu"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Caste (Optional)</label>
                    <input
                        name="caste"
                        defaultValue={user.profile?.caste || ''}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Birth Star (Optional)</label>
                    <input
                        name="birthStar"
                        defaultValue={user.profile?.birthStar || ''}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="e.g. Rohini"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupation *</label>
                    <input
                        name="occupation"
                        required
                        defaultValue={user.profile?.occupation || ''}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="e.g. Software Engineer"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio *</label>
                <textarea
                    name="bio"
                    rows={4}
                    required
                    defaultValue={user.profile?.bio || ''}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Write about your interests, lifestyle, and expectations..."
                />
            </div>

            <div className="flex items-start gap-4 p-6 bg-rose-50 rounded-xl border border-rose-100">
                <input
                    type="checkbox"
                    name="consent"
                    required
                    defaultChecked={user.profile?.consent}
                    className="mt-1.5 w-5 h-5 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
                />
                <div className="space-y-2">
                    <p className="text-lg font-medium text-slate-800 leading-snug">
                        We authorize the company to display our profile details including Mobile number and Email.
                    </p>
                    <p className="text-lg font-medium text-slate-800 leading-snug">
                        After marriage, we agree to update our status to Married.
                    </p>
                </div>
            </div>

            <button disabled={loading} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-colors disabled:bg-slate-400">
                {loading ? 'Saving...' : 'Save Profile'}
            </button>
        </form>
    )
}
