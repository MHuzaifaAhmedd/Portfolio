'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import WorldClassLoader from '../../../components/WorldClassLoader';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated, login } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      window.location.href = '/admin';
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();
      console.log('Login response:', result);

      if (result.success) {
        console.log('Token from response:', result.data.token.substring(0, 20) + '...');
        login(result.data.token);
        window.location.href = '/admin';
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#1a2332] to-[#0a0f1f] flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-16 sm:top-20 left-16 sm:left-20 w-24 h-24 sm:w-32 sm:h-32 border border-cyan-400/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-32 sm:top-40 right-24 sm:right-32 w-20 h-20 sm:w-24 sm:h-24 border border-blue-500/20 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-24 sm:bottom-32 left-24 sm:left-32 w-16 h-16 sm:w-20 sm:h-20 border border-cyan-400/20 rounded-full"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.25, 0.1],
            rotate: [0, 90, 180]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg relative z-10"
      >
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6 sm:mb-10"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl shadow-cyan-400/25">
            <span className="text-3xl sm:text-4xl font-bold text-black">H</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-3">
            Portfolio Admin
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">Professional Access Portal</p>
          <div className="w-20 h-1 sm:w-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mt-3 sm:mt-4"></div>
        </motion.div>

        {/* Enhanced Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#1a2332]/95 to-[#0f1a2a]/95 backdrop-blur-2xl border border-[#2a3342]/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-cyan-400/10 relative overflow-hidden"
        >
          {/* Form background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 opacity-30"></div>
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center space-x-2">
                  <span>📧</span>
                  <span>Email Address</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full bg-[#0a0f1f]/90 border border-[#2a3342] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 pl-12 sm:pl-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base"
                    placeholder="admin@huzaifa.dev"
                  />
                  <span className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-cyan-400 text-lg sm:text-xl">📧</span>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center space-x-2">
                  <span>🔒</span>
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="w-full bg-[#0a0f1f]/90 border border-[#2a3342] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 pl-12 sm:pl-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your password"
                  />
                  <span className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 text-cyan-400 text-lg sm:text-xl">🔒</span>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="p-3 sm:p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl sm:rounded-2xl text-red-400 text-xs sm:text-sm backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>⚠️</span>
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-black font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-2xl shadow-cyan-400/25 hover:shadow-cyan-400/40 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <span>🚀</span>
                      <span>Access Admin Panel</span>
                    </span>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Enhanced Demo Credentials */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-[#0f1a2a]/80 to-[#1a2332]/80 rounded-xl sm:rounded-2xl border border-[#2a3342]/50 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-cyan-400 text-base sm:text-lg">💡</span>
                <p className="text-gray-300 font-medium text-sm sm:text-base">Demo Credentials</p>
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-cyan-400 font-mono bg-[#0f1a2a]/50 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm break-all">{credentials.email || 'admin@huzaifa.dev'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                  <span className="text-gray-400">Password:</span>
                  <span className="text-cyan-400 font-mono bg-[#0f1a2a]/50 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm">{credentials.password || 'June_2k03'}</span>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-lg sm:rounded-xl border border-cyan-400/20">
                <p className="text-xs text-cyan-400 text-center">
                  🔐 Secure access to your portfolio management system
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6 sm:mt-8"
        >
          <p className="text-gray-500 text-xs sm:text-sm">
            Protected by enterprise-grade security • Built with Next.js & Framer Motion
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
