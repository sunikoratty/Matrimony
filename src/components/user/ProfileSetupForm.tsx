'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/user-actions'
import { Camera } from 'lucide-react'
import Link from 'next/link'

export default function ProfileSetupForm({ user }: { user: any }) {
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(user.profile?.photoUrl || '')

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
                    <input
                        name="dob"
                        type="date"
                        required
                        defaultValue={user.profile?.dob ? new Date(user.profile.dob).toISOString().split('T')[0] : ''}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Residence Country</label>
                    <select
                        name="currentResidence"
                        defaultValue={user.profile?.currentResidence || user.country}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="INDIA">India</option>
                        <option value="CANADA">Canada</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Present Location (City/State)</label>
                    <input
                        name="location"
                        required
                        defaultValue={user.profile?.location || ''}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="e.g. Mumbai"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email ID</label>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status</label>
                    <select
                        name="maritalStatus"
                        defaultValue={user.profile?.maritalStatus || 'UNMARRIED'}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="UNMARRIED">Unmarried</option>
                        <option value="MARRIED">Married</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Religion</label>
                    <input
                        name="religion"
                        required
                        defaultValue={user.profile?.religion || ''}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="e.g. Hindu"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Caste</label>
                    <input
                        name="caste"
                        defaultValue={user.profile?.caste || ''}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                    name="bio"
                    rows={4}
                    defaultValue={user.profile?.bio || ''}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Write about your interests, lifestyle, and expectations..."
                />
            </div>

            <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-lg">
                <input
                    type="checkbox"
                    name="consent"
                    required
                    defaultChecked={user.profile?.consent}
                    className="mt-1 w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                />
                <p className="text-sm text-slate-600">
                    We authorize the company to display our profile details. After marriage, we agree to update our status to Married.
                </p>
            </div>

            <button disabled={loading} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-colors disabled:bg-slate-400">
                {loading ? 'Saving...' : 'Save Profile'}
            </button>
        </form>
    )
}
