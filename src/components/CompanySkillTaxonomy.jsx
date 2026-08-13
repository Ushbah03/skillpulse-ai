import React, { useState } from 'react';
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
  BookOpen 
} from 'lucide-react';

import CompanyAdminSidebar from './CompanyAdminSidebar';

// Initial Mock Taxonomy Framework Data
const initialSkills = [
  { id: 1, name: 'React.js Architecture', category: 'Frontend Engineering', level: 'Advanced', weightage: 'High', benchmarkScore: 85, mappedRoles: 14 },
  { id: 2, name: 'Cloud Native AWS/GCP', category: 'DevOps & Infra', level: 'Expert', weightage: 'Critical', benchmarkScore: 90, mappedRoles: 8 },
  { id: 3, name: 'UX Design Systems', category: 'Product & Design', level: 'Intermediate', weightage: 'Medium', benchmarkScore: 75, mappedRoles: 10 },
  { id: 4, name: 'Enterprise Agile Frameworks', category: 'Project Management', level: 'Intermediate', weightage: 'Medium', benchmarkScore: 70, mappedRoles: 18 },
  { id: 5, name: 'Data Pipeline Engineering', category: 'Data & Analytics', level: 'Advanced', weightage: 'High', benchmarkScore: 80, mappedRoles: 6 },
  { id: 6, name: 'Cybersecurity Compliance', category: 'DevOps & Infra', level: 'Expert', weightage: 'Critical', benchmarkScore: 95, mappedRoles: 12 },
];

const categories = ['Frontend Engineering', 'DevOps & Infra', 'Product & Design', 'Project Management', 'Data & Analytics'];
const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const weightageTiers = ['Low', 'Medium', 'High', 'Critical'];

const CompanySkillTaxonomy = () => {
  const [skills, setSkills] = useState(initialSkills);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend Engineering',
    level: 'Intermediate',
    weightage: 'Medium',
    benchmarkScore: 75,
    mappedRoles: 1
  });

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Delete Skill
  const handleDeleteSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  // Open Edit Modal
  const handleEditClick = (skill) => {
    setCurrentSkill(skill);
    setFormData({ ...skill });
    setIsEditModalOpen(true);
  };

  // Submit New Skill
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newSkill = {
      id: Date.now(),
      ...formData,
      benchmarkScore: Number(formData.benchmarkScore),
      mappedRoles: Number(formData.mappedRoles)
    };
    setSkills([newSkill, ...skills]);
    setIsAddModalOpen(false);
    resetForm();
  };

  // Submit Skill Edit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSkills(skills.map(s => s.id === currentSkill.id ? { 
      ...formData, 
      benchmarkScore: Number(formData.benchmarkScore), 
      mappedRoles: Number(formData.mappedRoles) 
    } : s));
    setIsEditModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Frontend Engineering',
      level: 'Intermediate',
      weightage: 'Medium',
      benchmarkScore: 75,
      mappedRoles: 1
    });
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
              onClick={() => alert("Skill matrix template downloaded (CSV).")}
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

        {/* Taxonomy Data Table */}
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
                            onClick={() => handleDeleteSkill(skill.id)}
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
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Proficiency</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {proficiencyLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority Tier</label>
                    <select
                      value={formData.weightage}
                      onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {weightageTiers.map(w => <option key={w} value={w}>{w}</option>)}
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
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
                  >
                    Save Skill
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
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Proficiency</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {proficiencyLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority Tier</label>
                    <select
                      value={formData.weightage}
                      onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                      className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {weightageTiers.map(w => <option key={w} value={w}>{w}</option>)}
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
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
                  >
                    Update Skill
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

export default CompanySkillTaxonomy;