export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '₹0';
  
  return '₹' + new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-IN').format(Math.round(value));
}

export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function getChangeColor(value) {
  if (value > 0) return 'text-emerald-400';
  if (value < 0) return 'text-red-400';
  return 'text-surface-400';
}

export function getChangeBg(value) {
  if (value > 0) return 'bg-emerald-500/10 text-emerald-400';
  if (value < 0) return 'bg-red-500/10 text-red-400';
  return 'bg-surface-500/10 text-surface-400';
}
