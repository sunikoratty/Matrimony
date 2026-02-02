'use client'

import { useState } from 'react'
import { togglePaidStatus, updateUserStatus } from '@/lib/actions'
import { Check, X, Shield, Trash2, MoreHorizontal, Pencil } from 'lucide-react'
import EditUserModal from './EditUserModal'

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

import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function UserTable({ users, filter = 'all' }: { users: User[], filter?: string }) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    // Search and Pagination State
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    // Filtering Logic
    const filteredUsers = users.filter(user => {
        // Apply category filter
        if (filter === 'paid' && !user.isPaid) return false
        if (filter === 'unpaid' && user.isPaid) return false
        if (['ACTIVE', 'BLOCKED', 'DELETED'].includes(filter) && user.status !== filter) return false
        if (['INDIA', 'CANADA'].includes(filter) && user.country !== filter) return false

        // Apply search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
                user.name.toLowerCase().includes(query) ||
                user.mobile.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.country.toLowerCase().includes(query)
            )
        }
        return true
    })

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

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
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search by name, email, mobile or country..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1) // Reset to first page on search
                    }}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
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
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors border-l-2 border-l-transparent hover:border-l-blue-500">
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
                                                onClick={() => setEditingUser(user)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(user.id, user.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED')}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                                            >
                                                <Shield size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(user.id, 'DELETED')}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Search size={40} strokeWidth={1.5} />
                                            <p>No users found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-medium text-slate-900">{startIndex + 1}</span> to{' '}
                            <span className="font-medium text-slate-900">
                                {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
                            </span>{' '}
                            of <span className="font-medium text-slate-900">{filteredUsers.length}</span> users
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === i + 1
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                                : 'text-slate-600 hover:bg-white hover:border-slate-300 border border-transparent'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                />
            )}
        </div>
    )
}
