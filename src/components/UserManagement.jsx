import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  ShieldCheck, 
  Mail, 
  X, 
  KeyRound, 
  CheckCircle2, 
  UserX, 
  MoreVertical 
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';

// Mock Users Across Tenants
const initialUsers = [
  {
    id: 'USR-2001',
    name: 'Sarah Connor',
    email: 'sarah.connor@acmeglobal.com',
    tenant: 'Acme Global Enterprises',
    role: 'Tenant Admin',
    status: 'Active',
    lastActive: '10 mins ago',
    joinedDate: '2025-11-15'
  },
  {
    id: 'USR-2002',
    name: 'David Miller',
    email: 'david.m@nexustech.io',
    tenant: 'Nexus Tech Solutions',
    role: 'HR Manager',
    status: 'Active',
    lastActive: '2 hours ago',
    joinedDate: '2026-01-20'
  },
  {
    id: 'USR-2003',
    name: 'Elena Rostova',
    email: 'elena@apexfin.com',
    tenant: 'Apex Financial Services',
    role: 'Employee / Learner',
    status: 'Inactive',
    lastActive: '4 days ago',
    joinedDate: '2025-09-01'
  },
  {
    id: 'USR-2004',
    name: 'Marcus Vance',
    email: 'm.vance@vanguardhealth.org',
    tenant: 'Vanguard Health Systems',
    role: 'Tenant Admin',
    status: 'Suspended',
    lastActive: '2 weeks ago',
    joinedDate: '2026-03-12'
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    tenant: 'Acme Global Enterprises',
    role: 'Tenant Admin'
  });

  // Filter Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Create User Handler
  const handleCreateUser = (e) => {
    e.preventDefault();
    const created = {
      ...newUser,
      id: `USR-${Math.floor(2000 + Math.random() * 900)}`,
      status: 'Active',
      lastActive: 'Just now',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUsers([created, ...users]);
    setIsModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      tenant: 'Acme Global Enterprises',
      role: 'Tenant Admin'
    });
  };

  // Toggle User Status
  const toggleUserStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return {
          ...u,
          status: u.status === 'Active' ? 'Suspended' : 'Active'
        };
      }
      return u;
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Global User Directory
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Cross-tenant user administration, access provisioning, and global credential management.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Provision New User
          </motion.button>
        </div>

        {/* User Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Total Registered Users</p>
            <p className="text-2xl font-extrabold text-white mt-1">{users.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Active Accounts</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              {users.filter(u => u.status === 'Active').length}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Tenant Admins</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              {users.filter(u => u.role === 'Tenant Admin').length}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Suspended Accounts</p>
            <p className="text-2xl font-extrabold text-rose-400 mt-1">
              {users.filter(u => u.status === 'Suspended').length}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Role:</span>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0F172A]">All Roles</option>
                <option value="Tenant Admin" className="bg-[#0F172A]">Tenant Admin</option>
                <option value="HR Manager" className="bg-[#0F172A]">HR Manager</option>
                <option value="Employee / Learner" className="bg-[#0F172A]">Employee / Learner</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <span>Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0F172A]">All Statuses</option>
                <option value="Active" className="bg-[#0F172A]">Active</option>
                <option value="Inactive" className="bg-[#0F172A]">Inactive</option>
                <option value="Suspended" className="bg-[#0F172A]">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#1E293B]/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Assigned Tenant</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Activity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              {user.name}
                              <span className="text-[10px] font-mono text-slate-500">({user.id})</span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {user.tenant}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          user.status === 'Inactive' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'Active' ? 'bg-emerald-400' :
                            user.status === 'Inactive' ? 'bg-slate-400' :
                            'bg-rose-400'
                          }`} />
                          {user.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {user.lastActive}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Reset Password Link"
                            onClick={() => alert(`Password reset link dispatched to ${user.email}`)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              user.status === 'Suspended'
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                            }`}
                          >
                            {user.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-500">
                      No user accounts match current filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Provision New User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Provision New User Account</h2>
                    <p className="text-xs text-slate-400">Add user to target organization & role.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jane.doe@company.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Tenant</label>
                    <select
                      value={newUser.tenant}
                      onChange={(e) => setNewUser({ ...newUser, tenant: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Acme Global Enterprises">Acme Global Enterprises</option>
                      <option value="Nexus Tech Solutions">Nexus Tech Solutions</option>
                      <option value="Apex Financial Services">Apex Financial Services</option>
                      <option value="Vanguard Health Systems">Vanguard Health Systems</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Assigned Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Tenant Admin">Tenant Admin</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="Employee / Learner">Employee / Learner</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    Dispatch Invite & Provision
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserManagement;