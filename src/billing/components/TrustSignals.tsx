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
      titleKey: 'billing.trustSignals.manual.title',
      descriptionKey: 'billing.trustSignals.manual.description',
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
      titleKey: 'billing.trustSignals.support.title',
      descriptionKey: 'billing.trustSignals.support.description',
    },
  ];

  return (
    <section className="relative">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.03] blur-[100px]" />

      <motion.div
        variants={motionReveal}
        initial="hidden"
        whileInView="show"
        viewport={motionViewport}
        className="relative z-10 mx-auto max-w-6xl px-6"
      >
        {/* Premium trust band - horizontal cinematic layout */}
        <div className="tech-card relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.02] via-transparent to-cyan-500/[0.02]" />

          <div className="relative flex flex-col items-center gap-8 py-8 sm:flex-row sm:justify-between sm:gap-12 sm:py-10">
            {/* Left: Trust indicators - horizontal flow */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap sm:justify-start">
              {signals.map((signal, index) => (
                <motion.div
                  key={index}
                  variants={secondaryReveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={motionViewport}
                  className="group flex items-center gap-3"
                >
                  <div className="premium-icon-tile h-10 w-10">
                    <signal.icon className="h-4 w-4 text-indigo-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white transition-colors group-hover:text-indigo-200">
                      {t(signal.titleKey)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t(signal.descriptionKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Center/Right: V1 Manual Activation notice */}
            <motion.div
              variants={secondaryReveal}
              initial="hidden"
              whileInView="show"
              viewport={motionViewport}
              className="flex items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-2 backdrop-blur-sm"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                <svg className="h-4 w-4 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  {t('billing.trustSignals.eyebrow')}
                </p>
                <p className="text-xs font-medium text-slate-300">
                  {t('billing.trustSignals.poweredBy')}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
