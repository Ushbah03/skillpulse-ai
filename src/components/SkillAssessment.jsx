import React, { useState, useEffect } from 'react';
import { 
  Search, History, Layout, Filter, ArrowUpDown, Sparkles, Check, Loader2, Clock, Award, ShieldAlert, ChevronRight, X, AlertCircle, CheckCircle2
} from 'lucide-react';
import { employeeAPI } from '../services/api';

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
      question: "Which VPC networking component allows instances in a private subnet to connect to the internet while blocking inbound connections?",
      options: ["Internet Gateway", "NAT Gateway", "Route Table", "Security Group"],
      correct: 1
    },
    {
      id: 5,
      question: "Which AWS managed relational database engine supports PostgreSQL, MySQL, and MariaDB?",
      options: ["DynamoDB", "Amazon RDS", "ElastiCache", "Redshift"],
      correct: 1
    }
  ],
  'asm-4': [
    {
      id: 1,
      question: "Which Python library is the foundation for numerical computing, N-dimensional arrays, and vectorization?",
      options: ["Matplotlib", "NumPy", "Flask", "Requests"],
      correct: 1
    },
    {
      id: 2,
      question: "What Pandas data structure represents a 2D tabular data structure with labeled axes?",
      options: ["Series", "DataFrame", "Panel", "Tensor"],
      correct: 1
    },
    {
      id: 3,
      question: "Which Python library is the industry standard for traditional Machine Learning algorithms?",
      options: ["Scikit-Learn", "Seaborn", "NLTK", "BeautifulSoup"],
      correct: 0
    },
    {
      id: 4,
      question: "What method in Pandas is used to replace missing or null (NaN) values in a DataFrame?",
      options: ["df.fillna()", "df.clean()", "df.removeNull()", "df.replaceNaN()"],
      correct: 0
    },
    {
      id: 5,
      question: "Which library is commonly paired with Pandas for data visualization and plotting in Python?",
      options: ["Matplotlib / Seaborn", "SQLAlchemy", "Requests", "SciPy"],
      correct: 0
    }
  ]
};

const fallbackAvailable = [
  { id: 'asm-1', title: 'React Advanced Hooks', category: 'Frontend', type: 'AI-BASED', duration: '5 Min', difficulty: 'INTERMEDIATE', totalQuestions: 5, maxAttempts: 3 },
  { id: 'asm-2', title: 'Node.js Design Patterns', category: 'Backend', type: 'PRACTICAL', duration: '5 Min', difficulty: 'ADVANCED', totalQuestions: 5, maxAttempts: 1 },
  { id: 'asm-3', title: 'AWS Architect Associate', category: 'Cloud & DevOps', type: 'MCQ', duration: '5 Min', difficulty: 'EXPERT', totalQuestions: 5, maxAttempts: 2 },
  { id: 'asm-4', title: 'Python for Data Science', category: 'Data & AI', type: 'CODING CHALLENGE', duration: '5 Min', difficulty: 'INTERMEDIATE', totalQuestions: 5, maxAttempts: 3 }
];

const SkillAssessment = () => {
  const [available, setAvailable] = useState([]);
  const [taken, setTaken] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [submittingId, setSubmittingId] = useState(null);

  // Active Assessment Test Modal State
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
      // Auto-submit when time expires
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
      // Call Live Gemini AI API via Backend
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
      // Dynamically generate tailored questions for user's specific skill & category!
      const titleClean = asm.title.replace('Skill Verification', '').trim();
      questions = [
        {
          id: 1,
          question: `What is the core fundamental principle behind effective ${titleClean} implementation in professional workflows?`,
          options: [
            `Standardized best practices and structured methodology`,
            `Ad-hoc unmanaged execution`,
            `Ignoring domain-specific standards`,
            `Relying solely on default legacy configurations`
          ],
          correct: 0
        },
        {
          id: 2,
          question: `When evaluating ${titleClean} for high-performance projects, which factor yields the highest optimization?`,
          options: [
            `Minimizing architectural overhead and following modular design`,
            `Increasing monolithic complexity`,
            `Bypassing error handling & validation checks`,
            `Manual repetitive operations without automation`
          ],
          correct: 0
        },
        {
          id: 3,
          question: `In ${asm.category} domain, how is ${titleClean} quality typically benchmarked and validated?`,
          options: [
            `Random guessing`,
            `Through peer reviews, automated verification, and performance metrics`,
            `Ignoring documentation standards`,
            `Relying only on subjective user feedback`
          ],
          correct: 1
        },
        {
          id: 4,
          question: `What is the most effective approach to troubleshooting complex issues in ${titleClean}?`,
          options: [
            `Systematic root-cause analysis (5-Whys / Isolating variables)`,
            `Restarting systems without inspecting logs`,
            `Deleting configuration files`,
            `Ignoring error tracebacks`
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

  // Option Select
  const handleSelectOption = (qId, optionIdx) => {
    setValidationError('');
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  // Next Question with Validation
  const handleNextQuestion = () => {
    const currentQId = activeTest.questions[currentQIndex].id;
    if (userAnswers[currentQId] === undefined) {
      setValidationError('Please select an option before moving to the next question.');
      return;
    }
    setValidationError('');
    setCurrentQIndex(prev => prev + 1);
  };

  // Final Submit with Validation
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

  // Submit Test & Calculate Real Score
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

        // Refresh lists
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

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-10 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Check className="w-5 h-5" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
              {workspaceName}
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skill Assessment</h1>
          <p className="text-slate-500 text-base mt-1 font-medium">Validate your skills through structured assessments and practical challenges</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assessments..." 
              className="pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl w-72 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-sm" 
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        <AssessmentStat label="Available Assessments" value={filteredAvailable.length} sub="CURATED FOR YOU" color="blue" />
        <AssessmentStat label="Completed Attempts" value={taken.length} sub={`PASS RATE: ${taken.length > 0 ? Math.round((taken.filter(t => t.score >= 75).length / taken.length) * 100) : 0}%`} color="emerald" />
        <AssessmentStat label="Verified Skills Earned" value={taken.filter(t => t.score >= 75).length} sub="DATABASE VERIFIED" color="orange" />
        <AssessmentStat label="Ready For Certification" value={taken.filter(t => t.score >= 80).length} sub="80%+ THRESHOLD" color="violet" />
      </div>

      {/* Available Skill Assessments Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Available Skill Assessments</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
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
          <tbody className="divide-y divide-slate-50">
            {filteredAvailable.map((asm) => (
              <AssessmentRow 
                key={asm.id}
                name={asm.title} 
                skill={asm.category} 
                cat={asm.category} 
                type={asm.type} 
                dur={asm.duration} 
                diff={asm.difficulty} 
                diffColor={asm.difficulty === 'EXPERT' ? 'text-red-500' : asm.difficulty === 'ADVANCED' ? 'text-violet-500' : 'text-orange-500'} 
                attempts={asm.totalQuestions} 
                isLoading={submittingId === asm.id}
                onStart={() => handleStartAssessment(asm)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Completed Assessments List */}
      {taken.length > 0 && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <Award className="w-5 h-5 text-indigo-600" /> Completed Attempts History
            </h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              {taken.length} {taken.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          <div className="space-y-4">
            {taken.map((t) => {
              const difficulty = t.resultsJson?.difficulty || (t.score >= 80 ? 'ADVANCED' : 'INTERMEDIATE');
              const isPassed = t.score >= 75;
              const diffBadgeStyle = difficulty === 'EXPERT' ? 'bg-rose-50 text-rose-600 border-rose-200' : difficulty === 'ADVANCED' ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-amber-50 text-amber-600 border-amber-200';

              return (
                <div 
                  key={t.id} 
                  className="p-5 bg-white rounded-2xl flex justify-between items-center border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${
                      isPassed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {isPassed ? <Award className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                        <h4 className="font-black text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                          {t.title}
                        </h4>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {t.category}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${diffBadgeStyle}`}>
                          ★ {difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">{new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Answers</p>
                      <p className="text-xs font-bold text-slate-700">{t.correctAnswers} / {t.totalQuestions}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">SCORE</span>
                      <span className={`text-xl font-black ${isPassed ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {t.score}%
                      </span>
                    </div>

                    <span className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm border ${
                      isPassed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="w-20 h-20 bg-blue-600/10 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10">
              <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2">Generating AI Assessment...</h3>
            
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
              Google Gemini AI is crafting 5 tailored technical MCQs for <span className="font-bold text-slate-800">"{generatingAsm.title}"</span>...
            </p>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative shadow-inner">
              <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse w-3/4" />
            </div>
            
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              Building customized questions
            </p>
          </div>
        </div>
      )}

      {/* Real Interactive Assessment Modal */}
      {activeTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-6 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100">
            
            {/* Modal Header */}
            <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center relative">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {activeTest.type}
                  </span>
                  <span className="text-xs font-bold text-slate-400">• {activeTest.difficulty}</span>
                </div>
                <h2 className="text-2xl font-black">{activeTest.title}</h2>
              </div>

              {!testResult && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-sm font-bold text-blue-400 border border-white/10">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <button onClick={() => setActiveTest(null)} className="text-slate-400 hover:text-white transition-colors">
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
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">
                    Question {currentQIndex + 1} of {activeTest.questions.length}
                  </span>
                  <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                      style={{ width: `${((currentQIndex + 1) / activeTest.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Question */}
                {activeTest.questions[currentQIndex] && (
                  <div>
                    {validationError && (
                      <div className="mb-6 bg-amber-500/10 border border-amber-500/30 text-amber-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-bounce">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0 text-amber-500" />
                        <span>{validationError}</span>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-slate-900 mb-6 leading-relaxed">
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
                                ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm' 
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center border ${
                                isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              {opt}
                            </span>
                            {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <button
                        disabled={currentQIndex === 0}
                        onClick={() => {
                          setValidationError('');
                          setCurrentQIndex(prev => prev - 1);
                        }}
                        className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                      >
                        Previous
                      </button>

                      {currentQIndex < activeTest.questions.length - 1 ? (
                        <button
                          onClick={handleNextQuestion}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={handleValidateAndSubmit}
                          disabled={submittingId === activeTest.id}
                          className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-black uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
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
                  testResult.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {testResult.passed ? <CheckCircle2 className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {testResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Completed (Gap Recorded)'}
                </h3>
                
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                  {testResult.message}
                </p>

                <div className="bg-slate-50 p-6 rounded-2xl max-w-sm mx-auto mb-8 border border-slate-100 flex justify-around items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Score</p>
                    <p className={`text-3xl font-black ${testResult.passed ? 'text-emerald-600' : 'text-rose-500'}`}>{testResult.score}%</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct Answers</p>
                    <p className="text-3xl font-black text-slate-800">{testResult.correct} / {testResult.total}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTest(null)}
                  className="bg-[#0F172A] text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg"
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
    blue: 'text-blue-600 bg-blue-50/50',
    emerald: 'text-emerald-600 bg-emerald-50/50',
    orange: 'text-orange-600 bg-orange-50/50',
    violet: 'text-violet-600 bg-violet-50/50'
  };
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <p className="text-slate-400 text-xs font-bold mb-4">{label}</p>
      <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">{value}</h3>
      <span className={`${themes[color]} px-3 py-1 rounded-lg text-[10px] font-black tracking-widest`}>
        {sub}
      </span>
    </div>
  );
};

const AssessmentRow = ({ name, skill, cat, type, dur, diff, attempts, isLoading, onStart }) => {
  const diffBadge = diff === 'EXPERT' ? 'bg-rose-50 text-rose-600 border-rose-200' : diff === 'ADVANCED' ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-amber-50 text-amber-600 border-amber-200';
  return (
    <tr className="hover:bg-slate-50/70 transition-all cursor-pointer group">
      <td className="px-8 py-6">
        <h4 className="font-black text-slate-900 text-base group-hover:text-blue-600 transition-colors">{name}</h4>
        <p className="text-slate-400 text-xs font-medium mt-0.5">Category: {cat}</p>
      </td>
      <td className="px-8 py-6 text-slate-600 font-bold text-sm">{cat}</td>
      <td className="px-8 py-6">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-black text-[10px] tracking-wider uppercase border border-blue-200">
          {type}
        </span>
      </td>
      <td className="px-8 py-6 text-slate-500 font-bold text-sm">{dur}</td>
      <td className="px-8 py-6 font-black text-[10px]">
        <span className={`px-3 py-1 rounded-full border inline-block ${diffBadge}`}>
          ★ {diff}
        </span>
      </td>
      <td className="px-8 py-6 text-slate-600 font-bold text-sm">{attempts} Questions</td>
      <td className="px-8 py-6">
        <button 
          onClick={onStart}
          disabled={isLoading}
          className="bg-[#0F172A] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-80"
        >
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />}
          {isLoading ? 'Generating AI Test...' : 'Start Assessment'}
        </button>
      </td>
    </tr>
  );
};

export default SkillAssessment;