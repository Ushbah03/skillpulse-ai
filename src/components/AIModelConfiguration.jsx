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
import SkillPulseLoader from './SkillPulseLoader';
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

  // Baseline Model Testing & Validation States
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
    <div className="flex min-h-screen bg-[#E9EAF7] text-[#17233E] font-sans relative overflow-x-hidden selection:bg-[#1988A3]/20 selection:text-[#17233E]">
      {/* Ambient background glowing mesh depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#1988A3]/20 to-[#11C6DE]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-[#1B3154]/15 to-[#8A9CB7]/25 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-gradient-to-tr from-[#11C6DE]/15 to-[#1988A3]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#8A9CB7_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      <SuperadminSidebar activeItem="ai-config" />

      <main className="flex-1 min-w-0 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full font-sans relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#BEDDF5]/70 pb-6 relative">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1988A3] to-[#11C6DE] flex items-center justify-center text-white shadow-lg shadow-[#1988A3]/25">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17233E] flex items-center gap-2.5">
                  AI Engine & Provider Governance Hub
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#1988A3]/10 text-[#1988A3] border border-[#1988A3]/20 font-bold hidden sm:inline-block">
                    Enterprise LLM Core
                  </span>
                </h1>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Neural Pipeline Active
                  </span>
                  {lastUpdated && (
                    <span className="text-[11px] text-[#5A6D89] font-mono flex items-center gap-1.5 bg-white/80 px-2.5 py-0.5 rounded-full border border-[#BEDDF5]">
                      <Clock className="w-3.5 h-3.5 text-[#1988A3]" />
                      DB Synced: <span className="text-[#17233E] font-semibold">{lastUpdated}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTestConnection}
              disabled={testingConnection || loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-[#BEDDF5] disabled:opacity-50 text-[#17233E] text-xs font-semibold shadow-sm transition-all hover:border-[#1988A3] cursor-pointer"
            >
              {testingConnection ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#1988A3]" />
                  Testing Pipeline...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Test AI Engine Connection
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveConfig}
              disabled={saving || loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1988A3] to-[#11C6DE] hover:from-[#15738A] hover:to-[#0EB0C6] disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-[#1988A3]/25 transition-all cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Engine Config...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
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
          <div className="flex flex-col items-center justify-center py-20 bg-white/80 border border-[#BEDDF5] rounded-2xl shadow-sm">
            <SkillPulseLoader message="Loading AI Engine Configuration from database..." />
          </div>
        ) : (
        <>
        {/* Live Baseline Test Results Banner */}
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                    Baseline Integration Test: {testResult.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold">
                    {testResult.latencyMs}ms Latency
                  </span>
                </div>
                <p className="text-xs text-[#5A6D89] mt-0.5">
                  Live verification successful for <span className="font-mono text-[#17233E] font-bold">{testResult.model}</span> via <span className="text-[#1988A3] font-bold">{testResult.provider}</span>.
                </p>
              </div>
            </div>
            <div className="text-right text-[11px] font-mono text-[#8A9CB7] shrink-0">
              Verified: {new Date(testResult.timestamp).toLocaleTimeString()}
            </div>
          </motion.div>
        )}

        {testError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-300 shadow-sm flex items-center justify-between gap-4 text-rose-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider font-mono">Baseline Integration Diagnostic Failed</span>
                <p className="text-xs text-rose-700 mt-0.5">{testError}</p>
              </div>
            </div>
            <button
              onClick={() => setTestError(null)}
              className="text-xs text-[#5A6D89] hover:text-[#17233E] px-2 py-1 rounded cursor-pointer underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Active Engine Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Primary Active Model</p>
              <div className="w-8 h-8 rounded-xl bg-[#1988A3]/10 text-[#1988A3] flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <p className="text-base font-black text-[#17233E] mt-2 uppercase tracking-tight truncate">
              {activeModel || 'openai/gpt-oss-120b'}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                (envStatus.groqSecured || envStatus.openAiSecured || envStatus.anthropicSecured || envStatus.geminiSecured || envStatus.openRouterSecured)
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  : 'bg-amber-100 text-amber-700 border-amber-300'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {testResult ? `${testResult.latencyMs}ms Live Latency` : (envStatus.groqSecured || envStatus.openAiSecured || envStatus.anthropicSecured || envStatus.geminiSecured || envStatus.openRouterSecured) ? 'Active in DB' : 'Pending Key'}
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Provider Engine</p>
              <div className="w-8 h-8 rounded-xl bg-[#1988A3]/10 text-[#1988A3] flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <p className="text-base font-black text-[#1988A3] mt-2 tracking-tight truncate">
              {provider || 'Groq LPU Cloud'}
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/80 text-[#5A6D89] border border-[#BEDDF5] font-semibold">
                v{version || '1.0.0'} • High Throughput
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Context Window Limit</p>
              <div className="w-8 h-8 rounded-xl bg-[#1988A3]/10 text-[#1988A3] flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#17233E] mt-2 tracking-tight">
              {contextWindow.toLocaleString()} <span className="text-xs font-normal text-[#5A6D89] font-mono">Tokens</span>
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-100 text-purple-700 border border-purple-200 font-bold">
                {(contextWindow / 1000).toFixed(0)}k Tokens / Context
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#5A6D89] font-bold uppercase tracking-wider">Temperature / Top-P</p>
              <div className="w-8 h-8 rounded-xl bg-[#1988A3]/10 text-[#1988A3] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-700 mt-2 tracking-tight">
              {temperature} <span className="text-xs font-normal text-[#5A6D89] font-mono">/ Top-P {topP}</span>
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold">
                {temperature <= 0.2 ? 'Deterministic / Strict' : temperature <= 0.7 ? 'Balanced Reasoning' : 'Creative Exploration'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* MULTI-PROVIDER API KEYS SECTION */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-5">
              <div className="border-b border-[#BEDDF5] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#17233E] flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#1988A3]" />
                    Multi-AI Provider API Credentials & Keys
                  </h2>
                  <p className="text-xs text-[#5A6D89] mt-1">
                    Enter API secret keys for any provider. The system will auto-verify and enable live model switching.
                  </p>
                </div>
              </div>

              {/* 1. GROQ API KEY */}
              <div className="p-4 rounded-xl border border-[#BEDDF5] bg-white/85 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#17233E] font-mono">GROQ_API_KEY</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-mono border border-emerald-200 font-bold">
                      100% Free Engine
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${envStatus.groqSecured ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {envStatus.groqSecured ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ✓ Backend Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300">
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
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#BEDDF5] rounded-lg text-xs font-mono text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGroqKey(!showGroqKey)}
                    className="absolute right-3 top-2.5 text-[#8A9CB7] hover:text-[#17233E] cursor-pointer"
                  >
                    {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2. OPENAI API KEY */}
              <div className="p-4 rounded-xl border border-[#BEDDF5] bg-white/85 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#17233E] font-mono">OPENAI_API_KEY</span>
                    <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded font-mono border border-sky-200 font-bold">
                      GPT-4o & GPT-4o Mini
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${envStatus.openAiSecured ? 'text-emerald-700' : 'text-[#8A9CB7]'}`}>
                    {envStatus.openAiSecured ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ✓ Backend Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-medium">
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
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#BEDDF5] rounded-lg text-xs font-mono text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                    className="absolute right-3 top-2.5 text-[#8A9CB7] hover:text-[#17233E] cursor-pointer"
                  >
                    {showOpenAiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3. ANTHROPIC CLAUDE API KEY */}
              <div className="p-4 rounded-xl border border-[#BEDDF5] bg-white/85 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#17233E] font-mono">ANTHROPIC_API_KEY</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono border border-purple-200 font-bold">
                      Claude 3.5 Sonnet
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${envStatus.anthropicSecured ? 'text-emerald-700' : 'text-[#8A9CB7]'}`}>
                    {envStatus.anthropicSecured ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ✓ Backend Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-medium">
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
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#BEDDF5] rounded-lg text-xs font-mono text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowClaudeKey(!showClaudeKey)}
                    className="absolute right-3 top-2.5 text-[#8A9CB7] hover:text-[#17233E] cursor-pointer"
                  >
                    {showClaudeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4. GOOGLE GEMINI API KEY */}
              <div className="p-4 rounded-xl border border-[#BEDDF5] bg-white/85 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#17233E] font-mono">GEMINI_API_KEY</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono border border-blue-200 font-bold">
                      Gemini 1.5 Pro & Flash
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${envStatus.geminiSecured ? 'text-emerald-700' : 'text-[#8A9CB7]'}`}>
                    {envStatus.geminiSecured ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ✓ Backend Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-medium">
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
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#BEDDF5] rounded-lg text-xs font-mono text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="absolute right-3 top-2.5 text-[#8A9CB7] hover:text-[#17233E] cursor-pointer"
                  >
                    {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 5. OPENROUTER API KEY */}
              <div className="p-4 rounded-xl border border-[#BEDDF5] bg-white/85 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#17233E] font-mono">OPENROUTER_API_KEY</span>
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-mono border border-orange-200 font-bold">
                      Backup & Open Models
                    </span>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${envStatus.openRouterSecured ? 'text-emerald-700' : 'text-[#8A9CB7]'}`}>
                    {envStatus.openRouterSecured ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ✓ Backend Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-medium">
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
                    className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#BEDDF5] rounded-lg text-xs font-mono text-[#17233E] focus:outline-none focus:border-[#1988A3] shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                    className="absolute right-3 top-2.5 text-[#8A9CB7] hover:text-[#17233E] cursor-pointer"
                  >
                    {showOpenRouterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Task-Specific Routing */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6">
              <h2 className="text-base font-bold text-[#17233E] flex items-center gap-2 mb-2">
                <GitFork className="w-5 h-5 text-[#1988A3]" />
                Task-Specific LLM Model Routing
              </h2>
              <p className="text-xs text-[#5A6D89] mb-5">
                Route specific SkillPulse features to any of your configured AI models across providers.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-white/80 rounded-xl border border-[#BEDDF5] shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-[#17233E] block">Skill Assessment & Test Generation</span>
                    <span className="text-[11px] text-[#5A6D89]">High reasoning requirements</span>
                  </div>
                  <select
                    value={taskRouting.skillAssessment}
                    onChange={(e) => setTaskRouting({ ...taskRouting, skillAssessment: e.target.value })}
                    className="bg-white border border-[#BEDDF5] text-xs text-[#1988A3] font-bold px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer shadow-sm"
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

                <div className="flex items-center justify-between p-3.5 bg-white/80 rounded-xl border border-[#BEDDF5] shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-[#17233E] block">Resume Parsing & Taxonomy Mapping</span>
                    <span className="text-[11px] text-[#5A6D89]">Fast structured JSON extraction</span>
                  </div>
                  <select
                    value={taskRouting.resumeParsing}
                    onChange={(e) => setTaskRouting({ ...taskRouting, resumeParsing: e.target.value })}
                    className="bg-white border border-[#BEDDF5] text-xs text-[#1988A3] font-bold px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer shadow-sm"
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

                <div className="flex items-center justify-between p-3.5 bg-white/80 rounded-xl border border-[#BEDDF5] shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-[#17233E] block">Learning Roadmaps & Career Chat</span>
                    <span className="text-[11px] text-[#5A6D89]">High volume, cost sensitive</span>
                  </div>
                  <select
                    value={taskRouting.learningRecommendations}
                    onChange={(e) => setTaskRouting({ ...taskRouting, learningRecommendations: e.target.value })}
                    className="bg-white border border-[#BEDDF5] text-xs text-[#1988A3] font-bold px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer shadow-sm"
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
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-4">
              <h2 className="text-base font-bold text-[#17233E] flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-[#1988A3]" />
                Base AI System Prompt Guardrails
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#5A6D89] uppercase mb-1">Global System Context</label>
                <textarea
                  rows="3"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] font-mono focus:outline-none focus:border-[#1988A3] shadow-sm resize-none"
                />
              </div>
            </div>

          </div>

          {/* Model Parameters Sidebar */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#D8EBF9]/95 via-[#CBE3F7]/90 to-[#BEDDF5]/85 backdrop-blur-xl border border-white/85 shadow-xl shadow-[#1B3154]/6 space-y-6 relative overflow-hidden">
            <h2 className="text-base font-bold text-[#17233E] flex items-center gap-2 border-b border-[#BEDDF5] pb-4">
              <div className="w-7 h-7 rounded-lg bg-[#1988A3]/10 text-[#1988A3] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              Engine Hyperparameters
            </h2>

            {/* Primary Model Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#5A6D89] mb-1.5">Primary Model Name</label>
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
                className="w-full px-3 py-2.5 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] font-bold focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
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
              <label className="block text-xs font-semibold text-[#5A6D89] mb-1.5">Provider Engine Label</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-[#BEDDF5] rounded-xl text-xs text-[#17233E] font-medium focus:outline-none focus:border-[#1988A3] shadow-sm"
              />
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-[#5A6D89]">Temperature</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border transition-colors ${
                  temperature <= 0.2 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    : temperature <= 0.7 
                    ? 'bg-[#1988A3]/10 text-[#1988A3] border-[#1988A3]/30'
                    : 'bg-amber-100 text-amber-700 border-amber-300'
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1988A3]"
              />
            </div>

            {/* Max Output Tokens Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-[#5A6D89]">Max Output Tokens</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-100 text-sky-700 border border-sky-300">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1988A3]"
              />
            </div>

            {/* Sampling Top-P Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-[#5A6D89]">Sampling Top-P</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-100 text-purple-700 border border-purple-200">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1988A3]"
              />
            </div>

            {/* Guardrails Level */}
            <div>
              <label className="block text-xs font-semibold text-[#5A6D89] mb-2">AI Output Guardrails Filter</label>
              <select
                value={guardrailsStrictness}
                onChange={(e) => setGuardrailsStrictness(e.target.value)}
                className="w-full bg-white border border-[#BEDDF5] text-xs text-[#17233E] p-2.5 rounded-xl focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
              >
                <option value="Strict">Strict (Zero Hallucination Filter)</option>
                <option value="High">High (Recommended)</option>
                <option value="Moderate">Moderate</option>
              </select>
            </div>

            {/* Gap Detection Sensitivity */}
            <div>
              <label className="block text-xs font-semibold text-[#5A6D89] mb-2">Gap Detection Sensitivity</label>
              <select
                value={gapDetectionSensitivity}
                onChange={(e) => setGapDetectionSensitivity(e.target.value)}
                className="w-full bg-white border border-[#BEDDF5] text-xs text-[#17233E] p-2.5 rounded-xl focus:outline-none focus:border-[#1988A3] cursor-pointer shadow-sm"
              >
                <option value="strict">Strict (Exact Taxonomy Match)</option>
                <option value="moderate">Moderate (Semantic Cosine Match)</option>
                <option value="lenient">Lenient (Broad Category Match)</option>
              </select>
            </div>

            {/* Skill Inference Similarity Threshold */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-[#5A6D89]">Skill Inference Similarity Threshold</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
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
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1988A3]"
              />
            </div>

            {/* Fallback Reroute */}
            <div className="pt-4 border-t border-[#BEDDF5] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#17233E]">Automated Fallback</p>
                <p className="text-[11px] text-[#5A6D89]">Reroute on API error 5xx</p>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setFallbackEnabled(!fallbackEnabled)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  fallbackEnabled ? 'bg-[#1988A3] shadow-md shadow-[#1988A3]/30' : 'bg-slate-300'
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
