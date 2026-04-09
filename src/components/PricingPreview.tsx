import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Zap, Crown, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { instantReveal, motionViewport, sectionIntro, withDelay, motionStagger } from '../lib/motion';

export default function PricingPreview() {
  const { t } = useTranslation();
  const isEnglish = t('nav.docs') === 'Docs';
  const shouldReduceMotion = useReducedMotion();
  const introReveal = shouldReduceMotion ? instantReveal : sectionIntro;
  const secondaryIntroReveal = shouldReduceMotion ? instantReveal : withDelay(sectionIntro, motionStagger.tight);

  const copy = {
    eyebrow: isEnglish ? 'Simple pricing' : 'Precios simples',
    headline: isEnglish ? 'Three ways to operate' : 'Tres formas de operar',
    free: {
      label: isEnglish ? 'Free' : 'Gratis',
      desc: isEnglish ? 'Install the base' : 'Instala la base',
    },
    pro: {
      label: isEnglish ? 'Pro' : 'Pro',
      price: '$9',
      period: isEnglish ? '/mo' : '/mes',
      desc: isEnglish ? 'For serious operations' : 'Para operar en serio',
      cta: isEnglish ? 'View plans' : 'Ver planes',
    },
    enterprise: {
      label: isEnglish ? 'Enterprise' : 'Enterprise',
      desc: isEnglish ? 'Guided rollout' : 'Rollout guiado',
    },
  };

  return (
    <section id="pricing-preview" aria-labelledby="pricing-preview-heading" className="relative overflow-hidden bg-black py-16 sm:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.p
            variants={introReveal}
            initial="hidden"
            whileInView="show"
            viewport={motionViewport}
            className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400"
          >
            {copy.eyebrow}
          </motion.p>

          <motion.h2
            id="pricing-preview-heading"
            variants={secondaryIntroReveal}
            initial="hidden"
            whileInView="show"
            viewport={motionViewport}
            className="text-2xl font-bold text-white sm:text-3xl"
          >
            {copy.headline}
          </motion.h2>
        </div>

        {/* Compact Layout: Side notes + Center Card + Side note */}
        <motion.div
          variants={secondaryIntroReveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="grid items-stretch gap-4 sm:grid-cols-[1fr_1.5fr_1fr]"
        >
          {/* Free Note */}
          <div className="flex flex-col justify-center rounded-xl border border-white/5 bg-white/[0.02] p-5 text-center">
            <div className="mb-2 flex justify-center">
              <div className="rounded-lg bg-slate-800/50 p-2">
                <Zap className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-300">{copy.free.label}</p>
            <p className="mt-1 text-xs text-slate-500">{copy.free.desc}</p>
          </div>

          {/* Pro Card - Main */}
          <div className="relative flex flex-col justify-between rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6 text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                <Crown className="h-3 w-3" />
                {isEnglish ? 'Popular' : 'Popular'}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-indigo-300">{copy.pro.label}</p>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-white">{copy.pro.price}</span>
                <span className="text-sm text-slate-400">{copy.pro.period}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{copy.pro.desc}</p>
            </div>

            <Link
              to="/pricing"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700"
            >
              <span>{copy.pro.cta}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Enterprise Note */}
          <div className="flex flex-col justify-center rounded-xl border border-white/5 bg-white/[0.02] p-5 text-center">
            <div className="mb-2 flex justify-center">
              <div className="rounded-lg bg-slate-800/50 p-2">
                <Users className="h-4 w-4 text-slate-400" />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-300">{copy.enterprise.label}</p>
            <p className="mt-1 text-xs text-slate-500">{copy.enterprise.desc}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
