import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Shield,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Clock,
  Save,
  Undo2,
  Search,
  Building2,
  Sparkles,
  Sliders,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  UserX,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { adminAPI } from '../services/api';

// 5 Core SRS System Roles Definitions
const SYSTEM_ROLES = [
  {
    id: 'ROLE-01',
    roleKey: 'SUPER_ADMIN',
    name: 'SuperAdmin',
    tier: 'System (Global Root)',
    badgeColor: 'from-[#17233E] to-[#1988A3]',
    description: 'Unrestricted full platform access including multi-tenant provisioning, LLM API configs, global security, and billing operations.'
  },
  {
    id: 'ROLE-02',
    roleKey: 'COMPANY_ADMIN',
    name: 'Tenant Admin',
    tier: 'Tenant Level',
    badgeColor: 'from-[#1988A3] to-[#11C6DE]',
    description: 'Full administrative access restricted strictly to their assigned enterprise tenant workspace, users, and billing.'
  },
  {
    id: 'ROLE-03',
    roleKey: 'HR_MANAGER',
    name: 'HR Manager / Assessor',
    tier: 'Tenant Level',
    badgeColor: 'from-emerald-600 to-teal-500',
    description: 'Manages organization skill matrices, monitors workforce competency gaps, compliance certifications, and succession pipelines.'
  },
  {
    id: 'ROLE-04',
    roleKey: 'TEAM_LEADER',
    name: 'Team Leader',
    tier: 'Tenant Level',
    badgeColor: 'from-amber-600 to-orange-500',
    description: 'Oversees team skill gap analysis, assigns learning tracks, monitors team project readiness, and facilitates team formations.'
  },
  {
    id: 'ROLE-05',
    roleKey: 'EMPLOYEE',
    name: 'Employee / Learner',
    tier: 'Tenant Level',
    badgeColor: 'from-slate-600 to-slate-500',
    description: 'Standard end-user access to AI skill assessments, personalized career pathways, certification tracking, and learning goals.'
  }
];

// 12 Capability flags spanning platform administration, security, AI, and talent workflows
const PERMISSION_DEFINITIONS = [
  {
    key: 'tenantManagement',
    label: 'Multi-Tenant Provisioning & Control',
    category: 'Global Infrastructure',
    description: 'Create, suspend, and configure multi-tenant enterprise accounts and subdomains.',
    isRootPrivilege: true,
    planTier: 'SUPERADMIN ONLY',
    planBadgeColor: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    key: 'aiConfigAccess',
    label: 'Global LLM & AI Engine Configuration',
    category: 'Global Infrastructure',
    description: 'Manage Groq, OpenAI, Gemini API keys, provider routing, guardrails, and model fallbacks.',
    isRootPrivilege: true,
    planTier: 'SUPERADMIN ONLY',
    planBadgeColor: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  {
    key: 'billingAccess',
    label: 'Billing, Subscriptions & Invoicing',
    category: 'Commercial & Financial',
    description: 'Manage SaaS pricing tiers, enterprise payment methods, and invoices.',
    isRootPrivilege: false,
    planTier: 'STARTER, PRO, ENTERPRISE',
    planBadgeColor: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    key: 'securityAuditLogs',
    label: 'Security & Audit Trail Log Inspection',
    category: 'Governance & Security',
    description: 'View cross-tenant audit traces, actor IPs, and session authentication events.',
    isRootPrivilege: false,
    planTier: 'PRO & ENTERPRISE',
    planBadgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  {
    key: 'userManagement',
    label: 'User Directory & Access Control',
    category: 'Identity & Access',
    description: 'Invite new team members, activate/deactivate accounts, and assign workspace roles.',
    isRootPrivilege: false,
    planTier: 'STARTER, PRO, ENTERPRISE',
    planBadgeColor: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    key: 'taxonomyEdit',
    label: 'Skill Taxonomy & Framework Editing',
    category: 'Competency Framework',
    description: 'Create, update, and manage core skill benchmarks and proficiencies.',
    isRootPrivilege: false,
    planTier: 'PRO & ENTERPRISE',
    planBadgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  {
    key: 'globalIntegrations',
    label: 'HRIS & LMS API Integration Sync',
    category: 'Integrations & Sync',
    description: 'Configure and synchronize BambooHR, Workday, Coursera, and Udemy webhooks.',
    isRootPrivilege: false,
    planTier: 'ENTERPRISE ONLY',
    planBadgeColor: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    key: 'workforceAnalytics',
    label: 'Organization Skill & Workforce Analytics',
    category: 'Talent Intelligence',
    description: 'Access organization-wide skill distribution matrices and critical shortage analytics.',
    isRootPrivilege: false,
    planTier: 'PRO & ENTERPRISE',
    planBadgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  {
    key: 'careerSuccession',
    label: 'Career Readiness & Succession Planning',
    category: 'Talent Intelligence',
    description: 'View promotion readiness ratings, high-potential pipelines, and succession candidates.',
    isRootPrivilege: false,
    planTier: 'ENTERPRISE ONLY',
    planBadgeColor: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  {
    key: 'teamFormation',
    label: 'AI-Based Project Team Formation',
    category: 'Operations & Teams',
    description: 'Create project requirements and match high-readiness team members via AI.',
    isRootPrivilege: false,
    planTier: 'PRO & ENTERPRISE',
    planBadgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  {
    key: 'learningAssignment',
    label: 'Assign Learning Programs & Roadmaps',
    category: 'Learning & Development',
    description: 'Enroll subordinates or employees into mandatory compliance and upskilling courses.',
    isRootPrivilege: false,
    planTier: 'PRO & ENTERPRISE',
    planBadgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  {
    key: 'selfAssessment',
    label: 'Personal AI Skill Assessment & Portfolio',
    category: 'Employee Core',
    description: 'Undergo self-assessments, upload proof of certifications, and view career scores.',
    isRootPrivilege: false,
    planTier: 'ALL PLANS (CORE)',
    planBadgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  }
];

// Segregation of Duties (SoD) Conflict Detection Engine
const detectPermissionConflicts = (roleKey, permissions) => {
  if (!permissions) return [];
  const conflicts = [];

  if (roleKey !== 'SUPER_ADMIN') {
    if (permissions.tenantManagement) {
      conflicts.push({
        key: 'tenantManagement',
        label: 'Multi-Tenant Provisioning & Control',
        severity: 'CRITICAL',
        risk: 'Segregation of Duties (SoD) Violation: Non-SuperAdmin roles must never hold multi-tenant provisioning power.'
      });
    }
    if (permissions.aiConfigAccess) {
      conflicts.push({
        key: 'aiConfigAccess',
        label: 'Global LLM & AI Engine Configuration',
        severity: 'CRITICAL',
        risk: 'Security Isolation Breach: Global LLM routing and API credentials are restricted exclusively to SuperAdmin.'
      });
    }
  }

  if (roleKey === 'EMPLOYEE' || roleKey === 'TEAM_LEADER') {
    if (permissions.billingAccess) {
      conflicts.push({
        key: 'billingAccess',
        label: 'Billing, Subscriptions & Invoicing',
        severity: 'HIGH',
        risk: 'Financial Policy Conflict: Standard team leaders and employees must not manage tenant billing or invoices.'
      });
    }
    if (permissions.securityAuditLogs) {
      conflicts.push({
        key: 'securityAuditLogs',
        label: 'Security & Audit Trail Log Inspection',
        severity: 'MEDIUM',
        risk: 'Compliance Policy Conflict: Audit logs contain sensitive IP addresses and actor metadata.'
      });
    }
  }

  if (roleKey === 'EMPLOYEE') {
    if (permissions.userManagement) {
      conflicts.push({
        key: 'userManagement',
        label: 'User Directory & Access Control',
        severity: 'HIGH',
        risk: 'Privilege Escalation Risk: Standard employees cannot invite, deactivate, or reassign user roles.'
      });
    }
    if (permissions.taxonomyEdit) {
      conflicts.push({
        key: 'taxonomyEdit',
        label: 'Skill Taxonomy & Framework Editing',
        severity: 'MEDIUM',
        risk: 'Framework Governance Violation: Competency taxonomies require administrative authorization.'
      });
    }
    if (permissions.workforceAnalytics) {
      conflicts.push({
        key: 'workforceAnalytics',
        label: 'Organization Skill & Workforce Analytics',
        severity: 'MEDIUM',
        risk: 'Confidentiality Conflict: Org-wide skill shortages and performance distribution are restricted from general staff.'
      });
    }
  }

  return conflicts;
};

const RoleManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [selectedRoleKey, setSelectedRoleKey] = useState('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState('permissions'); // 'permissions' | 'users'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [metaInfo, setMetaInfo] = useState(null);

  // Apply mode modal / selection: 'IMMEDIATE' vs 'SCHEDULED'
  const [applyMode, setApplyMode] = useState('IMMEDIATE');
  const [showApplyModal, setShowApplyModal] = useState(false);

  // User search & pagination
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reassign role modal state
  const [reassignModalUser, setReassignModalUser] = useState(null);
  const [targetNewRole, setTargetNewRole] = useState('EMPLOYEE');
  const [reassigning, setReassigning] = useState(false);

  // Load live DB data: users and stored RBAC role permissions
  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, permRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getRolePermissions()
      ]);

      if (usersRes?.success && usersRes.data) {
        setAllUsers(usersRes.data);
      }
      if (permRes?.success && permRes.data) {
        setRolePermissions(permRes.data.permissions || {});
        setMetaInfo(permRes.data.meta || null);
      }
    } catch (err) {
      console.error('Failed to load RBAC data from Neon DB:', err);
      setStatusMessage({ type: 'error', text: 'Error connecting to database to load RBAC policies.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute live user counts per role from actual DB users
  const roleUserCounts = useMemo(() => {
    const counts = {};
    SYSTEM_ROLES.forEach(r => { counts[r.roleKey] = 0; });
    allUsers.forEach(u => {
      if (counts[u.role] !== undefined) {
        counts[u.role]++;
      }
    });
    return counts;
  }, [allUsers]);

  const selectedRole = useMemo(() => {
    return SYSTEM_ROLES.find(r => r.roleKey === selectedRoleKey) || SYSTEM_ROLES[0];
  }, [selectedRoleKey]);

  // Current working permissions for selected role
  const currentRolePermissions = useMemo(() => {
    return rolePermissions[selectedRoleKey] || {};
  }, [rolePermissions, selectedRoleKey]);

  // Detect live permission conflicts for selected role
  const activeConflicts = useMemo(() => {
    return detectPermissionConflicts(selectedRoleKey, currentRolePermissions);
  }, [selectedRoleKey, currentRolePermissions]);

  // Handle permission toggle for the selected role
  const handleTogglePermission = (permKey) => {
    const updatedRolePerms = {
      ...currentRolePermissions,
      [permKey]: !currentRolePermissions[permKey]
    };
    setRolePermissions(prev => ({
      ...prev,
      [selectedRoleKey]: updatedRolePerms
    }));
  };

  // Resolve conflict: revert all conflicting permissions to safe false
  const handleResolveConflicts = () => {
    if (!activeConflicts.length) return;
    const resolvedPerms = { ...currentRolePermissions };
    activeConflicts.forEach(c => {
      resolvedPerms[c.key] = false;
    });
    setRolePermissions(prev => ({
      ...prev,
      [selectedRoleKey]: resolvedPerms
    }));
    setStatusMessage({
      type: 'success',
      text: `Resolved ${activeConflicts.length} conflict(s). High-risk privilege flags reverted to safe baseline.`
    });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Save permissions to Neon DB with selected applyMode
  const handleSavePermissions = async (mode = applyMode) => {
    try {
      setSaving(true);
      setShowApplyModal(false);
      const res = await adminAPI.updateRolePermissions({
        roleKey: selectedRoleKey,
        permissions: currentRolePermissions,
        applyMode: mode
      });

      if (res?.success) {
        setStatusMessage({
          type: 'success',
          text: mode === 'SCHEDULED'
            ? `Role [${selectedRole.name}] permissions scheduled for next maintenance window.`
            : `Role [${selectedRole.name}] permissions applied live and persisted to Neon PostgreSQL DB.`
        });
        if (res.data?.meta) {
          setMetaInfo(res.data.meta);
        }
      } else {
        throw new Error(res?.message || 'Update failed');
      }
    } catch (err) {
      console.error('Failed to save RBAC permissions:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to persist RBAC permissions.' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 6000);
    }
  };

  // Reset selected role back to default canonical baseline
  const handleResetBaseline = async () => {
    if (!window.confirm(`Reset [${selectedRole.name}] permissions back to the canonical SRS specification baseline?`)) {
      return;
    }
    try {
      setSaving(true);
      const res = await adminAPI.resetRolePermissions({ roleKey: selectedRoleKey });
      if (res?.success && res.data?.permissions) {
        setRolePermissions(res.data.permissions);
        if (res.data.meta) setMetaInfo(res.data.meta);
        setStatusMessage({
          type: 'success',
          text: `Permissions for ${selectedRole.name} reset to SRS default specification.`
        });
      }
    } catch (err) {
      console.error('Reset error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to reset role permissions.' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Handle reassigning user role
  const handleConfirmReassign = async () => {
    if (!reassignModalUser) return;
    
    // Strict Plan-Based Ceiling Validation:
    const PREMIUM_ROLES = ['HR_MANAGER', 'TEAM_LEADER'];
    const tenantPlan = reassignModalUser.tenant?.plan || 'STARTER';
    if (PREMIUM_ROLES.includes(targetNewRole) && tenantPlan === 'STARTER') {
      alert(`Plan Restriction Enforced: The tenant '${reassignModalUser.tenant?.name || 'Company'}' is on the STARTER subscription plan, which does not allow assigning the premium '${targetNewRole}' role. Upgrade the company subscription to Professional or Enterprise in Billing to unlock premium roles.`);
      return;
    }

    try {
      setReassigning(true);
      const res = await adminAPI.updateUser(reassignModalUser.id, {
        role: targetNewRole
      });
      if (res?.success) {
        setStatusMessage({
          type: 'success',
          text: `User ${reassignModalUser.firstName} ${reassignModalUser.lastName} reassigned to ${targetNewRole}.`
        });
        setReassignModalUser(null);
        // Reload users list
        const refreshedUsers = await adminAPI.getUsers();
        if (refreshedUsers?.success && refreshedUsers.data) {
          setAllUsers(refreshedUsers.data);
        }
      } else {
        throw new Error(res?.message || 'Role update rejected by server.');
      }
    } catch (err) {
      alert(`Role assignment error: ${err.message}`);
    } finally {
      setReassigning(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Filtered assigned users for the selected role
  const assignedUsers = useMemo(() => {
    const list = allUsers.filter(u => u.role === selectedRoleKey);
    if (!userSearch.trim()) return list;
    const query = userSearch.toLowerCase();
    return list.filter(u => 
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.tenant?.name || '').toLowerCase().includes(query)
    );
  }, [allUsers, selectedRoleKey, userSearch]);

  const totalUserPages = Math.ceil(assignedUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * pageSize;
    return assignedUsers.slice(start, start + pageSize);
  }, [assignedUsers, userPage, pageSize]);

  return (
    <div className="flex min-h-screen bg-[#E9EAF7] text-[#17233E] font-sans relative overflow-x-hidden selection:bg-[#1988A3]/20 selection:text-[#17233E]">
      {/* Ambient background glowing mesh depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#1988A3]/20 to-[#11C6DE]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-[#1B3154]/15 to-[#8A9CB7]/25 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-[#11C6DE]/15 to-[#1988A3]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#8A9CB7_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <SuperadminSidebar activeItem="roles" />

      {loading ? (
        <div className="flex-1 min-w-0 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 flex items-center justify-center min-h-screen relative z-10">
          <SkillPulseLoader message="Loading RBAC policies & system roles..." />
        </div>
      ) : (
        <main className="flex-1 min-w-0 ml-0 lg:ml-64 px-3.5 sm:px-6 md:px-8 pt-20 lg:pt-8 pb-10 w-full max-w-full overflow-x-hidden relative z-10 space-y-6 sm:space-y-8 font-sans">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#BEDDF5]/70 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1988A3] to-[#11C6DE] text-white shadow-lg shadow-[#1988A3]/25">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E] flex items-center gap-3">
                  Role-Based Access Control (RBAC) Module
                </h1>
                <p className="text-[#5A6D89] text-sm mt-1">
                  Enforce principle of least privilege, inspect capability flags, resolve SoD conflicts, and manage assigned users across the 5 core system roles.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white border border-[#BEDDF5] text-[#17233E] text-xs font-semibold shadow-sm transition-all hover:border-[#1988A3]"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#1988A3] ${loading ? 'animate-spin' : ''}`} />
                Refresh DB State
              </button>
              <button
                onClick={handleResetBaseline}
                disabled={saving}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-amber-50 border border-[#BEDDF5] hover:border-amber-400 text-[#17233E] hover:text-amber-800 text-xs font-semibold shadow-sm transition-all"
              >
                <Undo2 className="w-3.5 h-3.5 text-amber-600" />
                Reset to Baseline
              </button>
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 transition-all"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Status Notification Toast */}
          <AnimatePresence>
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-xl border flex items-center justify-between shadow-md ${
                  statusMessage.type === 'error'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {statusMessage.type === 'error' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  <span className="text-sm font-medium">{statusMessage.text}</span>
                </div>
                <button 
                  onClick={() => setStatusMessage(null)}
                  className="text-xs font-semibold underline hover:opacity-80"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Real Metrics Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
            >
              <div className="flex items-center justify-between text-[#5A6D89]">
                <span className="text-xs font-bold uppercase tracking-wider">Core System Roles</span>
                <Shield className="w-4 h-4 text-[#1988A3]" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#17233E] mt-1.5 sm:mt-2">{SYSTEM_ROLES.length}</p>
              <p className="text-[11px] text-[#5A6D89] mt-1 font-mono">1 Global Root + 4 Workspace Tiers</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
            >
              <div className="flex items-center justify-between text-[#5A6D89]">
                <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled Users</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#17233E] mt-1.5 sm:mt-2">{allUsers.length}</p>
              <p className="text-[11px] text-[#5A6D89] mt-1">Real database users across all tenants</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
            >
              <div className="flex items-center justify-between text-[#5A6D89]">
                <span className="text-xs font-bold uppercase tracking-wider">Active Policy State</span>
                <Sparkles className="w-4 h-4 text-[#1988A3]" />
              </div>
              <p className="text-xl font-bold text-[#17233E] mt-2.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                {metaInfo?.status === 'SCHEDULED_MAINTENANCE' ? 'Scheduled Update' : 'Live Enforced'}
              </p>
              <p className="text-[11px] text-[#5A6D89] mt-1 font-mono">
                Mode: {metaInfo?.applyMode || 'IMMEDIATE'}
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
            >
              <div className="flex items-center justify-between text-[#5A6D89]">
                <span className="text-xs font-bold uppercase tracking-wider">SoD Conflicts Detected</span>
                <ShieldAlert className={`w-4 h-4 ${activeConflicts.length > 0 ? 'text-rose-600' : 'text-[#8A9CB7]'}`} />
              </div>
              <p className={`text-3xl font-black mt-2 ${activeConflicts.length > 0 ? 'text-rose-600' : 'text-[#17233E]'}`}>
                {activeConflicts.length}
              </p>
              <p className="text-[11px] text-[#5A6D89] mt-1">
                {activeConflicts.length > 0 ? 'Policy violation flagged' : 'Zero conflict violations'}
              </p>
            </motion.div>
          </div>

          {/* Layout Grid: Left Roles Selection, Right Content Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: 5 System Roles (3-4 cols) */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#5A6D89]">
                  System Role Hierarchy (5)
                </h2>
                <span className="text-[11px] text-[#8A9CB7] font-mono">Select to Inspect</span>
              </div>

              {SYSTEM_ROLES.map((role) => {
                const isSelected = selectedRoleKey === role.roleKey;
                const userCount = roleUserCounts[role.roleKey] || 0;
                const conflicts = detectPermissionConflicts(role.roleKey, rolePermissions[role.roleKey] || {});

                return (
                  <motion.div
                    key={role.id}
                    whileHover={{ x: 3 }}
                    onClick={() => {
                      setSelectedRoleKey(role.roleKey);
                      setUserPage(1);
                    }}
                    className={`p-5 rounded-2xl cursor-pointer border transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-r from-white/95 to-[#D8EBF9] border-2 border-[#1988A3] shadow-lg shadow-[#1988A3]/10'
                        : 'bg-white/75 hover:bg-white/95 border-white/80 hover:border-[#1988A3]/40 shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#1988A3] to-[#11C6DE]" />
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#17233E] text-base">{role.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#D8EBF9] text-[#17233E] border border-[#BEDDF5]">
                          {role.id}
                        </span>
                      </div>
                      {conflicts.length > 0 ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                          <AlertTriangle className="w-3 h-3" />
                          {conflicts.length} Conflict
                        </span>
                      ) : (
                        <Lock className={`w-4 h-4 ${isSelected ? 'text-[#1988A3]' : 'text-[#8A9CB7]'}`} />
                      )}
                    </div>

                    <p className="text-xs text-[#5A6D89] mt-2 line-clamp-2 leading-relaxed">
                      {role.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#BEDDF5]/60 flex items-center justify-between text-xs">
                      <span className="text-[#8A9CB7] font-mono text-[11px]">{role.tier}</span>
                      <span className="text-[#1988A3] font-semibold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {userCount} Users Assigned
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column: Active Role Workspace (8-9 cols) */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              
              {/* Selected Role Header Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#BEDDF5] gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${selectedRole.badgeColor} text-white shadow-lg`}>
                      <Shield className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-2xl font-black text-[#17233E]">{selectedRole.name}</h2>
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20">
                          {selectedRole.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/70 text-[#5A6D89] border border-[#BEDDF5]">
                          {selectedRole.tier}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A6D89] mt-1 max-w-xl">{selectedRole.description}</p>
                    </div>
                  </div>

                  {/* Tab Switcher */}
                  <div className="flex items-center p-1 rounded-xl bg-white/60 border border-[#BEDDF5] self-start sm:self-auto shadow-sm">
                    <button
                      onClick={() => setActiveTab('permissions')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'permissions'
                          ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white shadow-md'
                          : 'text-[#5A6D89] hover:text-[#17233E]'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Permission Matrix
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'users'
                          ? 'bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-white shadow-md'
                          : 'text-[#5A6D89] hover:text-[#17233E]'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Assigned Users ({roleUserCounts[selectedRole.roleKey] || 0})
                    </button>
                  </div>
                </div>

                {/* Multi-Tenant Plan Ceiling Guarantee Banner */}
                <div className="mt-6 p-4 rounded-xl bg-white/80 border border-[#BEDDF5] flex items-start gap-3.5 shadow-sm">
                  <div className="p-2 rounded-lg bg-[#1988A3]/10 text-[#1988A3] shrink-0 mt-0.5 border border-[#1988A3]/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-[#17233E]">
                      Two-Layer Security Architecture: Subscription Plan Ceilings &times; Role Responsibilities
                    </p>
                    <p className="text-[#5A6D89] mt-1 leading-relaxed">
                      A company's subscription plan (<strong className="text-amber-600">STARTER</strong>, <strong className="text-[#1988A3]">PRO</strong>, <strong className="text-purple-600">ENTERPRISE</strong>) acts as an <em>immutable security ceiling</em>. Toggling capabilities here defines this role's maximum privileges, but the platform strictly enforces plan boundaries: <strong>a user's effective permissions can never exceed what their company's subscription plan allows.</strong>
                    </p>
                  </div>
                </div>

                {/* Conflict Warning Banner */}
                <AnimatePresence>
                  {activeConflicts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-300 shadow-sm overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-rose-800">
                              Role Policy &amp; Segregation of Duties (SoD) Conflict Detected
                            </p>
                            <p className="text-xs text-rose-700 mt-0.5">
                              {activeConflicts.length} capability flag(s) violate principle of least privilege for {selectedRole.name}.
                            </p>
                            <ul className="mt-2 space-y-1">
                              {activeConflicts.map((c) => (
                                <li key={c.key} className="text-[11px] text-rose-800 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  <strong>{c.label}:</strong> {c.risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <button
                          onClick={handleResolveConflicts}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 shadow-md shadow-rose-600/20 transition-all self-start md:self-center"
                        >
                          Resolve Conflict (Revert to Safe)
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* TAB 1: PERMISSION MATRIX */}
                {activeTab === 'permissions' && (
                  <div className="mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold uppercase text-[#5A6D89] tracking-wider pb-3 border-b border-[#BEDDF5] gap-2">
                      <span>12 System Access Capability Flags</span>
                      <span className="text-[11px] font-mono text-[#1988A3] font-semibold normal-case">
                        {Object.values(currentRolePermissions).filter(Boolean).length} Granted / {12 - Object.values(currentRolePermissions).filter(Boolean).length} Restricted
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PERMISSION_DEFINITIONS.map((perm) => {
                        const isGranted = !!currentRolePermissions[perm.key];
                        const hasConflict = activeConflicts.some(c => c.key === perm.key);

                        return (
                          <div
                            key={perm.key}
                            className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                              hasConflict
                                ? 'bg-rose-50 border-rose-300 shadow-sm'
                                : isGranted
                                ? 'bg-white/90 border-[#1988A3]/30 shadow-sm hover:border-[#1988A3]'
                                : 'bg-white/50 border-[#BEDDF5]/70 opacity-80 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                                  isGranted
                                    ? 'bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                  {isGranted ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-sm font-bold text-[#17233E]">{perm.label}</span>
                                    {perm.isRootPrivilege && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-700 border border-purple-200">
                                        Root Only
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white text-[#5A6D89] border border-[#BEDDF5]">
                                      {perm.category}
                                    </span>
                                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${perm.planBadgeColor}`}>
                                      Plan: {perm.planTier}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Toggle Switch */}
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleTogglePermission(perm.key)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1988A3] focus:ring-offset-2 ${
                                    isGranted ? 'bg-[#1988A3]' : 'bg-slate-300'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                                      isGranted ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-[#5A6D89] leading-relaxed">{perm.description}</p>

                            <div className="pt-2 border-t border-[#BEDDF5]/50 flex items-center justify-between text-[11px]">
                              <span className="text-[#8A9CB7] font-mono">
                                Flag: <code className="text-[#1988A3] font-mono font-semibold">{perm.key}</code>
                              </span>
                              <span className={`font-bold flex items-center gap-1 ${
                                isGranted ? 'text-emerald-700' : 'text-slate-500'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isGranted ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                {isGranted ? 'Granted' : 'Restricted'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 2: ASSIGNED USERS DIRECTORY */}
                {activeTab === 'users' && (
                  <div className="mt-6">
                    {/* Search bar & count */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-[#8A9CB7] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search assigned users by name, email, or tenant..."
                          value={userSearch}
                          onChange={(e) => {
                            setUserSearch(e.target.value);
                            setUserPage(1);
                          }}
                          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#BEDDF5] text-xs text-[#17233E] placeholder-[#8A9CB7] focus:outline-none focus:border-[#1988A3] shadow-sm"
                        />
                      </div>
                      <span className="text-xs text-[#5A6D89] font-mono">
                        Showing {assignedUsers.length} user(s) with role <strong className="text-[#1988A3]">{selectedRole.roleKey}</strong>
                      </span>
                    </div>

                    {/* Users Table */}
                    <div className="rounded-xl border border-[#BEDDF5] overflow-hidden bg-white/80 shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#D8EBF9]/80 border-b border-[#BEDDF5] text-[#17233E] uppercase font-bold">
                          <tr>
                            <th className="py-3 px-4">User</th>
                            <th className="py-3 px-4">Company / Tenant</th>
                            <th className="py-3 px-4">Tenant Plan (Ceiling)</th>
                            <th className="py-3 px-4">Department</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#BEDDF5]/60 text-[#17233E]">
                          {paginatedUsers.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="py-8 text-center text-[#5A6D89]">
                                No active database users currently hold the <strong>{selectedRole.name}</strong> role.
                              </td>
                            </tr>
                          ) : (
                            paginatedUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-white/60 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1988A3] to-[#11C6DE] flex items-center justify-center text-white font-bold text-xs uppercase shrink-0 shadow-sm">
                                      {user.firstName?.[0] || 'U'}{user.lastName?.[0] || ''}
                                    </div>
                                    <div>
                                      <span className="font-bold text-[#17233E] block">
                                        {user.firstName} {user.lastName}
                                      </span>
                                      <span className="text-[11px] text-[#5A6D89] font-mono block">
                                        {user.email}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="flex items-center gap-1.5 text-[#17233E] font-medium">
                                    <Building2 className="w-3.5 h-3.5 text-[#1988A3]" />
                                    {user.tenant?.name || 'Platform Core (Global)'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                                    user.tenant?.plan === 'ENTERPRISE'
                                      ? 'bg-purple-100 text-purple-700 border-purple-200'
                                      : user.tenant?.plan === 'PRO'
                                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                                      : user.tenant?.plan === 'STARTER'
                                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                                      : 'bg-slate-100 text-slate-700 border-slate-200'
                                  }`}>
                                    {user.tenant?.plan || 'GLOBAL ROOT'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-[#5A6D89]">
                                  {user.department?.name || 'General Operations'}
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                                    user.status === 'ACTIVE'
                                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                      : 'bg-rose-100 text-rose-700 border border-rose-300'
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                      user.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                                    }`} />
                                    {user.status || 'ACTIVE'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => {
                                      setReassignModalUser(user);
                                      setTargetNewRole(user.role);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-[#1988A3]/10 hover:bg-[#1988A3]/20 text-[#1988A3] text-[11px] font-bold border border-[#1988A3]/30 transition-all shadow-sm"
                                  >
                                    Reassign Role
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalUserPages > 1 && (
                      <div className="flex items-center justify-between mt-4 text-xs text-[#5A6D89]">
                        <span>
                          Page {userPage} of {totalUserPages} ({assignedUsers.length} total)
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setUserPage(p => Math.max(1, p - 1))}
                            disabled={userPage === 1}
                            className="p-1.5 rounded-lg bg-white border border-[#BEDDF5] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-[#17233E] shadow-sm"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="font-mono text-[#17233E] font-bold px-2">{userPage}</span>
                          <button
                            onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                            disabled={userPage === totalUserPages}
                            className="p-1.5 rounded-lg bg-white border border-[#BEDDF5] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 text-[#17233E] shadow-sm"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* APPLY MODE MODAL */}
          <AnimatePresence>
            {showApplyModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233E]/60 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/90 rounded-2xl max-w-md w-full p-6 shadow-2xl"
                >
                  <div className="flex items-center gap-3 pb-4 border-b border-[#BEDDF5]">
                    <div className="p-2.5 rounded-xl bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#17233E]">Apply RBAC Policy Changes</h3>
                      <p className="text-xs text-[#5A6D89]">Choose enforcement timing for [{selectedRole.name}].</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <label
                      onClick={() => setApplyMode('IMMEDIATE')}
                      className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        applyMode === 'IMMEDIATE'
                          ? 'bg-white/90 border-[#1988A3] shadow-md'
                          : 'bg-white/50 border-[#BEDDF5] hover:bg-white/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name="applyMode"
                        checked={applyMode === 'IMMEDIATE'}
                        onChange={() => setApplyMode('IMMEDIATE')}
                        className="mt-1 accent-[#1988A3]"
                      />
                      <div>
                        <span className="text-sm font-bold block text-[#17233E]">Apply Immediately (Live Enforcement)</span>
                        <span className="text-xs text-[#5A6D89] block mt-0.5">
                          Immediately updates database records and flushes active user permission session cache across the tenant cluster.
                        </span>
                      </div>
                    </label>

                    <label
                      onClick={() => setApplyMode('SCHEDULED')}
                      className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        applyMode === 'SCHEDULED'
                          ? 'bg-white/90 border-purple-500 shadow-md'
                          : 'bg-white/50 border-[#BEDDF5] hover:bg-white/80'
                      }`}
                    >
                      <input
                        type="radio"
                        name="applyMode"
                        checked={applyMode === 'SCHEDULED'}
                        onChange={() => setApplyMode('SCHEDULED')}
                        className="mt-1 accent-purple-500"
                      />
                      <div>
                        <span className="text-sm font-bold block text-[#17233E]">Schedule Maintenance Window Update</span>
                        <span className="text-xs text-[#5A6D89] block mt-0.5">
                          Flags this policy change for rollout during the scheduled 02:00 UTC weekly system maintenance cycle.
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#BEDDF5] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white border border-[#BEDDF5] text-[#5A6D89] text-xs font-semibold shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSavePermissions(applyMode)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25"
                    >
                      Confirm &amp; Enforce
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* REASSIGN ROLE MODAL */}
          <AnimatePresence>
            {reassignModalUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233E]/60 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/90 rounded-2xl max-w-md w-full p-6 shadow-2xl"
                >
                  <div className="flex items-center gap-3 pb-4 border-b border-[#BEDDF5]">
                    <div className="p-2.5 rounded-xl bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#17233E]">Reassign System Role</h3>
                      <p className="text-xs text-[#5A6D89]">
                        User: {reassignModalUser.firstName} {reassignModalUser.lastName} ({reassignModalUser.email})
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-[#5A6D89] block mb-2">
                        Current Workspace Role
                      </label>
                      <div className="p-3 rounded-xl bg-white/80 border border-[#BEDDF5] text-xs font-mono font-bold text-[#17233E] shadow-sm">
                        {reassignModalUser.role}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#5A6D89] block mb-2">
                        Select Target Workspace Role
                      </label>
                      <select
                        value={targetNewRole}
                        onChange={(e) => setTargetNewRole(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-[#BEDDF5] text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                      >
                        {SYSTEM_ROLES.map(r => (
                          <option key={r.roleKey} value={r.roleKey}>
                            {r.name} ({r.roleKey}) - {r.tier}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-800 shadow-sm">
                      <strong>Note:</strong> Reassigning a role will immediately update the user's metadata mapping in the tenant database and flush active session tokens.
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#BEDDF5] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setReassignModalUser(null)}
                      disabled={reassigning}
                      className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white border border-[#BEDDF5] text-[#5A6D89] text-xs font-semibold shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmReassign}
                      disabled={reassigning}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25"
                    >
                      {reassigning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Confirm Assignment
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </main>
      )}
    </div>
  );
};

export default RoleManagement;
