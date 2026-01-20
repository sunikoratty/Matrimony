'use client'

import { useState } from 'react'
import { togglePaidStatus, updateUserStatus } from '@/lib/actions'
import { Check, X, Shield, Trash2, MoreHorizontal } from 'lucide-react'

import { useRouter } from 'next/navigation'

type User = {
    id: string
    name: string
    mobile: string
    email: string | null
    gender: string
    country: string
    isPaid: boolean
    status: string
    createdAt: Date
    profile: any
}

export default function UserTable({ users }: { users: User[] }) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    async function handleTogglePaid(userId: string, currentStatus: boolean) {
        setLoadingId(userId)
        await togglePaidStatus(userId, currentStatus)
        router.refresh()
        setLoadingId(null)
    }

    async function handleStatusChange(userId: string, status: string) {
        if (!confirm(`Are you sure you want to change status to ${status}?`)) return
        setLoadingId(userId)
        await updateUserStatus(userId, status)
        router.refresh()
        setLoadingId(null)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Recent Users</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-sm">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Contact</th>
                            <th className="px-6 py-4 font-medium">Country</th>
                            <th className="px-6 py-4 font-medium">Access</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.gender} • {user.profile?.religion || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div>{user.mobile}</div>
                                    <div className="text-xs text-slate-400">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                        {user.country}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        disabled={loadingId === user.id}
                                        onClick={() => handleTogglePaid(user.id, user.isPaid)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${user.isPaid
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {user.isPaid ? 'Premium' : 'Free'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                                        user.status === 'BLOCKED' ? 'bg-red-50 text-red-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleStatusChange(user.id, user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED')}
                                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                                            title={user.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                                        >
                                            <Shield size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(user.id, 'DELETED')}
                                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
