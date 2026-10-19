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
  Globe,
  Activity,
  AlertTriangle
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
  const [gapDetectionSensitivity, setGapDetectionSensitivity] = useState('strict');
  const [skillInferenceThreshold, setSkillInferenceThreshold] = useState(0.75);

  // Baseline Model Testing & Validation States (BRD 6.7.4 & Box 7 Draw.io)
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testError, setTestError] = useState(null);

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
        setActiveModel(active.modelName || 'openai/gpt-oss-120b');
        setProvider(active.provider || 'Groq LPU Cloud');
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
          if (active.hyperparams.gapDetectionSensitivity) setGapDetectionSensitivity(active.hyperparams.gapDetectionSensitivity);
          if (active.hyperparams.skillInferenceThreshold !== undefined) setSkillInferenceThreshold(active.hyperparams.skillInferenceThreshold);
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

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    setTestError(null);
    try {
      const res = await adminAPI.testAIConnection({
        modelName: activeModel,
        provider,
        groqApiKey: groqApiKey.trim() || undefined,
        openAiApiKey: openAiApiKey.trim() || undefined,
        anthropicApiKey: anthropicApiKey.trim() || undefined,
        geminiApiKey: geminiApiKey.trim() || undefined,
        openRouterApiKey: openRouterApiKey.trim() || undefined
      });
      if (res?.success) {
        setTestResult(res);
      } else {
        setTestError(res?.error || 'Inference baseline testing failed.');
      }
    } catch (err) {
      setTestError(err.message || 'Failed to reach AI model endpoint.');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const hyperparamsPayload = {
        taskRouting,
        systemPrompt,
        guardrailsStrictness,
        fallbackEnabled,
        gapDetectionSensitivity,
        skillInferenceThreshold: parseFloat(skillInferenceThreshold)
      };

      const payload = {
        modelName: activeModel || 'openai/gpt-oss-120b',
        provider: provider || 'Groq LPU Cloud',
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6 relative">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)]">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                  AI Engine & Provider Governance Hub
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold hidden sm:inline-block">
                    Enterprise LLM Core
                  </span>
                </h1>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Neural Pipeline Active
                  </span>
                  {lastUpdated && (
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-0.5 rounded-full border border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      DB Synced: <span className="text-slate-200">{lastUpdated}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTestConnection}
              disabled={testingConnection || loading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-black/20 transition-all shrink-0 cursor-pointer"
            >
              {testingConnection ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  Testing Pipeline...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Test AI Engine Connection
                </>
              )}
            </motion.button>

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
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0F172A] border border-slate-800/80 rounded-2xl mb-8">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm text-slate-400 mt-3">Loading AI Engine Configuration from PostgreSQL...</p>
          </div>
        ) : (
        <>
        {/* Live Baseline Test Results Banner (BRD 6.7.4 & Box 7 Draw.io) */}
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    Baseline Integration Test: {testResult.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {testResult.latencyMs}ms Latency
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Live verification successful for <span className="font-mono text-white font-semibold">{testResult.model}</span> via <span className="text-indigo-300 font-semibold">{testResult.provider}</span>.
                </p>
              </div>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
              Verified: {new Date(testResult.timestamp).toLocaleTimeString()}
            </div>
          </motion.div>
        )}

        {testError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between gap-4 text-rose-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">Baseline Integration Diagnostic Failed</span>
                <p className="text-xs text-slate-300 mt-0.5">{testError}</p>
              </div>
            </div>
            <button
              onClick={() => setTestError(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Active Engine Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <motion.div
            whileHover={{ y: -4, scale: 1.015 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#111A2E] via-[#0F172A] to-[#0B1120] border border-slate-800 hover:border-indigo-500/50 shadow-xl hover:shadow-[0_10px_25px_rgba(99,102,241,0.15)] transition-all duration-300 relative overflow-hidden group cursor-default"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all duration-500 pointer-events-none" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Primary Active Model</p>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <p className="text-lg font-black text-white mt-2 uppercase tracking-tight truncate">
              {activeModel || 'openai/gpt-oss-120b'}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                (envStatus.groqSecured || envStatus.openAiSecured || envStatus.anthropicSecured || envStatus.geminiSecured || envStatus.openRouterSecured)
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {testResult ? `${testResult.latencyMs}ms Live Latency` : (envStatus.groqSecured || envStatus.openAiSecured || envStatus.anthropicSecured || envStatus.geminiSecured || envStatus.openRouterSecured) ? 'Active in DB' : 'Pending Key'}
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.015 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#111A2E] via-[#0F172A] to-[#0B1120] border border-slate-800 hover:border-sky-500/50 shadow-xl hover:shadow-[0_10px_25px_rgba(56,189,248,0.15)] transition-all duration-300 relative overflow-hidden group cursor-default"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/25 transition-all duration-500 pointer-events-none" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Provider Engine</p>
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <p className="text-base font-black text-sky-300 mt-2 tracking-tight truncate">
              {provider || 'Groq LPU Cloud'}
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800/90 text-slate-300 border border-slate-700 font-medium">
                v{version || '1.0.0'} • High Throughput
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.015 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#111A2E] via-[#0F172A] to-[#0B1120] border border-slate-800 hover:border-purple-500/50 shadow-xl hover:shadow-[0_10px_25px_rgba(168,85,247,0.15)] transition-all duration-300 relative overflow-hidden group cursor-default"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-all duration-500 pointer-events-none" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Context Window Limit</p>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white mt-2 tracking-tight">
              {contextWindow.toLocaleString()} <span className="text-xs font-normal text-slate-400 font-mono">Tokens</span>
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30 font-medium shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                {(contextWindow / 1000).toFixed(0)}k Tokens / Context
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.015 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#111A2E] via-[#0F172A] to-[#0B1120] border border-slate-800 hover:border-emerald-500/50 shadow-xl hover:shadow-[0_10px_25px_rgba(16,185,129,0.15)] transition-all duration-300 relative overflow-hidden group cursor-default"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/25 transition-all duration-500 pointer-events-none" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Temperature / Top-P</p>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <Sliders className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-400 mt-2 tracking-tight">
              {temperature} <span className="text-xs font-normal text-slate-400 font-mono">/ Top-P {topP}</span>
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                {temperature <= 0.2 ? 'Deterministic / Strict' : temperature <= 0.7 ? 'Balanced Reasoning' : 'Creative Exploration'}
              </span>
            </div>
          </motion.div>
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
              <motion.div 
                whileHover={{ scale: 1.008 }}
                transition={{ duration: 0.15 }}
                className={`p-4 rounded-xl border transition-all duration-300 space-y-2.5 ${
                  envStatus.groqSecured 
                    ? 'bg-gradient-to-r from-emerald-950/20 via-[#1E293B]/80 to-[#1E293B]/60 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.08)]' 
                    : 'bg-[#1E293B]/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white font-mono">GROQ_API_KEY</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20 font-semibold">
                      100% Free Engine
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${envStatus.groqSecured ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {envStatus.groqSecured ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ✓ Backend Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        ⚠ Key Required
                      </span>
                    )}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showGroqKey ? 'text' : 'password'}
                    placeholder="Enter Groq API Key (starts with gsk_...)"
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-[#0F172A] border border-slate-700/80 rounded-lg text-xs font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGroqKey(!showGroqKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* 2. OPENAI API KEY */}
              <motion.div 
                whileHover={{ scale: 1.008 }}
                transition={{ duration: 0.15 }}
                className={`p-4 rounded-xl border transition-all duration-300 space-y-2.5 ${
                  envStatus.openAiSecured 
                    ? 'bg-gradient-to-r from-emerald-950/20 via-[#1E293B]/80 to-[#1E293B]/60 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.08)]' 
                    : 'bg-[#1E293B]/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white font-mono">OPENAI_API_KEY</span>
                    <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded font-mono border border-sky-500/20 font-semibold">
                      GPT-4o & GPT-4o Mini
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${envStatus.openAiSecured ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {envStatus.openAiSecured ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ✓ Backend Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 font-medium">
                        Optional / Standby
                      </span>
                    )}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showOpenAiKey ? 'text' : 'password'}
                    placeholder="Enter OpenAI API Key (starts with sk-...)"
                    value={openAiApiKey}
                    onChange={(e) => setOpenAiApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-[#0F172A] border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    {showOpenAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* 3. ANTHROPIC CLAUDE API KEY */}
              <motion.div 
                whileHover={{ scale: 1.008 }}
                transition={{ duration: 0.15 }}
                className={`p-4 rounded-xl border transition-all duration-300 space-y-2.5 ${
                  envStatus.anthropicSecured 
                    ? 'bg-gradient-to-r from-emerald-950/20 via-[#1E293B]/80 to-[#1E293B]/60 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.08)]' 
                    : 'bg-[#1E293B]/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white font-mono">ANTHROPIC_API_KEY</span>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono border border-purple-500/20 font-semibold">
                      Claude 3.5 Sonnet
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${envStatus.anthropicSecured ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {envStatus.anthropicSecured ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ✓ Backend Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 font-medium">
                        Optional / Standby
                      </span>
                    )}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showClaudeKey ? 'text' : 'password'}
                    placeholder="Enter Anthropic Claude Key (starts with sk-ant-...)"
                    value={anthropicApiKey}
                    onChange={(e) => setAnthropicApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-[#0F172A] border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowClaudeKey(!showClaudeKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    {showClaudeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* 4. GOOGLE GEMINI API KEY */}
              <motion.div 
                whileHover={{ scale: 1.008 }}
                transition={{ duration: 0.15 }}
                className={`p-4 rounded-xl border transition-all duration-300 space-y-2.5 ${
                  envStatus.geminiSecured 
                    ? 'bg-gradient-to-r from-emerald-950/20 via-[#1E293B]/80 to-[#1E293B]/60 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.08)]' 
                    : 'bg-[#1E293B]/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white font-mono">GEMINI_API_KEY</span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono border border-blue-500/20 font-semibold">
                      Gemini 1.5 Pro & Flash
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${envStatus.geminiSecured ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {envStatus.geminiSecured ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ✓ Backend Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 font-medium">
                        Optional / Standby
                      </span>
                    )}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showGeminiKey ? 'text' : 'password'}
                    placeholder="Enter Google Gemini Key (starts with AIzaSy...)"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-[#0F172A] border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* 5. OPENROUTER API KEY */}
              <motion.div 
                whileHover={{ scale: 1.008 }}
                transition={{ duration: 0.15 }}
                className={`p-4 rounded-xl border transition-all duration-300 space-y-2.5 ${
                  envStatus.openRouterSecured 
                    ? 'bg-gradient-to-r from-emerald-950/20 via-[#1E293B]/80 to-[#1E293B]/60 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.08)]' 
                    : 'bg-[#1E293B]/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white font-mono">OPENROUTER_API_KEY</span>
                    <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded font-mono border border-orange-500/20 font-semibold">
                      Backup & Open Models
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${envStatus.openRouterSecured ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {envStatus.openRouterSecured ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ✓ Backend Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 font-medium">
                        Optional / Standby
                      </span>
                    )}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showOpenRouterKey ? 'text' : 'password'}
                    placeholder="Enter OpenRouter Key (starts with sk-or-v1-...)"
                    value={openRouterApiKey}
                    onChange={(e) => setOpenRouterApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-[#0F172A] border border-slate-700/80 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    {showOpenRouterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

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
                    <option value="openai/gpt-oss-120b" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (openai/gpt-oss-120b 🟢)' : 'Groq LPU (🔒 Key Required)'}
                    </option>
                    <option value="openai/gpt-oss-20b" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (openai/gpt-oss-20b - Fast 🟢)' : 'Groq LPU (🔒 Key Required)'}
                    </option>
                    <option value="groq/compound" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (groq/compound 🟢)' : 'Groq LPU (🔒 Key Required)'}
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
                    <option value="openai/gpt-oss-120b" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (openai/gpt-oss-120b 🟢)' : 'Groq LPU (🔒 Key Required)'}
                    </option>
                    <option value="openai/gpt-oss-20b" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (openai/gpt-oss-20b - Fast 🟢)' : 'Groq LPU (🔒 Key Required)'}
                    </option>
                    <option value="groq/compound" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (groq/compound 🟢)' : 'Groq LPU (🔒 Key Required)'}
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
                    <option value="openai/gpt-oss-120b" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (openai/gpt-oss-120b 🟢)' : 'Groq LPU (🔒 Key Required)'}
                    </option>
                    <option value="openai/gpt-oss-20b" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (openai/gpt-oss-20b - Fast 🟢)' : 'Groq LPU (🔒 Key Required)'}
                    </option>
                    <option value="groq/compound" disabled={!envStatus.groqSecured}>
                      {envStatus.groqSecured ? 'Groq LPU (groq/compound 🟢)' : 'Groq LPU (🔒 Key Required)'}
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
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111A2E] via-[#0F172A] to-[#0B1120] border border-slate-800/90 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sliders className="w-4 h-4" />
              </div>
              Engine Hyperparameters
            </h2>

            {/* Primary Model Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Model Name</label>
              <select
                value={activeModel}
                onChange={(e) => {
                  const m = e.target.value;
                  setActiveModel(m);
                  if (m.includes('gpt-oss') || m.startsWith('groq/')) setProvider('Groq LPU Cloud');
                  else if (m.includes('llama') || m.includes('deepseek') || m.includes('qwen')) setProvider('OpenRouter Gateway');
                  else if (m.startsWith('gpt-')) setProvider('OpenAI API');
                  else if (m.startsWith('claude-')) setProvider('Anthropic Claude');
                  else if (m.startsWith('gemini-')) setProvider('Google Gemini');
                }}
                className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer transition-all"
              >
                <option value="openai/gpt-oss-120b" disabled={!envStatus.groqSecured}>
                  {envStatus.groqSecured ? 'Groq LPU Engine (openai/gpt-oss-120b 🟢)' : 'Groq LPU (🔒 Key Required)'}
                </option>
                <option value="openai/gpt-oss-20b" disabled={!envStatus.groqSecured}>
                  {envStatus.groqSecured ? 'Groq LPU Engine (openai/gpt-oss-20b - Fast 🟢)' : 'Groq LPU (🔒 Key Required)'}
                </option>
                <option value="groq/compound" disabled={!envStatus.groqSecured}>
                  {envStatus.groqSecured ? 'Groq Compound Gateway (groq/compound 🟢)' : 'Groq Compound (🔒 Key Required)'}
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Provider Engine Label</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Temperature</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border transition-colors ${
                  temperature <= 0.2 
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                    : temperature <= 0.7 
                    ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                }`}>
                  {temperature}
                </span>
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
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-[0_0_8px_rgba(56,189,248,0.2)]">
                  {maxTokens}
                </span>
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
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                  {topP}
                </span>
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
                className="w-full bg-[#0F172A] border border-slate-700/80 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer transition-all"
              >
                <option value="Strict">Strict (Zero Hallucination Filter)</option>
                <option value="High">High (Recommended)</option>
                <option value="Moderate">Moderate</option>
              </select>
            </div>

            {/* Gap Detection Sensitivity (BRD 6.7.4) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Gap Detection Sensitivity</label>
              <select
                value={gapDetectionSensitivity}
                onChange={(e) => setGapDetectionSensitivity(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-700/80 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer transition-all"
              >
                <option value="strict">Strict (Exact Taxonomy Match)</option>
                <option value="moderate">Moderate (Semantic Cosine Match)</option>
                <option value="lenient">Lenient (Broad Category Match)</option>
              </select>
            </div>

            {/* Skill Inference Similarity Threshold (BRD 6.7.4 & Draw.io Box 7) */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-300">Skill Inference Similarity Threshold</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                  {Math.round(skillInferenceThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={skillInferenceThreshold}
                onChange={(e) => setSkillInferenceThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Fallback Reroute */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Automated Fallback</p>
                <p className="text-[11px] text-slate-400">Reroute on API error 5xx</p>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setFallbackEnabled(!fallbackEnabled)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  fallbackEnabled ? 'bg-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.4)]' : 'bg-slate-800 border border-slate-700'
                }`}
              >
                <motion.div
                  animate={{ x: fallbackEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 rounded-full bg-white shadow-md"
                />
              </motion.button>
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