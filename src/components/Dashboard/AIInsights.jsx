import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Users, BarChart3, Sparkles } from 'lucide-react';
import useStore from '../../store/useStore';

const iconMap = {
  success: TrendingUp,
  danger: TrendingDown,
  warning: AlertTriangle,
  info: BarChart3,
};

const colorMap = {
  success: {
    bg: 'bg-surface-50 dark:bg-white/5',
    border: 'border-surface-200 dark:border-white/5 border-l-4 border-l-emerald-500 dark:border-l-emerald-400',
    text: 'text-surface-900 dark:text-white',
    icon: 'text-emerald-500 dark:text-emerald-400',
  },
  danger: {
    bg: 'bg-surface-50 dark:bg-white/5',
    border: 'border-surface-200 dark:border-white/5 border-l-4 border-l-red-500 dark:border-l-red-400',
    text: 'text-surface-900 dark:text-white',
    icon: 'text-red-500 dark:text-red-400',
  },
  warning: {
    bg: 'bg-surface-50 dark:bg-white/5',
    border: 'border-surface-200 dark:border-white/5 border-l-4 border-l-amber-500 dark:border-l-amber-400',
    text: 'text-surface-900 dark:text-white',
    icon: 'text-amber-500 dark:text-amber-400',
  },
  info: {
    bg: 'bg-surface-50 dark:bg-white/5',
    border: 'border-surface-200 dark:border-white/5 border-l-4 border-l-blue-500 dark:border-l-blue-400',
    text: 'text-surface-900 dark:text-white',
    icon: 'text-blue-500 dark:text-blue-400',
  },
};

export default function AIInsights() {
  const { getAIInsights } = useStore();
  const insights = getAIInsights();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl glass border border-surface-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-surface-200 dark:border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-500/20 dark:to-purple-500/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">AI Insights</h3>
            <span className="px-1.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Auto
            </span>
          </div>
          <p className="text-[10px] text-surface-500 dark:text-surface-400 mt-0.5">
            Intelligent analysis of your financial data
          </p>
        </div>
      </div>

      {/* Insights List */}
      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-10 h-10 text-surface-600 mx-auto mb-3" />
            <p className="text-sm text-surface-500">No data available for analysis</p>
          </div>
        ) : (
          insights.map((insight, i) => {
            const colors = colorMap[insight.type] || colorMap.info;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                whileHover={{ x: 4 }}
                className={`flex items-start gap-3 p-3.5 rounded-xl ${colors.bg} border ${colors.border} transition-all cursor-default`}
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{insight.icon}</span>
                <p className={`text-sm ${colors.text} leading-relaxed`}>{insight.text}</p>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
