import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Sparkles, 
  Key, 
  Sliders, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Database, 
  ShieldAlert, 
  GitFork, 
  FileCode2 
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';

const AIModelConfiguration = () => {
  // Global & Task-Specific Routing
  const [activeModel, setActiveModel] = useState('gpt-4o');
  const [taskRouting, setTaskRouting] = useState({
    skillAssessment: 'claude-3.5-sonnet',
    resumeParsing: 'gpt-4o',
    learningRecommendations: 'llama-3.1-70b'
  });

  // Parameters
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  const [guardrailsStrictness, setGuardrailsStrictness] = useState('High');
  const [isSaved, setIsSaved] = useState(false);

  // Vector DB & System Prompt
  const [systemPrompt, setSystemPrompt] = useState(
    "You are SkillPulse AI, an objective, highly accurate talent assessment engine. Ensure all skill evaluations strictly follow the global taxonomy framework without bias."
  );

  // API Keys
  const [apiKeys, setApiKeys] = useState({
    openai: 'sk-proj-••••••••••••••••••••••••••••489A',
    anthropic: 'sk-ant-••••••••••••••••••••••••••••912B',
    vectorDb: 'vector-qdrant-••••••••••••••••••••772C'
  });

  const handleSaveConfig = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 p-8 pl-80 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              AI Engine & Governance Configuration
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure multi-model orchestration, task routing, vector search embeddings, and system prompt guardrails.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveConfig}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 shrink-0"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Configurations Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save AI Engine Settings
              </>
            )}
          </motion.button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Primary Default Model</p>
            <p className="text-xl font-extrabold text-white mt-1 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {activeModel}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Vector Search Index</p>
            <p className="text-xl font-extrabold text-emerald-400 mt-1 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Qdrant Connected
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Monthly Token Usage</p>
            <p className="text-2xl font-extrabold text-indigo-400 mt-1">4.2M / 10M</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Guardrails Enforcement</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{guardrailsStrictness} Strictness</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Task-Specific Routing */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <GitFork className="w-5 h-5 text-indigo-400" />
                Task-Specific LLM Model Routing
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Route specific SkillPulse features to optimized models for maximum accuracy and cost efficiency.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-[#1E293B]/60 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Skill Assessment & Test Generation</span>
                    <span className="text-[11px] text-slate-400">High reasoning requirements</span>
                  </div>
                  <select
                    value={taskRouting.skillAssessment}
                    onChange={(e) => setTaskRouting({ ...taskRouting, skillAssessment: e.target.value })}
                    className="bg-[#0F172A] border border-slate-700 text-xs text-indigo-400 font-semibold px-3 py-1.5 rounded-lg focus:outline-none"
                  >
                    <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="gpt-4o">GPT-4o</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#1E293B]/60 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Resume Parsing & Taxonomy Mapping</span>
                    <span className="text-[11px] text-slate-400">Fast structured JSON extraction</span>
                  </div>
                  <select
                    value={taskRouting.resumeParsing}
                    onChange={(e) => setTaskRouting({ ...taskRouting, resumeParsing: e.target.value })}
                    className="bg-[#0F172A] border border-slate-700 text-xs text-indigo-400 font-semibold px-3 py-1.5 rounded-lg focus:outline-none"
                  >
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#1E293B]/60 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Learning Roadmaps & Career Chat</span>
                    <span className="text-[11px] text-slate-400">High volume, cost sensitive</span>
                  </div>
                  <select
                    value={taskRouting.learningRecommendations}
                    onChange={(e) => setTaskRouting({ ...taskRouting, learningRecommendations: e.target.value })}
                    className="bg-[#0F172A] border border-slate-700 text-xs text-indigo-400 font-semibold px-3 py-1.5 rounded-lg focus:outline-none"
                  >
                    <option value="llama-3.1-70b">Llama 3.1 70B (OpenSource)</option>
                    <option value="gpt-4o">GPT-4o</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Base System Prompt & Guardrails */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-indigo-400" />
                Base AI System Prompt Guardrails
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Global System Context</label>
                <textarea
                  rows="3"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">OpenAI API Key</label>
                  <input
                    type="password"
                    value={apiKeys.openai}
                    onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Anthropic API Key</label>
                  <input
                    type="password"
                    value={apiKeys.anthropic}
                    onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Model Parameters Sidebar */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Sliders className="w-5 h-5 text-indigo-400" />
              Hyperparameters
            </h2>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Temperature</span>
                <span className="text-indigo-400 font-mono font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Max Output Tokens */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Max Output Tokens</span>
                <span className="text-indigo-400 font-mono font-bold">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="512"
                max="8192"
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Guardrails Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">AI Output Guardrails Filter</label>
              <select
                value={guardrailsStrictness}
                onChange={(e) => setGuardrailsStrictness(e.target.value)}
                className="w-full bg-[#1E293B] border border-slate-700 text-xs text-white p-2.5 rounded-xl focus:outline-none"
              >
                <option value="Strict">Strict (Zero Hallucination Filter)</option>
                <option value="High">High (Recommended)</option>
                <option value="Moderate">Moderate</option>
              </select>
            </div>

            {/* Fallback Reroute */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Automated Fallback</p>
                <p className="text-[11px] text-slate-400">Reroute on API error 5xx</p>
              </div>

              <button
                onClick={() => setFallbackEnabled(!fallbackEnabled)}
                className={`w-12 h-6 rounded-full transition-colors p-1 ${
                  fallbackEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  fallbackEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default AIModelConfiguration;