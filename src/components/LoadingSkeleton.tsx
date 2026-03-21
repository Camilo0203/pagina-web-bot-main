import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'section' | 'card' | 'text';
  className?: string;
}

export default function LoadingSkeleton({ variant = 'section', className = '' }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={`tech-card animate-pulse ${className}`}>
        <div className="mb-4 h-12 w-12 rounded-2xl bg-white/5"></div>
        <div className="mb-3 h-6 w-3/4 rounded bg-white/5"></div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-white/5"></div>
          <div className="h-4 w-5/6 rounded bg-white/5"></div>
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`animate-pulse space-y-3 ${className}`}>
        <div className="h-8 w-2/3 rounded bg-white/5"></div>
        <div className="h-4 w-full rounded bg-white/5"></div>
        <div className="h-4 w-4/5 rounded bg-white/5"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex min-h-[400px] items-center justify-center ${className}`}
    >
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-indigo-500"></div>
        <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full bg-indigo-500/10"></div>
      </div>
    </motion.div>
  );
}
