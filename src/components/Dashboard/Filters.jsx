import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import useStore from '../../store/useStore';

export default function Filters() {
  const {
    selectedMonth,
    setSelectedMonth,
    selectedClient,
    setSelectedClient,
    selectedPerson,
    setSelectedPerson,
    getMonths,
    getClients,
    getPersons,
  } = useStore();

  const months = getMonths();
  const clients = getClients();
  const persons = getPersons();

  const hasFilters = selectedMonth !== 'All' || selectedClient !== 'All' || selectedPerson !== 'All';

  const clearFilters = () => {
    setSelectedMonth('All');
    setSelectedClient('All');
    setSelectedPerson('All');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-wrap items-center gap-3"
    >
      <div className="flex items-center gap-2 text-surface-700 dark:text-surface-400">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-tight">Filters</span>
      </div>

      <FilterSelect
        label="Month"
        value={selectedMonth}
        onChange={setSelectedMonth}
        options={months}
      />

      <FilterSelect
        label="Client"
        value={selectedClient}
        onChange={setSelectedClient}
        options={clients}
      />

      <FilterSelect
        label="Team"
        value={selectedPerson}
        onChange={setSelectedPerson}
        options={persons}
      />

      {hasFilters && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-all cursor-pointer"
        >
          <X className="w-3 h-3" />
          Clear All
        </motion.button>
      )}
    </motion.div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none px-4 py-2 pr-8 rounded-xl bg-white dark:bg-white/5 border border-surface-200 dark:border-white/10 text-sm font-medium text-surface-900 dark:text-white focus:outline-none focus:border-primary-500 shadow-elite transition-all cursor-pointer hover:border-surface-300 dark:hover:border-white/20"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-white dark:bg-surface-900 text-surface-900 dark:text-white">
            {opt === 'All' ? `All ${label}s` : opt}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-surface-500 dark:text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
