import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Search, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append('role', roleFilter);
      if (search) params.append('search', search);

      const response = await api.get(`/admin/users?${params.toString()}`);
      if (response.data && response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin users:', error);
      toast.error('Failed to retrieve user directories');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await api.put(`/admin/users/${id}`, { is_active: !currentStatus });
      if (response.data && response.data.success) {
        toast.success(`User account status updated successfully!`);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change user status');
    }
  };

  const handleUpdateRole = async (id, role) => {
    try {
      const response = await api.put(`/admin/users/${id}`, { role });
      if (response.data && response.data.success) {
        toast.success(`User role updated to ${role}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Role update failed');
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in w-full">
      {/* Title block */}
      <div className="pb-4 border-b border-white/5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Manage Users</h1>
        <p className="text-text-muted text-xs">View renter directories, adjust access permissions, and update user roles.</p>
      </div>

      {/* Search and Role Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex max-w-sm relative items-center w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-bg-secondary/40 border-white/10 text-white placeholder-white/20 rounded-xl"
          />
          <Search className="absolute left-3 w-4 h-4 text-text-muted" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-bg-secondary/40 border-white/10 text-white text-xs rounded-xl self-end sm:self-auto cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="customer">Renter (Customer)</option>
          <option value="owner">Fleet Owner</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      {/* Users table directory */}
      {loading ? (
        <div className="text-center py-12 text-primary font-bold animate-pulse text-sm">
          Loading user directories...
        </div>
      ) : users.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center text-text-muted">
          No users match your criteria.
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-text-muted uppercase font-bold tracking-wider">
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Account Role</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Change Status</th>
                  <th className="py-3 px-4 text-center">Role Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="text-white font-bold">{u.name}</div>
                      <span className="text-[10px] text-text-muted font-mono">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-muted">
                      {u.phone || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-red-500/10 text-red-400'
                          : u.role === 'owner'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.is_active
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {u.is_active ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(u.id, u.is_active)}
                        className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                          u.is_active
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.is_active ? <ToggleRight className="w-4 h-4 text-red-400" /> : <ToggleLeft className="w-4 h-4 text-emerald-400" />}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleUpdateRole(u.id, 'customer')}
                          disabled={u.role === 'customer'}
                          className="btn bg-white/5 border border-white/10 hover:border-white/20 text-white text-[10px] px-2 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Customer
                        </button>
                        <button
                          onClick={() => handleUpdateRole(u.id, 'owner')}
                          disabled={u.role === 'owner'}
                          className="btn bg-white/5 border border-white/10 hover:border-white/20 text-white text-[10px] px-2 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Owner
                        </button>
                        <button
                          onClick={() => handleUpdateRole(u.id, 'admin')}
                          disabled={u.role === 'admin'}
                          className="btn bg-white/5 border border-white/10 hover:border-white/20 text-white text-[10px] px-2 py-1 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Admin
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
