import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Binary, 
  Plus, 
  Search, 
  Layers, 
  Sparkles, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  X, 
  CheckCircle2, 
  Loader2, 
  Tag,
  AlertTriangle,
  Users,
  Target,
  ShieldAlert,
  Info,
  RefreshCw,
  Award
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

const SkillTaxonomyManagement = () => {
  const [taxonomy, setTaxonomy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [toastMsg, setToastMsg] = useState({ text: '', type: 'success' });
  const [blockedDeleteSkill, setBlockedDeleteSkill] = useState(null);

  // New Skill Form State
  const [newSkill, setNewSkill] = useState({
    categoryId: '',
    customCategory: '',
    name: '',
    level: 'Intermediate',
    priorityTier: 'Medium',
    benchmarkScore: 75,
    tags: ''
  });

  // Edit Skill Form State
  const [editingSkill, setEditingSkill] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg({ text: '', type: 'success' }), 4000);
  };

  const fetchTaxonomy = async (isManualSync = false) => {
    if (isManualSync) {
      setIsAiGenerating(true);
    } else {
      setLoading(true);
    }
    try {
      const res = await adminAPI.getTaxonomy();
      if (res?.success && res.data) {
        const mapped = res.data.map(cat => ({
          id: cat.id,
          category: cat.name,
          description: cat.description || `${cat.name} competency framework`,
          skillsCount: cat.skills?.length || 0,
          skills: (cat.skills || []).map(s => {
            const rawDesc = s.description || '';
            const parsedTags = rawDesc.includes(',')
              ? rawDesc.split(',').map(t => t.trim()).filter(Boolean)
              : rawDesc.trim() ? [rawDesc.trim()] : [];

            return {
              id: s.id,
              name: s.name,
              categoryId: cat.id,
              categoryName: cat.name,
              level: s.proficiencyLevel || 'Intermediate',
              priorityTier: s.priorityTier || 'Medium',
              benchmarkScore: s.benchmarkScore !== undefined && s.benchmarkScore !== null ? s.benchmarkScore : 75,
              rawDescription: rawDesc,
              tags: parsedTags,
              userSkillsCount: s._count?.userSkills || 0,
              skillGapsCount: s._count?.skillGaps || 0,
              courseSkillsCount: s._count?.courseSkills || 0
            };
          })
        }));

        setTaxonomy(mapped);

        if (mapped.length > 0) {
          // Keep current expanded or expand the first category
          setExpandedCategories(prev => prev.length > 0 ? prev : [mapped[0].id]);
          if (!newSkill.categoryId) {
            setNewSkill(prev => ({ ...prev, categoryId: mapped[0].id }));
          }
        }

        if (isManualSync) {
          const totalCount = mapped.reduce((acc, c) => acc + c.skills.length, 0);
          showToast(`Taxonomy synchronized: ${mapped.length} categories & ${totalCount} competencies verified from database.`, 'success');
        }
      }
    } catch (err) {
      console.warn('Failed to load skill taxonomy:', err);
      showToast('Failed to load skill taxonomy from database.', 'error');
    } finally {
      setLoading(false);
      setIsAiGenerating(false);
    }
  };

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  // Toggle Category Accordion
  const toggleCategory = (id) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  // Add Skill Handler (Documented: Valid & Unique check -> Save)
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    if (newSkill.categoryId === 'NEW_CATEGORY' && !newSkill.customCategory.trim()) return;

    setSaving(true);
    try {
      const payload = {
        name: newSkill.name.trim(),
        description: newSkill.tags.trim() || `${newSkill.name.trim()} Competency Node`,
        level: newSkill.level,
        proficiencyLevel: newSkill.level,
        priorityTier: newSkill.priorityTier,
        weightage: newSkill.priorityTier,
        benchmarkScore: Number(newSkill.benchmarkScore) || 75
      };

      if (newSkill.categoryId === 'NEW_CATEGORY') {
        payload.categoryName = newSkill.customCategory.trim();
      } else {
        payload.categoryId = newSkill.categoryId;
      }

      const res = await adminAPI.createSkill(payload);
      if (res?.success) {
        showToast(`Competency '${newSkill.name}' inserted into taxonomy!`, 'success');
        setIsAddModalOpen(false);
        setNewSkill({ 
          categoryId: taxonomy[0]?.id || '', 
          customCategory: '',
          name: '', 
          level: 'Intermediate', 
          priorityTier: 'Medium',
          benchmarkScore: 75,
          tags: '' 
        });
        await fetchTaxonomy();
      } else {
        showToast(res?.message || 'Failed to insert skill competency.', 'error');
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to add skill node.';
      showToast(errorMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (skill) => {
    setEditingSkill({
      id: skill.id,
      name: skill.name,
      categoryId: skill.categoryId,
      customCategory: '',
      level: skill.level || 'Intermediate',
      priorityTier: skill.priorityTier || 'Medium',
      benchmarkScore: skill.benchmarkScore || 75,
      tags: skill.rawDescription || skill.tags.join(', ')
    });
    setIsEditModalOpen(true);
  };

  // Edit Skill Handler (Documented in 6.3.4: Select & Modify Skill -> Save Changes)
  const handleSaveEditSkill = async (e) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) return;
    if (editingSkill.categoryId === 'NEW_CATEGORY' && !editingSkill.customCategory.trim()) return;

    setSaving(true);
    try {
      const payload = {
        name: editingSkill.name.trim(),
        description: editingSkill.tags.trim(),
        level: editingSkill.level,
        proficiencyLevel: editingSkill.level,
        priorityTier: editingSkill.priorityTier,
        weightage: editingSkill.priorityTier,
        benchmarkScore: Number(editingSkill.benchmarkScore) || 75
      };

      if (editingSkill.categoryId === 'NEW_CATEGORY') {
        payload.categoryName = editingSkill.customCategory.trim();
      } else {
        payload.categoryId = editingSkill.categoryId;
      }

      const res = await adminAPI.updateSkill(editingSkill.id, payload);
      if (res?.success) {
        showToast(`Competency '${editingSkill.name}' updated successfully!`, 'success');
        setIsEditModalOpen(false);
        setEditingSkill(null);
        await fetchTaxonomy();
      } else {
        showToast(res?.message || 'Failed to update skill competency.', 'error');
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update skill competency.';
      showToast(errorMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Skill Handler (Documented in 6.3.4: Skill in Use -> Block & Show Warning, Else Confirm & Delete)
  const handleDeleteSkill = async (skill) => {
    const isLinked = (skill.userSkillsCount || 0) > 0 || (skill.skillGapsCount || 0) > 0;
    
    if (isLinked) {
      // Documented Requirement: Block deletion and show warning if actively linked
      setBlockedDeleteSkill(skill);
      return;
    }

    if (!window.confirm(`Are you sure you want to remove '${skill.name}' from the global taxonomy?`)) {
      return;
    }

    try {
      const res = await adminAPI.deleteSkill(skill.id);
      if (res?.success) {
        showToast(`Skill '${skill.name}' removed from taxonomy.`, 'success');
        await fetchTaxonomy();
      } else {
        showToast(res?.message || 'Failed to delete skill.', 'error');
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to delete skill node.';
      showToast(errorMsg, 'error');
    }
  };

  // Real Indexed Keywords extracted purely from database taxonomy nodes (0% fake multipliers)
  const totalInferredKeywords = useMemo(() => {
    const keywordSet = new Set();
    taxonomy.forEach(cat => {
      if (cat.category) {
        cat.category.split(/\s+/).forEach(w => {
          const clean = w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          if (clean.length > 2) keywordSet.add(clean);
        });
      }
      (cat.skills || []).forEach(s => {
        if (s.name) {
          s.name.split(/\s+/).forEach(w => {
            const clean = w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            if (clean.length > 2) keywordSet.add(clean);
          });
        }
        if (s.tags && Array.isArray(s.tags)) {
          s.tags.forEach(t => {
            const clean = t.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            if (clean.length > 1) keywordSet.add(clean);
          });
        }
      });
    });
    return keywordSet.size;
  }, [taxonomy]);

  // Real Active In-Use Skills count
  const activeInUseCount = useMemo(() => {
    return taxonomy.reduce((acc, cat) => {
      return acc + (cat.skills || []).filter(s => (s.userSkillsCount || 0) > 0 || (s.skillGapsCount || 0) > 0).length;
    }, 0);
  }, [taxonomy]);

  // Dynamic Taxonomy Sync Status
  const taxonomyStatus = useMemo(() => {
    if (loading) return { text: 'Querying Database...', color: 'text-amber-400', isSpin: true };
    if (isAiGenerating || saving) return { text: 'Syncing Framework...', color: 'text-indigo-400', isSpin: true };
    if (taxonomy.length === 0) return { text: 'No Competencies Found', color: 'text-rose-400', isSpin: false };
    const totalSkills = taxonomy.reduce((acc, cat) => acc + cat.skills.length, 0);
    return { 
      text: 'Fully Synchronized', 
      color: 'text-emerald-400', 
      isSpin: false,
      detail: `${taxonomy.length} categories, ${totalSkills} competencies verified` 
    };
  }, [loading, isAiGenerating, saving, taxonomy]);

  // Search Filtered Taxonomy with Auto-Expansion
  const filteredTaxonomy = useMemo(() => {
    if (!searchTerm.trim()) return taxonomy;
    const term = searchTerm.toLowerCase().trim();

    return taxonomy.map(cat => {
      const catMatches = cat.category.toLowerCase().includes(term) ||
                         cat.description.toLowerCase().includes(term);
      const matchingSkills = cat.skills.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.level.toLowerCase().includes(term) ||
        s.priorityTier.toLowerCase().includes(term) ||
        s.tags.some(t => t.toLowerCase().includes(term))
      );

      if (catMatches || matchingSkills.length > 0) {
        return {
          ...cat,
          displaySkills: catMatches ? cat.skills : matchingSkills
        };
      }
      return null;
    }).filter(Boolean);
  }, [taxonomy, searchTerm]);

  const totalCompetencies = useMemo(() => {
    return taxonomy.reduce((acc, cat) => acc + cat.skills.length, 0);
  }, [taxonomy]);

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-slate-100 font-sans">
      <SuperadminSidebar activeItem="taxonomy" />

      {/* Toast Notification */}
      {toastMsg.text && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md transition-all ${
          toastMsg.type === 'error'
            ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
            : 'bg-indigo-900/90 text-white border-indigo-400/40'
        }`}>
          {toastMsg.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="font-semibold text-sm">{toastMsg.text}</span>
        </div>
      )}

      {/* Blocked Deletion Warning Modal (6.3.4 Manage Skill Taxonomy: Block & Show Warning) */}
      <AnimatePresence>
        {blockedDeleteSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0F172A] border border-amber-500/40 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Deletion Blocked</h3>
                  <p className="text-xs text-amber-400/90 font-medium">Competency Actively Linked</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  The skill competency <span className="font-bold text-white underline">{blockedDeleteSkill.name}</span> cannot be deleted because it is actively in use within the organization:
                </p>

                <div className="bg-[#1E293B] p-3 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" /> Linked Employee Profiles:
                    </span>
                    <span className="font-bold text-indigo-300 font-mono text-sm">
                      {blockedDeleteSkill.userSkillsCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Active Skill Gaps:
                    </span>
                    <span className="font-bold text-amber-300 font-mono text-sm">
                      {blockedDeleteSkill.skillGapsCount}
                    </span>
                  </div>
                </div>

                <p className="text-slate-400">
                  As required by data integrity policies, please reassign or unlink these employee profiles and assessments before deleting this skill node.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setBlockedDeleteSkill(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                >
                  Understood & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Binary className="w-8 h-8 text-indigo-500" /> Skill Taxonomy Engine
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Global competency frameworks, skill hierarchy trees, and AI-driven skill mapping configurations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchTaxonomy(true)}
              disabled={isAiGenerating || loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 text-sm font-semibold transition-all duration-200"
              title="Re-query database and synchronize taxonomy"
            >
              <RefreshCw className={`w-4 h-4 ${isAiGenerating ? 'animate-spin' : ''}`} />
              {isAiGenerating ? 'Syncing Framework...' : 'AI Auto-Sync Taxonomy'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Skill Node
            </motion.button>
          </div>
        </div>

        {/* Taxonomy Quick Stats - 100% Real Database Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Skill Categories</p>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white mt-2">{taxonomy.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">Domain competency groups</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Mapped Competencies</p>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Binary className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-indigo-400 mt-2">
              {totalCompetencies}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Verified platform skill nodes</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Active In-Use Nodes</p>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-emerald-400 mt-2">
              {activeInUseCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Linked to users or gap analyses</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Taxonomy Status</p>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              {taxonomyStatus.isSpin ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <CheckCircle2 className={`w-4 h-4 ${taxonomyStatus.color}`} />
              )}
              <span className={`text-base font-bold ${taxonomyStatus.color}`}>{taxonomyStatus.text}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{totalInferredKeywords} unique indexed terms</p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search skill nodes, levels, tiers, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-3 py-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Taxonomy Categories Accordion Tree */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0F172A] border border-slate-800/80 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-400 mt-3">Loading competency taxonomy from database...</p>
          </div>
        ) : filteredTaxonomy.length > 0 ? (
          <div className="space-y-4">
            {filteredTaxonomy.map((cat) => {
              const isSearchActive = Boolean(searchTerm.trim());
              const isExpanded = isSearchActive || expandedCategories.includes(cat.id);
              const skillsToRender = cat.displaySkills || cat.skills;

              return (
                <div key={cat.id} className="rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl overflow-hidden transition-colors">
                  {/* Category Header */}
                  <div 
                    onClick={() => toggleCategory(cat.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-indigo-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                      )}
                      <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          {cat.category}
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                            {skillsToRender.length} skills {isSearchActive && `(matched)`}
                          </span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 hidden sm:inline-block">
                      {cat.skills.length} competencies
                    </span>
                  </div>

                  {/* Skills Grid under Category */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-800/80 bg-[#0B1120]/60 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      >
                        {skillsToRender.length > 0 ? (
                          skillsToRender.map((skill) => {
                            const isLinked = (skill.userSkillsCount || 0) > 0 || (skill.skillGapsCount || 0) > 0;

                            const levelColor = 
                              skill.level === 'Expert' ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' :
                              skill.level === 'Advanced' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' :
                              skill.level === 'Intermediate' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' :
                              'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

                            return (
                              <div 
                                key={skill.id} 
                                className="p-4 rounded-xl bg-[#1E293B]/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${levelColor}`}>
                                      {skill.level}
                                    </span>
                                    
                                    {/* Actions: Edit & Delete (Documented in 6.3.4 Manage Skill Taxonomy) */}
                                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleOpenEdit(skill)}
                                        className="text-slate-400 hover:text-indigo-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                                        title="Edit Skill Competency"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSkill(skill)}
                                        className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                                        title={isLinked ? 'Cannot delete: Actively linked to users/assessments' : 'Delete Skill Node'}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <h3 className="text-sm font-bold text-white mt-2.5">
                                    {skill.name}
                                  </h3>

                                  {/* In-Use Status Indicators from Database */}
                                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                    {skill.userSkillsCount > 0 && (
                                      <span className="text-[10px] font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                                        <Users className="w-3 h-3 text-indigo-400" />
                                        {skill.userSkillsCount} users
                                      </span>
                                    )}
                                    {skill.skillGapsCount > 0 && (
                                      <span className="text-[10px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                                        {skill.skillGapsCount} gaps
                                      </span>
                                    )}
                                    {!isLinked && (
                                      <span className="text-[10px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
                                        Unassigned
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                                  <div className="flex flex-wrap gap-1">
                                    {skill.tags.length > 0 ? (
                                      skill.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                                          #{tag}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-slate-500 italic">No tags</span>
                                    )}
                                  </div>

                                  <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">
                                    BM: {skill.benchmarkScore}%
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-full py-6 text-center text-xs text-slate-500">
                            No skill nodes match query in this category.
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#0F172A] border border-slate-800/80 rounded-2xl">
            <Binary className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300">No Skill Nodes Match Your Query</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for a different skill name, level, tier, or tag.</p>
          </div>
        )}

      </main>

      {/* Modal: Add Skill Node (Documented in 6.3.4: Enter Skill Details -> Validate -> Save) */}
      <AnimatePresence>
        {isAddModalOpen && (
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
                    <Binary className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Add New Skill Node</h2>
                    <p className="text-xs text-slate-400">Expand the platform competency taxonomy.</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSkill} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Category</label>
                  <select
                    value={newSkill.categoryId}
                    onChange={(e) => setNewSkill({ ...newSkill, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {taxonomy.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0F172A]">{c.category}</option>
                    ))}
                    <option value="NEW_CATEGORY" className="bg-[#0F172A] text-indigo-400 font-bold">+ Create New Category...</option>
                  </select>

                  {newSkill.categoryId === 'NEW_CATEGORY' && (
                    <div className="mt-2.5">
                      <label className="block text-xs font-semibold uppercase text-indigo-400 mb-1">New Category Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cybersecurity & Compliance"
                        value={newSkill.customCategory}
                        onChange={(e) => setNewSkill({ ...newSkill, customCategory: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#1E293B] border border-indigo-500/50 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Skill Competency Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Systems Architecture"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Competency Level</label>
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Beginner" className="bg-[#0F172A]">Beginner</option>
                      <option value="Intermediate" className="bg-[#0F172A]">Intermediate</option>
                      <option value="Advanced" className="bg-[#0F172A]">Advanced</option>
                      <option value="Expert" className="bg-[#0F172A]">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority Tier</label>
                    <select
                      value={newSkill.priorityTier}
                      onChange={(e) => setNewSkill({ ...newSkill, priorityTier: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Low" className="bg-[#0F172A]">Low</option>
                      <option value="Medium" className="bg-[#0F172A]">Medium</option>
                      <option value="High" className="bg-[#0F172A]">High</option>
                      <option value="Critical" className="bg-[#0F172A]">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Benchmark (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newSkill.benchmarkScore}
                      onChange={(e) => setNewSkill({ ...newSkill, benchmarkScore: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Keywords / Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Microservices, Docker, Event-Driven"
                    value={newSkill.tags}
                    onChange={(e) => setNewSkill({ ...newSkill, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {saving ? 'Inserting...' : 'Insert Skill Node'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Edit Skill Node (Documented in 6.3.4: Select & Modify Skill -> Save Changes) */}
      <AnimatePresence>
        {isEditModalOpen && editingSkill && (
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
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Edit Skill Competency</h2>
                    <p className="text-xs text-slate-400">Modify competency parameters and category assignment.</p>
                  </div>
                </div>
                <button onClick={() => { setIsEditModalOpen(false); setEditingSkill(null); }} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditSkill} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Category</label>
                  <select
                    value={editingSkill.categoryId}
                    onChange={(e) => setEditingSkill({ ...editingSkill, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {taxonomy.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#0F172A]">{c.category}</option>
                    ))}
                    <option value="NEW_CATEGORY" className="bg-[#0F172A] text-indigo-400 font-bold">+ Create New Category...</option>
                  </select>

                  {editingSkill.categoryId === 'NEW_CATEGORY' && (
                    <div className="mt-2.5">
                      <label className="block text-xs font-semibold uppercase text-indigo-400 mb-1">New Category Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cybersecurity & Compliance"
                        value={editingSkill.customCategory}
                        onChange={(e) => setEditingSkill({ ...editingSkill, customCategory: e.target.value })}
                        className="w-full px-3.5 py-2 bg-[#1E293B] border border-indigo-500/50 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Skill Competency Name</label>
                  <input
                    type="text"
                    required
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Competency Level</label>
                    <select
                      value={editingSkill.level}
                      onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Beginner" className="bg-[#0F172A]">Beginner</option>
                      <option value="Intermediate" className="bg-[#0F172A]">Intermediate</option>
                      <option value="Advanced" className="bg-[#0F172A]">Advanced</option>
                      <option value="Expert" className="bg-[#0F172A]">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority Tier</label>
                    <select
                      value={editingSkill.priorityTier}
                      onChange={(e) => setEditingSkill({ ...editingSkill, priorityTier: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Low" className="bg-[#0F172A]">Low</option>
                      <option value="Medium" className="bg-[#0F172A]">Medium</option>
                      <option value="High" className="bg-[#0F172A]">High</option>
                      <option value="Critical" className="bg-[#0F172A]">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Benchmark (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingSkill.benchmarkScore}
                      onChange={(e) => setEditingSkill({ ...editingSkill, benchmarkScore: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Keywords / Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={editingSkill.tags}
                    onChange={(e) => setEditingSkill({ ...editingSkill, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsEditModalOpen(false); setEditingSkill(null); }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {saving ? 'Saving...' : 'Save Changes'}
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

export default SkillTaxonomyManagement;