import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Edit3, 
  Users, 
  CheckCircle2, 
  XCircle, 
  X, 
  SlidersHorizontal,
  Key
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';

// System Roles Data
const initialRoles = [
  {
    id: 'ROLE-01',
    name: 'SuperAdmin',
    type: 'System (Global)',
    usersCount: 3,
    description: 'Unrestricted full platform access including multi-tenant provisioning, LLM API configs, and security settings.',
    permissions: {
      tenantManagement: true,
      userManagement: true,
      taxonomyEdit: true,
      aiConfigAccess: true,
      globalIntegrations: true,
      securityAuditLogs: true,
      billingAccess: true,
    },
    isSystemDefault: true
  },
  {
    id: 'ROLE-02',
    name: 'Tenant Admin',
    type: 'Tenant Level',
    usersCount: 42,
    description: 'Full administrative access restricted strictly to their assigned enterprise tenant workspace.',
    permissions: {
      tenantManagement: false,
      userManagement: true,
      taxonomyEdit: true,
      aiConfigAccess: false,
      globalIntegrations: false,
      securityAuditLogs: true,
      billingAccess: true,
    },
    isSystemDefault: true
  },
  {
    id: 'ROLE-03',
    name: 'HR Manager / Assessor',
    type: 'Tenant Level',
    usersCount: 128,
    description: 'Manages employee skill matrices, views analytics dashboards, and assigns learning roadmaps.',
    permissions: {
      tenantManagement: false,
      userManagement: false,
      taxonomyEdit: false,
      aiConfigAccess: false,
      globalIntegrations: false,
      securityAuditLogs: false,
      billingAccess: false,
    },
    isSystemDefault: true
  },
  {
    id: 'ROLE-04',
    name: 'Employee / Learner',
    type: 'Tenant Level',
    usersCount: 14107,
    description: 'Standard end-user access to AI skill assessments, career pathways, and individual learning goals.',
    permissions: {
      tenantManagement: false,
      userManagement: false,
      taxonomyEdit: false,
      aiConfigAccess: false,
      globalIntegrations: false,
      securityAuditLogs: false,
      billingAccess: false,
    },
    isSystemDefault: true
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
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState(initialRoles[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Custom Role State
  const [newRole, setNewRole] = useState({
    name: '',
    type: 'Tenant Level',
    description: '',
    permissions: {
      tenantManagement: false,
      userManagement: false,
      taxonomyEdit: false,
      aiConfigAccess: false,
      globalIntegrations: false,
      securityAuditLogs: false,
      billingAccess: false,
    }
  });

  const handleCreateRole = (e) => {
    e.preventDefault();
    const createdRole = {
      ...newRole,
      id: `ROLE-0${roles.length + 1}`,
      usersCount: 0,
      isSystemDefault: false
    };
    setRoles([...roles, createdRole]);
    setSelectedRole(createdRole);
    setIsModalOpen(false);
    setNewRole({
      name: '',
      type: 'Tenant Level',
      description: '',
      permissions: {
        tenantManagement: false,
        userManagement: false,
        taxonomyEdit: false,
        aiConfigAccess: false,
        globalIntegrations: false,
        securityAuditLogs: false,
        billingAccess: false,
      }
    });
  };

  const togglePermission = (roleId, permKey) => {
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        const updatedPermissions = {
          ...r.permissions,
          [permKey]: !r.permissions[permKey]
        };
        const updatedRole = { ...r, permissions: updatedPermissions };
        if (selectedRole.id === roleId) {
          setSelectedRole(updatedRole);
        }
        return updatedRole;
      }
      return r;
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
              Role & Permission Governance
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure global RBAC access matrices, permission scopes, and role hierarchies.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Custom Role
          </motion.button>
        </div>

        {/* Layout Grid: Left Roles List, Right Granular Permission Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Roles Selection Cards */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              System Roles ({roles.length})
            </h2>

            {roles.map((role) => (
              <motion.div
                key={role.id}
                whileHover={{ x: 2 }}
                onClick={() => setSelectedRole(role)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                  selectedRole.id === role.id
                    ? 'bg-[#1E293B] border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-[#0F172A] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{role.name}</span>
                    {role.isSystemDefault && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
                        Default
                      </span>
                    )}
                  </div>
                  <Lock className={`w-4 h-4 ${selectedRole.id === role.id ? 'text-indigo-400' : 'text-slate-500'}`} />
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
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">{selectedRole.name} Matrix</h2>
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
                      <span className="text-[11px] text-slate-500 font-mono">Flag Key: {key}</span>
                    </div>

                    <button
                      disabled={selectedRole.name === 'SuperAdmin' && key === 'tenantManagement'} // Prevent locking superadmin
                      onClick={() => togglePermission(selectedRole.id, key)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isEnabled
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 hover:text-slate-300'
                      }`}
                    >
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
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>

      {/* Modal: Create Custom Role */}
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
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Create Custom Role</h2>
                    <p className="text-xs text-slate-400">Define role properties & system scope.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRole} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Audit Auditor / Security Compliance Officer"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Role Description</label>
                  <textarea
                    rows="2"
                    required
                    placeholder="Briefly state duties and clearance scope..."
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
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
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    Save & Create Role
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

export default RoleManagement;