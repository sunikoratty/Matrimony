import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import UserTable from '@/components/admin/UserTable'
import { getUsers } from '@/lib/actions'

export default async function AdminDashboard() {
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

    // Fetch Stats
    const [
        totalUsers,
        paidUsers,
        unpaidUsers,
        indiaUsers,
        canadaUsers,
        activeUsers,
        blockedUsers,
        deletedUsers
    ] = await Promise.all([
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.user.count({ where: { role: 'USER', isPaid: true } }),
        prisma.user.count({ where: { role: 'USER', isPaid: false } }),
        prisma.user.count({ where: { role: 'USER', country: 'INDIA' } }),
        prisma.user.count({ where: { role: 'USER', country: 'CANADA' } }),
        prisma.user.count({ where: { role: 'USER', status: 'ACTIVE' } }),
        prisma.user.count({ where: { role: 'USER', status: 'BLOCKED' } }),
        prisma.user.count({ where: { role: 'USER', status: 'DELETED' } }),
    ])

    const stats = [
        { label: 'Total Users', value: totalUsers, color: 'bg-blue-100 text-blue-800' },
        { label: 'Paid Members', value: paidUsers, color: 'bg-green-100 text-green-800' },
        { label: 'Unpaid Members', value: unpaidUsers, color: 'bg-gray-100 text-gray-800' },
        { label: 'Active Profiles', value: activeUsers, color: 'bg-emerald-100 text-emerald-800' },
        { label: 'Blocked', value: blockedUsers, color: 'bg-red-100 text-red-800' },
        { label: 'Deleted', value: deletedUsers, color: 'bg-slate-200 text-slate-600' },
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <p className={`text-2xl font-bold inline-block px-2 py-0.5 rounded ${stat.color}`}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Country Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 service-card">
                        <h3 className="font-semibold text-slate-800 mb-4">Country Distribution</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>🇮🇳 India</span>
                                <span className="font-bold">{indiaUsers}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>🇨🇦 Canada</span>
                                <span className="font-bold">{canadaUsers}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Table */}
                <div className="mb-8 mt-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">User Management</h2>
                    <UserTable users={await getUsers()} />
                </div>
            </div>
        </div>
    )
}
