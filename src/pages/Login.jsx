import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import api from '../services/api';
import Logo from '../components/UI/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const { login, authLoading, authError, isAuthenticated } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // DIAGNOSTIC HEARTBEAT
    const checkConnection = async () => {
      try {
        const response = await api.get('/health');
        if (response.data.status === 'ok') {
          setConnectionStatus('online');
          console.log('[Diagnostic] Auth Server is REACHABLE via Proxy');
        }
      } catch (err) {
        setConnectionStatus('offline');
        console.error('[Diagnostic] Auth Server is UNREACHABLE:', err.message);
      }
    };
    checkConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[Diagnostic] Submit Clicked for:', email);
    const success = await login(email, password);
    if (success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-surface-50 dark:bg-surface-950 transition-colors duration-500 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Unified Login Card */}
        <div className="glass-card shadow-elite rounded-[32px] p-8 sm:p-10 border border-surface-200/50 dark:border-white/10 bg-white/80 dark:bg-surface-900/80 backdrop-blur-3xl relative overflow-hidden">
          {/* Logo Section - Now Inside */}
          <div className="flex flex-col items-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <Logo collapsed={false} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-surface-500 dark:text-surface-400 text-[10px] font-bold tracking-[0.2em] uppercase text-center"
            >
              Elite Financial Intelligence
            </motion.p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-surface-950 dark:text-white tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 font-medium">
              Please enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-surface-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ehs.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-surface-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {authError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-xs font-bold text-red-500">{authError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={authLoading}
              type="submit"
              className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-surface-100 dark:border-white/5 flex items-center justify-center gap-2 text-surface-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Access Protocol</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
