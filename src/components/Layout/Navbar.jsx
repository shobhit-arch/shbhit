import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  RefreshCw,
  Download,
  Moon,
  Sun,
  User,
  ChevronDown,
  GitCompare,
  LogOut,
  Shield,
  Clock,
} from 'lucide-react';
import { useState } from 'react';
import useStore from '../../store/useStore';
import { exportToCSV } from '../../services/googleSheets';

export default function Navbar({ onRefresh }) {
  const {
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    filteredData,
    lastUpdated,
    sidebarOpen,
    toggleNotifications,
    comparisonMode,
    toggleComparisonMode,
    user,
    logout,
  } = useStore();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-30 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200 dark:border-white/10 shadow-sm transition-colors duration-500"
      style={{ marginLeft: sidebarOpen ? 280 : 80, transition: 'margin-left 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      <div className="flex items-center justify-between h-20 px-8">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-surface-500" />
          </div>
          <input
            type="text"
            placeholder="Search projects, clients, or metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-2xl text-sm text-surface-900 dark:text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/40 transition-all duration-300"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-6">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="flex items-center justify-center p-2.5 rounded-2xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 hover:bg-surface-200 dark:hover:bg-white/10 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-all cursor-pointer shadow-sm dark:shadow-none"
            title="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-500" />
            )}
          </motion.button>

          <div className="h-6 w-px bg-surface-200 dark:bg-white/10 mx-2" />

          {/* Action Group */}
          <div className="flex items-center gap-2">
            {[
              { icon: GitCompare, title: "Comparison Mode", action: toggleComparisonMode, active: comparisonMode, color: "text-primary-500 dark:text-primary-400" },
              { icon: RefreshCw, title: "Refresh Data", action: handleRefresh, spin: isRefreshing },
              { icon: Download, title: "Export CSV", action: () => exportToCSV(filteredData) },
            ].map((btn, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={btn.action}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  btn.active 
                    ? 'bg-primary-50 dark:bg-primary-500/20 border-primary-200 dark:border-primary-500/40 text-primary-600 dark:text-primary-400 shadow-sm dark:shadow-primary-500/10' 
                    : 'bg-surface-100 dark:bg-white/5 border-surface-200 dark:border-white/10 text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-200 dark:hover:bg-white/10'
                }`}
                title={btn.title}
              >
                <btn.icon className={`w-4 h-4 ${btn.spin ? 'animate-spin' : ''}`} />
              </motion.button>
            ))}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleNotifications}
              className="relative p-2.5 rounded-2xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-200 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-4 ring-surface-50 dark:ring-surface-950 transition-all shadow-glow" />
            </motion.button>
          </div>

          <div className="h-6 w-px bg-surface-200 dark:bg-white/10 mx-2" />

          {/* Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 hover:border-primary-500/40 transition-all cursor-pointer group shadow-sm dark:shadow-xl"
            >
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20 relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-sm font-bold text-surface-900 dark:text-white tracking-tight uppercase leading-none mb-1">
                  {user?.name || 'Loading...'}
                </p>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-2.5 h-2.5 text-primary-500" />
                  <p className="text-[9px] text-surface-500 font-bold uppercase tracking-widest leading-none">
                    {user?.role || 'User'}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-surface-500 group-hover:text-surface-900 dark:group-hover:text-white transition-colors" />
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-60 rounded-2xl glass border border-surface-200 dark:border-white/10 shadow-2xl overflow-hidden p-2"
                >
                  <div className="px-3 py-3 border-b border-surface-200 dark:border-white/5 mb-2">
                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Logged in as</p>
                    <p className="text-sm font-bold text-surface-900 dark:text-white truncate">{user?.email}</p>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-white/5 hover:text-surface-900 dark:hover:text-white transition-all cursor-pointer"
                    >
                      <User className="w-4 h-4" /> Account Settings
                    </button>
                    
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>

                  <div className="border-t border-surface-200 dark:border-white/5 mt-2 pt-2 px-3 pb-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-surface-500 uppercase tracking-widest">
                      <Clock className="w-2.5 h-2.5" />
                      Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
