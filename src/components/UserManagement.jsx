import React, { useState, useEffect, useMemo } from 'react';
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
  CheckCircle2, 
  UserX, 
  Loader2, 
  Trash2, 
  AlertTriangle, 
  RefreshCw, 
  UserCheck, 
  Shield, 
  Edit3, 
  Briefcase,
  Layers,
  Sparkles,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SuperadminSidebar from './SuperadminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { adminAPI } from '../services/api';

const ROLE_BADGE_STYLE = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
  COMPANY_ADMIN: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  HR_MANAGER: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  TEAM_LEADER: 'bg-blue-100 text-blue-800 border-blue-200',
  EMPLOYEE: 'bg-slate-100 text-slate-700 border-slate-200'
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
  const [toastMsg, setToastMsg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    dept: '',
    role: 'EMPLOYEE',
    status: 'ACTIVE'
  });
  const [updatingUser, setUpdatingUser] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'UserPass2026!',
    role: 'EMPLOYEE',
    tenantId: '',
    dept: ''
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

      let loadedTenants = [];
      if (tenantsRes?.success && tenantsRes.data) {
        loadedTenants = tenantsRes.data;
        setTenants(loadedTenants);
        if (loadedTenants.length > 0 && !newUser.tenantId) {
          setNewUser(prev => ({ ...prev, tenantId: loadedTenants[0].id }));
        }
      }

      if (usersRes?.success && usersRes.data) {
        const mapped = usersRes.data.map(u => {
          const tenantObj = loadedTenants.find(t => t.id === u.tenantId);
          const tenantPlan = u.tenant?.plan || tenantObj?.plan || 'PRO';

          // Safe extraction of nested objects or strings
          const deptStr = typeof u.department === 'object' && u.department !== null
            ? (u.department.name || 'General')
            : (typeof u.department === 'string' && u.department ? u.department : 'General');

          const tenantStr = typeof u.tenant === 'object' && u.tenant !== null
            ? (u.tenant.name || tenantObj?.name || 'Platform Core')
            : (typeof u.tenant === 'string' && u.tenant ? u.tenant : (tenantObj?.name || 'Platform Core'));

          const roleStr = typeof u.role === 'object' && u.role !== null
            ? (u.role.name || 'EMPLOYEE')
            : (typeof u.role === 'string' && u.role ? u.role : 'EMPLOYEE');

          return {
            id: u.id,
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || (typeof u.email === 'string' ? u.email.split('@')[0] : 'User'),
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            email: u.email || '',
            role: roleStr,
            status: u.status || 'ACTIVE',
            tenant: tenantStr,
            tenantId: u.tenantId,
            tenantPlan: tenantPlan,
            department: deptStr,
            jobTitle: u.jobTitle || '',
            skillsCount: u._count?.skills || u.userSkills?.length || 0,
            createdAt: u.createdAt
          };
        });
        setUsers(mapped);
      }
    } catch (err) {
      console.warn('Failed to load user directory from PostgreSQL:', err);
      showToast('Failed to load user directory from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const isRoleAllowedByPlan = (role, plan) => {
    const p = (plan || 'STARTER').toUpperCase();
    if (role === 'EMPLOYEE' || role === 'COMPANY_ADMIN') return true;
    if (role === 'TEAM_LEADER' || role === 'HR_MANAGER') {
      return p === 'PRO' || p === 'ENTERPRISE' || p === 'PROFESSIONAL' || p === 'ENTERPRISE AI';
    }
    if (role === 'SUPER_ADMIN') return true;
    return true;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const targetTenant = tenants.find(t => t.id === newUser.tenantId);
    const targetPlan = targetTenant?.plan || 'PRO';

    if (!isRoleAllowedByPlan(newUser.role, targetPlan)) {
      showToast(`The ${newUser.role} role requires a PRO or ENTERPRISE plan. Selected workspace is on ${targetPlan}.`, 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        tenantId: newUser.tenantId,
        department: newUser.dept || 'General'
      };

      const res = await adminAPI.createUser(payload);
      if (res?.success) {
        showToast(`User ${newUser.email} provisioned successfully in ${targetTenant?.name || 'workspace'}!`);
        setIsModalOpen(false);
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          password: 'UserPass2026!',
          role: 'EMPLOYEE',
          tenantId: tenants[0]?.id || '',
          dept: ''
        });
        loadData();
      }
    } catch (err) {
      console.warn('Failed to provision user:', err);
      showToast(err.message || 'Failed to provision user account', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      jobTitle: user.jobTitle || '',
      dept: typeof user.department === 'object' && user.department !== null ? (user.department.name || 'General') : (user.department || 'General'),
      role: typeof user.role === 'object' && user.role !== null ? (user.role.name || 'EMPLOYEE') : (user.role || 'EMPLOYEE'),
      status: user.status || 'ACTIVE'
    });
  };

  const handleSaveUserEdits = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!isRoleAllowedByPlan(editForm.role, editingUser.tenantPlan)) {
      showToast(`Role ${editForm.role} is not permitted on this workspace's ${editingUser.tenantPlan} subscription plan.`, 'error');
      return;
    }

    setUpdatingUser(true);
    try {
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        jobTitle: editForm.jobTitle,
        department: editForm.dept,
        role: editForm.role,
        status: editForm.status
      };

      const res = await adminAPI.updateUser(editingUser.id, payload);
      if (res?.success) {
        showToast(`Updated profile and roles for ${editingUser.email}`);
        setEditingUser(null);
        loadData();
      }
    } catch (err) {
      console.warn('Failed to update user profile:', err);
      showToast(err.message || 'Failed to save user modifications', 'error');
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const res = await adminAPI.updateUser(userId, { status: newStatus });
      if (res?.success) {
        showToast(`Account status updated to ${newStatus}`);
        loadData();
      }
    } catch (err) {
      console.warn('Failed to update user status:', err);
      showToast('Failed to update user status', 'error');
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to permanently delete user ${email} from the database?`)) {
      return;
    }
    try {
      const res = await adminAPI.deleteUser(userId);
      if (res?.success) {
        showToast(`User ${email} permanently purged from system`);
        loadData();
      }
    } catch (err) {
      console.warn('Failed to delete user:', err);
      showToast('Failed to delete user account', 'error');
    }
  };

  const handleTenantChangeInProvision = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    const plan = tenant?.plan || 'PRO';
    let currentRole = newUser.role;
    if (!isRoleAllowedByPlan(currentRole, plan)) {
      currentRole = 'EMPLOYEE';
    }
    setNewUser(prev => ({ ...prev, tenantId, role: currentRole }));
  };

  const filteredUsers = users.filter(u => {
    const nameStr = String(u.name || '');
    const emailStr = String(u.email || '');
    const deptStr = String(typeof u.department === 'object' && u.department !== null ? (u.department.name || '') : (u.department || ''));
    const tenantStr = String(typeof u.tenant === 'object' && u.tenant !== null ? (u.tenant.name || '') : (u.tenant || ''));

    const matchesSearch = 
      nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emailStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deptStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenantStr.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    const matchesTenant = selectedTenant === 'ALL' || u.tenantId === selectedTenant;
    const matchesStatus = selectedStatus === 'ALL' || u.status === selectedStatus;

    return matchesSearch && matchesRole && matchesTenant && matchesStatus;
  });

  // Reset to first page on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedTenant, selectedStatus, itemsPerPage]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure currentPage is within bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const selectedTenantObj = tenants.find(t => t.id === newUser.tenantId);
  const provisionTargetPlan = selectedTenantObj?.plan || 'PRO';

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

      <SuperadminSidebar activeItem="users" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              toastMsg.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white border-white/40 shadow-[#1988A3]/30'
            }`}
          >
            {toastMsg.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            )}
            <span className="font-bold text-xs">{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 ml-0 lg:ml-64 px-3.5 sm:px-6 md:px-8 pt-20 lg:pt-8 pb-10 w-full max-w-full overflow-x-hidden relative z-10 space-y-6 sm:space-y-8">
        
        {/* Header */}
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E]">
                Live User &amp; <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">RBAC Directory</span>
              </h1>
              <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-white/80 text-[#1988A3] border border-white/90 shadow-xs">
                {users.length} Users
              </span>
            </div>
            <p className="text-[#8A9CB7] text-xs md:text-sm font-medium mt-1.5 ml-0 sm:ml-12">
              Cross-tenant identity governance: provision accounts, assign plan-restricted roles, and manage credentials.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto justify-center flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Provision New User
          </motion.button>
        </header>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          
          {/* Metric 1 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Total Users</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#17233E] tracking-tight">{users.length}</p>
            <p className="text-[11px] text-[#8A9CB7] mt-2 font-semibold">
              Across <span className="text-[#1988A3] font-bold">{tenants.length}</span> registered client organizations
            </p>
          </motion.div>

          {/* Metric 2 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Active Accounts</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-emerald-600 shadow-sm">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              {users.filter(u => u.status === 'ACTIVE').length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] mt-2 font-semibold">
              Fully authenticated &amp; active portal sessions
            </p>
          </motion.div>

          {/* Metric 3 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-amber-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Pending Approvals</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-amber-600 shadow-sm">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-amber-600 tracking-tight">
              {users.filter(u => u.status === 'PENDING_INVITE').length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] mt-2 font-semibold">
              Awaiting workspace invitation verification
            </p>
          </motion.div>

          {/* Metric 4 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Administrators</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-purple-600 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-purple-700 tracking-tight">
              {users.filter(u => ['COMPANY_ADMIN', 'SUPER_ADMIN'].includes(u.role)).length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] mt-2 font-semibold">
              {users.filter(u => u.role === 'SUPER_ADMIN').length} Super • {users.filter(u => u.role === 'COMPANY_ADMIN').length} Company Admins
            </p>
          </motion.div>

        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9CB7]" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user name, email, department, or tenant..."
              className="w-full bg-white/80 border border-white/90 rounded-2xl pl-10 pr-4 py-2 text-xs text-[#17233E] placeholder:text-[#8A9CB7] font-medium focus:outline-none focus:border-[#1988A3] transition-colors shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Tenant Filter */}
            <div className="flex items-center gap-2 bg-white/80 border border-white/90 px-3 py-1.5 rounded-2xl text-xs text-[#17233E] shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-[#1988A3]" />
              <span className="font-semibold">Workspace:</span>
              <select 
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="ALL">All Workspaces</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2 bg-white/80 border border-white/90 px-3 py-1.5 rounded-2xl text-xs text-[#17233E] shadow-sm">
              <Filter className="w-3.5 h-3.5 text-[#1988A3]" />
              <span className="font-semibold">Role:</span>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="TEAM_LEADER">Team Leader</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="COMPANY_ADMIN">Company Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-white/80 border border-white/90 px-3 py-1.5 rounded-2xl text-xs text-[#17233E] shadow-sm">
              <span className="font-semibold">Status:</span>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING_INVITE">Pending Approval</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        {loading ? (
          <SkillPulseLoader message="Loading live user directory from PostgreSQL database..." fullScreen={false} />
        ) : (
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-sm text-[#17233E] min-w-[700px]">
                <thead className="bg-[#17233E]/10 text-xs font-bold uppercase tracking-wider text-[#17233E] border-b border-white/60">
                  <tr>
                    <th className="px-6 py-4">User Identity</th>
                    <th className="px-6 py-4">Workspace / Dept</th>
                    <th className="px-6 py-4">Company Package</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4">Account Status</th>
                    <th className="px-6 py-4 text-right">Actions &amp; RBAC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/60">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-xs flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                              {u.firstName?.[0] || u.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-[#17233E] flex items-center gap-2">
                                {u.name}
                              </div>
                              <div className="text-xs text-[#8A9CB7] flex items-center gap-1.5 mt-0.5 font-medium">
                                <Mail className="w-3 h-3 text-[#1988A3]" />
                                <span>{u.email}</span>
                                {u.jobTitle && (
                                  <>
                                    <span>•</span>
                                    <span>{u.jobTitle}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17233E]">
                              <Building2 className="w-3.5 h-3.5 text-[#1988A3]" />
                              {typeof u.tenant === 'object' && u.tenant !== null ? (u.tenant.name || 'Platform Core') : (u.tenant || 'Platform Core')}
                            </span>
                            <span className="text-[11px] text-[#8A9CB7] flex items-center gap-1 font-medium">
                              <Briefcase className="w-3 h-3 text-[#8A9CB7]" />
                              {typeof u.department === 'object' && u.department !== null ? (u.department.name || 'General') : (u.department || 'General')}
                              {u.skillsCount > 0 && (
                                <span className="ml-1 text-[10px] text-[#1988A3] font-mono font-bold">({u.skillsCount} skills)</span>
                              )}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold border shadow-2xs ${
                            u.tenantPlan === 'ENTERPRISE' || u.tenantPlan === 'Enterprise AI'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : u.tenantPlan === 'PRO' || u.tenantPlan === 'Professional'
                              ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {u.tenantPlan}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${ROLE_BADGE_STYLE[u.role] || ROLE_BADGE_STYLE.EMPLOYEE}`}>
                            <Shield className="w-3 h-3 text-[#1988A3]" />
                            {u.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {u.status === 'PENDING_INVITE' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                              Pending Approval
                            </span>
                          ) : u.status === 'INACTIVE' ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                              Inactive
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              Active
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit User Button */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => openEditModal(u)}
                              className="p-2 rounded-xl bg-white/80 hover:bg-white text-[#1988A3] border border-white/85 shadow-sm transition-all cursor-pointer"
                              title="Edit User &amp; Role"
                            >
                              <Edit3 className="w-4 h-4" />
                            </motion.button>

                            {u.status === 'PENDING_INVITE' && (
                              <button
                                onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> Approve
                              </button>
                            )}

                            {u.status === 'ACTIVE' && u.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={() => handleStatusChange(u.id, 'INACTIVE')}
                                className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer shadow-xs"
                                title="Deactivate Account"
                              >
                                Deactivate
                              </button>
                            )}

                            {u.status === 'INACTIVE' && (
                              <button
                                onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                                className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer shadow-xs"
                                title="Reactivate Account"
                              >
                                Reactivate
                              </button>
                            )}

                            {u.role !== 'SUPER_ADMIN' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 shadow-sm transition-all cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-[#8A9CB7] font-medium">
                        No users found matching active filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-[#17233E]/5 border-t border-white/60 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#17233E]">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[#8A9CB7]">
                  Showing <span className="font-extrabold text-[#17233E]">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
                  <span className="font-extrabold text-[#17233E]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                  <span className="font-extrabold text-[#17233E]">{totalItems}</span> {totalItems === 1 ? 'user' : 'users'}
                  {totalItems !== users.length && ` (filtered from ${users.length} total)`}
                </span>

                <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
                  <span className="text-[#8A9CB7] text-[11px]">Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white/80 border border-white/90 rounded-xl px-2.5 py-1 text-xs font-bold text-[#17233E] outline-none cursor-pointer shadow-xs focus:border-[#1988A3]"
                  >
                    <option value={8}>8</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl border border-white/85 bg-white/80 text-[#17233E] hover:bg-white hover:text-[#1988A3] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .map((pageNum, idx, arr) => {
                        const prevPageNum = arr[idx - 1];
                        const showEllipsis = prevPageNum && pageNum - prevPageNum > 1;
                        return (
                          <React.Fragment key={pageNum}>
                            {showEllipsis && <span className="text-[#8A9CB7] text-xs px-1 font-bold">...</span>}
                            <button
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-7 h-7 text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs ${
                                currentPage === pageNum
                                  ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white shadow-md shadow-[#1988A3]/25 scale-105'
                                  : 'border border-white/85 bg-white/70 text-[#17233E] hover:bg-white hover:text-[#1988A3]'
                              }`}
                            >
                              {pageNum}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl border border-white/85 bg-white/80 text-[#17233E] hover:bg-white hover:text-[#1988A3] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                    title="Next Page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Edit User & Role Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/85 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 text-[#17233E]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/80 text-[#1988A3] border border-white/90 shadow-xs">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#17233E]">Edit User &amp; Role Assignment</h2>
                    <p className="text-xs text-[#8A9CB7] flex items-center gap-1.5 mt-0.5 font-medium">
                      <span>{editingUser.email}</span>
                      <span>•</span>
                      <span className="font-bold text-[#1988A3]">{editingUser.tenant}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-white/80 text-[10px] font-mono font-bold text-amber-800 border border-white/90">
                        {editingUser.tenantPlan} Plan
                      </span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setEditingUser(null)} className="p-1 rounded-xl text-[#8A9CB7] hover:text-[#17233E] hover:bg-white/60 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Package restriction notice */}
              {editingUser.tenantPlan?.toUpperCase() === 'STARTER' && (
                <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-800 flex items-start gap-2.5 shadow-2xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Company Plan Restriction Active:</span>
                    This user's organization is on the <span className="font-bold underline">STARTER</span> package. Multi-tier leadership roles (Team Leader &amp; HR Manager) are locked according to company subscription.
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveUserEdits} className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">First Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Last Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Engineer"
                      value={editForm.jobTitle}
                      onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs placeholder:text-[#8A9CB7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering"
                      value={editForm.dept}
                      onChange={(e) => setEditForm({ ...editForm, dept: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs placeholder:text-[#8A9CB7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Assigned Security Role</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer font-bold shadow-xs"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="COMPANY_ADMIN">Company Admin</option>

                      {/* Premium Roles locked if plan is STARTER */}
                      {isRoleAllowedByPlan('TEAM_LEADER', editingUser.tenantPlan) ? (
                        <option value="TEAM_LEADER">Team Leader</option>
                      ) : (
                        <option value="TEAM_LEADER" disabled>
                          🔒 Team Leader (Requires Pro / Enterprise)
                        </option>
                      )}

                      {isRoleAllowedByPlan('HR_MANAGER', editingUser.tenantPlan) ? (
                        <option value="HR_MANAGER">HR Manager</option>
                      ) : (
                        <option value="HR_MANAGER" disabled>
                          🔒 HR Manager (Requires Pro / Enterprise)
                        </option>
                      )}

                      {/* Super Admin only for platform level accounts */}
                      {!editingUser.tenantId && (
                        <option value="SUPER_ADMIN">Super Admin (Platform Level)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Account Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer font-bold shadow-xs"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="PENDING_INVITE">PENDING_INVITE</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/60 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-[#17233E] text-xs font-bold transition-colors cursor-pointer border border-white/85 shadow-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingUser}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 cursor-pointer"
                  >
                    {updatingUser && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save User Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Provision New User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/85 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 text-[#17233E]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/80 text-[#1988A3] border border-white/90 shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#17233E]">Provision New User Account</h2>
                    <p className="text-xs text-[#8A9CB7] font-semibold">
                      Create user under specific client workspace ({provisionTargetPlan} Plan).
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl text-[#8A9CB7] hover:text-[#17233E] hover:bg-white/60 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {provisionTargetPlan?.toUpperCase() === 'STARTER' && (
                <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-800 flex items-start gap-2.5 shadow-2xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Starter Package Selected:</span>
                    The chosen workspace is on the Starter package. Team Leader and HR Manager roles are disabled.
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs placeholder:text-[#8A9CB7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jenkins"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs placeholder:text-[#8A9CB7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="user@company.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs placeholder:text-[#8A9CB7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Department</label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering"
                      value={newUser.dept}
                      onChange={(e) => setNewUser({ ...newUser, dept: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] font-semibold focus:outline-none focus:border-[#1988A3] shadow-xs placeholder:text-[#8A9CB7]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Target Workspace</label>
                    <select
                      value={newUser.tenantId}
                      onChange={(e) => handleTenantChangeInProvision(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer font-bold shadow-xs"
                    >
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.plan || 'PRO'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7] mb-1.5">Assigned Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer font-bold shadow-xs"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="COMPANY_ADMIN">Company Admin</option>

                      {isRoleAllowedByPlan('TEAM_LEADER', provisionTargetPlan) ? (
                        <option value="TEAM_LEADER">Team Leader</option>
                      ) : (
                        <option value="TEAM_LEADER" disabled>🔒 Team Leader (Requires Pro+)</option>
                      )}

                      {isRoleAllowedByPlan('HR_MANAGER', provisionTargetPlan) ? (
                        <option value="HR_MANAGER">HR Manager</option>
                      ) : (
                        <option value="HR_MANAGER" disabled>🔒 HR Manager (Requires Pro+)</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9CB7]">Initial Password</label>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="text-[11px] text-[#1988A3] hover:text-[#157289] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Auto-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/80 border border-white/90 rounded-2xl text-xs font-mono font-bold text-[#1988A3] focus:outline-none focus:border-[#1988A3] shadow-xs"
                  />
                </div>

                <div className="pt-4 border-t border-white/60 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white text-[#17233E] text-xs font-bold transition-colors cursor-pointer border border-white/85 shadow-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 cursor-pointer"
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
