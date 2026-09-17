import React, { useState, useEffect } from 'react';
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
  Check,
  Loader2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  Shield,
  Clock
} from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

const ROLE_BADGE_STYLE = {
  SUPER_ADMIN: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  COMPANY_ADMIN: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  HR_MANAGER: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  TEAM_LEADER: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  EMPLOYEE: 'bg-slate-500/10 text-slate-300 border-slate-500/20'
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedTenant, setSelectedTenant] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [toastMsg, setToastMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'UserPass2026!',
    role: 'EMPLOYEE',
    tenantId: ''
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser(prev => ({ ...prev, password: pass }));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, tenantsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getTenants()
      ]);

      if (tenantsRes?.success && tenantsRes.data) {
        setTenants(tenantsRes.data);
        if (tenantsRes.data.length > 0 && !newUser.tenantId) {
          setNewUser(prev => ({ ...prev, tenantId: tenantsRes.data[0].id }));
        }
      }

      if (usersRes?.success && usersRes.data) {
        const mapped = usersRes.data.map(u => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          email: u.email,
          tenantId: u.tenantId,
          tenant: u.tenant?.name || 'Global / Platform',
          role: u.role,
          status: u.status || 'ACTIVE',
          jobTitle: u.jobTitle || u.role.replace('_', ' ')
        }));
        setUsers(mapped);
      }
    } catch (err) {
      console.warn('Error loading user directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Role Update Handler
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminAPI.updateUserRole(userId, { role: newRole });
      if (res?.success) {
        showToast(`Role updated to ${newRole}!`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error('Role update error:', err);
    }
  };

  // Status Update Handler (Active / Inactive / Approve)
  const handleStatusChange = async (userId, newStatus, userName) => {
    try {
      const res = await adminAPI.updateUserRole(userId, { status: newStatus });
      if (res?.success) {
        showToast(`User status updated to ${newStatus}`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) return;
    try {
      const res = await adminAPI.deleteUser(userId);
      if (res?.success) {
        showToast(`User ${userEmail} deleted successfully.`);
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  // Create User Handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fullName = `${newUser.firstName} ${newUser.lastName}`.trim();
      const res = await adminAPI.createUser({
        name: fullName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        tenantId: newUser.tenantId
      });

      if (res?.success) {
        showToast(`User ${newUser.email} created successfully!`);
        setIsModalOpen(false);
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          password: 'UserPass2026!',
          role: 'EMPLOYEE',
          tenantId: tenants[0]?.id || ''
        });
        loadData();
      }
    } catch (err) {
      console.error('Create user error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    const matchesTenant = selectedTenant === 'ALL' || u.tenantId === selectedTenant;
    const matchesStatus = selectedStatus === 'ALL' || u.status === selectedStatus;

    return matchesSearch && matchesRole && matchesTenant && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-slate-100 font-sans">
      <SuperadminSidebar activeItem="users" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-indigo-400/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      <main className="flex-1 ml-64 p-8 w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-500" /> Live User &amp; RBAC Directory
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage users across client tenant organizations, assign security roles, and govern portal access.</p>
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

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Total Provisioned Users</p>
            <p className="text-2xl font-extrabold text-white mt-1">{users.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Active Accounts</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              {users.filter(u => u.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Pending Approvals</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">
              {users.filter(u => u.status === 'PENDING_INVITE').length}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Administrators (Company / Super)</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              {users.filter(u => ['COMPANY_ADMIN', 'SUPER_ADMIN'].includes(u.role)).length}
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user name, email, or tenant..."
              className="w-full bg-[#1E293B] border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Tenant Filter */}
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Tenant:</span>
              <select 
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="ALL" className="bg-[#0F172A]">All Workspaces</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id} className="bg-[#0F172A]">{t.name}</option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Role:</span>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#0F172A]">All Roles</option>
                <option value="EMPLOYEE" className="bg-[#0F172A]">Employee</option>
                <option value="TEAM_LEADER" className="bg-[#0F172A]">Team Leader</option>
                <option value="HR_MANAGER" className="bg-[#0F172A]">HR Manager</option>
                <option value="COMPANY_ADMIN" className="bg-[#0F172A]">Company Admin</option>
                <option value="SUPER_ADMIN" className="bg-[#0F172A]">Super Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <span>Status:</span>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#0F172A]">All Statuses</option>
                <option value="ACTIVE" className="bg-[#0F172A]">Active</option>
                <option value="PENDING_INVITE" className="bg-[#0F172A]">Pending Approval</option>
                <option value="INACTIVE" className="bg-[#0F172A]">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0F172A] border border-slate-800/80 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-400 mt-3">Loading live user directory from database...</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#1E293B]/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Tenant Workspace</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4">Account Status</th>
                    <th className="px-6 py-4 text-right">RBAC Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                              {u.firstName?.[0] || u.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-2">
                                {u.name}
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-500" />
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {u.tenant}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${ROLE_BADGE_STYLE[u.role] || ROLE_BADGE_STYLE.EMPLOYEE}`}>
                            <Shield className="w-3 h-3" />
                            {u.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {u.status === 'PENDING_INVITE' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                              Pending Approval
                            </span>
                          ) : u.status === 'INACTIVE' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                              Inactive
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Active
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {u.status === 'PENDING_INVITE' && (
                              <button
                                onClick={() => handleStatusChange(u.id, 'ACTIVE', u.name)}
                                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> Approve Access
                              </button>
                            )}

                            {u.status === 'ACTIVE' && u.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => handleStatusChange(u.id, 'INACTIVE', u.name)}
                                className="px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors"
                                title="Deactivate Account"
                              >
                                Deactivate Account
                              </button>
                            )}

                            {u.status === 'INACTIVE' && (
                              <button
                                onClick={() => handleStatusChange(u.id, 'ACTIVE', u.name)}
                                className="px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-colors"
                                title="Reactivate Account"
                              >
                                Reactivate Account
                              </button>
                            )}

                            {u.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-slate-500">
                        No users found matching active filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Provision New User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
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
                    <p className="text-xs text-slate-400">Create user under specific client workspace.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jenkins"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="user@company.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Tenant Workspace</label>
                    <select
                      value={newUser.tenantId}
                      onChange={(e) => setNewUser({ ...newUser, tenantId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-semibold"
                    >
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Assigned Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-semibold"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="TEAM_LEADER">Team Leader</option>
                      <option value="HR_MANAGER">HR Manager</option>
                      <option value="COMPANY_ADMIN">Company Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase text-slate-400">Initial Password</label>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Auto-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                  />
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
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Create Account
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