import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, RefreshCw, DollarSign, Zap } from 'lucide-react';
import { motionViewport, sectionIntro, withDelay, motionStagger } from '../../lib/motion';

export function TrustSignals() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionReveal = shouldReduceMotion ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : sectionIntro;
  const secondaryReveal = shouldReduceMotion ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : withDelay(sectionIntro, motionStagger.tight);

  const signals = [
    {
      icon: Shield,
      titleKey: 'billing.trustSignals.secure.title',
      descriptionKey: 'billing.trustSignals.secure.description',
    },
    {
      icon: RefreshCw,
      titleKey: 'billing.trustSignals.flexible.title',
      descriptionKey: 'billing.trustSignals.flexible.description',
    },
    {
      icon: DollarSign,
      titleKey: 'billing.trustSignals.protected.title',
      descriptionKey: 'billing.trustSignals.protected.description',
    },
    {
      icon: Zap,
      titleKey: 'billing.trustSignals.instant.title',
      descriptionKey: 'billing.trustSignals.instant.description',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-black py-12 sm:py-16">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Editorial trust band - compact and elegant */}
        <motion.div
          variants={motionReveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 backdrop-blur-xl sm:p-8"
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('billing.trustSignals.eyebrow')}
            </p>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FFC233" />
                <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="#FFC233" />
              </svg>
              <span className="text-xs font-medium text-slate-400">
                {t('billing.trustSignals.poweredBy')}
              </span>
            </div>
          </div>

          {/* Signals - compact row on desktop, 2x2 on mobile */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {signals.map((signal, index) => (
              <motion.div
                key={index}
                variants={secondaryReveal}
                initial="hidden"
                whileInView="show"
                viewport={motionViewport}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                  <signal.icon className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t(signal.titleKey)}</p>
                  <p className="text-xs text-slate-500">{t(signal.descriptionKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
