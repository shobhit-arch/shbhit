import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, BarChart3, Activity, PieChart as PieIcon } from 'lucide-react';
import useStore from '../../store/useStore';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#818cf8', '#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#2dd4bf', '#e879f9', '#60a5fa'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass rounded-xl p-3 border border-surface-200 dark:border-white/10 shadow-sm dark:shadow-2xl">
      <p className="text-xs font-semibold text-surface-900 dark:text-white mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-surface-500 dark:text-surface-400">{entry.name}:</span>
          <span className="text-surface-900 dark:text-white font-medium">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function Charts() {
  const { getChartData, getClientChartData } = useStore();
  const chartData = getChartData();
  const clientData = getClientChartData();
  const [selectedChart, setSelectedChart] = useState(null);

  // Profit distribution for pie chart
  const profitData = clientData
    .filter(d => d.revenue > 0)
    .slice(0, 8)
    .map(d => ({ name: d.client, value: Math.abs(d.revenue) }));

  return (
    <div className="space-y-4">
      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue vs Cost Line Chart */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/5 shadow-elite group transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/15 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Revenue vs Cost</h3>
                  <p className="text-[10px] text-surface-500 dark:text-surface-500">Monthly comparison</p>
                </div>
              </div>
            </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#818cf8" strokeWidth={2.5} dot={{ fill: '#818cf8', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#818cf8' }} />
              <Line type="monotone" dataKey="cost" name="Cost" stroke="#f87171" strokeWidth={2.5} dot={{ fill: '#f87171', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#f87171' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Profit Distribution Bar Chart */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/5 shadow-elite transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Client Profitability</h3>
                  <p className="text-[10px] text-surface-500 dark:text-surface-500">Top clients by profit</p>
                </div>
              </div>
            </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={clientData.slice(0, 10)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
              <YAxis dataKey="client" type="category" width={100} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="profit" name="Profit" radius={[0, 4, 4, 0]} maxBarSize={20}>
                {clientData.slice(0, 10).map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.profit >= 0 ? '#34d399' : '#f87171'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue Trend Area Chart */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/5 shadow-elite transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-50 dark:bg-accent-500/15 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Revenue Trend</h3>
                  <p className="text-[10px] text-surface-500 dark:text-surface-500">Monthly revenue flow</p>
                </div>
              </div>
            </div>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#38bdf8" strokeWidth={2} fill="url(#areaGrad)" />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#34d399" strokeWidth={2} fill="url(#profitAreaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue Distribution Pie Chart */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl p-5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/5 shadow-elite transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/15 flex items-center justify-center">
                  <PieIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Revenue Distribution</h3>
                  <p className="text-[10px] text-surface-500 dark:text-surface-500">Top clients share</p>
                </div>
              </div>
            </div>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={profitData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {profitData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="glass rounded-xl p-3 border border-surface-200 dark:border-white/10 shadow-sm dark:shadow-2xl">
                      <p className="text-xs font-semibold text-surface-900 dark:text-white">{payload[0].name}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{formatCurrency(payload[0].value)}</p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-2">
            {profitData.slice(0, 6).map((d, i) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] text-surface-400">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
