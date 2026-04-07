import { motion } from 'framer-motion';

const blobs = [
  {
    color: 'bg-[#3b82f6]', // Brand Blue - High Contrast
    size: 'w-[600px] h-[600px]',
    initial: { x: '-10%', y: '-10%', scale: 1 },
    animate: {
      x: ['-10%', '10%', '0%', '-10%'],
      y: ['-10%', '20%', '10%', '-10%'],
      scale: [1, 1.1, 0.95, 1],
    },
    duration: 20,
  },
  {
    color: 'bg-cyan-400', // Vibrant Contrast
    size: 'w-[700px] h-[700px]',
    initial: { x: '50%', y: '-20%', scale: 1.1 },
    animate: {
      x: ['50%', '30%', '55%', '50%'],
      y: ['-20%', '10%', '0%', '-20%'],
      scale: [1.1, 0.9, 1.2, 1.1],
    },
    duration: 25,
  },
  {
    color: 'bg-indigo-500', // Deep Professional Indigo
    size: 'w-[500px] h-[500px]',
    initial: { x: '20%', y: '50%', scale: 0.9 },
    animate: {
      x: ['20%', '40%', '15%', '20%'],
      y: ['50%', '35%', '60%', '50%'],
      scale: [0.9, 1.2, 0.85, 0.9],
    },
    duration: 18,
  },
];

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white dark:bg-surface-950 transition-colors duration-700">
      {/* Premium Mesh Gradient Overlay - The 'Good Vibes' Layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 via-white/80 to-blue-50/50 dark:hidden" />
      
      {/* Animated Blobs Layer */}
      <div className="absolute inset-0 filter blur-[120px] opacity-25 dark:opacity-20 sm:dark:opacity-30 pointer-events-none transition-opacity duration-700">
        {blobs.map((blob, i) => (
          <motion.div
            key={i}
            initial={blob.initial}
            animate={blob.animate}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            className={`absolute rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none ${blob.color} ${blob.size}`}
          />
        ))}
      </div>

      {/* Subtle Noise Texture for Premium Feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Adaptive Vignette */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block" 
           style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.4) 100%)' }} />
    </div>
  );
}
