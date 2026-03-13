import type { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

interface StateCardProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ReactNode;
  tone?: 'default' | 'warning' | 'danger';
}

const toneClasses: Record<NonNullable<StateCardProps['tone']>, string> = {
  default: 'from-brand-500/20 to-sky-500/15 border-brand-200/60 dark:border-brand-900/60',
  warning: 'from-amber-500/20 to-orange-500/15 border-amber-200/70 dark:border-amber-900/50',
  danger: 'from-rose-500/20 to-red-500/15 border-rose-200/70 dark:border-rose-900/50',
};

export default function StateCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  tone = 'default',
}: StateCardProps) {
  return (
    <section
      className={`rounded-[2rem] border bg-gradient-to-br p-8 shadow-xl ${toneClasses[tone]} bg-white/85 dark:bg-surface-800/85 backdrop-blur-xl`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700 dark:bg-surface-700/80 dark:text-brand-300">
            <Icon className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <h2 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>
        {actions ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
