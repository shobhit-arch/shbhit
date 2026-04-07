import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Wallet,
  Percent,
  Activity,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { formatCurrency, formatPercent } from '../../utils/formatters';

function AnimatedCounter({ value, duration = 1.5, isPercent = false }) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const startTime = performance.now();
    const dur = duration * 1000;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / dur, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
    prevValue.current = value;
  }, [value, duration]);

  return <span>{isPercent ? formatPercent(displayValue) : formatCurrency(displayValue)}</span>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function KPICards() {
  const { getKPIs } = useStore();
  const kpis = getKPIs();

  const cards = [
    {
      title: 'Total Revenue',
      value: kpis.totalRevenue,
      icon: TrendingUp,
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      change: kpis.growthPercent,
    },
    {
      title: 'Total Cost',
      value: kpis.totalCost,
      icon: Wallet,
      gradient: 'from-amber-500/20 to-amber-500/5',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      change: null,
    },
    {
      title: 'Net Profit/Loss',
      value: kpis.profit,
      icon: Activity,
      gradient: kpis.profit >= 0 ? 'from-blue-500/20 to-blue-500/5' : 'from-red-500/20 to-red-500/5',
      iconBg: kpis.profit >= 0 ? 'bg-blue-500/15' : 'bg-red-500/15',
      iconColor: kpis.profit >= 0 ? 'text-blue-400' : 'text-red-400',
      borderColor: kpis.profit >= 0 ? 'border-blue-500/20' : 'border-red-500/20',
      change: kpis.growthPercent,
    },
    {
      title: 'Active Clients',
      value: kpis.clientCount,
      icon: Users,
      gradient: 'from-purple-500/20 to-purple-500/5',
      iconBg: 'bg-purple-500/15',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      isCount: true,
      subtitle: `${kpis.profitableClients} profitable`,
    },
    {
      title: 'Average Percent',
      value: kpis.growthPercent,
      icon: Percent,
      gradient: 'from-pink-500/20 to-pink-500/5',
      iconBg: 'bg-pink-500/15',
      iconColor: 'text-pink-400',
      borderColor: 'border-pink-500/20',
      isPercent: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <Card key={card.title} card={card} index={i} />
      ))}
    </div>
  );
}

function Card({ card, index }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Tilt effects
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left - width / 2;
    const y = clientY - top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
    
    // For CSS variables (shiny effect)
    currentTarget.style.setProperty('--mouse-x', `${clientX - left}px`);
    currentTarget.style.setProperty('--mouse-y', `${clientY - top}px`);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-card shadow-elite rounded-3xl p-5 sm:p-6 transition-all duration-500 hover:border-primary-500/30 group relative overflow-hidden bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
    >
      {/* Shiny mouse-following overlay */}
      <div className="absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shiny-overlay" />
      
      {/* Animated Blobs */}
      <div className="absolute inset-0 filter blur-[100px] opacity-5 dark:opacity-20 sm:dark:opacity-30 pointer-events-none transition-opacity duration-700" />
      
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-40 transition-opacity duration-500`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-widest">
            {card.title}
          </span>
          <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shadow-lg shadow-${card.iconColor.split('-')[1]}-500/10 dark:shadow-none`}>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
        </div>

        {/* Value */}
        <div className="text-lg sm:text-xl xl:text-lg 2xl:text-xl font-black text-surface-900 dark:text-white mb-2 tracking-tighter truncate" title={String(card.value)}>
          {card.isCount ? (
            <CountUp target={card.value} />
          ) : card.isPercent ? (
            <AnimatedCounter value={card.value} isPercent={true} />
          ) : (
            <AnimatedCounter value={card.value} />
          )}
        </div>

        {/* Change / Subtitle */}
        {card.change !== null && card.change !== undefined && !card.isCount ? (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${card.change >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {card.change >= 0 ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {formatPercent(card.change)}
            </div>
            <span className="text-[10px] text-surface-500 font-medium uppercase tracking-wider">Avg Growth</span>
          </div>
        ) : card.subtitle ? (
            <span className="text-[10px] text-surface-500 dark:text-surface-400 font-medium uppercase tracking-wider bg-surface-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
            {card.subtitle}
          </span>
        ) : null}
      </div>

      {/* Modern Decorative Accent */}
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${card.iconBg} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
    </motion.div>
  );
}

function CountUp({ target, duration = 1.5 }) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = prevTarget.current;
    const startTime = performance.now();
    const dur = duration * 1000;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    prevTarget.current = target;
  }, [target, duration]);

  return <span>{value}</span>;
}
