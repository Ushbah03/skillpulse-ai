import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Sparkles, 
  Key, 
  Sliders, 
  Save, 
  CheckCircle2, 
  Database, 
  ShieldAlert, 
  GitFork, 
  FileCode2,
  Loader2,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
  Bot,
  Zap,
  Globe
} from 'lucide-react';

import SuperadminSidebar from './SuperadminSidebar';
import { adminAPI } from '../services/api';

const AIModelConfiguration = () => {
  const [configId, setConfigId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [envStatus, setEnvStatus] = useState({ 
    groqSecured: false, 
    openAiSecured: false, 
    anthropicSecured: false, 
    geminiSecured: false,
    openRouterSecured: false
  });
  const [hasRecord, setHasRecord] = useState(false);

  // Individual Show/Hide secret toggles
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);
  const [showClaudeKey, setShowClaudeKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);

  // Editable API Keys
  const [groqApiKey, setGroqApiKey] = useState('');
  const [openAiApiKey, setOpenAiApiKey] = useState('');
  const [anthropicApiKey, setAnthropicApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');

  // Primary Model DB Fields
  const [activeModel, setActiveModel] = useState('groq/compound');
  const [provider, setProvider] = useState('Groq LPU Cloud (Free Tier)');
  const [version, setVersion] = useState('1.0.0');
  const [contextWindow, setContextWindow] = useState(128000);
  const [topP, setTopP] = useState(0.95);
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [isActive, setIsActive] = useState(true);

  // Hyperparameters & Task Routing
  const [taskRouting, setTaskRouting] = useState({
    skillAssessment: 'groq/compound',
    resumeParsing: 'groq/compound',
    learningRecommendations: 'groq/compound'
  });
  const [systemPrompt, setSystemPrompt] = useState(
    'You are SkillPulse AI, an objective, highly accurate talent assessment engine. Ensure all skill evaluations strictly follow the global taxonomy framework without bias.'
  );
  const [guardrailsStrictness, setGuardrailsStrictness] = useState('High');
  const [fallbackEnabled, setFallbackEnabled] = useState(true);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAIConfigs();
      if (res?.envStatus) {
        setEnvStatus(res.envStatus);
      }
      if (res?.activeKeys) {
        if (res.activeKeys.groqApiKey) setGroqApiKey(res.activeKeys.groqApiKey);
        if (res.activeKeys.openAiApiKey) setOpenAiApiKey(res.activeKeys.openAiApiKey);
        if (res.activeKeys.anthropicApiKey) setAnthropicApiKey(res.activeKeys.anthropicApiKey);
        if (res.activeKeys.geminiApiKey) setGeminiApiKey(res.activeKeys.geminiApiKey);
        if (res.activeKeys.openRouterApiKey) setOpenRouterApiKey(res.activeKeys.openRouterApiKey);
      }
      if (res?.success && res.data && res.data.length > 0) {
        const active = res.data.find(c => c.isActive) || res.data[0];
        setConfigId(active.id);
        setActiveModel(active.modelName || 'groq/compound');
        setProvider(active.provider || 'Groq LPU Cloud (Free Tier)');
        setVersion(active.version || '1.0.0');
        setTemperature(active.temperature ?? 0.2);
        setMaxTokens(active.maxTokens ?? 4096);
        setTopP(active.topP ?? 0.95);
        setContextWindow(active.contextWindow ?? 128000);
        setIsActive(active.isActive ?? true);
        setLastUpdated(active.updatedAt ? new Date(active.updatedAt).toLocaleString() : '');
        setHasRecord(true);

        // Unpack hyperparams from database JSON
        if (active.hyperparams && typeof active.hyperparams === 'object') {
          if (active.hyperparams.taskRouting) setTaskRouting(active.hyperparams.taskRouting);
          if (active.hyperparams.systemPrompt) setSystemPrompt(active.hyperparams.systemPrompt);
          if (active.hyperparams.guardrailsStrictness) setGuardrailsStrictness(active.hyperparams.guardrailsStrictness);
          if (active.hyperparams.fallbackEnabled !== undefined) setFallbackEnabled(active.hyperparams.fallbackEnabled);
        }
      } else {
        setHasRecord(false);
        setConfigId(null);
      }
    } catch (err) {
      console.warn('Failed to load AI config from database:', err);
      setHasRecord(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const hyperparamsPayload = {
        taskRouting,
        systemPrompt,
        guardrailsStrictness,
        fallbackEnabled,
        gapDetectionSensitivity: 'strict',
        skillInferenceThreshold: 0.75
      };

      const payload = {
        modelName: activeModel || 'groq/compound',
        provider: provider || 'Groq LPU Cloud (Free Tier)',
        version: version || '1.0.0',
        temperature: parseFloat(temperature) || 0.2,
        maxTokens: parseInt(maxTokens) || 4096,
        topP: parseFloat(topP) || 0.95,
        contextWindow: parseInt(contextWindow) || 128000,
        isActive: true,
        groqApiKey: groqApiKey.trim() || undefined,
        openAiApiKey: openAiApiKey.trim() || undefined,
        anthropicApiKey: anthropicApiKey.trim() || undefined,
        geminiApiKey: geminiApiKey.trim() || undefined,
        openRouterApiKey: openRouterApiKey.trim() || undefined,
        hyperparams: hyperparamsPayload
      };

      let res;
      if (configId) {
        res = await adminAPI.updateAIConfig(configId, payload);
      } else {
        res = await adminAPI.createAIConfig(payload);
      }

      if (res?.success && res.data) {
        setConfigId(res.data.id);
        setHasRecord(true);
        setIsSaved(true);
        setLastUpdated(new Date().toLocaleString());
        
        // Re-fetch to update active badges
        await fetchConfig();
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (err) {
      console.warn('Failed to save AI model configuration in database:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120]">
      <SuperadminSidebar />

      <main className="flex-1 text-slate-100 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-indigo-400" />
              AI Engine & Provider Governance Hub
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Configure Multi-Provider AI Keys (Groq, OpenAI, Claude, Gemini), model routing, guardrails, and context parameters.
            </p>
            {lastUpdated && (
              <p className="text-[11px] text-slate-500 font-mono mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Database Record Last Synchronized: {lastUpdated}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveConfig}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all shrink-0 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating Engine Config...
              </>
            ) : isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Settings Saved & Live
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save AI Engine Settings
              </>
            )}
          </motion.button>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0F172A] border border-slate-800/80 rounded-2xl mb-8">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-400 mt-3">Loading AI Engine Configuration from PostgreSQL...</p>
          </div>
        ) : (
        <>
        {/* Active Engine Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Primary Active Model</p>
            <p className="text-lg font-extrabold text-white mt-1 uppercase flex items-center gap-2 truncate">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{activeModel || 'groq/compound'}</span>
            </p>
            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono border ${
              (envStatus.groqSecured || envStatus.openAiSecured || envStatus.anthropicSecured || envStatus.geminiSecured)
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {(envStatus.groqSecured || envStatus.openAiSecured || envStatus.anthropicSecured || envStatus.geminiSecured) ? 'Active in DB' : 'Pending Key'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Provider Engine</p>
            <p className="text-base font-extrabold text-indigo-300 mt-1 flex items-center gap-2 truncate">
              <Database className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{provider || 'Groq LPU Cloud'}</span>
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
              v{version || '1.0.0'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Context Window Limit</p>
            <p className="text-2xl font-extrabold text-white mt-1">
              {contextWindow.toLocaleString()} <span className="text-xs font-normal text-slate-400">Tokens</span>
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
              128k Embeddings
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
            <p className="text-xs text-slate-400 font-medium">Temperature / Top-P</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              {temperature} <span className="text-xs font-normal text-slate-400">/ Top-P {topP}</span>
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Low Hallucination
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* FULL MULTI-PROVIDER API KEYS SECTION */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-indigo-400" />
                    Multi-AI Provider API Credentials & Keys
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter API secret keys for any provider. The system will auto-verify and enable live model switching.
                  </p>
                </div>
              </div>

              {/* 1. GROQ API KEY */}
              <div className="p-4 rounded-xl bg-[#1E293B]/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white font-mono">GROQ_API_KEY</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20">
                      100% Free Engine
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold ${envStatus.groqSecured ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {envStatus.groqSecured ? '✓ Backend Verified' : '⚠ Key Required'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showGroqKey ? 'text' : 'password'}
                    placeholder="Enter Groq API Key (starts with gsk_...)"
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGroqKey(!showGroqKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2. OPENAI API KEY */}
              <div className="p-4 rounded-xl bg-[#1E293B]/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-white font-mono">OPENAI_API_KEY</span>
                    <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-mono border border-sky-500/20">
                      GPT-4o & GPT-4o Mini
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold ${envStatus.openAiSecured ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {envStatus.openAiSecured ? '✓ Backend Verified' : 'Optional / Standby'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showOpenAiKey ? 'text' : 'password'}
                    placeholder="Enter OpenAI API Key (starts with sk-...)"
                    value={openAiApiKey}
                    onChange={(e) => setOpenAiApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showOpenAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3. ANTHROPIC CLAUDE API KEY */}
              <div className="p-4 rounded-xl bg-[#1E293B]/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white font-mono">ANTHROPIC_API_KEY</span>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono border border-purple-500/20">
                      Claude 3.5 Sonnet
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold ${envStatus.anthropicSecured ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {envStatus.anthropicSecured ? '✓ Backend Verified' : 'Optional / Standby'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showClaudeKey ? 'text' : 'password'}
                    placeholder="Enter Anthropic Claude Key (starts with sk-ant-...)"
                    value={anthropicApiKey}
                    onChange={(e) => setAnthropicApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowClaudeKey(!showClaudeKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showClaudeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4. GOOGLE GEMINI API KEY */}
              <div className="p-4 rounded-xl bg-[#1E293B]/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white font-mono">GEMINI_API_KEY</span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono border border-blue-500/20">
                      Gemini 1.5 Pro & Flash
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold ${envStatus.geminiSecured ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {envStatus.geminiSecured ? '✓ Backend Verified' : 'Optional / Standby'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showGeminiKey ? 'text' : 'password'}
                    placeholder="Enter Google Gemini Key (starts with AIzaSy...)"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#1E293B]/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-bold text-white font-mono">OPENROUTER_API_KEY</span>
                    <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded font-mono border border-orange-500/20">
                      Backup & Open Models
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold ${envStatus.openRouterSecured ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {envStatus.openRouterSecured ? '✓ Backend Verified' : 'Optional / Standby'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showOpenRouterKey ? 'text' : 'password'}
                    placeholder="Enter OpenRouter Key (starts with sk-or-v1-...)"
                    value={openRouterApiKey}
                    onChange={(e) => setOpenRouterApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-[#0F172A] border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showOpenRouterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Task-Specific Routing */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <GitFork className="w-5 h-5 text-indigo-400" />
                Task-Specific LLM Model Routing
              </h2>
              <p className="text-xs text-slate-400 mb-5">
                Route specific SkillPulse features to any of your configured AI models across providers.
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
                    className="bg-[#0F172A] border border-slate-700 text-xs text-indigo-400 font-semibold px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="groq/compound" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (groq/compound - Free 🟢)' : 'Groq LPU (🔒 Key Required)'}
                    </option>
                    <option value="meta-llama/llama-3.3-70b-instruct:free" disabled={!envStatus.openRouterSecured}>
                      {envStatus.openRouterSecured ? 'OpenRouter Llama 3.3 70B (Free 🟢)' : 'OpenRouter Llama 3.3 (🔒 Key Required)'}
                    </option>
                    <option value="deepseek/deepseek-r1:free" disabled={!envStatus.openRouterSecured}>
                      {envStatus.openRouterSecured ? 'OpenRouter DeepSeek R1 (Free 🟢)' : 'OpenRouter DeepSeek R1 (🔒 Key Required)'}
                    </option>
                    <option value="gpt-4o" disabled={!envStatus.openAiSecured}>
                      {envStatus.openAiSecured ? 'OpenAI (gpt-4o 🟢)' : 'OpenAI (gpt-4o - 🔒 Key Required)'}
                    </option>
                    <option value="claude-3-5-sonnet" disabled={!envStatus.anthropicSecured}>
                      {envStatus.anthropicSecured ? 'Anthropic (claude-3-5-sonnet 🟢)' : 'Anthropic (claude-3-5-sonnet - 🔒 Key Required)'}
                    </option>
                    <option value="gemini-1.5-pro" disabled={!envStatus.geminiSecured}>
                      {envStatus.geminiSecured ? 'Google (gemini-1.5-pro 🟢)' : 'Google (gemini-1.5-pro - 🔒 Key Required)'}
                    </option>
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
                    className="bg-[#0F172A] border border-slate-700 text-xs text-indigo-400 font-semibold px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="groq/compound" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (groq/compound - Free 🟢)' : 'Groq LPU (🔒 Key Required)'}
                    </option>
                    <option value="meta-llama/llama-3.3-70b-instruct:free" disabled={!envStatus.openRouterSecured}>
                      {envStatus.openRouterSecured ? 'OpenRouter Llama 3.3 70B (Free 🟢)' : 'OpenRouter Llama 3.3 (🔒 Key Required)'}
                    </option>
                    <option value="gpt-4o" disabled={!envStatus.openAiSecured}>
                      {envStatus.openAiSecured ? 'OpenAI (gpt-4o 🟢)' : 'OpenAI (gpt-4o - 🔒 Key Required)'}
                    </option>
                    <option value="claude-3-5-sonnet" disabled={!envStatus.anthropicSecured}>
                      {envStatus.anthropicSecured ? 'Anthropic (claude-3-5-sonnet 🟢)' : 'Anthropic (claude-3-5-sonnet - 🔒 Key Required)'}
                    </option>
                    <option value="gemini-1.5-flash" disabled={!envStatus.geminiSecured}>
                      {envStatus.geminiSecured ? 'Google (gemini-1.5-flash 🟢)' : 'Google (gemini-1.5-flash - 🔒 Key Required)'}
                    </option>
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
                    className="bg-[#0F172A] border border-slate-700 text-xs text-indigo-400 font-semibold px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="groq/compound" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (groq/compound - Free 🟢)' : 'Groq LPU (🔒 Key Required)'}
                    </option>
                    <option value="qwen/qwen-2.5-72b-instruct:free" disabled={!envStatus.openRouterSecured}>
                      {envStatus.openRouterSecured ? 'OpenRouter Qwen 2.5 72B (Free 🟢)' : 'OpenRouter Qwen 2.5 (🔒 Key Required)'}
                    </option>
                    <option value="gpt-4o-mini" disabled={!envStatus.openAiSecured}>
                      {envStatus.openAiSecured ? 'OpenAI (gpt-4o-mini 🟢)' : 'OpenAI (gpt-4o-mini - 🔒 Key Required)'}
                    </option>
                    <option value="claude-3-haiku" disabled={!envStatus.anthropicSecured}>
                      {envStatus.anthropicSecured ? 'Anthropic (claude-3-haiku 🟢)' : 'Anthropic (claude-3-haiku - 🔒 Key Required)'}
                    </option>
                    <option value="gemini-1.5-flash" disabled={!envStatus.geminiSecured}>
                      {envStatus.geminiSecured ? 'Google (gemini-1.5-flash 🟢)' : 'Google (gemini-1.5-flash - 🔒 Key Required)'}
                    </option>
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
            </div>

          </div>

          {/* Model Parameters Sidebar */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-xl space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <Sliders className="w-5 h-5 text-indigo-400" />
              Engine Hyperparameters
            </h2>

            {/* Primary Model Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Model Name</label>
              <select
                value={activeModel}
                onChange={(e) => {
                  const m = e.target.value;
                  setActiveModel(m);
                  if (m.startsWith('groq/')) setProvider('Groq LPU Cloud (Free Tier)');
                  else if (m.includes('llama') || m.includes('deepseek') || m.includes('qwen')) setProvider('OpenRouter Gateway');
                  else if (m.startsWith('gpt-')) setProvider('OpenAI API');
                  else if (m.startsWith('claude-')) setProvider('Anthropic Claude');
                  else if (m.startsWith('gemini-')) setProvider('Google Gemini');
                }}
                className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="groq/compound" disabled={!envStatus.groqSecured}>
                  {envStatus.groqSecured ? 'Groq LPU Engine (groq/compound 🟢)' : 'Groq LPU (🔒 Key Required)'}
                </option>
                <option value="meta-llama/llama-3.3-70b-instruct:free" disabled={!envStatus.openRouterSecured}>
                  {envStatus.openRouterSecured ? 'OpenRouter Llama 3.3 70B (Free 🟢)' : 'OpenRouter Llama 3.3 (🔒 Key Required)'}
                </option>
                <option value="deepseek/deepseek-r1:free" disabled={!envStatus.openRouterSecured}>
                  {envStatus.openRouterSecured ? 'OpenRouter DeepSeek R1 (Free 🟢)' : 'OpenRouter DeepSeek R1 (🔒 Key Required)'}
                </option>
                <option value="gpt-4o" disabled={!envStatus.openAiSecured}>
                  {envStatus.openAiSecured ? 'OpenAI GPT-4o 🟢' : 'OpenAI GPT-4o (🔒 Key Required)'}
                </option>
                <option value="claude-3-5-sonnet" disabled={!envStatus.anthropicSecured}>
                  {envStatus.anthropicSecured ? 'Anthropic Claude 3.5 Sonnet 🟢' : 'Anthropic Claude 3.5 (🔒 Key Required)'}
                </option>
                <option value="gemini-1.5-pro" disabled={!envStatus.geminiSecured}>
                  {envStatus.geminiSecured ? 'Google Gemini 1.5 Pro 🟢' : 'Google Gemini 1.5 (🔒 Key Required)'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Provider Engine Label</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E293B] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

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

            {/* Max Output Tokens Slider */}
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

            {/* Sampling Top-P Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Sampling Top-P</span>
                <span className="text-indigo-400 font-mono font-bold">{topP}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Guardrails Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">AI Output Guardrails Filter</label>
              <select
                value={guardrailsStrictness}
                onChange={(e) => setGuardrailsStrictness(e.target.value)}
                className="w-full bg-[#1E293B] border border-slate-700 text-xs text-white p-2.5 rounded-xl focus:outline-none cursor-pointer"
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
                type="button"
                onClick={() => setFallbackEnabled(!fallbackEnabled)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer ${
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
        </>
        )}

      </main>
    </div>
  );
};

export default AIModelConfiguration;