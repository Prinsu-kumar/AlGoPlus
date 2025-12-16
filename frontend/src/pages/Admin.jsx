import React, { useState } from 'react';
import { Plus, Edit, Trash2, Home, RefreshCw, Zap, Video, Cpu, Database, Shield, Rocket } from 'lucide-react';
import { NavLink } from 'react-router';

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeHover, setActiveHover] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding challenge to the platform',
      icon: Plus,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-900/30 to-emerald-900/20',
      iconColor: 'text-green-400',
      route: '/admin/create',
      emoji: '🚀'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit and optimize existing challenges',
      icon: Edit,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-900/30 to-orange-900/20',
      iconColor: 'text-yellow-400',
      route: '/admin/update',
      emoji: '⚡'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove outdated challenges from the system',
      icon: Trash2,
      color: 'from-red-400 to-rose-500',
      bgColor: 'from-red-900/30 to-rose-900/20',
      iconColor: 'text-red-400',
      route: '/admin/delete',
      emoji: '🧹'
    },
    {
      id: 'video',
      title: 'Video Manager',
      description: 'Upload and manage solution videos',
      icon: Video,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-900/30 to-cyan-900/20',
      iconColor: 'text-blue-400',
      route: '/admin/video',
      emoji: '🎬'
    },
    {
      id: 'system',
      title: 'System Monitor',
      description: 'Monitor platform performance and analytics',
      icon: Cpu,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-900/30 to-pink-900/20',
      iconColor: 'text-purple-400',
      route: '/admin/system',
      emoji: '📊'
    },
    {
      id: 'database',
      title: 'Database',
      description: 'Manage user data and problem statistics',
      icon: Database,
      color: 'from-indigo-400 to-violet-500',
      bgColor: 'from-indigo-900/30 to-violet-900/20',
      iconColor: 'text-indigo-400',
      route: '/admin/database',
      emoji: '💾'
    }
  ];

  const stats = [
    { label: 'Total Problems', value: '1,247', change: '+12%', color: 'cyan' },
    { label: 'Active Users', value: '24.5K', change: '+8%', color: 'green' },
    { label: 'Avg Solve Rate', value: '68%', change: '+5%', color: 'yellow' },
    { label: 'System Health', value: '99.9%', change: '+0.2%', color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,${0.05 + Math.random() * 0.1}) 0%, transparent 70%)`,
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header with Stats */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center animate-rotate-slow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
                Admin Control Center
              </h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Advanced management panel for platform administration and content control
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                    <div className="text-2xl font-bold text-white mt-1">{stat.value}</div>
                  </div>
                  <div className={`text-${stat.color}-400 text-sm font-bold bg-${stat.color}-500/10 px-2 py-1 rounded`}>
                    {stat.change}
                  </div>
                </div>
                <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-full transition-all duration-1000 group-hover:w-full`}
                    style={{ width: `${70 + index * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Admin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            const isHovered = activeHover === option.id;
            
            return (
              <div
                key={option.id}
                onMouseEnter={() => setActiveHover(option.id)}
                onMouseLeave={() => setActiveHover(null)}
                className="relative group"
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${option.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}></div>
                
                {/* Card */}
                <div className={`relative bg-gradient-to-br ${option.bgColor} backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-${option.color.split('from-')[1].split('-')[0]}-500/20 ${
                  isHovered ? 'scale-105 shadow-2xl' : ''
                }`}>
                  {/* Icon and Emoji */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 bg-gradient-to-br ${option.color}/20 rounded-xl border border-white/10`}>
                      <IconComponent size={28} className={option.iconColor} />
                    </div>
                    <span className="text-2xl">{option.emoji}</span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {option.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {option.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="flex items-center justify-between mt-auto">
                    <NavLink 
                      to={option.route}
                      className={`px-5 py-2.5 bg-gradient-to-r ${option.color} text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2`}
                    >
                      <span>Access</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </NavLink>
                    
                    {/* Quick Stats */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                        <span>Ready</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Line */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${option.color} transition-all duration-500 group-hover:w-3/4`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">⚡ Quick Actions</h3>
                <p className="text-gray-400 text-sm">Perform common admin tasks instantly</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 rounded-lg border border-white/10 transition-all duration-300 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh Cache
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 hover:from-cyan-800/40 hover:to-blue-800/40 text-cyan-300 rounded-lg border border-cyan-500/30 transition-all duration-300 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Run Diagnostics
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-green-900/30 to-emerald-900/30 hover:from-green-800/40 hover:to-emerald-800/40 text-green-300 rounded-lg border border-green-500/30 transition-all duration-300 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Return Home
                </button>
              </div>
            </div>
            
            {/* Live Status */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">System Status: </span>
                    <span className="text-sm text-green-400 font-medium">All Systems Operational</span>
                  </div>
                  <div className="text-xs text-gray-500">Last updated: Just now</div>
                </div>
                <div className="text-xs text-gray-500">
                  Version 2.5.1 • Admin Mode Active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 CodePulse Admin • Secure Panel • All activities are logged
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Warning: Unauthorized access is strictly prohibited
          </p>
        </div>
      </div>

      {/* Custom Animations CSS */}
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
            transform: translateY(-10px) rotate(180deg);
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
        
        .animate-rotate-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}

export default Admin;