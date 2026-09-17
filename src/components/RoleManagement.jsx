import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Shield,
  Loader2
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

// 5 Core SRS System Roles Definitions (permissions matrix config, user counts derived from live DB)
const systemRoleDefinitions = [
  {
    id: 'ROLE-01',
    roleKey: 'SUPER_ADMIN',
    name: 'SuperAdmin',
    type: 'System (Global)',
    description: 'Unrestricted full platform access including multi-tenant provisioning, LLM API configs, and security settings.',
    permissions: {
      tenantManagement: true,
      userManagement: true,
      taxonomyEdit: true,
      aiConfigAccess: true,
      globalIntegrations: true,
      securityAuditLogs: true,
      billingAccess: true,
    }
  },
  {
    id: 'ROLE-02',
    roleKey: 'COMPANY_ADMIN',
    name: 'Tenant Admin',
    type: 'Tenant Level',
    description: 'Full administrative access restricted strictly to their assigned enterprise tenant workspace.',
    permissions: {
      tenantManagement: false,
      userManagement: true,
      taxonomyEdit: true,
      aiConfigAccess: false,
      globalIntegrations: false,
      securityAuditLogs: true,
      billingAccess: true,
    }
  },
  {
    id: 'ROLE-03',
    roleKey: 'HR_MANAGER',
    name: 'HR Manager / Assessor',
    type: 'Tenant Level',
    description: 'Manages employee skill matrices, views analytics dashboards, and assigns learning roadmaps.',
    permissions: {
      tenantManagement: false,
      userManagement: false,
      taxonomyEdit: false,
      aiConfigAccess: false,
      globalIntegrations: false,
      securityAuditLogs: false,
      billingAccess: false,
    }
  },
  {
    id: 'ROLE-04',
    roleKey: 'TEAM_LEADER',
    name: 'Team Leader',
    type: 'Tenant Level',
    description: 'Oversees team skill gap analysis, assigns learning tracks, and manages project team formations.',
    permissions: {
      tenantManagement: false,
      userManagement: false,
      taxonomyEdit: false,
      aiConfigAccess: false,
      globalIntegrations: false,
      securityAuditLogs: false,
      billingAccess: false,
    }
  },
  {
    id: 'ROLE-05',
    roleKey: 'EMPLOYEE',
    name: 'Employee / Learner',
    type: 'Tenant Level',
    description: 'Standard end-user access to AI skill assessments, career pathways, and individual learning goals.',
    permissions: {
      tenantManagement: false,
      userManagement: false,
      taxonomyEdit: false,
      aiConfigAccess: false,
      globalIntegrations: false,
      securityAuditLogs: false,
      billingAccess: false,
    }
  }
];

const permissionLabels = [
  { key: 'tenantManagement', label: 'Multi-Tenant Provisioning & Control' },
  { key: 'userManagement', label: 'User Directory & Access Control' },
  { key: 'taxonomyEdit', label: 'Skill Taxonomy & Framework Editing' },
  { key: 'aiConfigAccess', label: 'Global LLM & AI Engine Configuration' },
  { key: 'globalIntegrations', label: 'Global HRIS & LMS API Integration' },
  { key: 'securityAuditLogs', label: 'Security & Audit Trail Log Viewing' },
  { key: 'billingAccess', label: 'Billing, Subscriptions & Invoicing' },
];

const RoleManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await adminAPI.getUsers();
        if (res?.success && res.data) {
          setAllUsers(res.data);
        }
      } catch (err) {
        console.warn('Failed to load users for role counts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // Compute live user counts per role from DB users
  const roles = useMemo(() => {
    const countByRole = {};
    allUsers.forEach(u => {
      countByRole[u.role] = (countByRole[u.role] || 0) + 1;
    });
    return systemRoleDefinitions.map(r => ({
      ...r,
      usersCount: countByRole[r.roleKey] || 0
    }));
  }, [allUsers]);

  const [selectedRole, setSelectedRole] = useState(systemRoleDefinitions[0]);

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-slate-100 font-sans">
      <SuperadminSidebar activeItem="roles" />

      <main className="flex-1 ml-64 p-8 w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-500" /> System RBAC Roles &amp; Permission Matrix
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Inspect global Role-Based Access Control (RBAC) permission matrices across the 5 core system role tiers.
            </p>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Core SRS System Roles</p>
            <p className="text-2xl font-extrabold text-white mt-1">{roles.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Global System Control Role</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              1 (SuperAdmin)
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Tenant Level Roles</p>
            <p className="text-2xl font-extrabold text-cyan-400 mt-1">
              4 Roles
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Assigned System Users</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              {allUsers.length}
            </p>
          </div>
        </div>

        {/* Layout Grid: Left Roles List, Right Granular Permission Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Roles Selection Cards */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              System Roles Hierarchy ({roles.length})
            </h2>

            {roles.map((role) => (
              <motion.div
                key={role.id}
                whileHover={{ x: 2 }}
                onClick={() => setSelectedRole(role)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                  selectedRole?.id === role.id
                    ? 'bg-[#1E293B] border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-[#0F172A] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{role.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
                      Core SRS
                    </span>
                  </div>
                  <Lock className={`w-4 h-4 ${selectedRole?.id === role.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {role.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">{role.type}</span>
                  <span className="text-indigo-400 font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {role.usersCount} Active Users
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Permission Matrix View for Selected Role */}
          {selectedRole ? (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">{selectedRole.name} Permission Matrix</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {selectedRole.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedRole.description}</p>
                </div>
              </div>
            </div>

            {/* Permission Flags Checklist */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 tracking-wider pb-2 border-b border-slate-800/60">
                <span>Access Privilege Capability</span>
                <span>Permission Status</span>
              </div>

              {permissionLabels.map(({ key, label }) => {
                const isEnabled = selectedRole.permissions[key];
                return (
                  <div 
                    key={key} 
                    className="p-4 rounded-xl bg-[#1E293B]/40 border border-slate-800 flex items-center justify-between transition-colors hover:bg-[#1E293B]/80"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-200 block">{label}</span>
                      <span className="text-[11px] text-slate-500 font-mono">Capability Flag: {key}</span>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${
                      isEnabled
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {isEnabled ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Granted
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-slate-500" />
                          Restricted
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          ) : (
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl flex items-center justify-center">
              <p className="text-sm text-slate-500">Select a role from the list to view its permission matrix.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default RoleManagement;