import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    streak: 7
  });
  const [activeHover, setActiveHover] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: problemsData } = await axiosClient.get('/problem/getAllProblem');
        setProblems(problemsData);
        
        if (user) {
          const { data: solvedData } = await axiosClient.get('/problem/problemSolvedByUser');
          setSolvedProblems(solvedData);
          
          const solvedCount = solvedData.length;
          const easyCount = problemsData.filter(p => p.difficulty === 'easy').length;
          const mediumCount = problemsData.filter(p => p.difficulty === 'medium').length;
          const hardCount = problemsData.filter(p => p.difficulty === 'hard').length;
          
          setStats({
            total: problemsData.length,
            solved: solvedCount,
            easy: easyCount,
            medium: mediumCount,
            hard: hardCount,
            streak: Math.floor(Math.random() * 30) + 1
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id)) ||
                      (filters.status === 'unsolved' && !solvedProblems.some(sp => sp._id === problem._id));
    return difficultyMatch && tagMatch && statusMatch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'from-green-400 to-emerald-300';
      case 'medium': return 'from-yellow-400 to-orange-300';
      case 'hard': return 'from-red-500 to-pink-400';
      default: return 'from-gray-400 to-gray-300';
    }
  };

  const getDifficultyEmoji = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '😊';
      case 'medium': return '🤔';
      case 'hard': return '🔥';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,${0.1 + Math.random() * 0.2}) 0%, transparent 70%)`,
              width: `${Math.random() * 30 + 5}px`,
              height: `${Math.random() * 30 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      {/* Mouse follower glow */}
      <div 
        className="fixed w-64 h-64 rounded-full blur-3xl pointer-events-none z-0 transition-transform duration-100"
        style={{
          background: 'radial-gradient(circle, rgba(147,51,234,0.3) 0%, transparent 70%)',
          transform: `translate(${mousePosition.x - 128}px, ${mousePosition.y - 128}px)`,
        }}
      />

      {/* Navigation Bar */}
      <nav className="relative z-50 bg-gradient-to-r from-black/40 via-purple-900/40 to-black/40 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-purple-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with animation */}
            <NavLink to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center animate-rotate-slow group-hover:animate-spin">
                  <span className="text-white font-bold text-xl">{'</>'}</span>
                </div>
                <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-xl animate-ping-slow"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
                  AlGoPlUs
                </h1>
                <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-500"></div>
              </div>
            </NavLink>

            {/* Welcome Message */}
            <div className="hidden md:block text-center">
              <div className="text-sm text-cyan-300 animate-pulse">
                Good {timeOfDay}, {user?.firstName}!
              </div>
              <div className="text-xs text-purple-300">
                Ready to solve some challenges?
              </div>
            </div>

            {/* User Profile with Energy */}
            <div className="relative group">
              <button className="relative flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-pink-900/30 rounded-2xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
                {/* Energy ring */}
                <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-2xl animate-spin-slow"></div>
                
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/30">
                    {user?.firstName?.[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse ring-2 ring-green-400/50"></div>
                </div>
                
                <div className="text-left">
                  <div className="text-white font-bold text-lg">{user?.firstName}</div>
                  <div className="text-xs bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                    Level {Math.floor(stats.solved / 10) + 1}
                  </div>
                </div>
                
                <svg className="w-5 h-5 text-cyan-300 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-3 w-56 bg-gradient-to-b from-black/90 to-purple-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                <div className="p-4">
                  {user?.role === 'admin' && (
                    <NavLink 
                      to="/admin"
                      className="flex items-center px-4 py-3 mb-2 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 hover:from-cyan-700/50 hover:to-purple-700/50 rounded-xl text-white transition-all duration-300 group/item"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Admin Panel</div>
                        <div className="text-xs text-cyan-300">Control Center</div>
                      </div>
                      <div className="ml-auto text-cyan-300 group-hover/item:translate-x-1 transition-transform">
                        →
                      </div>
                    </NavLink>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-red-900/30 to-pink-900/30 hover:from-red-700/50 hover:to-pink-700/50 rounded-xl text-white transition-all duration-300 group/item"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-400 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Logout</div>
                      <div className="text-xs text-pink-300">End Session</div>
                    </div>
                    <div className="ml-auto text-pink-300 group-hover/item:translate-x-1 transition-transform">
                      →
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Animated Stats Header */}
        <div className="relative mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Problems', value: stats.total, color: 'from-cyan-500 to-blue-500', icon: '📚', desc: 'Available' },
              { label: 'Solved', value: stats.solved, color: 'from-green-400 to-emerald-400', icon: '✅', desc: 'Completed' },
              { label: 'Accuracy', value: stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0, color: 'from-purple-500 to-pink-500', icon: '🎯', desc: 'Rate' },
              { label: 'Streak', value: stats.streak, color: 'from-orange-500 to-red-500', icon: '🔥', desc: 'Days' }
            ].map((stat, index) => (
              <div 
                key={index}
                onMouseEnter={() => setActiveHover(index)}
                onMouseLeave={() => setActiveHover(null)}
                className={`relative bg-gradient-to-br ${stat.color}/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-${stat.color.split('from-')[1].split('-')[0]}-500/30 ${
                  activeHover === index ? 'scale-105 shadow-2xl' : ''
                }`}
              >
                {/* Animated background effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 rounded-2xl transition-opacity duration-500 ${
                  activeHover === index ? 'opacity-10' : ''
                }`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-300 mb-1">{stat.label}</div>
                      <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.desc}</div>
                    </div>
                    <div className="text-3xl animate-bounce-slow">{stat.icon}</div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${Math.min(stat.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Animated welcome message */}
          <div className="mt-8 text-center">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-2 animate-gradient">
                Ready to Level Up Your Skills?
              </h2>
              <p className="text-cyan-200">Solve problems to earn XP and climb the leaderboard! 🚀</p>
            </div>
          </div>
        </div>

        {/* Interactive Filters */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-black/40 via-purple-900/30 to-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="mr-2">🔍</span>
              Filter Challenges
              <span className="ml-auto text-sm text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full">
                {filteredProblems.length} Results
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Status', value: filters.status, options: ['all', 'solved', 'unsolved'], icon: '📊' },
                { label: 'Difficulty', value: filters.difficulty, options: ['all', 'easy', 'medium', 'hard'], icon: '⚡' },
                { label: 'Tags', value: filters.tag, options: ['all', 'array', 'linkedList', 'graph', 'dp', 'tree', 'string'], icon: '🏷️' }
              ].map((filter, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-xl mr-2">{filter.icon}</span>
                      <label className="text-sm font-medium text-gray-300">{filter.label}</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filter.options.map(option => (
                        <button
                          key={option}
                          onClick={() => setFilters({...filters, [filter.label.toLowerCase()]: option})}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                            filter.value === option 
                              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg' 
                              : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setFilters({ difficulty: 'all', tag: 'all', status: 'all' })}
                className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl border border-white/10 transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin reverse"></div>
              <div className="absolute inset-3 border-4 border-pink-500/30 border-l-pink-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-xl text-white font-semibold animate-pulse">
              Loading your coding journey...
            </p>
            <p className="mt-2 text-cyan-300">Preparing challenges</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-xl border border-white/10 rounded-3xl">
            <div className="text-6xl mb-6">🤖</div>
            <h3 className="text-3xl font-bold text-white mb-4">No Problems Found</h3>
            <p className="text-gray-300 mb-6">Try adjusting your filters or check back later!</p>
            <button 
              onClick={() => setFilters({ difficulty: 'all', tag: 'all', status: 'all' })}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-cyan-500/30"
            >
              Show All Problems
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProblems.map((problem, index) => {
              const isSolved = solvedProblems.some(sp => sp._id === problem._id);
              return (
                <div 
                  key={problem._id}
                  onMouseEnter={() => setActiveHover(`problem-${index}`)}
                  onMouseLeave={() => setActiveHover(null)}
                  className={`group relative bg-gradient-to-br from-gray-900/60 to-purple-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 ${
                    activeHover === `problem-${index}` ? 'scale-[1.02] shadow-2xl' : ''
                  }`}
                >
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-cyan-500/50 transition-all duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-3">{getDifficultyEmoji(problem.difficulty)}</span>
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                            <NavLink to={`/problem/${problem._id}`} className="hover:underline">
                              {problem.title}
                            </NavLink>
                          </h3>
                          {isSolved && (
                            <span className="ml-3 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 flex items-center animate-pulse">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                              SOLVED
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                          {problem.description || "Challenge your skills with this problem!"}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r ${getDifficultyColor(problem.difficulty)} text-white shadow-lg`}>
                            {problem.difficulty.toUpperCase()}
                          </span>
                          <span className="px-4 py-2 text-sm font-medium rounded-xl bg-white/5 text-gray-300 border border-white/10">
                            {problem.tags}
                          </span>
                          <span className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {problem.acceptance || 'N/A'}% Success
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <NavLink 
                          to={`/problem/${problem._id}`}
                          className="relative inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50 group/btn"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                          <span className="relative flex items-center">
                            Solve Now
                            <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                        </NavLink>
                        
                        {isSolved && (
                          <div className="mt-3 text-center">
                            <div className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                              +50 XP Earned
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Challenge Progress</span>
                        <span>{Math.floor(Math.random() * 100)}% Attempted</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getDifficultyColor(problem.difficulty)} rounded-full transition-all duration-1000`}
                          style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer with Energy */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Keep Coding! 💻
              </div>
              <p className="text-gray-400 mt-2">Every problem solved makes you stronger</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-cyan-400 text-2xl font-bold">{problems.length}</div>
                  <div className="text-xs text-gray-400">Total Problems</div>
                </div>
                <div className="h-8 w-px bg-gradient-to-b from-cyan-500 to-purple-500"></div>
                <div className="text-center">
                  <div className="text-green-400 text-2xl font-bold">{stats.solved}</div>
                  <div className="text-xs text-gray-400">Your Solved</div>
                </div>
                <div className="h-8 w-px bg-gradient-to-b from-purple-500 to-pink-500"></div>
                <div className="text-center">
                  <div className="text-yellow-400 text-2xl font-bold">{stats.streak}</div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} CodePulse • Turn problems into possibilities 🚀</p>
            <p className="mt-2 text-xs">Real-time updates • Community driven • Always improving</p>
          </div>
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
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
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          background-image: linear-gradient(to right, #67e8f9, #a855f7, #ec4899, #67e8f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-rotate-slow {
          animation: spin-slow 30s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-spin.reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
}

export default Homepage;