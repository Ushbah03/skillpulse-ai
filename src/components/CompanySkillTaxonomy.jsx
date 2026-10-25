import React, { useState, useEffect, useMemo } from 'react';
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
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';
import SkillPulseLoader from './SkillPulseLoader';
import { adminAPI } from '../services/api';

const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const weightageTiers = ['Low', 'Medium', 'High', 'Critical'];

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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  
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
    category: '',
    level: 'Intermediate',
    weightage: 'Medium',
    benchmarkScore: 75,
    mappedRoles: 0
  });

  const fetchTaxonomy = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getTaxonomy();
      if (res?.success && Array.isArray(res.data)) {
        const cats = res.data;
        const catNames = cats.map(c => c.name).filter(Boolean).sort();
        setCategories(catNames);

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
                level: skill.proficiencyLevel || (userSkillCount > 0 ? PROFICIENCY_LABEL(computedScore) : 'Beginner'),
                weightage: skill.priorityTier || (gapCount > 0 ? WEIGHTAGE_LABEL(gapCount) : 'Low'),
                benchmarkScore,
                mappedRoles: userSkillCount
              });
            }
          });
        });
        setSkills(mapped);
        if (catNames.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: catNames[0] }));
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

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [skills, searchTerm, selectedCategory]);

  // Reset to first page on search or category filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, itemsPerPage]);

  const totalItems = filteredSkills.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure currentPage is within bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSkills.slice(start, start + itemsPerPage);
  }, [filteredSkills, currentPage, itemsPerPage]);

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
      console.warn('Failed to delete skill node:', err);
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
      console.warn('Failed to create skill node:', err);
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
      console.warn('Failed to update skill node:', err);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setShowCustomCategory(false);
    setFormData({
      name: '',
      category: categories[0] || '',
      level: 'Intermediate',
      weightage: 'Medium',
      benchmarkScore: 75,
      mappedRoles: 0
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

      <main className="flex-1 min-w-0 ml-0 lg:ml-64 px-3.5 sm:px-6 md:px-8 pt-20 lg:pt-8 pb-10 w-full max-w-full overflow-x-hidden relative z-10 space-y-6 sm:space-y-8">
        
        {/* Page Header */}
        <header className="bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/85 shadow-xl shadow-[#1B3154]/6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm shrink-0">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E]">
                Company Skill <span className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] bg-clip-text text-transparent">Taxonomy</span>
              </h1>
            </div>
            <p className="text-[#8A9CB7] text-xs md:text-sm font-medium mt-1.5 ml-0 sm:ml-12">
              Configure target competency matrices, proficiency benchmarks, and organizational skill weightages.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsExportModalOpen(true)}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl bg-white/80 hover:bg-white text-[#17233E] border border-white/85 text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#1988A3]" />
              <span>Export Framework</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { resetForm(); setIsAddModalOpen(true); }}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Skill</span>
            </motion.button>
          </div>
        </header>

        {/* Live Framework Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Total Skills</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#1988A3] shadow-sm">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#17233E] mt-2 sm:mt-3 tracking-tight">{skills.length}</p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1988A3]"></span> Configured competencies
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Domain Categories</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-[#11C6DE] shadow-sm">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#17233E] mt-2 sm:mt-3 tracking-tight">{categories.length}</p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#11C6DE]"></span> Taxonomy domains
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Strategic Priority</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-amber-600 shadow-sm">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2 sm:mt-3 tracking-tight">
              {skills.filter(s => ['High', 'Critical'].includes(s.weightage)).length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> High & critical tier
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 relative overflow-hidden group hover:border-[#1988A3]/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9CB7] uppercase tracking-wider">Workforce Mapped</span>
              <div className="p-2 rounded-2xl bg-white/70 border border-white/85 text-emerald-600 shadow-sm">
                <Sliders className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2 sm:mt-3 tracking-tight">
              {skills.filter(s => s.mappedRoles > 0).length}
            </p>
            <p className="text-[11px] text-[#8A9CB7] font-semibold mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Skills held by employees
            </p>
          </motion.div>
        </div>

        {/* Search & Filter Controls */}
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
              placeholder="Search taxonomy by skill name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 text-[#17233E] border border-white/90 rounded-2xl text-sm focus:outline-none focus:border-[#1988A3] transition-colors placeholder:text-[#8A9CB7] shadow-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
            <span className="text-xs font-bold text-[#8A9CB7] bg-white/60 px-3 py-1.5 rounded-2xl border border-white/80">
              Showing <span className="text-[#17233E] font-extrabold">{filteredSkills.length}</span> of {skills.length}
            </span>

            <div className="flex items-center gap-2 bg-white/80 border border-white/90 px-3 py-1.5 rounded-2xl text-xs text-[#17233E] shadow-sm">
              <Filter className="w-3.5 h-3.5 text-[#1988A3]" />
              <span className="font-semibold">Category:</span>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-[#17233E] font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Domains</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <SkillPulseLoader message="Querying Enterprise Skill Taxonomy..." fullScreen={false} />
        ) : (
        /* Taxonomy Data Table */
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
                  <th className="px-6 py-4">Skill Title</th>
                  <th className="px-6 py-4">Domain Category</th>
                  <th className="px-6 py-4">Required Level</th>
                  <th className="px-6 py-4">Strategic Priority</th>
                  <th className="px-6 py-4">Benchmark Target</th>
                  <th className="px-6 py-4">Mapped Roles</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {paginatedSkills.length > 0 ? (
                  paginatedSkills.map((skill, idx) => (
                    <motion.tr 
                      key={skill.id} 
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(0.25, idx * 0.015) }}
                      className="hover:bg-white/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white/70 border border-white/85 text-[#1988A3] group-hover:scale-105 transition-all shrink-0 shadow-xs">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-[#17233E] group-hover:text-[#1988A3] transition-colors">{skill.name}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-semibold text-[#17233E]">
                        <span className="px-3 py-1 rounded-xl bg-white/70 border border-white/85 shadow-xs">
                          {skill.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-xl bg-white/70 border border-white/85 text-[#17233E] shadow-xs">
                          {skill.level}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl border shadow-xs ${
                          skill.weightage === 'Critical' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          skill.weightage === 'High' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}>
                          {skill.weightage === 'Critical' && (
                            <span className="relative flex h-2 w-2 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                            </span>
                          )}
                          {skill.weightage === 'High' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                          )}
                          {skill.weightage !== 'Critical' && skill.weightage !== 'High' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                          )}
                          {skill.weightage}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-[#1B3154]/10 h-2.5 rounded-full overflow-hidden p-0.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.benchmarkScore}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="bg-gradient-to-r from-[#1988A3] to-[#11C6DE] h-full rounded-full" 
                            />
                          </div>
                          <span className="text-xs font-extrabold text-[#17233E] font-mono">{skill.benchmarkScore}%</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono text-[#8A9CB7] font-semibold">
                        <span className="px-2.5 py-1 rounded-xl bg-white/60 border border-white/80">
                          {skill.mappedRoles} active {skill.mappedRoles === 1 ? 'employee' : 'employees'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleEditClick(skill)}
                            className="p-2 rounded-xl bg-white/80 hover:bg-white text-[#1988A3] border border-white/85 shadow-sm transition-all cursor-pointer"
                            title="Edit Skill"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleDeleteClick(skill)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 shadow-sm transition-all cursor-pointer"
                            title="Remove Skill"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-[#8A9CB7] font-medium">
                      No taxonomy skills match the specified criteria.
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
                <span className="font-extrabold text-[#17233E]">{totalItems}</span> {totalItems === 1 ? 'skill' : 'skills'}
                {totalItems !== skills.length && ` (filtered from ${skills.length} total)`}
              </span>

              <div className="flex items-center gap-1.5 ml-0 sm:ml-2">
                <span className="text-[11px] text-[#8A9CB7] font-bold">Per page:</span>
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
        </motion.div>
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
              className="w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#17233E] to-[#121E33] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Add Custom Skill to Matrix</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-[#8A9CB7] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Skill Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kubernetes Cluster Mgmt"
                    className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#11C6DE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Domain Category</label>
                  {showCustomCategory ? (
                    <div className="relative">
                      <input type="text" required value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Type custom category..."
                        className="w-full px-3.5 py-2.5 pr-8 bg-white/10 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE]" autoFocus />
                      <button type="button" onClick={() => { setShowCustomCategory(false); setFormData({ ...formData, category: categories[0] || 'Technical' }); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9CB7] hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
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
                      className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE] cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option disabled>──────────</option>
                      <option value="__CUSTOM__">➕ Add Custom Category...</option>
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Target Proficiency</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE] cursor-pointer"
                    >
                      {proficiencyLevels.map(l => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Priority Tier</label>
                    <select
                      value={formData.weightage}
                      onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE] cursor-pointer"
                    >
                      {weightageTiers.map(w => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">
                    Target Benchmark Score ({formData.benchmarkScore}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formData.benchmarkScore}
                    onChange={(e) => setFormData({ ...formData, benchmarkScore: e.target.value })}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#11C6DE]"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] disabled:opacity-50 text-white text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 cursor-pointer"
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
              className="w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#17233E] to-[#121E33] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Edit Taxonomy Skill</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-[#8A9CB7] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Skill Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/10 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Domain Category</label>
                  {showCustomCategory ? (
                    <div className="relative">
                      <input type="text" required value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Type custom category..."
                        className="w-full px-3.5 py-2.5 pr-8 bg-white/10 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE]" autoFocus />
                      <button type="button" onClick={() => { setShowCustomCategory(false); setFormData({ ...formData, category: currentSkill?.category || categories[0] || 'Technical' }); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9CB7] hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
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
                      className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE] cursor-pointer"
                    >
                      {!categories.includes(formData.category) && <option value={formData.category}>{formData.category}</option>}
                      {categories.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option disabled>──────────</option>
                      <option value="__CUSTOM__">➕ Add Custom Category...</option>
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Target Proficiency</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE] cursor-pointer"
                    >
                      {proficiencyLevels.map(l => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">Priority Tier</label>
                    <select
                      value={formData.weightage}
                      onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                      className="w-full px-3 py-2.5 bg-[#1B3154] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#11C6DE] cursor-pointer"
                    >
                      {weightageTiers.map(w => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#8A9CB7] mb-1">
                    Target Benchmark Score ({formData.benchmarkScore}%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formData.benchmarkScore}
                    onChange={(e) => setFormData({ ...formData, benchmarkScore: e.target.value })}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#11C6DE]"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] disabled:opacity-50 text-white text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#1988A3]/25 cursor-pointer"
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
              className="w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#17233E] to-[#121E33] border border-rose-500/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-center relative font-sans text-white"
            >
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="absolute top-4 right-4 text-[#8A9CB7] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/10">
                <Trash2 className="w-7 h-7" />
              </div>

              <h2 className="text-xl font-bold text-white mb-2">Delete Skill Node?</h2>
              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                Are you sure you want to permanently remove <span className="font-bold text-rose-400">"{skillToDelete?.name}"</span> from your organization taxonomy? This will remove associated competency benchmarks.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteSkill}
                  disabled={deleting}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
              className="w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#17233E] to-[#121E33] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-center relative font-sans text-white"
            >
              <button 
                onClick={() => setIsExportModalOpen(false)} 
                className="absolute top-4 right-4 text-[#8A9CB7] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 text-[#11C6DE] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1988A3]/10">
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
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#157289] hover:to-[#0EB3C9] text-white text-sm font-bold shadow-lg shadow-[#1988A3]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Export as CSV (.csv)
                </button>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#11C6DE]" />
                  Export as JSON (.json)
                </button>
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-[#8A9CB7] hover:text-white transition-colors mt-1 cursor-pointer"
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
