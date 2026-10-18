import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Search, Filter, ShieldCheck, Edit3, 
  UserX, UserCheck, Mail, Building2, X, Check, 
  SlidersHorizontal, Loader2, Lock, Plus
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';
import { adminAPI } from '../services/api';

const ROLE_DISPLAY = {
  EMPLOYEE: 'Employee', TEAM_LEADER: 'Team Leader',
  HR_MANAGER: 'HR Manager', COMPANY_ADMIN: 'Company Admin',
  SUPER_ADMIN: 'Super Admin'
};

const REVERSE_ROLE = {
  'Employee': 'EMPLOYEE', 'Team Leader': 'TEAM_LEADER',
  'HR Manager': 'HR_MANAGER', 'Company Admin': 'COMPANY_ADMIN',
  'Super Admin': 'SUPER_ADMIN'
};

const ROLE_COLORS = {
  'Company Admin': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'HR Manager': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Team Leader': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Employee': 'bg-slate-800 text-slate-300 border-slate-700'
};

const UserRoleGovernance = () => {
  const storedUser = localStorage.getItem('user');
  let userPlan = 'STARTER';
  if (storedUser) {
    try {
      const u = JSON.parse(storedUser);
      userPlan = u?.tenant?.plan || u?.plan || 'STARTER';
    } catch(e) {}
  }

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [dynamicDepts, setDynamicDepts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'EMPLOYEE', dept: '', status: 'ACTIVE' });
  const [showCustomDept, setShowCustomDept] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, deptsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getDepartments()
      ]);

      let deptsFromDB = [];
      if (deptsRes?.success && Array.isArray(deptsRes.data)) {
        deptsFromDB = deptsRes.data.map(d => d.name).filter(Boolean);
      }

      if (usersRes?.success && Array.isArray(usersRes.data)) {
        const mapped = usersRes.data.map(u => ({
          id: u.id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          email: u.email,
          roleEnum: u.role,
          role: ROLE_DISPLAY[u.role] || u.role,
          dept: u.department?.name || 'Unassigned',
          status: u.status || 'ACTIVE',
          joined: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        }));
        setUsers(mapped);

        const userDepts = mapped.map(u => u.dept).filter(d => d && d !== 'Unassigned');
        const mergedDepts = Array.from(new Set([...deptsFromDB, ...userDepts])).sort();
        setDynamicDepts(mergedDepts);
        if (mergedDepts.length > 0 && !formData.dept) {
          setFormData(prev => ({ ...prev, dept: mergedDepts[0] }));
        }
      } else if (deptsFromDB.length > 0) {
        setDynamicDepts(deptsFromDB.sort());
        if (!formData.dept) {
          setFormData(prev => ({ ...prev, dept: deptsFromDB[0] }));
        }
      }
    } catch (err) {
      console.warn('Failed to load tenant users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || user.role === selectedRoleFilter;
    const matchesDept = selectedDeptFilter === 'All' || user.dept === selectedDeptFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  const toggleUserStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await adminAPI.updateUserRole(user.id, { role: user.roleEnum, status: nextStatus });
      if (res?.success) fetchUsers();
    } catch (err) { console.warn('Failed to update user status:', err); }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setFormData({ name: user.name, email: user.email, role: user.roleEnum || user.role, dept: user.dept, status: user.status });
    setShowCustomDept(false);
    setIsEditModalOpen(true);
  };

  const PREMIUM_ROLES = ['HR_MANAGER', 'TEAM_LEADER'];
  const planLevel = { 'STARTER': 1, 'PRO': 2, 'Professional': 2, 'ENTERPRISE': 3, 'Enterprise AI': 3 };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    const roleEnum = REVERSE_ROLE[formData.role] || formData.role;
    if (PREMIUM_ROLES.includes(roleEnum) && (planLevel[userPlan] || 1) < 2) {
      setError('Upgrade to Professional or Enterprise to assign premium roles.');
      return;
    }
    setSaving(true); setError('');
    try {
      const res = await adminAPI.createUser({ name: formData.name, email: formData.email, role: roleEnum, dept: formData.dept });
      if (res?.success) {
        setIsAddModalOpen(false);
        setFormData({ name: '', email: '', role: 'EMPLOYEE', dept: 'Unassigned', status: 'ACTIVE' });
        fetchUsers();
      } else { setError(res?.message || 'Failed to create user.'); }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to provision user.');
    } finally { setSaving(false); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const roleEnum = REVERSE_ROLE[formData.role] || formData.role;
    if (PREMIUM_ROLES.includes(roleEnum) && (planLevel[userPlan] || 1) < 2) {
      setError('Upgrade to Professional or Enterprise to assign premium roles.');
      return;
    }
    setSaving(true); setError('');
    try {
      const res = await adminAPI.updateUserRole(currentUser.id, { role: roleEnum, status: formData.status, dept: formData.dept });
      if (res?.success) {
        setIsEditModalOpen(false); fetchUsers();
      } else { setError(res?.message || 'Failed to update user.'); }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update user.');
    } finally { setSaving(false); }
  };

  const isRoleLocked = (role) => PREMIUM_ROLES.includes(role) && (planLevel[userPlan] || 1) < 2;
  const showPlanWarning = (planLevel[userPlan] || 1) < 2;

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <CompanyAdminSidebar />
      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">User & Role Governance</h1>
            </div>
            <p className="text-slate-400 text-sm mt-1.5 ml-12">Provision employee accounts, assign organizational roles, and manage tenant access permissions.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.04, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { 
              setIsAddModalOpen(true); 
              setError(''); 
              setShowCustomDept(false); 
              setFormData({ name: '', email: '', role: 'EMPLOYEE', dept: dynamicDepts[0] || '', status: 'ACTIVE' }); 
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Provision New User
          </motion.button>
        </motion.div>

        {/* Live Governance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.4)" }}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#131D31] to-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white mt-3 tracking-tight">{users.length}</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Active workspace roster
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            whileHover={{ y: -4, borderColor: "rgba(16, 185, 129, 0.4)" }}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#131D31] to-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Accounts</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400 mt-3 tracking-tight">
              {users.filter(u => u.status === 'ACTIVE').length}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {users.length > 0 ? Math.round((users.filter(u => u.status === 'ACTIVE').length / users.length) * 100) : 0}% active rate
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            whileHover={{ y: -4, borderColor: "rgba(56, 189, 248, 0.4)" }}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#131D31] to-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Departments</span>
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-sky-400 mt-3 tracking-tight">{dynamicDepts.length}</p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> Active business units
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            whileHover={{ y: -4, borderColor: "rgba(168, 85, 247, 0.4)" }}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#131D31] to-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden transition-all duration-300 group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leadership</span>
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-purple-400 mt-3 tracking-tight">
              {users.filter(u => ['Company Admin', 'HR Manager', 'Team Leader'].includes(u.role)).length}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Governing accounts
            </p>
          </motion.div>
        </div>

        {/* Filter & Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name or email..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs font-semibold text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50">
              Showing <span className="text-white font-bold">{filteredUsers.length}</span> of {users.length}
            </span>
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" /><span>Role:</span>
              <select value={selectedRoleFilter} onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer">
                <option value="All" className="bg-[#0F172A]">All Roles</option>
                {['Employee','Team Leader','HR Manager','Company Admin'].map(r => <option key={r} value={r} className="bg-[#0F172A]">{r}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /><span>Dept:</span>
              <select value={selectedDeptFilter} onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer">
                <option value="All" className="bg-[#0F172A]">All Depts</option>
                {dynamicDepts.map(d => <option key={d} value={d} className="bg-[#0F172A]">{d}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-sm font-semibold text-slate-400">Loading tenant user accounts...</p>
          </div>
        ) : (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#1E293B]/70 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Provisioned Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                  <motion.tr 
                    key={user.id} 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(0.25, idx * 0.015) }}
                    className="hover:bg-slate-800/40 hover:border-slate-700/60 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-tight group-hover:text-indigo-200 transition-colors">{user.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${ROLE_COLORS[user.role] || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.dept === 'Unassigned' ? (
                        <button onClick={() => handleEditClick(user)} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 rounded-full border border-amber-400/20 transition-colors">
                          <Plus className="w-3 h-3" /> Assign Dept
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300">{user.dept}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                        user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">{user.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditClick(user)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Edit User">
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleUserStatus(user)}
                          className={`p-2 rounded-lg transition-colors ${user.status === 'ACTIVE' ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'}`}
                          title={user.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}>
                          {user.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-12 text-slate-500">No users match the search criteria.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        )}
      </main>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">Provision New Tenant User</h2>
                <button onClick={() => { setIsAddModalOpen(false); setError(''); }} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jane Doe" className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Corporate Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane.doe@company.com" className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Role</label>
                    <select required value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                      <option value="EMPLOYEE">Employee</option>
                      <option value="COMPANY_ADMIN">Company Admin</option>
                      <option value="TEAM_LEADER" disabled={isRoleLocked('TEAM_LEADER')}>
                        Team Leader {isRoleLocked('TEAM_LEADER') ? '🔒 Pro/Enterprise' : ''}
                      </option>
                      <option value="HR_MANAGER" disabled={isRoleLocked('HR_MANAGER')}>
                        HR Manager {isRoleLocked('HR_MANAGER') ? '🔒 Pro/Enterprise' : ''}
                      </option>
                    </select>
                    {showPlanWarning && (
                      <p className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1">
                        <Lock className="w-3 h-3 shrink-0" /> Upgrade to unlock premium roles.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Department</label>
                    {showCustomDept ? (
                      <div className="relative">
                        <input type="text" required value={formData.dept}
                          onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                          placeholder="Type custom department..."
                          className="w-full px-3 py-2 pr-8 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500" autoFocus />
                        <button type="button" onClick={() => { setShowCustomDept(false); setFormData({ ...formData, dept: dynamicDepts[0] || 'Unassigned' }); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <select required value={formData.dept}
                        onChange={(e) => {
                          if (e.target.value === '__CUSTOM__') {
                            setShowCustomDept(true); setFormData({ ...formData, dept: '' });
                          } else {
                            setFormData({ ...formData, dept: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                        {dynamicDepts.map(d => <option key={d} value={d}>{d}</option>)}
                        <option disabled>──────────</option>
                        <option value="__CUSTOM__">➕ Add Custom Dept...</option>
                      </select>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsAddModalOpen(false); setError(''); }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors">Cancel</button>
                  <button type="submit" disabled={saving}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Provision User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">Edit User Governance</h2>
                <button onClick={() => { setIsEditModalOpen(false); setError(''); }} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
                  <input type="text" disabled value={formData.name}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-400 opacity-70 cursor-not-allowed focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Corporate Email</label>
                  <input type="email" disabled value={formData.email}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-400 opacity-70 cursor-not-allowed focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Department</label>
                  {showCustomDept ? (
                    <div className="relative">
                      <input type="text" required value={formData.dept}
                        onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                        placeholder="Type custom department..."
                        className="w-full px-3.5 py-2 pr-8 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500" autoFocus />
                      <button type="button" onClick={() => { setShowCustomDept(false); setFormData({ ...formData, dept: currentUser?.dept || dynamicDepts[0] || 'Unassigned' }); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <select required value={formData.dept}
                      onChange={(e) => {
                        if (e.target.value === '__CUSTOM__') {
                          setShowCustomDept(true); setFormData({ ...formData, dept: '' });
                        } else {
                          setFormData({ ...formData, dept: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                      {!dynamicDepts.includes(formData.dept) && <option value={formData.dept}>{formData.dept}</option>}
                      {dynamicDepts.map(d => <option key={d} value={d}>{d}</option>)}
                      <option disabled>──────────</option>
                      <option value="__CUSTOM__">➕ Add Custom Dept...</option>
                    </select>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Role</label>
                    <select required value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                      <option value="EMPLOYEE">Employee</option>
                      <option value="COMPANY_ADMIN">Company Admin</option>
                      <option value="TEAM_LEADER" disabled={isRoleLocked('TEAM_LEADER')}>
                        Team Leader {isRoleLocked('TEAM_LEADER') ? '🔒 Pro/Enterprise' : ''}
                      </option>
                      <option value="HR_MANAGER" disabled={isRoleLocked('HR_MANAGER')}>
                        HR Manager {isRoleLocked('HR_MANAGER') ? '🔒 Pro/Enterprise' : ''}
                      </option>
                    </select>
                    {showPlanWarning && (
                      <p className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1">
                        <Lock className="w-3 h-3 shrink-0" /> Upgrade to unlock premium roles.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsEditModalOpen(false); setError(''); }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors">Cancel</button>
                  <button type="submit" disabled={saving}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Changes
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

export default UserRoleGovernance;
