import { useEffect, useCallback, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import KPICards from './components/Dashboard/KPICards';
import Charts from './components/Dashboard/Charts';
import DataTable from './components/Dashboard/DataTable';
import Filters from './components/Dashboard/Filters';
import AIInsights from './components/Dashboard/AIInsights';
import ComparisonView from './components/Dashboard/ComparisonView';
import NotificationsPanel from './components/Dashboard/NotificationsPanel';
import Background from './components/UI/Background';
import { DashboardSkeleton } from './components/UI/SkeletonLoader';
import { fetchSheetData } from './services/googleSheets';
import useStore from './store/useStore';
import Login from './pages/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import { Shield, Lock, Loader2 } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function App() {
  const { 
    isLoading, 
    error, 
    sidebarOpen, 
    activeView, 
    setRawData, 
    setLoading, 
    setError,
    checkAuth,
    isAuthenticated
  } = useStore();
  
  const location = useLocation();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSheetData();
      setRawData(data);
    } catch (err) {
      setError(err.message);
    }
  }, [setRawData, setLoading, setError]);

  useEffect(() => {
    checkAuth();
    loadData();
    // Initialize dark mode
    if (useStore.getState().darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [loadData, checkAuth]);

  return (
    <div className="min-h-screen text-surface-900 dark:text-white transition-colors duration-300 bg-white dark:bg-surface-950">
      <Background />
      <NotificationsPanel />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        
        {/* PROTECTED DASHBOARD ROUTES */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardLayout loadData={loadData} />} />
          {/* Catch-all for protected routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

function DashboardLayout({ loadData }) {
  const { sidebarOpen, activeView, isLoading, error } = useStore();

  const renderContent = () => {
    if (isLoading) return <DashboardSkeleton />;

    if (error) {
      return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl glass border border-red-500/20 p-10 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Failed to Load Data</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadData}
              className="px-6 py-2 rounded-xl gradient-primary text-white text-sm font-medium cursor-pointer"
            >
              Try Again
            </motion.button>
          </motion.div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'table':
        return <TableView />;
      case 'insights':
        return <InsightsView />;
      case 'comparison':
        return <ComparisonView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <>
      <Sidebar />
      <Navbar onRefresh={loadData} />
      <main
        className="transition-all duration-300 ease-out pt-4 pb-10 px-6 min-h-screen"
        style={{ marginLeft: sidebarOpen ? 280 : 80, transition: 'margin-left 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-surface-950 dark:text-white mb-1.5 tracking-tight">
            {getPageTitle(activeView)}
          </h1>
          <p className="text-sm font-medium text-surface-600 dark:text-surface-400 opacity-80">
            {getPageSubtitle(activeView)}
          </p>
        </motion.div>

        {/* Filters (show on relevant views) */}
        {['dashboard', 'analytics', 'table'].includes(activeView) && !isLoading && (
          <div className="mb-6">
            <Filters />
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}

// VIEW COMPONENTS (SAME AS BEFORE)
function DashboardView() {
  return (
    <div className="space-y-6 overflow-x-auto custom-scrollbar pb-6">
      <KPICards />
      <Charts />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DataTable />
        </div>
        <div className="h-full">
          <AIInsights />
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="space-y-6 overflow-x-auto custom-scrollbar pb-6">
      <KPICards />
      <Charts />
    </div>
  );
}

function TableView() {
  return <DataTable />;
}

function InsightsView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AIInsights />
      <div className="space-y-4">
        <KPICards />
      </div>
    </div>
  );
}

function NotificationsView() {
  const { filteredData } = useStore();
  const lossClients = filteredData.filter(d => d.difference < 0).sort((a, b) => a.difference - b.difference);
  const topClients = filteredData.filter(d => d.percent > 20).sort((a, b) => b.percent - a.percent);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/5 shadow-elite p-5"
      >
        <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
          <span>⚠️</span> Loss Alerts ({lossClients.length} clients)
        </h3>
        <div className="space-y-2">
          {lossClients.slice(0, 10).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10"
            >
              <div>
                <p className="text-sm text-surface-900 dark:text-white font-medium">{c.client}</p>
                <p className="text-[10px] text-surface-500 dark:text-surface-400">{c.month} • {c.sheetPerson}</p>
              </div>
              <span className="text-sm font-mono text-red-500 dark:text-red-400">{Math.abs(c.difference).toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/5 shadow-elite p-5"
      >
        <h3 className="text-sm font-semibold text-emerald-400 mb-4 flex items-center gap-2">
          <span>🏆</span> Top Performers ({topClients.length} clients)
        </h3>
        <div className="space-y-2">
          {topClients.slice(0, 10).map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10"
            >
              <div>
                <p className="text-sm text-surface-900 dark:text-white font-medium">{c.client}</p>
                <p className="text-[10px] text-surface-500 dark:text-surface-400">{c.month} • {c.sheetPerson}</p>
              </div>
              <span className="text-sm font-mono text-emerald-500 dark:text-emerald-400">+{c.percent.toFixed(1)}%</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SettingsView() {
  const { role, setRole, changePassword, authLoading } = useStore();
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (passwords.new !== passwords.confirm) {
      return setStatus({ type: 'error', message: 'New passwords do not match' });
    }

    if (passwords.new.length < 6) {
      return setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
    }

    const { success, message } = await changePassword(passwords.old, passwords.new);
    if (success) {
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setPasswords({ old: '', new: '', confirm: '' });
    } else {
      setStatus({ type: 'error', message: message || 'Failed to update password' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Preferences Card */}
      <div className="rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/5 shadow-elite p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500">
             <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-surface-950 dark:text-white">General Preferences</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/5">
            <div>
              <p className="text-sm font-bold text-surface-950 dark:text-white">Active Role</p>
              <p className="text-[10px] text-surface-500 dark:text-surface-400 font-medium uppercase tracking-tight">Access Level Management</p>
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-white/10 text-sm font-bold text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer shadow-sm"
            >
              <option value="Admin">👑 Admin</option>
              <option value="Manager">📋 Manager</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div className="rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/5 shadow-elite p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
             <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-surface-950 dark:text-white">Security & Access</h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest ml-1">Current Password</label>
            <input
              type="password"
              required
              value={passwords.old}
              onChange={(e) => setPasswords({...passwords, old: e.target.value})}
              className="w-full px-4 py-3 bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest ml-1">New Password</label>
            <input
              type="password"
              required
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              className="w-full px-4 py-3 bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest ml-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="w-full px-4 py-3 bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <AnimatePresence mode="wait">
            {status.message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  status.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}
              >
                {status.type === 'success' ? '✅' : '⚠️'}
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={authLoading}
            type="submit"
            className="w-full py-3.5 bg-surface-950 dark:bg-white text-white dark:text-surface-950 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {authLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Update Security Protocol'
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

// HELPERS
function getPageTitle(view) {
  const titles = {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    table: 'Data Table',
    insights: 'AI Insights',
    comparison: 'Comparison',
    notifications: 'Alerts & Notifications',
    settings: 'Settings',
  };
  return titles[view] || 'Dashboard';
}

function getPageSubtitle(view) {
  const subtitles = {
    dashboard: 'Real-time financial analytics overview',
    analytics: 'Deep dive into revenue and cost trends',
    table: 'Search, sort, and export financial records',
    insights: 'AI-powered analysis of your financial data',
    comparison: 'Month-over-month performance comparison',
    notifications: 'Alerts for losses and top performers',
    settings: 'Configure dashboard preferences',
  };
  return subtitles[view] || '';
}
