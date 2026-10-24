import React, { useState, useEffect } from 'react';
import { 
  Search, History, Layout, Filter, ArrowUpDown, Sparkles, Check, Loader2, Clock, Award, ShieldAlert, ChevronRight, X, AlertCircle, CheckCircle2
} from 'lucide-react';
import { employeeAPI } from '../services/api';
import SkillPulseLoader from './SkillPulseLoader';

// Question Banks for Assessments
const QUESTION_BANKS = {
  'asm-1': [
    {
      id: 1,
      question: "Which React hook is specifically designed to cache the calculated result of an expensive computation between re-renders?",
      options: ["useEffect", "useMemo", "useCallback", "useRef"],
      correct: 1
    },
    {
      id: 2,
      question: "What is the primary technical difference between `useMemo` and `useCallback`?",
      options: [
        "useMemo caches values; useCallback caches function instances",
        "useCallback executes synchronously during paint",
        "useMemo is exclusively for DOM references",
        "There is no difference; they are aliases"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "When does `useLayoutEffect` fire compared to the standard `useEffect`?",
      options: [
        "Synchronously after all DOM mutations but BEFORE browser paint",
        "Asynchronously 100ms after browser paint",
        "Before DOM nodes are mutated",
        "Exclusively when the component unmounts"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "How can you store a mutable value in React that persists across renders without triggering a re-render?",
      options: ["useState", "useReducer", "useRef", "useContext"],
      correct: 2
    },
    {
      id: 5,
      question: "Which hook is best suited for managing complex component state with multi-step action dispatchers?",
      options: ["useState", "useReducer", "useEffect", "useImperativeHandle"],
      correct: 1
    }
  ],
  'asm-2': [
    {
      id: 1,
      question: "Which core design pattern handles asynchronous event-driven communications in Node.js?",
      options: ["Observer / EventEmitter Pattern", "Singleton Pattern", "Factory Pattern", "Decorator Pattern"],
      correct: 0
    },
    {
      id: 2,
      question: "What is the primary architectural purpose of the Middleware pattern in Express.js?",
      options: [
        "Database schema migrations",
        "Request processing pipeline & Chain of Responsibility",
        "Multi-core CPU thread management",
        "In-memory Redis caching"
      ],
      correct: 1
    },
    {
      id: 3,
      question: "How does Node.js achieve non-blocking I/O operations despite running on a single main thread?",
      options: [
        "Multi-threaded CPU core locking",
        "Libuv Event Loop & background I/O Thread Pool",
        "Synchronous blocking calls",
        "Cluster module workers only"
      ],
      correct: 1
    },
    {
      id: 4,
      question: "Which pattern is recommended for managing shared database connection pools across a Node application?",
      options: ["Prototype Pattern", "Singleton Pattern", "Builder Pattern", "Strategy Pattern"],
      correct: 1
    },
    {
      id: 5,
      question: "What is the memory benefit of using Streams and `.pipe()` in Node.js for large files?",
      options: [
        "Loads the entire file into RAM at once",
        "Processes data in chunks without overloading RAM",
        "Encrypts data automatically",
        "Compresses files on disk"
      ],
      correct: 1
    }
  ],
  'asm-3': [
    {
      id: 1,
      question: "Which AWS service provides object storage with 99.999999999% (11 9s) durability?",
      options: ["AWS EC2", "AWS S3", "AWS EBS", "AWS DynamoDB"],
      correct: 1
    },
    {
      id: 2,
      question: "What is the main function of an AWS EC2 Auto Scaling Group?",
      options: [
        "Automatically adjust the number of EC2 instances based on demand traffic",
        "Schedule daily database snapshots",
        "Manage IAM user authentication keys",
        "Route DNS domain queries"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "Which service allows executing code in response to events without managing or provisioning servers?",
      options: ["AWS Elastic Beanstalk", "AWS Lambda", "AWS ECS", "AWS CloudFront"],
      correct: 1
    },
    {
      id: 4,
      question: "In AWS VPC architecture, what component connects private subnets to the public Internet for outbound updates?",
      options: ["Internet Gateway", "NAT Gateway", "Virtual Private Gateway", "Direct Connect"],
      correct: 1
    },
    {
      id: 5,
      question: "Which managed AWS database service supports both relational SQL and automated failover multi-AZ replication?",
      options: ["Amazon RDS", "Amazon DynamoDB", "Amazon Redshift", "Amazon ElastiCache"],
      correct: 0
    }
  ],
  'asm-4': [
    {
      id: 1,
      question: "What is the primary benefit of TypeScript's `unknown` type over the `any` type?",
      options: [
        "Enforces type checking before performing operations on the value",
        "Allows arbitrary method calls without verification",
        "Compiles to native C++ binaries",
        "Automatically generates SQL queries"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Which TypeScript utility type constructs a type with all properties of T set to optional?",
      options: ["Required<T>", "Readonly<T>", "Partial<T>", "Record<K, T>"],
      correct: 2
    },
    {
      id: 3,
      question: "How do Discriminated Unions facilitate safe polymorphism in TypeScript?",
      options: [
        "By enforcing a common literal property used as a type guard",
        "By compiling multiple types into a single interface",
        "By ignoring type safety during runtime",
        "By casting all types to Object"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "What is the purpose of the `satisfies` operator introduced in TypeScript 4.9?",
      options: [
        "Validates that an expression matches a type without changing its resulting inferred type",
        "Converts synchronous functions into async promises",
        "Checks runtime prototype inheritance",
        "Enforces strict null checks globally"
      ],
      correct: 0
    },
    {
      id: 5,
      question: "Which keyword creates a type that represents the return type of a function type T?",
      options: ["ReturnType<T>", "InstanceType<T>", "Parameters<T>", "Extract<T>"],
      correct: 0
    }
  ]
};

const fallbackAvailable = [
  { id: 'asm-1', title: 'Advanced React Architecture', category: 'Frontend', type: 'MCQ & Practical', duration: '20 min', difficulty: 'ADVANCED', totalQuestions: 5 },
  { id: 'asm-2', title: 'Node.js Microservices Patterns', category: 'Backend', type: 'Architectural Analysis', duration: '25 min', difficulty: 'EXPERT', totalQuestions: 5 },
  { id: 'asm-3', title: 'Cloud Infrastructure & AWS', category: 'DevOps', type: 'Scenario Based', duration: '30 min', difficulty: 'INTERMEDIATE', totalQuestions: 5 },
  { id: 'asm-4', title: 'TypeScript Enterprise Design', category: 'Language', type: 'Syntax & Types', duration: '15 min', difficulty: 'ADVANCED', totalQuestions: 5 },
];

const SkillAssessment = () => {
  const [available, setAvailable] = useState([]);
  const [taken, setTaken] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittingId, setSubmittingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Active Interactive Assessment Modal State
  const [activeTest, setActiveTest] = useState(null);
  const [generatingAsm, setGeneratingAsm] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [validationError, setValidationError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins in seconds
  const [testResult, setTestResult] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const workspaceName = storedUser.tenant?.name || 'Enterprise Corp Workspace';

  const loadAssessments = async () => {
    try {
      const res = await employeeAPI.getAssessments();
      if (res.success && res.data) {
        setAvailable(res.data.available || fallbackAvailable);
        setTaken(res.data.taken || []);
      }
    } catch (err) {
      console.warn('Error loading assessments:', err);
      setAvailable(fallbackAvailable);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  // Countdown timer for active test
  useEffect(() => {
    let timer;
    if (activeTest && !testResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (activeTest && !testResult && timeLeft === 0) {
      handleFinalSubmit();
    }
    return () => clearInterval(timer);
  }, [activeTest, testResult, timeLeft]);

  // Launch Real Assessment Modal with Live Gemini AI Question Generation
  const handleStartAssessment = async (asm) => {
    setSubmittingId(asm.id);
    setGeneratingAsm(asm);
    let questions = null;

    try {
      const res = await employeeAPI.generateAIQuestions(asm.title, asm.category, asm.difficulty);
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        questions = res.data;
      }
    } catch (err) {
      console.warn('Gemini AI live fetch failed, using fallback question generator:', err);
    } finally {
      setSubmittingId(null);
      setGeneratingAsm(null);
    }

    if (!questions || questions.length === 0) {
      questions = QUESTION_BANKS[asm.id];
    }

    if (!questions || questions.length === 0) {
      const titleClean = asm.title.replace(/[^a-zA-Z0-9 ]/g, '');
      questions = [
        {
          id: 1,
          question: `What is the core industry design principle when building production systems using ${titleClean}?`,
          options: [
            `Separation of concerns, modularity, and explicit type contracts`,
            `Coupling all application logic into a monolithic script`,
            `Avoiding asynchronous functions entirely`,
            `Ignoring error boundary fallbacks`
          ],
          correct: 0
        },
        {
          id: 2,
          question: `Which metric is the most critical for evaluating performance and efficiency in ${titleClean}?`,
          options: [
            `Throughput, latency, and memory footprint`,
            `Number of physical files in directory`,
            `Comments count per function`,
            `CSS hex code character length`
          ],
          correct: 0
        },
        {
          id: 3,
          question: `In modern scalable architectures, how should state synchronization be handled in ${titleClean}?`,
          options: [
            `Global unvalidated mutable variables`,
            `Deterministic state management or immutable event streams`,
            `Periodic page refreshes via meta tags`,
            `Hardcoded timeout polling`
          ],
          correct: 1
        },
        {
          id: 4,
          question: `Which security vector must be mitigated when processing external inputs in ${titleClean}?`,
          options: [
            `Input sanitization, injection prevention, and strict validation`,
            `Exposing raw credentials in client code`,
            `Disabling CORS policies completely`,
            `Allowing arbitrary unchecked evaluations`
          ],
          correct: 0
        },
        {
          id: 5,
          question: `Which strategy ensures long-term scalability and maintainability when working with ${titleClean}?`,
          options: [
            `Continuous refactoring, documentation, and adhering to industry standards`,
            `Hardcoding transient values`,
            `Avoiding version control`,
            `Disabling security policies`
          ],
          correct: 0
        }
      ];
    }

    setActiveTest({ ...asm, questions });
    setCurrentQIndex(0);
    setUserAnswers({});
    setValidationError('');
    setTimeLeft(300); // 5 mins
    setTestResult(null);
  };

  const handleSelectOption = (qId, optionIdx) => {
    setValidationError('');
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleNextQuestion = () => {
    const currentQId = activeTest.questions[currentQIndex].id;
    if (userAnswers[currentQId] === undefined) {
      setValidationError('Please select an option before moving to the next question.');
      return;
    }
    setValidationError('');
    setCurrentQIndex(prev => prev + 1);
  };

  const handleValidateAndSubmit = () => {
    const unansweredIdx = activeTest.questions.findIndex(q => userAnswers[q.id] === undefined);
    if (unansweredIdx !== -1) {
      setCurrentQIndex(unansweredIdx);
      setValidationError(`Please select an option for Question ${unansweredIdx + 1} before submitting.`);
      return;
    }
    setValidationError('');
    handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    if (!activeTest) return;
    setSubmittingId(activeTest.id);

    const questions = activeTest.questions;
    let correctCount = 0;

    questions.forEach(q => {
      if (userAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const realScore = Math.round((correctCount / questions.length) * 100);

    try {
      const res = await employeeAPI.submitAssessment({
        title: activeTest.title,
        category: activeTest.category,
        score: realScore,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        resultsJson: {
          difficulty: activeTest.difficulty,
          type: activeTest.type,
          userAnswers
        }
      });

      if (res?.success) {
        setTestResult({
          score: realScore,
          correct: correctCount,
          total: questions.length,
          passed: realScore >= 75,
          message: res.message
        });

        await loadAssessments();
      }
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredAvailable = available.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <SkillPulseLoader message="Initializing Adaptive Assessment Matrix..." />;
  }

  return (
    <div className="bg-transparent min-h-screen p-6 md:p-10 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#17233E] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#1988A3]/40">
          <Check className="w-5 h-5 text-[#11C6DE]" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#1988A3]/10 text-[#1988A3] px-2.5 py-1 rounded-lg border border-[#1988A3]/25">
              {workspaceName}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#17233E] tracking-tight">Skill Assessment</h1>
          <p className="text-[#5A6D89] text-sm md:text-base mt-1 font-medium">Validate your skills through structured assessments and practical challenges</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-[#8A9CB7] w-4 h-4" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assessments..." 
              className="pl-11 pr-4 py-2.5 bg-[#F0F5FB]/85 backdrop-blur-md border border-[#8A9CB7]/30 rounded-2xl w-60 md:w-72 text-sm text-[#17233E] placeholder:text-[#8A9CB7] focus:outline-none focus:border-[#1988A3] shadow-sm transition-all" 
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <AssessmentStat label="Available Assessments" value={filteredAvailable.length} sub="CURATED FOR YOU" color="cyan" />
        <AssessmentStat label="Completed Attempts" value={taken.length} sub={`PASS RATE: ${taken.length > 0 ? Math.round((taken.filter(t => t.score >= 75).length / taken.length) * 100) : 0}%`} color="emerald" />
        <AssessmentStat label="Verified Skills Earned" value={taken.filter(t => t.score >= 75).length} sub="DATABASE VERIFIED" color="amber" />
        <AssessmentStat label="Ready For Certification" value={taken.filter(t => t.score >= 80).length} sub="80%+ THRESHOLD" color="navy" />
      </div>

      {/* Available Skill Assessments Table */}
      <div className="glass-panel rounded-[2.5rem] overflow-hidden mb-10">
        <div className="p-6 md:p-8 border-b border-[#8A9CB7]/20 flex justify-between items-center">
          <div>
            <h3 className="text-lg md:text-xl font-black text-[#17233E]">Available Skill Assessments</h3>
            <p className="text-xs text-[#5A6D89] font-medium mt-0.5">Test competencies with adaptive questions and AI generation</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#17233E]/5 border-b border-[#8A9CB7]/20 text-[#5A6D89] text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Assessment Name</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4">Duration</th>
                <th className="px-8 py-4">Difficulty</th>
                <th className="px-8 py-4">Questions</th>
                <th className="px-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8A9CB7]/15">
              {filteredAvailable.map((asm) => (
                <AssessmentRow 
                  key={asm.id}
                  name={asm.title} 
                  skill={asm.category} 
                  cat={asm.category} 
                  type={asm.type} 
                  dur={asm.duration} 
                  diff={asm.difficulty} 
                  attempts={asm.totalQuestions} 
                  isLoading={submittingId === asm.id}
                  onStart={() => handleStartAssessment(asm)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Assessments List */}
      {taken.length > 0 && (
        <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-black text-[#17233E] flex items-center gap-3">
              <Award className="w-5 h-5 text-[#1988A3]" /> Completed Attempts History
            </h3>
            <span className="text-xs font-bold text-[#5A6D89] bg-[#17233E]/5 px-3 py-1 rounded-full">
              {taken.length} {taken.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          <div className="space-y-4">
            {taken.map((t) => {
              const difficulty = t.resultsJson?.difficulty || (t.score >= 80 ? 'ADVANCED' : 'INTERMEDIATE');
              const isPassed = t.score >= 75;
              const diffBadgeStyle = difficulty === 'EXPERT' ? 'bg-rose-50 text-rose-600 border-rose-200' : difficulty === 'ADVANCED' ? 'bg-[#1988A3]/10 text-[#1988A3] border-[#1988A3]/25' : 'bg-amber-50 text-amber-600 border-amber-200';

              return (
                <div 
                  key={t.id} 
                  className="p-5 bg-[#F0F5FB]/85 backdrop-blur-md rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-[#8A9CB7]/25 hover:border-[#1988A3]/40 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${
                      isPassed ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      {isPassed ? <Award className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                        <h4 className="font-black text-[#17233E] text-base group-hover:text-[#1988A3] transition-colors">
                          {t.title}
                        </h4>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#17233E]/5 text-[#5A6D89] border border-[#8A9CB7]/20">
                          {t.category}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${diffBadgeStyle}`}>
                          ★ {difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A9CB7] font-medium">{new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end sm:self-auto">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest">Correct Answers</p>
                      <p className="text-xs font-bold text-[#17233E]">{t.correctAnswers} / {t.totalQuestions}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest block mb-0.5">SCORE</span>
                      <span className={`text-xl font-black ${isPassed ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {t.score}%
                      </span>
                    </div>

                    <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border ${
                      isPassed ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-rose-500/10 text-rose-700 border-rose-500/20'
                    }`}>
                      {isPassed ? 'PASSED' : 'GAP CREATED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Question Generation Loader Modal Overlay */}
      {generatingAsm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17233E]/60 backdrop-blur-md p-6 animate-in fade-in duration-200">
          <div className="bg-[#F5F9FD]/95 backdrop-blur-2xl rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl border border-white/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1988A3]/15 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="w-20 h-20 bg-[#1988A3]/10 text-[#1988A3] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#1988A3]/20 shadow-lg shadow-[#1988A3]/15">
              <Sparkles className="w-10 h-10 text-[#1988A3] animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-black text-[#17233E] mb-2">Generating AI Assessment...</h3>
            
            <p className="text-[#5A6D89] text-sm font-medium mb-8 leading-relaxed">
              Google Gemini AI is crafting 5 tailored technical MCQs for <span className="font-bold text-[#17233E]">"{generatingAsm.title}"</span>...
            </p>

            <div className="w-full bg-[#17233E]/10 h-2 rounded-full overflow-hidden relative shadow-inner">
              <div className="h-full bg-gradient-to-r from-[#17233E] via-[#1988A3] to-[#11C6DE] rounded-full animate-pulse w-3/4" />
            </div>
            
            <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1988A3]" />
              Synthesizing domain telemetry
            </p>
          </div>
        </div>
      )}

      {/* Real Interactive Assessment Modal */}
      {activeTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17233E]/70 backdrop-blur-md p-6 overflow-y-auto">
          <div className="bg-[#F5F9FD]/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-white/80">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#17233E] via-[#1B3154] to-[#121E33] p-8 text-white flex justify-between items-center relative">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#1988A3] text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {activeTest.type}
                  </span>
                  <span className="text-xs font-bold text-[#8A9CB7]">• {activeTest.difficulty}</span>
                </div>
                <h2 className="text-2xl font-black">{activeTest.title}</h2>
              </div>

              {!testResult && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm font-bold text-[#11C6DE] border border-white/10">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <button onClick={() => setActiveTest(null)} className="text-[#8A9CB7] hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal Body */}
            {!testResult ? (
              <div className="p-8">
                {/* Stepper Progress */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase text-[#8A9CB7] tracking-widest">
                    Question {currentQIndex + 1} of {activeTest.questions.length}
                  </span>
                  <div className="w-48 h-2 bg-[#17233E]/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1988A3] to-[#11C6DE] transition-all duration-300 rounded-full"
                      style={{ width: `${((currentQIndex + 1) / activeTest.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Question */}
                {activeTest.questions[currentQIndex] && (
                  <div>
                    {validationError && (
                      <div className="mb-6 bg-amber-500/10 border border-amber-500/30 text-amber-700 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0 text-amber-600" />
                        <span>{validationError}</span>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-[#17233E] mb-6 leading-relaxed">
                      {activeTest.questions[currentQIndex].question}
                    </h3>

                    {/* Options Grid */}
                    <div className="space-y-3 mb-8">
                      {activeTest.questions[currentQIndex].options.map((opt, idx) => {
                        const qId = activeTest.questions[currentQIndex].id;
                        const isSelected = userAnswers[qId] === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(qId, idx)}
                            className={`w-full text-left p-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between ${
                              isSelected 
                                ? 'bg-[#1988A3]/10 border-[#1988A3] text-[#17233E] shadow-sm' 
                                : 'bg-white border-[#8A9CB7]/30 text-[#17233E] hover:bg-[#E4EEF8]/80 hover:border-[#1988A3]/40'
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center border ${
                                isSelected ? 'bg-[#1988A3] text-white border-[#1988A3]' : 'bg-[#17233E]/5 text-[#5A6D89] border-[#8A9CB7]/30'
                              }`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              {opt}
                            </span>
                            {isSelected && <Check className="w-5 h-5 text-[#1988A3]" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-[#8A9CB7]/20">
                      <button
                        disabled={currentQIndex === 0}
                        onClick={() => {
                          setValidationError('');
                          setCurrentQIndex(prev => prev - 1);
                        }}
                        className="px-6 py-2.5 border border-[#8A9CB7]/30 rounded-xl text-xs font-bold text-[#5A6D89] hover:bg-[#1988A3]/10 disabled:opacity-40 transition-colors"
                      >
                        Previous
                      </button>

                      {currentQIndex < activeTest.questions.length - 1 ? (
                        <button
                          onClick={handleNextQuestion}
                          className="px-6 py-2.5 bg-[#17233E] text-white rounded-xl text-xs font-bold hover:bg-[#1988A3] transition-colors shadow-md"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={handleValidateAndSubmit}
                          disabled={submittingId === activeTest.id}
                          className="px-8 py-2.5 bg-gradient-to-r from-[#1988A3] to-[#11C6DE] text-[#17233E] rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 transition-colors flex items-center gap-2 shadow-lg shadow-[#1988A3]/25"
                        >
                          {submittingId && <Loader2 className="w-4 h-4 animate-spin" />}
                          Submit Exam
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Test Results View */
              <div className="p-10 text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${
                  testResult.passed ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                }`}>
                  {testResult.passed ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                </div>

                <h3 className="text-2xl font-black text-[#17233E] mb-2">
                  {testResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Completed (Gap Recorded)'}
                </h3>
                
                <p className="text-[#5A6D89] text-sm mb-6 max-w-md mx-auto leading-relaxed">
                  {testResult.message}
                </p>

                <div className="bg-[#17233E]/5 p-6 rounded-2xl max-w-sm mx-auto mb-8 border border-[#8A9CB7]/25 flex justify-around items-center">
                  <div>
                    <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest">Final Score</p>
                    <p className={`text-3xl font-black ${testResult.passed ? 'text-emerald-600' : 'text-rose-500'}`}>{testResult.score}%</p>
                  </div>
                  <div className="h-8 w-px bg-[#8A9CB7]/30" />
                  <div>
                    <p className="text-[10px] font-black text-[#8A9CB7] uppercase tracking-widest">Correct Answers</p>
                    <p className="text-3xl font-black text-[#17233E]">{testResult.correct} / {testResult.total}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTest(null)}
                  className="bg-[#17233E] hover:bg-[#1988A3] text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  Return to Assessments Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

// --- Sub Components ---

const AssessmentStat = ({ label, value, sub, color }) => {
  const themes = {
    cyan: 'text-[#1988A3] bg-[#1988A3]/10 border border-[#1988A3]/20',
    emerald: 'text-emerald-600 bg-emerald-500/10 border border-emerald-500/20',
    amber: 'text-amber-600 bg-amber-500/10 border border-amber-500/20',
    navy: 'text-[#17233E] bg-[#17233E]/10 border border-[#17233E]/20'
  };
  return (
    <div className="glass-panel p-6 rounded-[2rem]">
      <p className="text-[#5A6D89] text-xs font-bold mb-3">{label}</p>
      <h3 className="text-3xl font-black text-[#17233E] mb-3 tracking-tight">{value}</h3>
      <span className={`${themes[color]} px-3 py-1 rounded-lg text-[9px] font-black tracking-widest inline-block`}>
        {sub}
      </span>
    </div>
  );
};

const AssessmentRow = ({ name, skill, cat, type, dur, diff, attempts, isLoading, onStart }) => {
  const diffBadge = diff === 'EXPERT' ? 'bg-rose-50 text-rose-600 border-rose-200' : diff === 'ADVANCED' ? 'bg-[#1988A3]/10 text-[#1988A3] border-[#1988A3]/25' : 'bg-amber-50 text-amber-600 border-amber-200';
  return (
    <tr className="hover:bg-[#E4EEF8]/60 transition-all cursor-pointer group">
      <td className="px-8 py-5">
        <h4 className="font-black text-[#17233E] text-sm group-hover:text-[#1988A3] transition-colors">{name}</h4>
        <p className="text-[#8A9CB7] text-xs font-medium mt-0.5">Category: {cat}</p>
      </td>
      <td className="px-8 py-5 text-[#5A6D89] font-bold text-xs">{cat}</td>
      <td className="px-8 py-5">
        <span className="bg-[#1988A3]/10 text-[#1988A3] px-3 py-1 rounded-full font-black text-[10px] tracking-wider uppercase border border-[#1988A3]/20">
          {type}
        </span>
      </td>
      <td className="px-8 py-5 text-[#5A6D89] font-bold text-xs">{dur}</td>
      <td className="px-8 py-5 font-black text-[10px]">
        <span className={`px-3 py-1 rounded-full border inline-block ${diffBadge}`}>
          ★ {diff}
        </span>
      </td>
      <td className="px-8 py-5 text-[#5A6D89] font-bold text-xs">{attempts} Questions</td>
      <td className="px-8 py-5">
        <button 
          onClick={onStart}
          disabled={isLoading}
          className="bg-[#17233E] hover:bg-[#1988A3] text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 disabled:opacity-80"
        >
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#11C6DE]" />}
          {isLoading ? 'Generating AI...' : 'Start Assessment'}
        </button>
      </td>
    </tr>
  );
};

export default SkillAssessment;
