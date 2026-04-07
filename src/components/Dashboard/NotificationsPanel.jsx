import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle, TrendingDown, DollarSign, Clock } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatCurrency } from '../../utils/formatters';

export default function NotificationsPanel() {
  const { showNotifications, toggleNotifications, filteredData, currency } = useStore();

  // Generate notifications from data
  const notifications = [];

  // Find negative profit clients
  const lossClients = filteredData.filter(d => d.difference < 0).sort((a, b) => a.difference - b.difference);
  lossClients.slice(0, 3).forEach(client => {
    notifications.push({
      id: `loss-${client.id}`,
      type: 'warning',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      title: `${client.client} is at a loss`,
      description: `Net loss of ${formatCurrency(Math.abs(client.difference), 'INR')} in ${client.month}`,
      time: 'Latest',
    });
  });

  // Top performers
  const topClients = filteredData.filter(d => d.percent > 50).sort((a, b) => b.percent - a.percent);
  topClients.slice(0, 2).forEach(client => {
    notifications.push({
      id: `top-${client.id}`,
      type: 'success',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      title: `${client.client} performing well`,
      description: `Growth of ${client.percent.toFixed(1)}% in ${client.month}`,
      time: 'Latest',
    });
  });

  // High cost alerts
  const highCost = filteredData.filter(d => d.costWithAdmin > 100000).sort((a, b) => b.costWithAdmin - a.costWithAdmin);
  highCost.slice(0, 2).forEach(client => {
    notifications.push({
      id: `cost-${client.id}`,
      type: 'info',
      icon: <TrendingDown className="w-4 h-4 text-blue-400" />,
      title: `High cost alert: ${client.client}`,
      description: `Cost with admin: ${formatCurrency(client.costWithAdmin, 'INR')}`,
      time: 'Latest',
    });
  });

  return (
    <AnimatePresence>
      {showNotifications && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleNotifications}
            className="fixed inset-0 z-50 bg-black/40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-96 z-50 glass border-l border-white/10 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-400" />
                <h2 className="text-sm font-semibold text-white">Notifications</h2>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400">
                  {notifications.length}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleNotifications}
                className="p-1.5 rounded-lg hover:bg-white/5 text-surface-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Notifications List */}
            <div className="p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-10 h-10 text-surface-600 mx-auto mb-3" />
                  <p className="text-sm text-surface-500">No notifications</p>
                </div>
              ) : (
                notifications.map((notif, i) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="mt-0.5">{notif.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{notif.title}</p>
                      <p className="text-[10px] text-surface-400 mt-0.5">{notif.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-surface-500 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {notif.time}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
