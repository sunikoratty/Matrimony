

import { useState, useEffect } from 'react'
import { updateProfile } from '@/lib/user-actions'
import { Camera, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '@/components/ui/Toast'
import { useNavigate } from 'react-router-dom'
import CircularLoader from '@/components/ui/CircularLoader'

export default function ProfileSetupForm({ user }: { user: any }) {
    const { showToast } = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(user.profile?.photoUrl || '')

    // Controlled States for all fields
    const religions = ['Hindu', 'Christian', 'Muslim', 'No Religion', 'Others']
    const initIsCustomReligion = user.profile?.religion && !religions.includes(user.profile.religion.trim())
    const [religion, setReligion] = useState(initIsCustomReligion ? 'Others' : (user.profile?.religion?.trim() || ''))
    const [customReligion, setCustomReligion] = useState(initIsCustomReligion ? user.profile.religion : '')

    const castes = ['No Caste', 'Nair', 'Ezhava', 'Vishwakarma', 'Brahmin', 'Pulaya', 'Vettuva', 'Kaniyan', 'Dheevara', 'Others']
    const initIsCustomCaste = user.profile?.caste && !castes.includes(user.profile.caste.trim())
    const [caste, setCaste] = useState(initIsCustomCaste ? 'Others' : (user.profile?.caste?.trim() || ''))
    const [customCaste, setCustomCaste] = useState(initIsCustomCaste ? user.profile.caste : '')

    const christianDenoms = ['Latin Catholic', 'Roman Catholic', 'Syro Malabar', 'Syrian Catholic', 'Syro Malankara', 'Pentecost', 'Others']
    const muslimDenoms = ['Shia', 'Sunni', 'Intercaste', 'Others']
    
    const isMuslim = religion === 'Muslim'
    const isChristian = religion === 'Christian'
    const currentDenoms = isMuslim ? muslimDenoms : (isChristian ? christianDenoms : [])

    const initIsCustomDenom = user.profile?.denomination && !currentDenoms.includes(user.profile.denomination.trim())
    const [denomination, setDenomination] = useState(initIsCustomDenom ? 'Others' : (user.profile?.denomination?.trim() || ''))
    const [customDenomination, setCustomDenomination] = useState(initIsCustomDenom ? user.profile.denomination : '')

    const [location, setLocation] = useState(user.profile?.location || '')
    const [email, setEmail] = useState(user.email || '')
    const [maritalStatus, setMaritalStatus] = useState(user.profile?.maritalStatus || 'NEVER_MARRIED')
    const [currentResidence, setCurrentResidence] = useState(user.profile?.currentResidence || user.country || 'INDIA')
    const [bio, setBio] = useState(user.profile?.bio || '')
    const [qualification, setQualification] = useState(user.profile?.qualification || '')
    const [occupation, setOccupation] = useState(user.profile?.occupation || '')
    const [dosham, setDosham] = useState(user.profile?.dosham || '')
    const [birthStar, setBirthStar] = useState(user.profile?.birthStar || '')
    const [thalakkuriUrl, setThalakkuriUrl] = useState(user.profile?.thalakkuriUrl || '')
    const [consent, setConsent] = useState(user.profile?.consent || false)

    // Logic for No Religion -> No Caste
    useEffect(() => {
        if (religion === 'No Religion') {
            setCaste('No Caste')
        }
    }, [religion])

    // Date Logic
    const defaultDate = user.profile?.dob ? new Date(user.profile.dob) : null
    const [day, setDay] = useState(defaultDate ? defaultDate.getDate().toString() : '')
    const [month, setMonth] = useState(defaultDate ? (defaultDate.getMonth() + 1).toString() : '')
    const [year, setYear] = useState(defaultDate ? defaultDate.getFullYear().toString() : '')

    const days = Array.from({ length: 31 }, (_, i) => i + 1)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 80 }, (_, i) => currentYear - 18 - i)

    async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = (event) => {
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const maxWidth = 800
                    const maxHeight = 800
                    let width = img.width
                    let height = img.height

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width
                            width = maxWidth
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height
                            height = maxHeight
                        }
                    }

                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx?.drawImage(img, 0, 0, width, height)
                    
                    // Compress to JPEG with 0.7 quality
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
                    setPreview(compressedBase64)
                }
                img.src = event.target?.result as string
            }
            reader.readAsDataURL(file)
        }
    }
    
    async function handleThalakkuri(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showToast('File size should be less than 2MB', 'error')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setThalakkuriUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <form onSubmit={async (e) => {
            e.preventDefault()
            if (!preview) {
                showToast('Please upload a photo to complete your profile.', 'error')
                return
            }
            setLoading(true)
            const formData = new FormData(e.currentTarget)
            const res = await updateProfile(formData)
            setLoading(false)
            if (res?.error) {
                showToast(res.error, 'error')
            } else if (res?.success) {
                showToast('Profile updated successfully!', 'success')
                navigate('/profile/view')
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
                <label className="cursor-pointer px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all shadow-md shadow-rose-100 mt-2 block w-max mx-auto">
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
                            className="px-2 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900 appearance-auto"
                        >
                            <option value="">Day</option>
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select
                            value={month} onChange={(e) => setMonth(e.target.value)} required
                            className="px-2 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900 appearance-auto"
                        >
                            <option value="">Month</option>
                            {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                        </select>
                        <select
                            value={year} onChange={(e) => setYear(e.target.value)} required
                            className="px-2 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900 appearance-auto"
                        >
                            <option value="">Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <input type="hidden" name="dob" value={day && month && year ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Residence Country *</label>
                    <select
                        name="currentResidence"
                        required
                        value={currentResidence}
                        onChange={(e) => setCurrentResidence(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                    >
                        <option value="INDIA">India</option>
                        <option value="CANADA">Canada</option>
                        <option value="UK">UK</option>
                        <option value="USA">USA</option>
                        <option value="AUSTRALIA">Australia</option>
                        <option value="GERMANY">Germany</option>
                        <option value="ITALY">Italy</option>
                        <option value="IRELAND">Ireland</option>
                        <option value="MALTA">Malta</option>
                        <option value="NEW_ZEALAND">New Zealand</option>
                        <option value="JAPAN">Japan</option>
                        <option value="CHINA">China</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Present Location (City and State) *</label>
                    <input
                        name="location"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                        placeholder="e.g. Mumbai, Maharashtra"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email ID *</label>
                    <input
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
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
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                    >
                        <option value="NEVER_MARRIED">Never Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                        <option value="MARRIED">Married (Admin only)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Religion *</label>
                    <select
                        value={religion}
                        onChange={(e) => setReligion(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 mb-2 bg-white text-slate-900"
                    >
                        <option value="">Select Religion</option>
                        {religions.filter(r => r !== 'Others').map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                        <option value="Others">Others</option>
                    </select>
                    {religion === 'Others' && (
                        <input
                            required
                            value={customReligion}
                            onChange={(e) => setCustomReligion(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                            placeholder="Type your religion"
                        />
                    )}
                    <input type="hidden" name="religion" value={religion === 'Others' ? customReligion : religion} />
                </div>

                {(religion === 'Hindu' || religion === 'No Religion') && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Caste *</label>
                            <select
                                value={caste}
                                disabled={religion === 'No Religion'}
                                onChange={(e) => setCaste(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 mb-2 bg-white text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
                            >
                                <option value="">Select Caste</option>
                                {castes.filter(c => c !== 'Others').map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                                <option value="Others">Others</option>
                            </select>
                            {caste === 'Others' && religion !== 'No Religion' && (
                                <input
                                    required
                                    value={customCaste}
                                    onChange={(e) => setCustomCaste(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                                    placeholder="Type your caste"
                                />
                            )}
                            <input type="hidden" name="caste" value={caste === 'Others' ? customCaste : caste} />
                        </div>
                        {religion === 'Hindu' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Dosham (Optional)</label>
                                    <input
                                        name="dosham"
                                        value={dosham}
                                        onChange={(e) => setDosham(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                                        placeholder="e.g. Chovva Dosham, etc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Birth Star (Optional)</label>
                                    <input
                                        name="birthStar"
                                        value={birthStar}
                                        onChange={(e) => setBirthStar(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                                        placeholder="e.g. Rohini"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Upload Thalakkuri / Horoscope (Optional - Image or PDF)</label>
                                    <div className="flex items-center gap-4">
                                        <label className="cursor-pointer px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors border border-slate-300">
                                            {thalakkuriUrl ? 'Change File' : 'Choose File'}
                                            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleThalakkuri} />
                                        </label>
                                        {thalakkuriUrl && (
                                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                                <CheckCircle size={16} />
                                                <span>File Uploaded</span>
                                                <button type="button" onClick={() => setThalakkuriUrl('')} className="text-rose-600 hover:text-rose-700 ml-2">Remove</button>
                                            </div>
                                        )}
                                    </div>
                                    <input type="hidden" name="thalakkuriUrl" value={thalakkuriUrl} />
                                </div>
                            </>
                        )}
                    </>
                )}

                {(religion === 'Christian' || religion === 'Muslim') && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Denomination *</label>
                        <select
                            required
                            value={denomination}
                            onChange={(e) => setDenomination(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 mb-2 bg-white text-slate-900"
                        >
                            <option value="">Select Denomination</option>
                            {currentDenoms.filter(d => d !== 'Others').map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                            <option value="Others">Others</option>
                        </select>
                        {denomination === 'Others' && (
                            <input
                                required
                                value={customDenomination}
                                onChange={(e) => setCustomDenomination(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                                placeholder="Type your denomination"
                            />
                        )}
                        <input type="hidden" name="denomination" value={denomination === 'Others' ? customDenomination : denomination} />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Qualification *</label>
                    <input
                        name="qualification"
                        required
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                        placeholder="e.g. B.Tech, MBA"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
                    <input
                        name="occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                        placeholder="e.g. Software Engineer"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio (Optional)</label>
                <textarea
                    name="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900"
                    placeholder="Write about your interests, lifestyle, and expectations..."
                />
            </div>

            <div className="flex items-start gap-4 p-6 bg-rose-50 rounded-xl border border-rose-100">
                <input
                    type="checkbox"
                    name="consent"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
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

            <button disabled={loading} className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2 cursor-pointer">
                {loading && <CircularLoader size="sm" color="white" />}
                {loading ? 'Saving Profile...' : 'Save Profile'}
            </button>
        </form>
    )
}

