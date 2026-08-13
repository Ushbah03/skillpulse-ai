import React, { useState } from 'react';
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
  BookOpen
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';

// Initial Mock Taxonomy Framework
const initialTaxonomy = [
  {
    id: 'CAT-1',
    category: 'Software Engineering & Cloud',
    description: 'Core software development, cloud computing, and DevOps engineering competencies.',
    skillsCount: 24,
    skills: [
      { name: 'React.js Architecture', code: 'SK-ENG-01', level: 'Advanced', tags: ['Frontend', 'JavaScript', 'UI'] },
      { name: 'Cloud Native & Kubernetes', code: 'SK-ENG-02', level: 'Expert', tags: ['DevOps', 'AWS', 'Containers'] },
      { name: 'Python Backend Systems', code: 'SK-ENG-03', level: 'Intermediate', tags: ['Backend', 'APIs', 'Data'] }
    ]
  },
  {
    id: 'CAT-2',
    category: 'Artificial Intelligence & Data',
    description: 'Machine learning models, prompt engineering, LLM fine-tuning, and data analytics.',
    skillsCount: 18,
    skills: [
      { name: 'Large Language Model Fine-Tuning', code: 'SK-AI-01', level: 'Expert', tags: ['LLM', 'PyTorch', 'GenAI'] },
      { name: 'Prompt Engineering & System Design', code: 'SK-AI-02', level: 'Intermediate', tags: ['AI', 'NLP', 'LangChain'] },
      { name: 'Data Pipeline Engineering', code: 'SK-AI-03', level: 'Advanced', tags: ['ETL', 'SQL', 'BigData'] }
    ]
  },
  {
    id: 'CAT-3',
    category: 'Leadership & Strategic Management',
    description: 'Cross-functional team leadership, agile governance, and business strategy.',
    skillsCount: 12,
    skills: [
      { name: 'Strategic Resource Allocation', code: 'SK-MGT-01', level: 'Advanced', tags: ['Strategy', 'Planning'] },
      { name: 'Cross-Functional Team Agile Leadership', code: 'SK-MGT-02', level: 'Intermediate', tags: ['Agile', 'Scrum'] }
    ]
  }
];

const SkillTaxonomyManagement = () => {
  const [taxonomy, setTaxonomy] = useState(initialTaxonomy);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(['CAT-1', 'CAT-2']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // New Skill Form State
  const [newSkill, setNewSkill] = useState({
    categoryId: 'CAT-1',
    name: '',
    code: '',
    level: 'Intermediate',
    tags: ''
  });

  // Toggle Category Accordion
  const toggleCategory = (id) => {
    setExpandedCategories(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  // Add Skill Handler
  const handleAddSkill = (e) => {
    e.preventDefault();
    const tagArray = newSkill.tags.split(',').map(t => t.trim()).filter(Boolean);
    const generatedCode = newSkill.code || `SK-GEN-${Math.floor(100 + Math.random() * 900)}`;

    setTaxonomy(taxonomy.map(cat => {
      if (cat.id === newSkill.categoryId) {
        return {
          ...cat,
          skillsCount: cat.skillsCount + 1,
          skills: [
            ...cat.skills,
            {
              name: newSkill.name,
              code: generatedCode,
              level: newSkill.level,
              tags: tagArray.length ? tagArray : ['AI-Tagged']
            }
          ]
        };
      }
      return cat;
    }));

    setIsModalOpen(false);
    setNewSkill({ categoryId: 'CAT-1', name: '', code: '', level: 'Intermediate', tags: '' });
  };

  // Trigger AI Auto-Generate Suggestion Simulation
  const handleAiAutoGenerate = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setIsAiGenerating(false);
      alert('AI Taxonomy Sync Complete: Automatically categorized 14 new emerging industry skills.');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Skill Taxonomy Engine
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
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">1,420+</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Taxonomy Status</p>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Fully Synchronized
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl mb-6 flex items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search skill nodes, codes, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E293B] text-slate-200 border border-slate-700/60 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Taxonomy Categories Accordion Tree */}
        <div className="space-y-4">
          {taxonomy.map((cat) => {
            const isExpanded = expandedCategories.includes(cat.id);
            const filteredSkills = cat.skills.filter(s => 
              s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
              s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
            );

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
                          {cat.skills.length} skills
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
                      {filteredSkills.length > 0 ? (
                        filteredSkills.map((skill, idx) => (
                          <div 
                            key={idx} 
                            className="p-4 rounded-xl bg-[#1E293B]/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                  {skill.code}
                                </span>
                                <span className="text-[10px] font-semibold uppercase text-slate-400">
                                  {skill.level}
                                </span>
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

      </main>

      {/* Modal: Add Skill Node */}
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
                  </select>
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
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    Insert Skill Node
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