import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Zap, Crown, Users } from 'lucide-react';
import { instantReveal, motionViewport, sectionIntro, withDelay, motionStagger } from '../lib/motion';

export default function PricingPreview() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  
  const reveal = shouldReduceMotion ? instantReveal : sectionIntro;
  const cardReveal = shouldReduceMotion ? instantReveal : withDelay(sectionIntro, motionStagger.tight);

  return (
    <section id="pricing-preview" aria-labelledby="pricing-preview-heading" className="relative overflow-hidden bg-black py-16 sm:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.p
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={motionViewport}
            className="mb-6 text-xs font-bold uppercase tracking-wide-readable text-indigo-400"
          >
            {t('pricing.eyebrow')}
          </motion.p>
          <motion.h2
            id="pricing-preview-heading"
            variants={cardReveal}
            initial="hidden"
            whileInView="show"
            viewport={motionViewport}
            className="text-4xl font-black uppercase leading-[0.92] tracking-tightest text-white sm:text-5xl"
          >
            {t('pricing.headline')}
          </motion.h2>
        </div>

        {/* Compact Layout: Side notes + Center Card + Side note */}
        <motion.div
          variants={cardReveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="grid items-stretch gap-4 sm:grid-cols-[1fr_1.5fr_1fr]"
        >
          {/* Free Note */}
          <div className="flex flex-col justify-center rounded-xl border border-white/5 bg-white/[0.02] p-5 text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {t('pricing.free.name')}
              </span>
            </div>
            <p className="text-xl font-semibold text-white">{t('pricing.free.description')}</p>
          </div>

          {/* Pro Card - Main */}
          <div className="relative flex flex-col justify-between rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6 text-center">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1">
                <Crown className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-400">
                  {t('pricing.pro.name')}
                </span>
                <span className="text-[10px] font-bold text-white">•</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-400">
                  {t('pricing.pro.badge')}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{t('pricing.pro.description')}</p>
            </div>
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-white/20 hover:text-white">
              {t('pricing.pro.cta')}
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Enterprise Note */}
          <div className="flex flex-col justify-center rounded-xl border border-white/5 bg-white/[0.02] p-5 text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {t('pricing.enterprise.name')}
              </span>
            </div>
            <p className="text-xl font-semibold text-white">{t('pricing.enterprise.description')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
