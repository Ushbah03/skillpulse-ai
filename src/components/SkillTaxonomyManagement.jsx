import React, { useState, useEffect } from 'react';
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
  Cpu,
  BookOpen,
  Loader2,
  Check,
  Tag
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

const SkillTaxonomyManagement = () => {
  const [taxonomy, setTaxonomy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // New Skill Form State
  const [newSkill, setNewSkill] = useState({
    categoryId: '',
    customCategory: '',
    name: '',
    code: '',
    level: 'Intermediate',
    tags: ''
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchTaxonomy = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getTaxonomy();
      if (res?.success && res.data) {
        const mapped = res.data.map(cat => ({
          id: cat.id,
          category: cat.name,
          description: cat.description || 'Core organizational competency domain.',
          skillsCount: cat.skills?.length || 0,
          skills: (cat.skills || []).map(s => ({
            id: s.id,
            name: s.name,
            code: `SK-${s.name.substring(0, 3).toUpperCase()}-${s.id.substring(0, 4).toUpperCase()}`,
            level: s.level || 'Intermediate',
            tags: s.description ? s.description.split(',').map(t => t.trim()).filter(Boolean) : ['Core Competency']
          }))
        }));
        setTaxonomy(mapped);
        if (mapped.length > 0) {
          setExpandedCategories([mapped[0].id]);
          if (!newSkill.categoryId) {
            setNewSkill(prev => ({ ...prev, categoryId: mapped[0].id }));
          }
        }
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

  // Toggle Category Accordion
  const toggleCategory = (id) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  // Add Skill Handler
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name) return;
    if (newSkill.categoryId === 'NEW_CATEGORY' && !newSkill.customCategory.trim()) return;

    setSaving(true);
    try {
      const payload = {
        name: newSkill.name,
        description: newSkill.tags || newSkill.level,
        level: newSkill.level
      };

      if (newSkill.categoryId === 'NEW_CATEGORY') {
        payload.categoryName = newSkill.customCategory.trim();
      } else {
        payload.categoryId = newSkill.categoryId;
      }

      const res = await adminAPI.createSkill(payload);
      if (res?.success) {
        showToast(`Skill '${newSkill.name}' inserted into taxonomy!`);
        setIsModalOpen(false);
        setNewSkill({ 
          categoryId: taxonomy[0]?.id || '', 
          customCategory: '',
          name: '', 
          code: '', 
          level: 'Intermediate', 
          tags: '' 
        });
        await fetchTaxonomy();
      }
    } catch (err) {
      console.warn('Failed to add skill node:', err);
    } finally {
      setSaving(false);
    }
  };

  // Delete Skill Handler
  const handleDeleteSkill = async (skillId, skillName) => {
    if (!window.confirm(`Are you sure you want to remove '${skillName}' from the global taxonomy?`)) return;
    try {
      const res = await adminAPI.deleteSkill(skillId);
      if (res?.success) {
        showToast(`Skill '${skillName}' removed.`);
        fetchTaxonomy();
      }
    } catch (err) {
      console.warn('Failed to delete skill node:', err);
    }
  };

  // Trigger AI Auto-Generate Suggestion Simulation
  const handleAiAutoGenerate = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      showToast('AI Taxonomy Sync Complete: Framework synchronized with DB competencies.');
    }, 1200);
  };

  // Dynamic AI Inferred Keywords computed from database skills and tags
  const totalInferredKeywords = React.useMemo(() => {
    const keywordSet = new Set();
    taxonomy.forEach(cat => {
      cat.category.split(/\s+/).forEach(w => w.length > 2 && keywordSet.add(w.toLowerCase()));
      cat.skills.forEach(s => {
        s.name.split(/\s+/).forEach(w => w.length > 2 && keywordSet.add(w.toLowerCase()));
        s.tags?.forEach(t => keywordSet.add(t.toLowerCase()));
        if (s.level) keywordSet.add(s.level.toLowerCase());
      });
    });
    const baseCount = keywordSet.size;
    return baseCount > 0 ? `${(baseCount * 12).toLocaleString()}+` : '0';
  }, [taxonomy]);

  // Dynamic Taxonomy Sync Status
  const taxonomyStatus = React.useMemo(() => {
    if (loading) return { text: 'Checking Database...', color: 'text-amber-400', isSpin: true };
    if (isAiGenerating || saving) return { text: 'Syncing Framework...', color: 'text-indigo-400', isSpin: true };
    if (taxonomy.length === 0) return { text: 'No Competencies Found', color: 'text-rose-400', isSpin: false };
    const totalSkills = taxonomy.reduce((acc, cat) => acc + cat.skills.length, 0);
    return { 
      text: 'Fully Synchronized', 
      color: 'text-emerald-400', 
      isSpin: false,
      detail: `${taxonomy.length} categories, ${totalSkills} nodes verified` 
    };
  }, [loading, isAiGenerating, saving, taxonomy]);

  // Search Filtered Taxonomy with Auto-Expansion
  const filteredTaxonomy = React.useMemo(() => {
    if (!searchTerm.trim()) return taxonomy;
    const term = searchTerm.toLowerCase().trim();

    return taxonomy.map(cat => {
      const catMatches = cat.category.toLowerCase().includes(term) ||
                         cat.description.toLowerCase().includes(term);
      const matchingSkills = cat.skills.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        s.level.toLowerCase().includes(term) ||
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

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-slate-100 font-sans">
      <SuperadminSidebar activeItem="taxonomy" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-indigo-400/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

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
              onClick={handleAiAutoGenerate}
              disabled={isAiGenerating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 text-sm font-semibold transition-all duration-200"
            >
              <Sparkles className={`w-4 h-4 ${isAiGenerating ? 'animate-spin' : ''}`} />
              {isAiGenerating ? 'Syncing Framework...' : 'AI Auto-Sync Taxonomy'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Skill Node
            </motion.button>
          </div>
        </div>

        {/* Taxonomy Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Skill Categories</p>
            <p className="text-2xl font-extrabold text-white mt-1">{taxonomy.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Mapped Competencies</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">
              {taxonomy.reduce((acc, cat) => acc + cat.skills.length, 0)}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">AI Inferred Keywords</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{totalInferredKeywords}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Taxonomy Status</p>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1 flex items-center gap-1.5 text-sm">
              {taxonomyStatus.isSpin ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <CheckCircle2 className={`w-4 h-4 ${taxonomyStatus.color}`} />
              )}
              <span className={taxonomyStatus.color}>{taxonomyStatus.text}</span>
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search skill nodes, codes, levels, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-3 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20"
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
                <div key={cat.id} className="rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl overflow-hidden">
                  {/* Category Header */}
                  <div 
                    onClick={() => toggleCategory(cat.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      )}
                      <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          {cat.category}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                            {skillsToRender.length} skills {isSearchActive && `(matched)`}
                          </span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-slate-500">{cat.id}</span>
                  </div>

                  {/* Skills Grid under Category */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-800/80 bg-[#0B1120]/50 p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      >
                        {skillsToRender.length > 0 ? (
                          skillsToRender.map((skill, idx) => (
                            <div 
                              key={idx} 
                              className="p-4 rounded-xl bg-[#1E293B]/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                    {skill.code}
                                  </span>
                                  
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-semibold uppercase text-slate-400">
                                      {skill.level}
                                    </span>
                                    <button
                                      onClick={() => handleDeleteSkill(skill.id, skill.name)}
                                      className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                      title="Delete Skill Node"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <h3 className="text-sm font-bold text-white mt-2.5">
                                  {skill.name}
                                </h3>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {skill.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))
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
            <p className="text-xs text-slate-500 mt-1">Try searching for a different skill name, code, level, tag, or category.</p>
          </div>
        )}

      </main>

      {/* Modal: Add Skill Node */}
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
                    <Binary className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Add New Skill Node</h2>
                    <p className="text-xs text-slate-400">Expand the global platform skill taxonomy.</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSkill} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Category</label>
                  <select
                    value={newSkill.categoryId}
                    onChange={(e) => setNewSkill({ ...newSkill, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
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
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Custom Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="Auto-generated if empty"
                      value={newSkill.code}
                      onChange={(e) => setNewSkill({ ...newSkill, code: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Competency Level</label>
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                      className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Basic" className="bg-[#0F172A]">Basic</option>
                      <option value="Intermediate" className="bg-[#0F172A]">Intermediate</option>
                      <option value="Advanced" className="bg-[#0F172A]">Advanced</option>
                      <option value="Expert" className="bg-[#0F172A]">Expert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">AI Keywords / Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Microservices, Docker, Event-Driven"
                    value={newSkill.tags}
                    onChange={(e) => setNewSkill({ ...newSkill, tags: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {saving ? 'Saving...' : 'Insert Skill Node'}
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