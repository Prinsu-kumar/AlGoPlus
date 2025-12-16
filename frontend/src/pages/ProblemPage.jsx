import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [hoveredTab, setHoveredTab] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;

        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 shadow-green-500/30';
      case 'medium': return 'text-yellow-400 shadow-yellow-500/30';
      case 'hard': return 'text-red-400 shadow-red-500/30';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyGradient = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'hard': return 'from-red-500 to-rose-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin reverse"></div>
          <div className="absolute inset-3 border-4 border-pink-500/30 border-l-pink-500 rounded-full animate-spin"></div>
          <p className="mt-6 text-center text-cyan-300 animate-pulse">Loading Problem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Left Panel - Problem Description */}
      <div className="w-1/2 flex flex-col border-r border-white/10 relative">
        {/* Left Panel Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-gray-950/20 backdrop-blur-xl"></div>
        
        {/* Left Tabs - Futuristic Design */}
        <div className="relative z-10 flex px-4 pt-4 bg-gradient-to-b from-black/20 to-transparent">
          {[
            { id: 'description', label: 'Description', icon: '📝' },
            { id: 'editorial', label: 'Editorial', icon: '📚' },
            { id: 'solutions', label: 'Solutions', icon: '💡' },
            { id: 'submissions', label: 'Submissions', icon: '📊' },
            { id: 'chatAI', label: 'ChatAI', icon: '🤖' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`relative px-6 py-3 text-sm font-medium transition-all duration-300 transform ${
                activeLeftTab === tab.id
                  ? 'text-cyan-300'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              onClick={() => setActiveLeftTab(tab.id)}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </span>
              
              {/* Active indicator */}
              {activeLeftTab === tab.id && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                </>
              )}
              
              {/* Hover effect */}
              {hoveredTab === tab.id && activeLeftTab !== tab.id && (
                <div className="absolute inset-0 bg-white/5 rounded-lg -z-10"></div>
              )}
            </button>
          ))}
        </div>

        {/* Left Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div className="animate-fadeIn">
                  {/* Problem Header */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-4 mb-4">
                      <h1 className="text-3xl font-bold text-white">
                        <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                          {problem.title}
                        </span>
                      </h1>
                      <div className={`px-4 py-1 bg-gradient-to-r ${getDifficultyGradient(problem.difficulty)} text-white font-bold rounded-full text-sm shadow-lg`}>
                        {problem.difficulty.toUpperCase()}
                      </div>
                      <div className="px-4 py-1 bg-gray-800/50 text-cyan-300 font-medium rounded-full text-sm border border-cyan-500/30">
                        {problem.tags}
                      </div>
                    </div>
                    
                    {/* Stats Bar */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-300">Acceptance: 72.8%</span>
                      </div>
                      <div className="h-4 w-px bg-gray-700"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-300">Likes: 12.5K</span>
                      </div>
                      <div className="h-4 w-px bg-gray-700"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-300">Dislikes: 890</span>
                      </div>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="prose prose-invert max-w-none mb-8">
                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed bg-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                      {problem.description}
                    </div>
                  </div>

                  {/* Examples Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-cyan-400">📋</span>
                      Examples
                    </h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div 
                          key={index} 
                          className="group bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-xl p-5 rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300"
                        >
                          <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                            Example {index + 1}
                          </h4>
                          <div className="space-y-3 font-mono">
                            <div className="flex gap-2">
                              <strong className="text-gray-400">Input:</strong>
                              <div className="flex-1 px-3 py-2 bg-black/30 rounded text-gray-300 border border-gray-700">
                                {example.input}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <strong className="text-gray-400">Output:</strong>
                              <div className="flex-1 px-3 py-2 bg-black/30 rounded text-gray-300 border border-gray-700">
                                {example.output}
                              </div>
                            </div>
                            {example.explanation && (
                              <div className="flex gap-2">
                                <strong className="text-gray-400">Explanation:</strong>
                                <div className="flex-1 px-3 py-2 bg-black/30 rounded text-gray-300 border border-gray-700">
                                  {example.explanation}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constraints Section */}
                  <div className="p-5 bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-xl border border-white/10">
                    <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                      <span className="text-red-400">⚠️</span>
                      Constraints
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <span>1 ≤ n ≤ 10⁵</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <span>-10⁹ ≤ nums[i] ≤ 10⁹</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        <span>You must solve it in O(n) time complexity</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="animate-fadeIn">
                  <div className="p-5 bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-xl border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-yellow-400">📚</span>
                      Editorial
                    </h2>
                    <Editorial 
                      secureUrl={problem.secureUrl} 
                      thumbnailUrl={problem.thumbnailUrl} 
                      duration={problem.duration}
                    />
                  </div>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div className="animate-fadeIn">
                  <div className="p-5 bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-xl border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-green-400">💡</span>
                      Solutions
                    </h2>
                    <div className="space-y-4">
                      {problem.referenceSolution?.map((solution, index) => (
                        <div key={index} className="group bg-gray-900/40 backdrop-blur-sm rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
                          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 px-4 py-3 rounded-t-lg border-b border-white/10">
                            <h3 className="font-semibold text-white">{problem?.title} - {solution?.language}</h3>
                          </div>
                          <div className="p-4">
                            <pre className="bg-black/40 p-4 rounded text-sm overflow-x-auto text-gray-300 border border-gray-800">
                              <code>{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-4">🔒</div>
                          <p className="text-gray-400">Solutions will be available after you solve the problem.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div className="animate-fadeIn">
                  <div className="p-5 bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-xl border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-blue-400">📊</span>
                      My Submissions
                    </h2>
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

              {activeLeftTab === 'chatAI' && (
                <div className="animate-fadeIn">
                  <div className="p-5 bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-xl rounded-xl border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-purple-400">🤖</span>
                      Chat with AI Assistant
                    </h2>
                    <ChatAi problem={problem} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="w-1/2 flex flex-col relative">
        {/* Right Panel Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-gray-950/20 backdrop-blur-xl"></div>
        
        {/* Right Tabs */}
        <div className="relative z-10 flex px-4 pt-4 bg-gradient-to-b from-black/20 to-transparent">
          {[
            { id: 'code', label: 'Code', icon: '💻' },
            { id: 'testcase', label: 'Testcase', icon: '🧪' },
            { id: 'result', label: 'Result', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`relative px-6 py-3 text-sm font-medium transition-all duration-300 transform ${
                activeRightTab === tab.id
                  ? 'text-cyan-300'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveRightTab(tab.id)}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </span>
              
              {/* Active indicator */}
              {activeRightTab === tab.id && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector - Futuristic Design */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-gray-900/40 to-gray-800/20">
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        selectedLanguage === lang
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                      {selectedLanguage === lang && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse ring-2 ring-green-500/50"></div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Theme Toggle */}
                <button
                  onClick={() => setIsDarkTheme(!isDarkTheme)}
                  className="px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg hover:text-white hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                >
                  {isDarkTheme ? '🌙' : '☀️'}
                  <span className="text-sm">{isDarkTheme ? 'Dark' : 'Light'}</span>
                </button>
              </div>

              {/* Enhanced Monaco Editor Container */}
              <div className="flex-1 relative">
                {/* Editor Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-purple-900/10 to-pink-900/10"></div>
                
                {/* Editor */}
                <div className="absolute inset-0">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme={isDarkTheme ? "vs-dark" : "light"}
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                      cursorBlinking: 'smooth',
                      mouseWheelZoom: true,
                      smoothScrolling: true,
                      contextmenu: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: 'on',
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        useShadows: false
                      },
                      overviewRulerBorder: false,
                      renderIndentGuides: true,
                      guides: {
                        indentation: true
                      },
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons - Enhanced */}
              <div className="p-4 border-t border-white/10 bg-gradient-to-r from-gray-900/40 to-gray-800/20 flex justify-between">
                <div className="flex gap-2">
                  <button 
                    className="px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg hover:text-white hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-2"
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    <span>📊</span>
                    Console
                  </button>
                  <button 
                    className="px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg hover:text-white hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-2"
                    onClick={() => setCode(problem?.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '')}
                  >
                    <span>↻</span>
                    Reset Code
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    className={`relative px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    <div className="absolute inset-0 w-1/2 bg-white/20 skew-x-12 translate-x-[-200%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                    <span className="relative flex items-center gap-2">
                      {loading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Running...
                        </>
                      ) : (
                        <>
                          <span>▶️</span>
                          Run Code
                        </>
                      )}
                    </span>
                  </button>
                  <button
                    className={`relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    <div className="absolute inset-0 w-1/2 bg-white/20 skew-x-12 translate-x-[-200%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
                    <span className="relative flex items-center gap-2">
                      {loading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          Submit Solution
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-yellow-400">🧪</span>
                Test Results
              </h3>
              
              {runResult ? (
                <div className={`p-5 rounded-xl border ${
                  runResult.success 
                    ? 'border-green-500/30 bg-gradient-to-r from-green-900/20 to-emerald-900/10' 
                    : 'border-red-500/30 bg-gradient-to-r from-red-900/20 to-rose-900/10'
                } backdrop-blur-sm`}>
                  {runResult.success ? (
                    <div className="animate-fadeIn">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white">✓</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-green-400 text-lg">✅ All Test Cases Passed!</h4>
                          <p className="text-gray-400 text-sm">Your solution works correctly</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
                          <div className="text-gray-400 text-sm">Runtime</div>
                          <div className="text-green-400 text-lg font-bold">{runResult.runtime} sec</div>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg border border-gray-800">
                          <div className="text-gray-400 text-sm">Memory</div>
                          <div className="text-blue-400 text-lg font-bold">{runResult.memory} KB</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="font-semibold text-gray-300 mb-3">Test Case Details:</h5>
                        <div className="space-y-3">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="bg-black/40 p-3 rounded-lg border border-gray-800">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-400">Test Case {i + 1}</span>
                              </div>
                              <div className="font-mono text-sm space-y-1">
                                <div><span className="text-gray-500">Input:</span> <span className="text-gray-300">{tc.stdin}</span></div>
                                <div><span className="text-gray-500">Expected:</span> <span className="text-green-400">{tc.expected_output}</span></div>
                                <div><span className="text-gray-500">Output:</span> <span className="text-green-400">{tc.stdout}</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fadeIn">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white">✗</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-red-400 text-lg">❌ Test Failed</h4>
                          <p className="text-gray-400 text-sm">Some test cases didn't pass</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {runResult.testCases.map((tc, i) => (
                          <div key={i} className="bg-black/40 p-3 rounded-lg border border-gray-800">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${tc.status_id === 3 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-sm text-gray-400">Test Case {i + 1}</span>
                              </div>
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                tc.status_id === 3 
                                  ? 'bg-green-900/30 text-green-400' 
                                  : 'bg-red-900/30 text-red-400'
                              }`}>
                                {tc.status_id === 3 ? 'PASSED' : 'FAILED'}
                              </span>
                            </div>
                            <div className="font-mono text-sm space-y-1">
                              <div><span className="text-gray-500">Input:</span> <span className="text-gray-300">{tc.stdin}</span></div>
                              <div><span className="text-gray-500">Expected:</span> <span className="text-green-400">{tc.expected_output}</span></div>
                              <div><span className="text-gray-500">Output:</span> <span className="text-red-400">{tc.stdout}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-r from-gray-900/20 to-gray-800/10 rounded-xl border border-white/10">
                  <div className="text-6xl mb-6">⚡</div>
                  <h4 className="text-xl font-semibold text-gray-300 mb-2">No Test Results Yet</h4>
                  <p className="text-gray-500">Click "Run Code" to test your solution with example cases</p>
                </div>
              )}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-400">📈</span>
                Submission Result
              </h3>
              
              {submitResult ? (
                <div className={`p-5 rounded-xl border backdrop-blur-sm ${
                  submitResult.accepted
                    ? 'border-green-500/30 bg-gradient-to-r from-green-900/20 to-emerald-900/10'
                    : 'border-red-500/30 bg-gradient-to-r from-red-900/20 to-rose-900/10'
                }`}>
                  {submitResult.accepted ? (
                    <div className="animate-fadeIn">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-white text-3xl">🎉</span>
                          </div>
                          <div className="absolute inset-0 border-2 border-green-500/30 rounded-full animate-ping-slow"></div>
                        </div>
                        <div>
                          <h4 className="font-bold text-3xl text-green-400 mb-2">Accepted!</h4>
                          <p className="text-gray-300">Your solution passed all test cases</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                          <div className="text-gray-400 text-sm mb-1">Test Cases</div>
                          <div className="text-2xl font-bold text-white">
                            {submitResult.passedTestCases}<span className="text-gray-500">/</span>{submitResult.totalTestCases}
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                              style={{ width: `${(submitResult.passedTestCases / submitResult.totalTestCases) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                          <div className="text-gray-400 text-sm mb-1">Runtime</div>
                          <div className="text-2xl font-bold text-green-400">{submitResult.runtime} sec</div>
                          <div className="text-xs text-gray-500 mt-1">Beats 92.5% of users</div>
                        </div>
                        <div className="bg-black/30 p-4 rounded-xl border border-gray-800">
                          <div className="text-gray-400 text-sm mb-1">Memory</div>
                          <div className="text-2xl font-bold text-blue-400">{submitResult.memory} KB</div>
                          <div className="text-xs text-gray-500 mt-1">Beats 87.3% of users</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                          View All Submissions
                        </button>
                        <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                          Next Problem →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fadeIn">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-3xl">❌</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-3xl text-red-400 mb-2">Wrong Answer</h4>
                          <p className="text-gray-300">{submitResult.error || 'Your solution failed some test cases'}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6 p-4 bg-black/30 rounded-xl border border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-gray-300">Test Cases Passed</div>
                          <div className="text-lg font-bold text-red-400">
                            {submitResult.passedTestCases}<span className="text-gray-500">/</span>{submitResult.totalTestCases}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000"
                            style={{ width: `${(submitResult.passedTestCases / submitResult.totalTestCases) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                          Run Code Again
                        </button>
                        <button className="flex-1 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                          View Editorial
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-r from-gray-900/20 to-gray-800/10 rounded-xl border border-white/10">
                  <div className="text-6xl mb-6">📤</div>
                  <h4 className="text-xl font-semibold text-gray-300 mb-2">No Submission Results</h4>
                  <p className="text-gray-500">Submit your solution to see the evaluation results</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProblemPage;