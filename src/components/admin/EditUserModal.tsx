'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { adminUpdateUser } from '@/lib/actions'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'

export default function EditUserModal({ user, onClose }: { user: any, onClose: () => void }) {
    const { showToast } = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name || '',
        mobile: user.mobile || '',
        email: user.email || '',
        gender: user.gender || 'MALE',
        country: user.country || 'INDIA',
        isPaid: user.isPaid || false,
        status: user.status || 'ACTIVE',
        profile: {
            bio: user.profile?.bio || '',
            religion: user.profile?.religion || '',
            caste: user.profile?.caste || '',
            denomination: user.profile?.denomination || '',
            dosham: user.profile?.dosham || '',
            birthStar: user.profile?.birthStar || '',
            maritalStatus: user.profile?.maritalStatus || 'UNMARRIED',
            currentResidence: user.profile?.currentResidence || '',
            location: user.profile?.location || '',
            occupation: user.profile?.occupation || '',
            qualification: user.profile?.qualification || '',
            dob: user.profile?.dob ? new Date(user.profile.dob).toISOString().split('T')[0] : '',
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        if (name.startsWith('profile.')) {
            const profileField = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [profileField]: value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const result = await adminUpdateUser(user.id, formData)
        setLoading(false)
        if (result.success) {
            showToast('User updated successfully', 'success')
            router.refresh()
            onClose()
        } else {
            showToast(result.error || 'Failed to update user', 'error')
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Edit User Profile</h2>
                        <p className="text-xs text-slate-500 font-mono">{user.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <form id="admin-edit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-rose-600 uppercase tracking-wider">Account Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                    <input name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500">
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Mobile</label>
                                    <input name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                    <input name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Country</label>
                                    <select name="country" value={formData.country} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500">
                                        <option value="INDIA">India</option>
                                        <option value="CANADA">Canada</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500">
                                        <option value="ACTIVE">Active</option>
                                        <option value="BLOCKED">Blocked</option>
                                        <option value="DELETED">Deleted</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" name="isPaid" id="isPaid" checked={formData.isPaid} onChange={handleChange} className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500" />
                                <label htmlFor="isPaid" className="text-sm font-bold text-slate-700">Premium Membership Active</label>
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-rose-600 uppercase tracking-wider">Personal Profile</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                                    <input type="date" name="profile.dob" value={formData.profile.dob} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Marital Status</label>
                                    <select name="profile.maritalStatus" value={formData.profile.maritalStatus} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500">
                                        <option value="UNMARRIED">Unmarried</option>
                                        <option value="MARRIED">Married</option>
                                        <option value="DIVORCED">Divorced</option>
                                        <option value="WIDOWED">Widowed</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Religion</label>
                                    <input name="profile.religion" value={formData.profile.religion} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Caste</label>
                                    <input name="profile.caste" value={formData.profile.caste} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Denomination</label>
                                    <input name="profile.denomination" value={formData.profile.denomination} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Birth Star</label>
                                    <input name="profile.birthStar" value={formData.profile.birthStar} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                                </div>
                            </div>
                        </div>

                        {/* Professional & Location */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-rose-600 uppercase tracking-wider">Professional & Location</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Qualification</label>
                                    <input name="profile.qualification" value={formData.profile.qualification} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Occupation</label>
                                    <input name="profile.occupation" value={formData.profile.occupation} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Current Residence</label>
                                    <input name="profile.currentResidence" value={formData.profile.currentResidence} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">City & State</label>
                                    <input name="profile.location" value={formData.profile.location} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-rose-600 uppercase tracking-wider">Other Details</h3>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Dosham</label>
                                <input name="profile.dosham" value={formData.profile.dosham} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Bio / Description</label>
                                <textarea name="profile.bio" value={formData.profile.bio} onChange={handleChange} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none font-sans" />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
                    <button onClick={onClose} className="px-6 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-all border border-slate-200">
                        Cancel
                    </button>
                    <button form="admin-edit-form" type="submit" disabled={loading} className="px-8 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 flex items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}
