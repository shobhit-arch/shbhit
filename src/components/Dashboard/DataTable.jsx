import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { formatCurrency, formatNumber, formatPercent, getChangeBg } from '../../utils/formatters';
import { exportToCSV } from '../../services/googleSheets';

const PAGE_SIZE = 15;

export default function DataTable() {
  const { filteredData, currency, role } = useStore();
  const [sortField, setSortField] = useState('client');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [minRevenue, setMinRevenue] = useState(0);
  const [minPercent, setMinPercent] = useState(-100);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(() => {
    let data = [...filteredData];

    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      data = data.filter(
        (d) =>
          d.client.toLowerCase().includes(q) ||
          d.clientOf.toLowerCase().includes(q) ||
          d.month.toLowerCase().includes(q) ||
          d.sheetPerson?.toLowerCase().includes(q)
      );
    }

    if (minRevenue > 0) {
      data = data.filter((d) => (d.revInINR || 0) >= minRevenue);
    }

    if (minPercent > -100) {
      data = data.filter((d) => (d.percent || 0) >= minPercent);
    }

    data.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [filteredData, sortField, sortDir, tableSearch, minRevenue, minPercent]);

  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
  const pageData = sortedData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const columns = [
    { key: 'client', label: 'Client', width: 'min-w-[150px]' },
    { key: 'clientOf', label: 'Client of', width: 'min-w-[100px]' },
    { key: 'month', label: 'Month', width: 'min-w-[100px]' },
    { key: 'personUtilized', label: 'Person utilized', width: 'min-w-[120px]' },
    { key: 'costWithoutAdmin', label: 'cost(without admin)', width: 'min-w-[140px]' },
    { key: 'clientRevenue', label: 'Client revenue', width: 'min-w-[130px]' },
    { key: 'costWithAdmin', label: 'cost(with admin)', width: 'min-w-[130px]' },
    { key: 'revInINR', label: 'Rev in INR', width: 'min-w-[120px]' },
    { key: 'difference', label: ' Difference', width: 'min-w-[120px]' },
    { key: 'percent', label: 'PerCent  %', width: 'min-w-[100px]' },
  ];

  const visibleColumns = columns;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl bg-white dark:bg-surface-950 border border-surface-200 dark:border-white/5 overflow-hidden shadow-elite"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-surface-200 dark:border-white/5">
        <div>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Financial Data Table</h3>
          <p className="text-xs text-surface-500 mt-0.5">
            {sortedData.length} records • Page {page + 1} of {totalPages || 1}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
          
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Min Rev</label>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">{minRevenue > 0 ? formatCurrency(minRevenue) : 'All'}</span>
            </div>
            <input 
               type="range" 
               min="0" 
               max="2000000" 
               step="50000"
               value={minRevenue} 
               onChange={(e) => { setMinRevenue(Number(e.target.value)); setPage(0); }}
               className="w-full sm:w-28 h-1 bg-surface-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">Min %</label>
              <span className="text-[10px] font-mono text-blue-500 font-bold">{minPercent > -100 ? formatPercent(minPercent) : 'All'}</span>
            </div>
            <input 
               type="range" 
               min="-50" 
               max="100" 
               step="5"
               value={minPercent} 
               onChange={(e) => { setMinPercent(Number(e.target.value)); setPage(0); }}
               className="w-full sm:w-28 h-1 bg-surface-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
              <input
                type="text"
                placeholder="Search Client..."
                value={tableSearch}
                onChange={(e) => { setTableSearch(e.target.value); setPage(0); }}
                className="pl-9 pr-3 py-1.5 w-full sm:w-40 bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-lg text-xs text-surface-900 dark:text-white placeholder-surface-500 focus:outline-none focus:border-primary-500/50 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportToCSV(sortedData)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-surface-400 text-xs font-medium hover:bg-surface-200 dark:hover:bg-white/10 transition-all cursor-pointer border border-surface-200 dark:border-white/10"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </motion.button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[500px] border-b border-surface-200 dark:border-white/5">
        <table className="w-full relative">
          <thead className="sticky top-0 z-10 bg-surface-50/90 dark:bg-surface-900/90 backdrop-blur-md">
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`${col.width} px-4 py-3 text-left text-[10px] font-semibold text-surface-600 dark:text-surface-500 whitespace-nowrap tracking-wider cursor-pointer hover:text-surface-900 dark:hover:text-white transition-colors group`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {sortField === col.key ? (
                        sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3" />
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
            <tr className="h-[1px] bg-surface-200 dark:bg-white/5 w-full block absolute bottom-0 left-0 right-0"></tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {pageData.map((row, i) => {
                const isNegative = row.difference < 0;
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    onClick={() => setSelectedRow(selectedRow === row.id ? null : row.id)}
                    className={`border-b border-surface-100 dark:border-white/3 cursor-pointer transition-all hover:bg-surface-50 dark:hover:bg-white/3 ${selectedRow === row.id ? 'bg-primary-50 dark:bg-primary-500/5' : ''}`}
                  >
                    {visibleColumns.map((col) => (
                      <td key={col.key} className="px-4 py-4 whitespace-nowrap">
                        {col.key === 'client' && (
                          <div className="flex items-center gap-2">
                            {isNegative && (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 flex-shrink-0" />
                            )}
                            <span className="text-sm text-surface-900 dark:text-white font-medium">
                              {row.client}
                            </span>
                          </div>
                        )}
                        {col.key === 'clientOf' && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-surface-300">
                            {row.clientOf}
                          </span>
                        )}
                        {col.key === 'month' && (
                          <span className="text-xs text-surface-600 dark:text-surface-300">{row.month}</span>
                        )}
                        {col.key === 'personUtilized' && (
                          <span className="text-sm text-surface-600 dark:text-surface-300 font-mono">
                            {formatNumber(row.personUtilized)}
                          </span>
                        )}
                        {col.key === 'costWithoutAdmin' && (
                          <span className="text-sm text-surface-600 dark:text-surface-300 font-mono">
                            {formatCurrency(row.costWithoutAdmin)}
                          </span>
                        )}
                        {col.key === 'clientRevenue' && (
                          <span className="text-sm text-surface-900 dark:text-white font-mono">
                            {formatCurrency(row.clientRevenue)}
                          </span>
                        )}
                        {col.key === 'costWithAdmin' && (
                          <span className="text-sm text-surface-600 dark:text-surface-300 font-mono">
                            {formatCurrency(row.costWithAdmin)}
                          </span>
                        )}
                        {col.key === 'revInINR' && (
                          <span className="text-sm text-surface-600 dark:text-surface-300 font-mono">
                            {formatCurrency(row.revInINR)}
                          </span>
                        )}
                        {col.key === 'difference' && (
                          <span className="text-sm font-mono font-medium">
                            <span className={isNegative ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'}>
                              {formatCurrency(row.difference)}
                            </span>
                          </span>
                        )}
                        {col.key === 'percent' && (
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${row.percent >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {formatPercent(row.percent)}
                          </span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-surface-200 dark:border-white/5">
        <p className="text-xs text-surface-500">
          Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, sortedData.length)} of {sortedData.length}
        </p>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          
          <span className="text-[10px] font-semibold text-surface-600 dark:text-surface-300">
            {page + 1} / {totalPages || 1}
          </span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Row Detail Panel */}
      <AnimatePresence>
        {selectedRow && (
          <RowDetailPanel
            row={filteredData.find((d) => d.id === selectedRow)}
            onClose={() => setSelectedRow(null)}
            currency={currency}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RowDetailPanel({ row, onClose }) {
  if (!row) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-surface-200 dark:border-white/5 overflow-hidden"
    >
      <div className="p-5 bg-surface-50 dark:bg-white/2">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-surface-900 dark:text-white">📋 {row.client} — Detail View</h4>
          <button onClick={onClose} className="text-xs text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white cursor-pointer">Close</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DetailItem label="Rev (₹)" value={formatCurrency(row.revInINR)} />
          <DetailItem label="Cost (₹)" value={formatCurrency(row.costWithAdmin)} />
          <DetailItem label="Profit (₹)" value={formatCurrency(row.difference)} color={row.difference >= 0 ? 'text-emerald-500' : 'text-red-500'} />
          <DetailItem label="Percent" value={formatPercent(row.percent)} color={row.percent >= 0 ? 'text-emerald-500' : 'text-red-500'} />
          <DetailItem label="Person utilized" value={formatNumber(row.personUtilized)} color="text-surface-600 dark:text-surface-300" />
          <DetailItem label="Sheet Source" value={row.sheetPerson} color="text-surface-600 dark:text-surface-300" />
        </div>
      </div>
    </motion.div>
  );
}

function DetailItem({ label, value, color = 'text-surface-900 dark:text-white' }) {
  return (
    <div>
      <p className="text-[10px] text-surface-600 dark:text-surface-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-mono font-medium ${color}`}>{value}</p>
    </div>
  );
}
