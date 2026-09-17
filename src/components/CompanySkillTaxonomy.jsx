import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit3, 
  Trash2, 
  Sliders, 
  X, 
  CheckCircle2, 
  Award, 
  BookOpen,
  Loader2
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';
import { adminAPI } from '../services/api';

const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const weightageTiers = ['Low', 'Medium', 'High', 'Critical'];
const defaultDomainCategories = [
  'Frontend Development',
  'Backend & Cloud',
  'Data & AI',
  'DevOps & Infrastructure',
  'Security & Governance',
  'Product & Design'
];

const PROFICIENCY_LABEL = (score) => {
  if (score >= 90) return 'Expert';
  if (score >= 75) return 'Advanced';
  if (score >= 55) return 'Intermediate';
  return 'Beginner';
};

const WEIGHTAGE_LABEL = (gapCount) => {
  if (gapCount >= 10) return 'Critical';
  if (gapCount >= 5) return 'High';
  if (gapCount >= 2) return 'Medium';
  return 'Low';
};

const CompanySkillTaxonomy = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState(defaultDomainCategories);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: defaultDomainCategories[0],
    level: 'Intermediate',
    weightage: 'Medium',
    benchmarkScore: 75,
    mappedRoles: 1
  });

  const fetchTaxonomy = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getTaxonomy();
      if (res?.success) {
        const cats = res.data;
        const catNames = cats.map(c => c.name).filter(Boolean);
        const combinedCats = Array.from(new Set([...catNames, ...defaultDomainCategories]));
        setCategories(combinedCats);

        const mapped = [];
        const seenSkillIds = new Set();
        cats.forEach(cat => {
          (cat.skills || []).forEach(skill => {
            if (!seenSkillIds.has(skill.id)) {
              seenSkillIds.add(skill.id);
              const userSkillCount = skill._count?.userSkills || 0;
              const gapCount = skill._count?.skillGaps || 0;
              const computedScore = Math.min(100, Math.round((userSkillCount / Math.max(1, userSkillCount + gapCount)) * 100));
              const benchmarkScore = skill.benchmarkScore !== null && skill.benchmarkScore !== undefined ? skill.benchmarkScore : (userSkillCount > 0 ? computedScore : 75);
              mapped.push({
                id: skill.id,
                name: skill.name,
                category: cat.name,
                // Use stored DB values first; computed values only if actual usage data exists
                level: skill.proficiencyLevel || (userSkillCount > 0 ? PROFICIENCY_LABEL(computedScore) : 'Beginner'),
                weightage: skill.priorityTier || (gapCount > 0 ? WEIGHTAGE_LABEL(gapCount) : 'Low'),
                benchmarkScore,
                mappedRoles: userSkillCount
              });
            }
          });
        });
        setSkills(mapped);
      }
    } catch (err) {
      console.warn('Failed to load skill taxonomy:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Delete Skill Click (Open Custom Dialog)
  const handleDeleteClick = (skill) => {
    setSkillToDelete(skill);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Handler
  const confirmDeleteSkill = async () => {
    if (!skillToDelete) return;
    setDeleting(true);
    try {
      const res = await adminAPI.deleteSkill(skillToDelete.id);
      if (res?.success) {
        setIsDeleteModalOpen(false);
        setSkillToDelete(null);
        fetchTaxonomy();
      }
    } catch (err) {
      console.warn('Failed to delete skill node from database:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Open Edit Modal
  const handleEditClick = (skill) => {
    setCurrentSkill(skill);
    setFormData({ ...skill });
    setShowCustomCategory(false);
    setIsEditModalOpen(true);
  };

  // Submit New Skill
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    setSaving(true);
    try {
      const res = await adminAPI.createSkill({
        name: formData.name,
        category: formData.category,
        description: `${formData.name} (${formData.level} Level)`,
        level: formData.level,
        weightage: formData.weightage,
        benchmarkScore: Number(formData.benchmarkScore)
      });
      if (res?.success) {
        setIsAddModalOpen(false);
        resetForm();
        fetchTaxonomy();
      }
    } catch (err) {
      console.warn('Failed to create skill node in database:', err);
    } finally {
      setSaving(false);
    }
  };

  // Submit Skill Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!currentSkill) return;
    setSaving(true);
    try {
      const res = await adminAPI.updateSkill(currentSkill.id, {
        name: formData.name,
        category: formData.category,
        description: `${formData.name} (${formData.level} Level)`,
        level: formData.level,
        weightage: formData.weightage,
        benchmarkScore: Number(formData.benchmarkScore)
      });
      if (res?.success) {
        setIsEditModalOpen(false);
        resetForm();
        fetchTaxonomy();
      }
    } catch (err) {
      console.warn('Failed to update skill node in database:', err);
    } finally {
      setSaving(false);
    }

  };

  const resetForm = () => {
    setShowCustomCategory(false);
    setFormData({
      name: '',
      category: 'Frontend Engineering',
      level: 'Intermediate',
      weightage: 'Medium',
      benchmarkScore: 75,
      mappedRoles: 1
    });
  };

  const handleExportCSV = () => {
    const headers = ['Skill Title', 'Domain Category', 'Required Level', 'Strategic Priority', 'Benchmark Target', 'Mapped Roles'];
    const rows = skills.map(s => [s.name, s.category, s.level, s.weightage, `${s.benchmarkScore}%`, s.mappedRoles]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'company_skill_taxonomy.csv';
    link.click();
    setIsExportModalOpen(false);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify({ taxonomy: skills }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'company_skill_taxonomy.json';
    link.click();
    setIsExportModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <CompanyAdminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Company Skill Taxonomy
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure target competency matrices, proficiency benchmarks, and organizational skill weightages.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Export Framework
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { resetForm(); setIsAddModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Custom Skill
            </motion.button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search taxonomy by skill name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#1E293B] border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Category:</span>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0F172A]">All Domains</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-[#0F172A]">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-sm font-semibold text-slate-400">Loading skill taxonomy from database...</p>
          </div>
        ) : (
        /* Taxonomy Data Table */
        <div className="rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#1E293B]/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Skill Title</th>
                  <th className="px-6 py-4">Domain Category</th>
                  <th className="px-6 py-4">Required Level</th>
                  <th className="px-6 py-4">Strategic Priority</th>
                  <th className="px-6 py-4">Benchmark Target</th>
                  <th className="px-6 py-4">Mapped Roles</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-white">{skill.name}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-slate-300">
                        {skill.category}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                          {skill.level}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                          skill.weightage === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          skill.weightage === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {skill.weightage}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-indigo-500 h-full rounded-full" 
                              style={{ width: `${skill.benchmarkScore}%` }} 
                            />
                          </div>
                          <span className="text-xs font-semibold text-white">{skill.benchmarkScore}%</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {skill.mappedRoles} active roles
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(skill)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Edit Skill"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteClick(skill)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Remove Skill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-500">
                      No taxonomy skills match the specified criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

      </main>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">Add Custom Skill to Matrix</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Skill Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kubernetes Cluster Mgmt"
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Domain Category</label>
                  {showCustomCategory ? (
                    <div className="relative">
                      <input type="text" required value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Type custom category..."
                        className="w-full px-3.5 py-2 pr-8 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500" autoFocus />
                      <button type="button" onClick={() => { setShowCustomCategory(false); setFormData({ ...formData, category: categories[0] || defaultDomainCategories[0] }); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === '__CUSTOM__') {
                          setShowCustomCategory(true); setFormData({ ...formData, category: '' });
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c} value={c} className="bg-[#0F172A] text-slate-100 py-1">
                          {c}
                        </option>
                      ))}
                      <option disabled className="bg-[#0F172A] text-slate-500">──────────</option>
                      <option value="__CUSTOM__" className="bg-[#0F172A] font-bold text-indigo-400">➕ Add Custom Category...</option>
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Proficiency</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {proficiencyLevels.map(l => (
                        <option key={l} value={l} className="bg-[#0F172A] text-slate-100 py-1">
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority Tier</label>
                    <select
                      value={formData.weightage}
                      onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {weightageTiers.map(w => (
                        <option key={w} value={w} className="bg-[#0F172A] text-slate-100 py-1">
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Target Benchmark Score ({formData.benchmarkScore}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formData.benchmarkScore}
                    onChange={(e) => setFormData({ ...formData, benchmarkScore: e.target.value })}
                    className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving Skill...
                      </>
                    ) : (
                      'Save Skill'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Skill Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white">Edit Taxonomy Skill</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Skill Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Domain Category</label>
                  {showCustomCategory ? (
                    <div className="relative">
                      <input type="text" required value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Type custom category..."
                        className="w-full px-3.5 py-2 pr-8 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500" autoFocus />
                      <button type="button" onClick={() => { setShowCustomCategory(false); setFormData({ ...formData, category: currentSkill?.category || categories[0] || defaultDomainCategories[0] }); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === '__CUSTOM__') {
                          setShowCustomCategory(true); setFormData({ ...formData, category: '' });
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {!categories.includes(formData.category) && <option value={formData.category} className="bg-[#0F172A] text-slate-100 py-1">{formData.category}</option>}
                      {categories.map(c => (
                        <option key={c} value={c} className="bg-[#0F172A] text-slate-100 py-1">
                          {c}
                        </option>
                      ))}
                      <option disabled className="bg-[#0F172A] text-slate-500">──────────</option>
                      <option value="__CUSTOM__" className="bg-[#0F172A] font-bold text-indigo-400">➕ Add Custom Category...</option>
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Proficiency</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {proficiencyLevels.map(l => (
                        <option key={l} value={l} className="bg-[#0F172A] text-slate-100 py-1">
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority Tier</label>
                    <select
                      value={formData.weightage}
                      onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {weightageTiers.map(w => (
                        <option key={w} value={w} className="bg-[#0F172A] text-slate-100 py-1">
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Target Benchmark Score ({formData.benchmarkScore}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formData.benchmarkScore}
                    onChange={(e) => setFormData({ ...formData, benchmarkScore: e.target.value })}
                    className="w-full h-2 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating Skill...
                      </>
                    ) : (
                      'Update Skill'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#0F172A] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 text-center relative font-sans text-slate-100"
            >
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/10">
                <Trash2 className="w-7 h-7" />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">Delete Skill Node?</h2>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Are you sure you want to permanently remove <span className="font-bold text-rose-400">"{skillToDelete?.name}"</span> from your organization taxonomy? This will remove associated benchmarks from PostgreSQL.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteSkill}
                  disabled={deleting}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Node'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Export Framework Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#0F172A] border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 text-center relative font-sans text-slate-100"
            >
              <button 
                onClick={() => setIsExportModalOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/10">
                <Download className="w-7 h-7" />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">Export Skill Taxonomy</h2>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Download your organization's complete skill taxonomy matrix framework.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export as CSV (.csv)
                </button>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  Export as JSON (.json)
                </button>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors mt-1"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CompanySkillTaxonomy;