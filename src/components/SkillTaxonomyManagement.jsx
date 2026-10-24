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
import SkillPulseLoader from './SkillPulseLoader';
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
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  // AI-Driven Taxonomy Synchronization via Groq LPU (Llama-3.3-70b)
  const handleAiAutoSync = async () => {
    setIsAiGenerating(true);
    try {
      const res = await adminAPI.aiSyncTaxonomy();
      if (res?.success) {
        showToast(res.message || 'AI Taxonomy Sync Complete via Llama-3.3-70b!', 'success');
        await fetchTaxonomy();
      } else {
        showToast(res?.message || 'Failed to sync taxonomy with AI.', 'error');
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'AI taxonomy synchronization failed.';
      showToast(errorMsg, 'error');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Toggle Category Accordion
  const toggleCategory = (id) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  // Add Skill Handler
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

  // Edit Skill Handler
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

  // Delete Skill Handler
  const handleDeleteSkill = (skill) => {
    const isLinked = (skill.userSkillsCount || 0) > 0 || (skill.skillGapsCount || 0) > 0;
    
    if (isLinked) {
      setBlockedDeleteSkill(skill);
      return;
    }

    setSkillToDelete(skill);
  };

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    setDeleting(true);
    try {
      const res = await adminAPI.deleteSkill(skillToDelete.id);
      if (res?.success) {
        showToast(`Skill '${skillToDelete.name}' removed from taxonomy.`, 'success');
        setSkillToDelete(null);
        await fetchTaxonomy();
      } else {
        showToast(res?.message || 'Failed to delete skill.', 'error');
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to delete skill node.';
      showToast(errorMsg, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Indexed Keywords count
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

  // Active In-Use Skills count
  const activeInUseCount = useMemo(() => {
    return taxonomy.reduce((acc, cat) => {
      return acc + (cat.skills || []).filter(s => (s.userSkillsCount || 0) > 0 || (s.skillGapsCount || 0) > 0).length;
    }, 0);
  }, [taxonomy]);

  // Dynamic Taxonomy Sync Status
  const taxonomyStatus = useMemo(() => {
    if (loading) return { text: 'Querying Database...', color: 'text-amber-600', isSpin: true };
    if (isAiGenerating || saving) return { text: 'Syncing Framework...', color: 'text-[#1988A3]', isSpin: true };
    if (taxonomy.length === 0) return { text: 'No Competencies Found', color: 'text-rose-600', isSpin: false };
    const totalSkills = taxonomy.reduce((acc, cat) => acc + cat.skills.length, 0);
    return { 
      text: 'Fully Synchronized', 
      color: 'text-emerald-700', 
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
    <div className="flex min-h-screen bg-[#E9EAF7] text-[#17233E] font-sans relative overflow-x-hidden selection:bg-[#1988A3]/20 selection:text-[#17233E]">
      {/* Ambient glowing mesh depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#1988A3]/20 to-[#11C6DE]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-[#1B3154]/15 to-[#8A9CB7]/25 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-[#11C6DE]/15 to-[#1988A3]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#8A9CB7_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <SuperadminSidebar activeItem="taxonomy" />

      {/* Toast Notification */}
      {toastMsg.text && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md transition-all ${
          toastMsg.type === 'error'
            ? 'bg-rose-50 border-rose-300 text-rose-800'
            : 'bg-white/95 border-emerald-300 text-emerald-800'
        }`}>
          {toastMsg.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span className="font-bold text-sm">{toastMsg.text}</span>
        </div>
      )}

      {/* Blocked Deletion Warning Modal */}
      <AnimatePresence>
        {blockedDeleteSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233E]/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/90 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#BEDDF5]">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-700 border border-amber-300">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17233E]">Deletion Blocked</h3>
                  <p className="text-xs text-amber-800 font-medium">Competency Actively Linked</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-xs text-[#5A6D89] leading-relaxed">
                <p>
                  The skill competency <span className="font-bold text-[#17233E] underline">{blockedDeleteSkill.name}</span> cannot be deleted because it is actively in use within the organization:
                </p>

                <div className="bg-white/80 p-3 rounded-xl border border-[#BEDDF5] space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5A6D89] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#1988A3]" /> Linked Employee Profiles:
                    </span>
                    <span className="font-bold text-[#1988A3] font-mono text-sm">
                      {blockedDeleteSkill.userSkillsCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5A6D89] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Active Skill Gaps:
                    </span>
                    <span className="font-bold text-amber-700 font-mono text-sm">
                      {blockedDeleteSkill.skillGapsCount}
                    </span>
                  </div>
                </div>

                <p className="text-[#5A6D89]">
                  As required by data integrity policies, please reassign or unlink these employee profiles and assessments before deleting this skill node.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setBlockedDeleteSkill(null)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#17233E] text-xs font-semibold transition-colors border border-[#BEDDF5] shadow-sm"
                >
                  Understood & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal for Unlinked Skill Deletion */}
      <AnimatePresence>
        {skillToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233E]/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/90 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#BEDDF5]">
                <div className="p-3 rounded-xl bg-rose-100 text-rose-700 border border-rose-300">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#17233E]">Confirm Skill Deletion</h3>
                  <p className="text-xs text-rose-700 font-medium">Remove from Global Taxonomy</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-xs text-[#5A6D89] leading-relaxed">
                <p>
                  Are you sure you want to remove competency <span className="font-bold text-[#17233E] underline">{skillToDelete.name}</span> from the global taxonomy?
                </p>
                <p className="text-[#5A6D89]">
                  This skill node is currently unlinked from active user profiles and assessments. Once deleted, it will be permanently removed from the master competency repository.
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setSkillToDelete(null)}
                  className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-[#5A6D89] text-xs font-semibold transition-colors border border-[#BEDDF5] shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleConfirmDelete}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-md shadow-rose-600/20"
                >
                  {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {deleting ? 'Deleting...' : 'Delete Skill'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#BEDDF5]/70 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E] flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-gradient-to-br from-[#1988A3] to-[#11C6DE] text-white shadow-lg shadow-[#1988A3]/25 inline-flex">
                <Binary className="w-7 h-7" />
              </span>
              Skill Taxonomy Engine
            </h1>
            <p className="text-[#5A6D89] text-sm mt-1">
              Global competency frameworks, skill hierarchy trees, and AI-driven skill mapping configurations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAiAutoSync}
              disabled={isAiGenerating || loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-[#1988A3] border border-[#BEDDF5] text-xs font-bold shadow-sm transition-all hover:border-[#1988A3]"
              title="Run Real AI Semantic Tagging & Normalization via Llama-3.3-70b"
            >
              <Sparkles className={`w-4 h-4 text-[#1988A3] ${isAiGenerating ? 'animate-spin' : ''}`} />
              {isAiGenerating ? 'AI Syncing (Llama-3.3-70b)...' : 'AI Auto-Sync Taxonomy'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Skill Node
            </motion.button>
          </div>
        </div>

        {/* Taxonomy Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <motion.div 
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Skill Categories</p>
              <div className="p-2 rounded-lg bg-[#1988A3]/10 text-[#1988A3]">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#17233E] mt-2">{taxonomy.length}</p>
            <p className="text-[11px] text-[#5A6D89] mt-1 font-mono">Domain competency groups</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Mapped Competencies</p>
              <div className="p-2 rounded-lg bg-[#1988A3]/10 text-[#1988A3]">
                <Binary className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#1988A3] mt-2">
              {totalCompetencies}
            </p>
            <p className="text-[11px] text-[#5A6D89] mt-1">Verified platform skill nodes</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Active In-Use Nodes</p>
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-700 mt-2">
              {activeInUseCount}
            </p>
            <p className="text-[11px] text-[#5A6D89] mt-1">Linked to users or gap analyses</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Taxonomy Status</p>
              <div className="p-2 rounded-lg bg-[#1988A3]/10 text-[#1988A3]">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              {taxonomyStatus.isSpin ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1988A3]" />
              ) : (
                <CheckCircle2 className={`w-4 h-4 ${taxonomyStatus.color}`} />
              )}
              <span className={`text-base font-bold ${taxonomyStatus.color}`}>{taxonomyStatus.text}</span>
            </div>
            <p className="text-[11px] text-[#5A6D89] mt-1">{totalInferredKeywords} unique indexed terms</p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9CB7]" />
            <input
              type="text"
              placeholder="Search skill nodes, levels, tiers, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white text-[#17233E] border border-[#BEDDF5] rounded-xl text-xs focus:outline-none focus:border-[#1988A3] shadow-sm transition-colors placeholder:text-[#8A9CB7]"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-[#1988A3] hover:text-[#15738A] font-bold px-3 py-1.5 bg-white/80 rounded-lg border border-[#BEDDF5] shadow-sm"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Taxonomy Categories Accordion Tree */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/80 border border-[#BEDDF5] rounded-2xl shadow-sm">
            <SkillPulseLoader message="Loading competency taxonomy from database..." />
          </div>
        ) : filteredTaxonomy.length > 0 ? (
          <div className="space-y-4">
            {filteredTaxonomy.map((cat) => {
              const isSearchActive = Boolean(searchTerm.trim());
              const isExpanded = isSearchActive || expandedCategories.includes(cat.id);
              const skillsToRender = cat.displaySkills || cat.skills;

              return (
                <div key={cat.id} className="rounded-2xl bg-white/85 border border-[#BEDDF5] shadow-sm overflow-hidden transition-all">
                  {/* Category Header */}
                  <div 
                    onClick={() => toggleCategory(cat.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-[#1988A3] shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-[#8A9CB7] shrink-0" />
                      )}
                      <div>
                        <h2 className="text-base font-bold text-[#17233E] flex items-center gap-2">
                          {cat.category}
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20 font-mono">
                            {skillsToRender.length} skills {isSearchActive && `(matched)`}
                          </span>
                        </h2>
                        <p className="text-xs text-[#5A6D89] mt-0.5">{cat.description}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-[#8A9CB7] hidden sm:inline-block">
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
                        className="border-t border-[#BEDDF5]/70 bg-[#D8EBF9]/25 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      >
                        {skillsToRender.length > 0 ? (
                          skillsToRender.map((skill) => {
                            const isLinked = (skill.userSkillsCount || 0) > 0 || (skill.skillGapsCount || 0) > 0;

                            const levelColor = 
                              skill.level === 'Expert' ? 'text-purple-700 bg-purple-100 border-purple-200' :
                              skill.level === 'Advanced' ? 'text-indigo-700 bg-indigo-100 border-indigo-200' :
                              skill.level === 'Intermediate' ? 'text-sky-700 bg-sky-100 border-sky-200' :
                              'text-emerald-700 bg-emerald-100 border-emerald-200';

                            return (
                              <div 
                                key={skill.id} 
                                className="p-4 rounded-xl bg-white border border-[#BEDDF5] hover:border-[#1988A3] transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${levelColor}`}>
                                      {skill.level}
                                    </span>
                                    
                                    {/* Actions: Edit & Delete */}
                                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleOpenEdit(skill)}
                                        className="text-[#5A6D89] hover:text-[#1988A3] p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                        title="Edit Skill Competency"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSkill(skill)}
                                        className="text-[#5A6D89] hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                                        title={isLinked ? 'Cannot delete: Actively linked to users/assessments' : 'Delete Skill Node'}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <h3 className="text-sm font-bold text-[#17233E] mt-2.5">
                                    {skill.name}
                                  </h3>

                                  {/* In-Use Status Indicators from Database */}
                                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                    {skill.userSkillsCount > 0 && (
                                      <span className="text-[10px] font-semibold text-[#1988A3] bg-[#1988A3]/10 border border-[#1988A3]/20 px-2 py-0.5 rounded flex items-center gap-1">
                                        <Users className="w-3 h-3 text-[#1988A3]" />
                                        {skill.userSkillsCount} users
                                      </span>
                                    )}
                                    {skill.skillGapsCount > 0 && (
                                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                                        {skill.skillGapsCount} gaps
                                      </span>
                                    )}
                                    {!isLinked && (
                                      <span className="text-[10px] text-[#8A9CB7] bg-slate-100 px-2 py-0.5 rounded font-medium">
                                        Unassigned
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-[#BEDDF5]/60 flex items-center justify-between text-[11px] text-[#5A6D89]">
                                  <div className="flex flex-wrap gap-1">
                                    {skill.tags.length > 0 ? (
                                      skill.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className="text-[10px] bg-[#D8EBF9] text-[#17233E] px-2 py-0.5 rounded font-mono font-medium">
                                          #{tag}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-[#8A9CB7] italic">No tags</span>
                                    )}
                                  </div>

                                  <span className="text-[10px] text-[#5A6D89] font-mono ml-2 shrink-0 font-bold">
                                    BM: {skill.benchmarkScore}%
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-full py-6 text-center text-xs text-[#5A6D89]">
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
          <div className="py-16 text-center bg-white/80 border border-[#BEDDF5] rounded-2xl shadow-sm">
            <Binary className="w-10 h-10 text-[#8A9CB7] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#17233E]">No Skill Nodes Match Your Query</h3>
            <p className="text-xs text-[#5A6D89] mt-1">Try searching for a different skill name, level, tier, or tag.</p>
          </div>
        )}

      </main>

      {/* Modal: Add Skill Node */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233E]/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/90 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#BEDDF5]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20">
                    <Binary className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#17233E]">Add New Skill Node</h2>
                    <p className="text-xs text-[#5A6D89]">Expand the platform competency taxonomy.</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-[#5A6D89] hover:text-[#17233E]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSkill} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Target Category</label>
                  <select
                    value={newSkill.categoryId}
                    onChange={(e) => setNewSkill({ ...newSkill, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
                  >
                    {taxonomy.map((c) => (
                      <option key={c.id} value={c.id}>{c.category}</option>
                    ))}
                    <option value="NEW_CATEGORY" className="text-[#1988A3] font-bold">+ Create New Category...</option>
                  </select>

                  {newSkill.categoryId === 'NEW_CATEGORY' && (
                    <div className="mt-2.5">
                      <label className="block text-xs font-semibold uppercase text-[#1988A3] mb-1">New Category Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cybersecurity & Compliance"
                        value={newSkill.customCategory}
                        onChange={(e) => setNewSkill({ ...newSkill, customCategory: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-[#1988A3]/50 rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Skill Competency Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Systems Architecture"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Competency Level</label>
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Priority Tier</label>
                    <select
                      value={newSkill.priorityTier}
                      onChange={(e) => setNewSkill({ ...newSkill, priorityTier: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Benchmark (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newSkill.benchmarkScore}
                      onChange={(e) => setNewSkill({ ...newSkill, benchmarkScore: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Keywords / Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Microservices, Docker, Event-Driven"
                    value={newSkill.tags}
                    onChange={(e) => setNewSkill({ ...newSkill, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                  />
                </div>

                <div className="pt-4 border-t border-[#BEDDF5] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-[#5A6D89] text-xs font-semibold transition-colors border border-[#BEDDF5] shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 transition-all"
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

      {/* Modal: Edit Skill Node */}
      <AnimatePresence>
        {isEditModalOpen && editingSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233E]/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-gradient-to-br from-[#D8EBF9] via-[#CBE3F7] to-[#BEDDF5] border border-white/90 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#BEDDF5]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#17233E]">Edit Skill Competency</h2>
                    <p className="text-xs text-[#5A6D89]">Modify competency parameters and category assignment.</p>
                  </div>
                </div>
                <button onClick={() => { setIsEditModalOpen(false); setEditingSkill(null); }} className="text-[#5A6D89] hover:text-[#17233E]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditSkill} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Target Category</label>
                  <select
                    value={editingSkill.categoryId}
                    onChange={(e) => setEditingSkill({ ...editingSkill, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
                  >
                    {taxonomy.map((c) => (
                      <option key={c.id} value={c.id}>{c.category}</option>
                    ))}
                    <option value="NEW_CATEGORY" className="text-[#1988A3] font-bold">+ Create New Category...</option>
                  </select>

                  {editingSkill.categoryId === 'NEW_CATEGORY' && (
                    <div className="mt-2.5">
                      <label className="block text-xs font-semibold uppercase text-[#1988A3] mb-1">New Category Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cybersecurity & Compliance"
                        value={editingSkill.customCategory}
                        onChange={(e) => setEditingSkill({ ...editingSkill, customCategory: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-[#1988A3]/50 rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Skill Competency Name</label>
                  <input
                    type="text"
                    required
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Competency Level</label>
                    <select
                      value={editingSkill.level}
                      onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Priority Tier</label>
                    <select
                      value={editingSkill.priorityTier}
                      onChange={(e) => setEditingSkill({ ...editingSkill, priorityTier: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Benchmark (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingSkill.benchmarkScore}
                      onChange={(e) => setEditingSkill({ ...editingSkill, benchmarkScore: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#5A6D89] mb-1">Keywords / Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={editingSkill.tags}
                    onChange={(e) => setEditingSkill({ ...editingSkill, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                  />
                </div>

                <div className="pt-4 border-t border-[#BEDDF5] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsEditModalOpen(false); setEditingSkill(null); }}
                    className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-[#5A6D89] text-xs font-semibold transition-colors border border-[#BEDDF5] shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 transition-all"
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
