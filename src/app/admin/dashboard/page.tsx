import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import UserTable from '@/components/admin/UserTable'
import { getUsers } from '@/lib/actions'

import Link from 'next/link'

import ErrorState from '@/components/ui/ErrorState'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    try {
        const params = await searchParams
        const currentFilter = (params.filter as string) || 'all'

        const cookieStore = await cookies()
        const sessionId = cookieStore.get('admin_session')?.value

        if (!sessionId) {
            redirect('/admin/login')
        }

        // Verify user is admin
        const admin = await prisma.user.findUnique({
            where: { id: sessionId },
        })

        if (!admin || admin.role !== 'ADMIN') {
            redirect('/admin/login')
        }

        // Fetch all users once to calculate stats and display in table
        const users = await getUsers()

        // Calculate Stats in memory to reduce database calls
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
                            <p className="text-slate-500">Welcome back, {admin.name}</p>
                        </div>
                        <form action={async () => {
                            'use server'
                            await import('@/lib/actions').then(m => m.adminLogout())
                        }}>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                                Logout
                            </button>
                        </form>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat) => (
                            <Link
                                key={stat.label}
                                href={`/admin/dashboard?filter=${stat.filter}`}
                                className={`bg-white p-6 rounded-xl shadow-sm border transition-all hover:shadow-md ${currentFilter === stat.filter ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-100 hover:border-blue-200'}`}
                            >
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                <p className={`text-2xl font-bold inline-block px-2 py-0.5 rounded ${stat.color}`}>
                                    {stat.value}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* Country Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 service-card">
                            <h3 className="font-semibold text-slate-800 mb-4">Country Distribution</h3>
                            <div className="space-y-4">
                                <Link href="/admin/dashboard?filter=INDIA" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                    <span>🇮🇳 India</span>
                                    <span className="font-bold">{indiaUsers}</span>
                                </Link>
                                <Link href="/admin/dashboard?filter=CANADA" className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                    <span>🇨🇦 Canada</span>
                                    <span className="font-bold">{canadaUsers}</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* User Table */}
                    <div className="mb-8 mt-8">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-xl font-bold text-slate-800">User Management</h2>
                            <div className="text-sm text-slate-500">
                                Showing: <span className="font-semibold capitalize text-blue-600">{currentFilter}</span>
                            </div>
                        </div>
                        <UserTable users={users} filter={currentFilter} />
                    </div>
                </div>
            </div>
        )
    } catch (error: any) {
        console.error('Dashboard Load Error:', error)

        const isConnectionError = error.message?.includes('Can\'t reach database server') ||
            error.code === 'P1001' ||
            error.code === 'P1003'

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
                <ErrorState
                    title={isConnectionError ? 'Server Not Reached' : 'Dashboard Error'}
                    message={isConnectionError
                        ? 'We were unable to reach the database server. Please ensure your database is running and try again.'
                        : 'There was an unexpected error loading the dashboard. Please try refreshing the page.'
                    }
                />
            </div>
        )
    }
}
