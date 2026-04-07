import { motion } from 'framer-motion';
import { GitCompare, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export default function ComparisonView() {
  const { rawData } = useStore();

  // Get data by month
  const months = [...new Set(rawData.map(d => d.month))];
  if (months.length < 2) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass border border-surface-200 dark:border-white/5 p-10 text-center shadow-sm dark:shadow-none"
      >
        <GitCompare className="w-12 h-12 text-surface-500 dark:text-surface-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Comparison Mode</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400">Need at least 2 months of data to compare.</p>
      </motion.div>
    );
  }

  const month1 = months[0];
  const month2 = months[1];
  const data1 = rawData.filter(d => d.month === month1);
  const data2 = rawData.filter(d => d.month === month2);

  const calcTotals = (data) => ({
    revenue: data.reduce((s, d) => s + (d.revInINR || 0), 0),
    cost: data.reduce((s, d) => s + (d.costWithAdmin || 0), 0),
    profit: data.reduce((s, d) => s + (d.difference || 0), 0),
    clients: new Set(data.map(d => d.client)).size,
    resources: data.reduce((s, d) => s + (d.personUtilized || 0), 0),
  });

  const totals1 = calcTotals(data1);
  const totals2 = calcTotals(data2);

  const metrics = [
    { label: 'Total Revenue', m1: totals1.revenue, m2: totals2.revenue, isCurrency: true },
    { label: 'Total Cost', m1: totals1.cost, m2: totals2.cost, isCurrency: true },
    { label: 'Net Profit/Loss', m1: totals1.profit, m2: totals2.profit, isCurrency: true },
    { label: 'Active Clients', m1: totals1.clients, m2: totals2.clients, isCurrency: false },
    { label: 'Resources Used', m1: totals1.resources, m2: totals2.resources, isCurrency: false },
  ];

  // Compare clients across months
  const allClients = [...new Set(rawData.map(d => d.client))].sort();
  const clientComparison = allClients.map(client => {
    const d1 = data1.find(d => d.client === client);
    const d2 = data2.find(d => d.client === client);
    return {
      client,
      rev1: d1 ? (d1.revInINR || 0) : 0,
      rev2: d2 ? (d2.revInINR || 0) : 0,
      diff1: d1?.difference || 0,
      diff2: d2?.difference || 0,
    };
  }).filter(c => c.rev1 > 0 || c.rev2 > 0).slice(0, 15);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
          <GitCompare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">Month Comparison</h2>
          <p className="text-xs text-surface-500 dark:text-surface-400">{month1} vs {month2}</p>
        </div>
      </div>

      {/* KPI Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map((metric, i) => {
          const change = metric.m1 !== 0 ? ((metric.m2 - metric.m1) / Math.abs(metric.m1)) * 100 : 0;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-4 glass border border-surface-200 dark:border-white/5 shadow-sm dark:shadow-none"
            >
              <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-3">{metric.label}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-surface-500 dark:text-surface-400">{month1}</span>
                  <span className="text-sm font-bold text-surface-900 dark:text-white">
                    {metric.isCurrency ? formatCurrency(metric.m1) : metric.m1.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-surface-500 dark:text-surface-400">{month2}</span>
                  <span className="text-sm font-bold text-surface-900 dark:text-white">
                    {metric.isCurrency ? formatCurrency(metric.m2) : metric.m2.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className={`mt-3 pt-3 border-t border-surface-200 dark:border-white/5 flex items-center gap-1 ${change > 0 ? 'text-emerald-500 dark:text-emerald-400' : change < 0 ? 'text-red-500 dark:text-red-400' : 'text-surface-500 dark:text-surface-400'}`}>
                {change > 0 ? <ArrowUp className="w-3 h-3" /> : change < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span className="text-xs font-semibold">{formatPercent(change)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Client Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl glass border border-surface-200 dark:border-white/5 overflow-hidden shadow-sm dark:shadow-none"
      >
        <div className="p-4 border-b border-surface-200 dark:border-white/5">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Client-Level Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-white/5">
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-surface-600 dark:text-surface-500 uppercase">Client</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-surface-600 dark:text-surface-500 uppercase">{month1} Rev</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-surface-600 dark:text-surface-500 uppercase">{month2} Rev</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-surface-600 dark:text-surface-500 uppercase">Change</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-surface-600 dark:text-surface-500 uppercase">{month1} P/L</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-surface-600 dark:text-surface-500 uppercase">{month2} P/L</th>
              </tr>
            </thead>
            <tbody>
              {clientComparison.map((c, i) => {
                const revChange = c.rev1 !== 0 ? ((c.rev2 - c.rev1) / Math.abs(c.rev1)) * 100 : 0;
                return (
                  <motion.tr
                    key={c.client}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.03 }}
                    className="border-b border-surface-100 dark:border-white/3 hover:bg-surface-50 dark:hover:bg-white/3 transition-all"
                  >
                    <td className="px-4 py-2.5 text-sm text-surface-900 dark:text-white font-medium">{c.client}</td>
                    <td className="px-4 py-2.5 text-sm text-surface-500 dark:text-surface-300 text-right font-mono">{formatCurrency(c.rev1)}</td>
                    <td className="px-4 py-2.5 text-sm text-surface-500 dark:text-surface-300 text-right font-mono">{formatCurrency(c.rev2)}</td>
                    <td className={`px-4 py-2.5 text-sm text-right font-mono font-medium ${revChange > 0 ? 'text-emerald-500 dark:text-emerald-400' : revChange < 0 ? 'text-red-500 dark:text-red-400' : 'text-surface-500 dark:text-surface-400'}`}>
                      {formatPercent(revChange)}
                    </td>
                    <td className={`px-4 py-2.5 text-sm text-right font-mono ${c.diff1 >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {formatCurrency(c.diff1)}
                    </td>
                    <td className={`px-4 py-2.5 text-sm text-right font-mono ${c.diff2 >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {formatCurrency(c.diff2)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
