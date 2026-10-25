import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, Filter, ShieldCheck, Edit3,
  UserX, UserCheck, Mail, Building2, X, Check,
  SlidersHorizontal, Loader2, Lock, Plus
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
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
  'Company Admin': 'bg-purple-100 text-purple-700 border-purple-200 font-bold',
  'HR Manager': 'bg-sky-100 text-sky-700 border-sky-200 font-bold',
  'Team Leader': 'bg-amber-100 text-amber-700 border-amber-200 font-bold',
  'Employee': 'bg-slate-100 text-slate-700 border-slate-200 font-bold'
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
    <div className="flex min-h-screen bg-[#E9EAF7] font-sans text-[#17233E] relative overflow-x-hidden selection:bg-[#1988A3] selection:text-white">
      {/* Ambient Gradient Depth Mesh Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[550px] h-[550px] bg-[#1988A3]/20 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#11C6DE]/16 blur-[140px] rounded-full" />
        <div className="absolute top-2/3 left-10 w-[600px] h-[600px] bg-[#1B3154]/16 blur-[150px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-[#8A9CB7]/28 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(27,49,84,0.10)_1px,transparent_1px)] [background-size:28px_28px] opacity-35" />
      </div>

      <CompanyAdminSidebar />
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 px-3.5 sm:px-6 md:px-8 pb-10 w-full max-w-full overflow-x-hidden relative z-10 space-y-6 sm:space-y-8">
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E]">
                User & Role <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Governance</span>
              </h1>
            </div>
            <p className="text-[#8A9CB7] text-xs md:text-sm font-medium mt-1 sm:mt-1.5 ml-0 sm:ml-12">
              Provision employee accounts, assign organizational roles, and manage tenant access permissions.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setIsAddModalOpen(true);
              setError('');
              setShowCustomDept(false);
              setFormData({ name: '', email: '', role: 'EMPLOYEE', dept: dynamicDepts[0] || '', status: 'ACTIVE' });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Provision New User
          </motion.button>
        </header>

        {/* Live Governance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] sm:text-xs font-bold text-[#8A9CB7] uppercase tracking-wider truncate">Total Users</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#17233E] mt-3 tracking-tight">{users.length}</p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1988A3]"></span> Active workspace roster
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] sm:text-xs font-bold text-[#8A9CB7] uppercase tracking-wider truncate">Active Accounts</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-emerald-600 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 mt-3 tracking-tight">
              {users.filter(u => u.status === 'ACTIVE').length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {users.length > 0 ? Math.round((users.filter(u => u.status === 'ACTIVE').length / users.length) * 100) : 0}% active rate
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] sm:text-xs font-bold text-[#8A9CB7] uppercase tracking-wider truncate">Departments</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#11C6DE] shadow-sm">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[#17233E] mt-3 tracking-tight">{dynamicDepts.length}</p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE]"></span> Active business units
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] sm:text-xs font-bold text-[#8A9CB7] uppercase tracking-wider truncate">Leadership</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-purple-600 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-purple-600 mt-3 tracking-tight">
              {users.filter(u => ['Company Admin', 'HR Manager', 'Team Leader'].includes(u.role)).length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Governing accounts
            </p>
          </motion.div>
        </div>

        {/* Filter & Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4"
        >
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9CB7]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 text-[#17233E] border border-white/90 rounded-2xl text-sm focus:outline-none focus:border-[#1988A3] placeholder:text-[#8A9CB7] shadow-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
            <span className="text-xs font-bold text-[#8A9CB7] bg-white/60 px-3 py-1.5 rounded-2xl border border-white/80">
              Showing <span className="text-[#17233E] font-extrabold">{filteredUsers.length}</span> of {users.length}
            </span>
            <div className="flex items-center gap-2 bg-white/80 border border-white/90 px-3 py-1.5 rounded-2xl text-xs text-[#17233E] shadow-sm">
              <Filter className="w-3.5 h-3.5 text-[#1988A3]" /><span className="font-semibold">Role:</span>
              <select value={selectedRoleFilter} onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer">
                <option value="All">All Roles</option>
                {['Employee','Team Leader','HR Manager','Company Admin'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white/80 border border-white/90 px-3 py-1.5 rounded-2xl text-xs text-[#17233E] shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-[#1988A3]" /><span className="font-semibold">Dept:</span>
              <select value={selectedDeptFilter} onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer">
                <option value="All">All Depts</option>
                {dynamicDepts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <SkillPulseLoader message="Synchronizing Workspace User Governance..." fullScreen={false} />
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 overflow-hidden"
        >
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-sm text-[#17233E] min-w-[700px]">
              <thead className="bg-[#17233E]/10 text-xs font-bold uppercase tracking-wider text-[#17233E] border-b border-white/60">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Provisioned Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(0.25, idx * 0.015) }}
                    className="hover:bg-white/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#1988A3] to-[#11C6DE] text-white font-extrabold flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#17233E] leading-tight group-hover:text-[#1988A3] transition-colors">{user.name}</p>
                          <p className="text-xs text-[#8A9CB7] font-medium mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-xl border shadow-xs ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.dept === 'Unassigned' ? (
                        <button onClick={() => handleEditClick(user)} className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 transition-colors cursor-pointer">
                          <Plus className="w-3 h-3" /> Assign Dept
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-white/70 border border-white/85 text-xs font-semibold text-[#17233E] shadow-xs">{user.dept}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl border shadow-xs ${
                        user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'}`} />
                        {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#8A9CB7] font-mono font-medium">{user.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleEditClick(user)}
                          className="p-2 rounded-xl bg-white/80 hover:bg-white text-[#1988A3] border border-white/85 shadow-sm transition-all cursor-pointer"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => toggleUserStatus(user)}
                          className={`p-2 rounded-xl transition-all shadow-sm cursor-pointer ${
                            user.status === 'ACTIVE'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200'
                          }`}
                          title={user.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                        >
                          {user.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-12 text-[#8A9CB7] font-medium">No users match the search criteria.</td></tr>
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
              className="w-full max-w-md bg-gradient-to-b from-[#17233E] to-[#121E33] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-4 sm:p-6 max-h-[90vh] overflow-y-auto text-white">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Provision New Tenant User</h2>
                <button onClick={() => { setIsAddModalOpen(false); setError(''); }} className="text-[#8A9CB7] hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              {error && (
                <div className="mt-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jane Doe" className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#11C6DE]" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Corporate Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane.doe@company.com" className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#11C6DE]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Role</label>
                    <select required value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE]">
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
                      <p className="text-[10px] text-amber-300 mt-1 flex items-center gap-1 font-semibold">
                        <Lock className="w-3 h-3 shrink-0" /> Upgrade to unlock premium roles.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Department</label>
                    {showCustomDept ? (
                      <div className="relative">
                        <input type="text" required value={formData.dept}
                          onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                          placeholder="Type custom department..."
                          className="w-full px-3 py-2.5 pr-8 bg-white/10 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE]" autoFocus />
                        <button type="button" onClick={() => { setShowCustomDept(false); setFormData({ ...formData, dept: dynamicDepts[0] || 'Unassigned' }); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8A9CB7] hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
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
                        className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE]">
                        {dynamicDepts.map(d => <option key={d} value={d}>{d}</option>)}
                        <option disabled>──────────</option>
                        <option value="__CUSTOM__">➕ Add Custom Dept...</option>
                      </select>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsAddModalOpen(false); setError(''); }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" disabled={saving}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 cursor-pointer">
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
              className="w-full max-w-md bg-gradient-to-b from-[#17233E] to-[#121E33] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-4 sm:p-6 max-h-[90vh] overflow-y-auto text-white">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Edit User Governance</h2>
                <button onClick={() => { setIsEditModalOpen(false); setError(''); }} className="text-[#8A9CB7] hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              {error && (
                <div className="mt-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Full Name</label>
                  <input type="text" disabled value={formData.name}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-[#8A9CB7] opacity-70 cursor-not-allowed focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Corporate Email</label>
                  <input type="email" disabled value={formData.email}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-[#8A9CB7] opacity-70 cursor-not-allowed focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Department</label>
                  {showCustomDept ? (
                    <div className="relative">
                      <input type="text" required value={formData.dept}
                        onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                        placeholder="Type custom department..."
                        className="w-full px-3.5 py-2.5 pr-8 bg-white/10 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE]" autoFocus />
                      <button type="button" onClick={() => { setShowCustomDept(false); setFormData({ ...formData, dept: currentUser?.dept || dynamicDepts[0] || 'Unassigned' }); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9CB7] hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
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
                      className="w-full px-3.5 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE]">
                      {!dynamicDepts.includes(formData.dept) && <option value={formData.dept}>{formData.dept}</option>}
                      {dynamicDepts.map(d => <option key={d} value={d}>{d}</option>)}
                      <option disabled>──────────</option>
                      <option value="__CUSTOM__">➕ Add Custom Dept...</option>
                    </select>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Role</label>
                    <select required value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE]">
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
                      <p className="text-[10px] text-amber-300 mt-1 flex items-center gap-1 font-semibold">
                        <Lock className="w-3 h-3 shrink-0" /> Upgrade to unlock premium roles.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE]">
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button type="button" onClick={() => { setIsEditModalOpen(false); setError(''); }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" disabled={saving}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 cursor-pointer">
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
