import { motion } from 'framer-motion';

export function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <div className="w-24 h-4 rounded-lg bg-white/5 shimmer" />
        <div className="w-10 h-10 rounded-xl bg-white/5 shimmer" />
      </div>
      <div className="w-32 h-8 rounded-lg bg-white/5 shimmer mb-2" />
      <div className="w-20 h-4 rounded-lg bg-white/5 shimmer" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-2xl p-6 glass h-80">
      <div className="w-32 h-5 rounded-lg bg-white/5 shimmer mb-6" />
      <div className="flex items-end gap-3 h-52">
        {[40, 70, 55, 85, 60, 75, 45, 90, 65, 50, 80, 70].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-lg bg-white/5 shimmer"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="rounded-2xl p-6 glass">
      <div className="w-32 h-5 rounded-lg bg-white/5 shimmer mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-1/4 h-4 rounded-lg bg-white/5 shimmer" />
            <div className="w-1/6 h-4 rounded-lg bg-white/5 shimmer" />
            <div className="w-1/6 h-4 rounded-lg bg-white/5 shimmer" />
            <div className="w-1/6 h-4 rounded-lg bg-white/5 shimmer" />
            <div className="w-1/6 h-4 rounded-lg bg-white/5 shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable />
    </motion.div>
  );
}
