import React, { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import UserTable from '@/components/admin/UserTable'
import { getUsers, adminLogout } from '@/lib/actions'
import ErrorState from '@/components/ui/ErrorState'

export default function AdminDashboardPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<any[]>([])
    const [admin, setAdmin] = useState<any>(null)
    const [error, setError] = useState<any>(null)

    const [refreshCount, setRefreshCount] = useState(0)

    const currentFilter = searchParams.get('filter') || 'all'

    const refreshData = () => setRefreshCount(prev => prev + 1)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const userData = await getUsers()
                if (userData && 'error' in (userData as any) && (userData as any).error === 'Unauthorized') {
                    navigate('/admin/login')
                    return
                }
                setUsers(userData)
                
                const profile = await fetch('/api/profile').then(r => r.json())
                setAdmin(profile)
            } catch (err: any) {
                console.error("Failed to fetch dashboard data", err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [navigate, refreshCount])

    const handleLogout = async () => {
        await adminLogout()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-rose-600 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
                <ErrorState
                    title="Dashboard Error"
                    message="There was an unexpected error loading the dashboard. Please try refreshing the page."
                />
            </div>
        )
    }

    // Calculate Stats
    const totalUsers = users.length
    const paidUsers = users.filter(u => u.isPaid).length
    const unpaidUsers = totalUsers - paidUsers
    const activeUsers = users.filter(u => u.status === 'ACTIVE').length
    const blockedUsers = users.filter(u => u.status === 'BLOCKED').length
    const deletedUsers = users.filter(u => u.status === 'DELETED').length

    const indiaUsers = users.filter(u => u.country === 'INDIA').length
    const canadaUsers = users.filter(u => u.country === 'CANADA').length

    const stats = [
        { label: 'Total Users', value: totalUsers, color: 'bg-blue-100 text-blue-800', filter: 'all' },
        { label: 'Paid Members', value: paidUsers, color: 'bg-green-100 text-green-800', filter: 'paid' },
        { label: 'Unpaid Members', value: unpaidUsers, color: 'bg-gray-100 text-gray-800', filter: 'unpaid' },
        { label: 'Active Profiles', value: activeUsers, color: 'bg-emerald-100 text-emerald-800', filter: 'ACTIVE' },
        { label: 'Blocked', value: blockedUsers, color: 'bg-red-100 text-red-800', filter: 'BLOCKED' },
        { label: 'Deleted', value: deletedUsers, color: 'bg-slate-200 text-slate-600', filter: 'DELETED' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500">Welcome back, {admin?.name || 'Admin'}</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat) => (
                        <Link
                            key={stat.label}
                            to={`/admin/dashboard?filter=${stat.filter}`}
                            className={`bg-white p-6 rounded-xl shadow-sm border transition-all hover:shadow-md ${currentFilter === stat.filter ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-100 hover:border-blue-200'}`}
                        >
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <p className={`text-2xl font-bold inline-block px-2 py-0.5 rounded ${stat.color}`}>
                                {stat.value}
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 service-card">
                        <h3 className="font-semibold text-slate-800 mb-4">Country Distribution</h3>
                        <div className="space-y-4">
                            <Link to="/admin/dashboard?filter=INDIA" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                <span>🇮🇳 India</span>
                                <span className="font-bold">{indiaUsers}</span>
                            </Link>
                            <Link to="/admin/dashboard?filter=CANADA" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                <span>🇨🇦 Canada</span>
                                <span className="font-bold">{canadaUsers}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mb-8 mt-8">
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xl font-bold text-slate-800">User Management</h2>
                        <div className="text-sm text-slate-500">
                            Showing: <span className="font-semibold capitalize text-blue-600">{currentFilter}</span>
                        </div>
                    </div>
                    <UserTable users={users} filter={currentFilter} onRefresh={refreshData} />
                </div>
            </div>
        </div>
    )
}
