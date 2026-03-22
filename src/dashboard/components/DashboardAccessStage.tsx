import type { ReactNode } from 'react';
import clsx from 'clsx';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Loader2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import Logo from '../../components/Logo';
import { config } from '../../config';
import { dashboardEase, fadeUpVariants } from '../motion';

export type DashboardAccessStageVariant = 'loading' | 'success' | 'warning' | 'error';
export type DashboardAccessStageTone = 'brand' | 'success' | 'warning' | 'danger';
export type DashboardAccessStepState = 'pending' | 'active' | 'complete' | 'error';

export interface DashboardAccessProgressStep {
  label: string;
  state: DashboardAccessStepState;
}

interface DashboardAccessStageProps {
  variant?: DashboardAccessStageVariant;
  tone?: DashboardAccessStageTone;
  eyebrow: string;
  title: string;
  description: string;
  statusText?: string;
  progressLabel?: string;
  progressDescription?: string;
  progressSteps?: DashboardAccessProgressStep[];
  statusPill?: ReactNode;
  actions?: ReactNode;
  icon?: LucideIcon;
  brandLabel?: string;
}

interface DashboardAccessStatusPillProps {
  label: string;
  tone?: DashboardAccessStageTone;
  icon?: LucideIcon;
  spin?: boolean;
}

const toneByVariant: Record<DashboardAccessStageVariant, DashboardAccessStageTone> = {
  loading: 'brand',
  success: 'success',
  warning: 'warning',
  error: 'danger',
};

const variantIcons: Record<DashboardAccessStageVariant, LucideIcon> = {
  loading: Loader2,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertTriangle,
};

const toneStyles: Record<
  DashboardAccessStageTone,
  {
    eyebrow: string;
    glow: string;
    panel: string;
    statusBox: string;
    iconTile: string;
    pill: string;
    activeStep: string;
    completeStep: string;
    errorStep: string;
  }
> = {
  brand: {
    eyebrow: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100',
    glow: 'bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.34),transparent_42%),radial-gradient(circle_at_18%_30%,rgba(34,211,238,0.12),transparent_24%),radial-gradient(circle_at_82%_26%,rgba(255,255,255,0.06),transparent_18%)]',
    panel: 'border-indigo-400/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)),rgba(4,7,18,0.88)]',
    statusBox: 'border-indigo-400/22 bg-[linear-gradient(180deg,rgba(99,102,241,0.12),rgba(34,211,238,0.04)),rgba(255,255,255,0.02)]',
    iconTile: 'border-indigo-400/24 bg-[linear-gradient(180deg,rgba(99,102,241,0.18),rgba(34,211,238,0.08)),rgba(255,255,255,0.04)] text-indigo-100',
    pill: 'border-indigo-400/24 bg-indigo-400/12 text-indigo-100',
    activeStep: 'border-indigo-400/26 bg-indigo-400/10 text-indigo-50',
    completeStep: 'border-emerald-400/24 bg-emerald-400/10 text-emerald-100',
    errorStep: 'border-rose-400/24 bg-rose-400/10 text-rose-100',
  },
  success: {
    eyebrow: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    glow: 'bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.28),transparent_42%),radial-gradient(circle_at_24%_34%,rgba(34,211,238,0.1),transparent_22%),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.06),transparent_18%)]',
    panel: 'border-emerald-400/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)),rgba(4,9,14,0.88)]',
    statusBox: 'border-emerald-400/22 bg-[linear-gradient(180deg,rgba(16,185,129,0.14),rgba(34,197,94,0.05)),rgba(255,255,255,0.02)]',
    iconTile: 'border-emerald-400/24 bg-[linear-gradient(180deg,rgba(16,185,129,0.18),rgba(34,197,94,0.08)),rgba(255,255,255,0.04)] text-emerald-100',
    pill: 'border-emerald-400/24 bg-emerald-400/12 text-emerald-100',
    activeStep: 'border-emerald-400/24 bg-emerald-400/10 text-emerald-100',
    completeStep: 'border-emerald-400/24 bg-emerald-400/10 text-emerald-100',
    errorStep: 'border-rose-400/24 bg-rose-400/10 text-rose-100',
  },
  warning: {
    eyebrow: 'border-amber-300/24 bg-amber-300/10 text-amber-50',
    glow: 'bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.28),transparent_42%),radial-gradient(circle_at_22%_32%,rgba(251,191,36,0.12),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.06),transparent_18%)]',
    panel: 'border-amber-300/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)),rgba(14,10,4,0.88)]',
    statusBox: 'border-amber-300/22 bg-[linear-gradient(180deg,rgba(245,158,11,0.14),rgba(251,191,36,0.05)),rgba(255,255,255,0.02)]',
    iconTile: 'border-amber-300/24 bg-[linear-gradient(180deg,rgba(245,158,11,0.18),rgba(251,191,36,0.08)),rgba(255,255,255,0.04)] text-amber-50',
    pill: 'border-amber-300/24 bg-amber-300/12 text-amber-50',
    activeStep: 'border-amber-300/24 bg-amber-300/10 text-amber-50',
    completeStep: 'border-emerald-400/24 bg-emerald-400/10 text-emerald-100',
    errorStep: 'border-amber-300/24 bg-amber-300/10 text-amber-50',
  },
  danger: {
    eyebrow: 'border-rose-300/24 bg-rose-300/10 text-rose-50',
    glow: 'bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.28),transparent_42%),radial-gradient(circle_at_24%_32%,rgba(251,113,133,0.12),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(255,255,255,0.06),transparent_18%)]',
    panel: 'border-rose-300/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02)),rgba(14,5,9,0.88)]',
    statusBox: 'border-rose-300/22 bg-[linear-gradient(180deg,rgba(244,63,94,0.14),rgba(251,113,133,0.05)),rgba(255,255,255,0.02)]',
    iconTile: 'border-rose-300/24 bg-[linear-gradient(180deg,rgba(244,63,94,0.18),rgba(251,113,133,0.08)),rgba(255,255,255,0.04)] text-rose-50',
    pill: 'border-rose-300/24 bg-rose-300/12 text-rose-50',
    activeStep: 'border-rose-300/24 bg-rose-300/10 text-rose-50',
    completeStep: 'border-emerald-400/24 bg-emerald-400/10 text-emerald-100',
    errorStep: 'border-rose-300/24 bg-rose-300/10 text-rose-50',
  },
};

const panelVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: dashboardEase,
      delay: 0.06,
    },
  },
};

export function DashboardAccessStatusPill({
  label,
  tone = 'brand',
  icon: Icon = Sparkles,
  spin = false,
}: DashboardAccessStatusPillProps) {
  const styles = toneStyles[tone];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] shadow-[0_12px_28px_rgba(0,0,0,0.16)]',
        styles.pill,
      )}
    >
      <Icon className={clsx('h-3.5 w-3.5', spin ? 'animate-spin motion-reduce:animate-none' : undefined)} />
      {label}
    </span>
  );
}

function DashboardAccessStepIndicator({
  state,
  shouldReduceMotion,
}: {
  state: DashboardAccessStepState;
  shouldReduceMotion: boolean;
}) {
  if (state === 'complete') {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/24 bg-emerald-400/10 text-emerald-100">
        <Check className="h-4 w-4" />
      </span>
    );
  }

  if (state === 'active') {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/24 bg-indigo-400/10 text-indigo-100">
        <Loader2 className={clsx('h-4 w-4', shouldReduceMotion ? undefined : 'animate-spin motion-reduce:animate-none')} />
      </span>
    );
  }

  if (state === 'error') {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-400/24 bg-rose-400/10 text-rose-100">
        <AlertTriangle className="h-4 w-4" />
      </span>
    );
  }

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400">
      <span className="h-2.5 w-2.5 rounded-full bg-current opacity-75" />
    </span>
  );
}

export default function DashboardAccessStage({
  variant = 'loading',
  tone,
  eyebrow,
  title,
  description,
  statusText,
  progressLabel,
  progressDescription,
  progressSteps = [],
  statusPill,
  actions,
  icon,
  brandLabel = `${config.botName} Dashboard`,
}: DashboardAccessStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const resolvedTone = tone ?? toneByVariant[variant];
  const styles = toneStyles[resolvedTone];
  const Icon = icon ?? variantIcons[variant];

  return (
    <motion.section
      variants={fadeUpVariants}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate="show"
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className="relative isolate w-full overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#02030a] shadow-[0_42px_140px_rgba(0,0,0,0.52)]"
    >
      <div className="bg-cinematic-atmosphere absolute inset-0 opacity-95" />
      <div className="bg-cinematic-texture absolute inset-0 opacity-50" />
      <div className="bg-film-grain absolute inset-0 opacity-[0.06]" />
      <div className={clsx('pointer-events-none absolute inset-0 opacity-90', styles.glow)} />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="pointer-events-none absolute inset-x-[14%] top-[18%] h-[18rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),rgba(255,255,255,0.01)_38%,transparent_74%)] opacity-70" />
      <div className="scanline-sweep pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.38)_64%,rgba(0,0,0,0.58)_100%)]" />

      <div className="relative z-[1] grid gap-8 px-6 py-7 sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,24rem)] lg:gap-12 lg:px-12 lg:py-12">
        <motion.div
          variants={panelVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="show"
          className="flex min-w-0 flex-col gap-7"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={clsx(
                'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em]',
                styles.eyebrow,
              )}
            >
              <Icon className={clsx('h-3.5 w-3.5', variant === 'loading' && !shouldReduceMotion ? 'animate-spin motion-reduce:animate-none' : undefined)} />
              {eyebrow}
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              {brandLabel}
            </p>
          </div>

          <div className="flex items-center">
            <Logo
              size="lg"
              withText={false}
              className="justify-start"
              imageClassName="drop-shadow-[0_26px_56px_rgba(99,102,241,0.24)]"
            />
          </div>

          <div className="max-w-3xl">
            <h1 className="text-balance text-[2.35rem] font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[3rem] lg:text-[3.5rem]">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-[1.02rem]">
              {description}
            </p>
          </div>

          {actions ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {actions}
            </div>
          ) : null}
        </motion.div>

        <motion.aside
          variants={panelVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="show"
          className={clsx(
            'relative overflow-hidden rounded-[1.85rem] border p-5 shadow-[0_22px_64px_rgba(0,0,0,0.3)] sm:p-6',
            styles.panel,
          )}
          aria-label={progressLabel}
        >
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

          <div className="relative z-[1]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                {progressLabel ? (
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">
                    {progressLabel}
                  </p>
                ) : null}
              </div>
              {statusPill}
            </div>

            {progressDescription ? (
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {progressDescription}
              </p>
            ) : null}

            {statusText ? (
              <div
                className={clsx(
                  'mt-5 rounded-[1.35rem] border px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
                  styles.statusBox,
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={clsx(
                      'inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[1rem] border shadow-[0_16px_36px_rgba(0,0,0,0.22)]',
                      styles.iconTile,
                    )}
                  >
                    <Icon className={clsx('h-5 w-5', variant === 'loading' && !shouldReduceMotion ? 'animate-spin motion-reduce:animate-none' : undefined)} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-7 text-slate-200">
                      {statusText}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {progressSteps.length ? (
              <ol className="mt-5 grid gap-3" aria-label={progressLabel}>
                {progressSteps.map((step, index) => {
                  const stepStateClass = step.state === 'complete'
                    ? styles.completeStep
                    : step.state === 'error'
                      ? styles.errorStep
                      : step.state === 'active'
                        ? styles.activeStep
                        : 'border-white/10 bg-white/[0.04] text-slate-300';

                  return (
                    <li
                      key={`${step.label}-${index}`}
                      aria-current={step.state === 'active' ? 'step' : undefined}
                      className={clsx(
                        'rounded-[1.35rem] border px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,background-color,transform] duration-300',
                        stepStateClass,
                      )}
                      >
                        <div className="flex items-start gap-3">
                          <DashboardAccessStepIndicator state={step.state} shouldReduceMotion={Boolean(shouldReduceMotion)} />
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                              {String(index + 1).padStart(2, '0')}
                            </p>
                            <p className="mt-2 text-sm font-semibold leading-6 text-white">
                              {step.label}
                            </p>
                          </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : null}
          </div>
        </motion.aside>
      </div>
    </motion.section>
  );
}
