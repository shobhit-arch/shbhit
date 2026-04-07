import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BarChart3,
  Table2,
  Brain,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  GitCompare,
  LogOut,
} from 'lucide-react';
import useStore from '../../store/useStore';
import Logo from '../UI/Logo';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'table', label: 'Data Table', icon: Table2 },
  { id: 'insights', label: 'AI Insights', icon: Brain },
  { id: 'comparison', label: 'Compare', icon: GitCompare },
];

const bottomItems = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, activeView, setActiveView, logout } = useStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 280 : 80 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-white dark:bg-surface-950 border-r border-surface-200 dark:border-white/10 shadow-elite transition-colors duration-500"
    >
      {/* Logo Container */}
      <div className={`flex items-center h-20 border-b border-surface-200 dark:border-white/5 transition-all duration-300 overflow-hidden ${sidebarOpen ? 'px-6 justify-start' : 'justify-center px-0'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={sidebarOpen ? 'full' : 'mini'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center w-full"
          >
            <Logo collapsed={!sidebarOpen} className="text-surface-900 dark:text-white" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] uppercase tracking-[0.2em] text-surface-500 font-bold px-4 mb-3"
            >
              Overview
            </motion.p>
          )}
        </AnimatePresence>
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer relative group ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-white shadow-xl shadow-primary-500/10'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-2xl bg-primary-500/5 border border-primary-500/20"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="py-3 px-3 space-y-1 border-t border-surface-200 dark:border-white/5">
        {bottomItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeView === item.id
                ? 'bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400'
                : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Logout Item */}
      <div className="py-3 px-3 border-t border-surface-200 dark:border-white/5">
        <motion.button
          onClick={() => logout()}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Toggle Button */}
      <motion.button
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-surface-800 border-surface-200 border dark:border-white/10 flex items-center justify-center text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors cursor-pointer z-50 shadow-sm"
      >
        {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </motion.button>
    </motion.aside>
  );
}
