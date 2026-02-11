'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Shield,
    User as UserIcon,
    Loader2,
    ChevronLeft,
    ChevronRight,
    UserCog,
    Eye
} from 'lucide-react'

interface User {
    id: string
    full_name: string
    university: string
    major: string
    semester: number
    role: string
    city: string
    created_at: string
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [actionMenuId, setActionMenuId] = useState<string | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    const fetchUsers = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                search,
                role: roleFilter,
            })

            const res = await fetch(`/api/admin/users?${params}`)
            const data = await res.json()

            if (data.users) {
                setUsers(data.users)
                setTotalPages(data.pagination.totalPages)
                setTotal(data.pagination.total)
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            setIsLoading(false)
        }
    }, [page, search, roleFilter])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleUpdateRole = async (userId: string, newRole: string) => {
        setIsUpdating(true)
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, updates: { role: newRole } }),
            })

            if (res.ok) {
                fetchUsers()
                setActionMenuId(null)
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to update role')
            }
        } catch (error) {
            console.error('Failed to update role:', error)
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.')) {
            return
        }

        try {
            const res = await fetch(`/api/admin/users?userId=${userId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                fetchUsers()
                setActionMenuId(null)
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to delete user')
            }
        } catch (error) {
            console.error('Failed to delete user:', error)
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'super_admin':
                return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">Super Admin</span>
            case 'admin':
                return <span className="px-2 py-1 bg-violet-500/20 text-violet-400 rounded-full text-xs font-medium">Admin</span>
            default:
                return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">User</span>
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manajemen Pengguna</h1>
                    <p className="text-gray-400">Total {total} pengguna terdaftar</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama, universitas, jurusan..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
                        className="pl-10 pr-8 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none appearance-none cursor-pointer"
                    >
                        <option value="all">Semua Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left p-4 text-gray-400 font-medium">User</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Universitas</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Jurusan</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Role</th>
                                <th className="text-left p-4 text-gray-400 font-medium">Bergabung</th>
                                <th className="text-right p-4 text-gray-400 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center">
                                        <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        Tidak ada pengguna ditemukan
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                                                    <span className="text-white font-medium">
                                                        {user.full_name?.charAt(0) || '?'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.full_name || 'No Name'}</p>
                                                    <p className="text-gray-400 text-sm">{user.city || 'Unknown'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-300">{user.university || '-'}</td>
                                        <td className="p-4 text-gray-300">{user.major || '-'}</td>
                                        <td className="p-4">{getRoleBadge(user.role)}</td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2 relative">
                                                <button
                                                    onClick={() => setActionMenuId(actionMenuId === user.id ? null : user.id)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                {actionMenuId === user.id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={() => setActionMenuId(null)}
                                                        />
                                                        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-700 rounded-lg border border-gray-600 shadow-xl z-50">
                                                            <div className="p-1">
                                                                <button
                                                                    onClick={() => { setSelectedUser(user); setShowEditModal(true); setActionMenuId(null) }}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors text-left"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    Lihat Detail
                                                                </button>
                                                                {user.role !== 'admin' && user.role !== 'super_admin' && (
                                                                    <button
                                                                        onClick={() => handleUpdateRole(user.id, 'admin')}
                                                                        disabled={isUpdating}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-violet-400 hover:bg-gray-600 rounded-lg transition-colors text-left disabled:opacity-50"
                                                                    >
                                                                        <Shield className="w-4 h-4" />
                                                                        Jadikan Admin
                                                                    </button>
                                                                )}
                                                                {user.role === 'admin' && (
                                                                    <button
                                                                        onClick={() => handleUpdateRole(user.id, 'user')}
                                                                        disabled={isUpdating}
                                                                        className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors text-left disabled:opacity-50"
                                                                    >
                                                                        <UserIcon className="w-4 h-4" />
                                                                        Jadikan User
                                                                    </button>
                                                                )}
                                                                <div className="h-px bg-gray-600 my-1" />
                                                                <button
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-gray-600 rounded-lg transition-colors text-left"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-700">
                        <p className="text-gray-400 text-sm">
                            Halaman {page} dari {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Detail Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg">
                        <div className="p-6 border-b border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">
                                        {selectedUser.full_name?.charAt(0) || '?'}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedUser.full_name}</h2>
                                    <p className="text-gray-400">{getRoleBadge(selectedUser.role)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Universitas</p>
                                    <p className="text-white">{selectedUser.university || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Jurusan</p>
                                    <p className="text-white">{selectedUser.major || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Semester</p>
                                    <p className="text-white">{selectedUser.semester || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Kota</p>
                                    <p className="text-white">{selectedUser.city || '-'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">User ID</p>
                                <p className="text-white font-mono text-sm">{selectedUser.id}</p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-700 flex justify-end">
                            <button
                                onClick={() => { setShowEditModal(false); setSelectedUser(null) }}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
