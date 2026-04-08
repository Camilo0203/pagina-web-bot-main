import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRICING_CONFIG, type PricingPlanKey } from '../config/pricing';
import { cardStagger, instantReveal, motionStagger, motionViewport, revealUp, sectionIntro, withDelay, withDuration } from '../lib/motion';

const planKeys: PricingPlanKey[] = ['free', 'pro', 'enterprise'];

export default function PricingPreview() {
  const { t } = useTranslation();
  const isEnglish = t('nav.docs') === 'Docs';
  const shouldReduceMotion = useReducedMotion();
  const introReveal = shouldReduceMotion ? instantReveal : sectionIntro;
  const secondaryIntroReveal = shouldReduceMotion ? instantReveal : withDelay(sectionIntro, motionStagger.tight);
  const gridReveal = shouldReduceMotion ? instantReveal : cardStagger;
  const planReveal = shouldReduceMotion ? instantReveal : withDuration(revealUp, 0.28);
  const lang = isEnglish ? 'en' : 'es';
  
  const copy = {
    tag: isEnglish ? 'Pricing' : 'Precios',
    title: isEnglish ? 'Simple,' : 'Simple,',
    titleAccent: isEnglish ? 'Transparent Pricing' : 'Precios Transparentes',
    description: isEnglish
      ? 'Start free. Upgrade to Pro when you need advanced operations. Enterprise for multi-server rollout.'
      : 'Empieza gratis. Sube a Pro cuando necesites operaciones avanzadas. Enterprise para rollout multi-servidor.',
    cta: isEnglish ? 'See Pro Plans' : 'Ver Planes Pro',
  };

  return (
    <section id="pricing-preview" aria-labelledby="pricing-preview-heading" className="relative overflow-hidden bg-black py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute left-1/3 top-0 h-80 w-80 rounded-full bg-purple-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <motion.div
            variants={introReveal}
            initial="hidden"
            whileInView="show"
            viewport={motionViewport}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-2"
          >
            <CreditCard className="h-3 w-3 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-wide-readable text-indigo-300">{copy.tag}</span>
          </motion.div>

          <motion.h2
            id="pricing-preview-heading"
            variants={secondaryIntroReveal}
            initial="hidden"
            whileInView="show"
            viewport={motionViewport}
            className="mb-6 text-4xl font-black uppercase leading-[0.92] tracking-tightest text-white sm:text-6xl lg:text-7xl"
          >
            {copy.title} <br />
            <span className="headline-accent headline-accent-solid">{copy.titleAccent}</span>
          </motion.h2>

          <motion.p
            variants={secondaryIntroReveal}
            initial="hidden"
            whileInView="show"
            viewport={motionViewport}
            className="mx-auto mb-10 max-w-3xl text-base font-medium leading-relaxed text-slate-400 md:text-lg"
          >
            {copy.description}
          </motion.p>
        </div>

        <motion.div
          variants={gridReveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="grid gap-6 lg:grid-cols-3 mb-12"
        >
          {planKeys.map((planKey) => {
            const planConfig = PRICING_CONFIG[planKey];
            const isPro = planKey === 'pro';
            const name = planConfig.name[lang];
            const desc = planConfig.description[lang];
            const priceDisplay = planConfig.price.monthly.display;
            const period = isPro ? (isEnglish ? '/mo' : '/mes') : '';
            const popular = planConfig.popular ? planConfig.popularLabel?.[lang] : null;

            return (
              <motion.div
                key={planKey}
                variants={planReveal}
                className={`relative flex flex-col overflow-hidden rounded-[2rem] border p-8 backdrop-blur-xl transition-[border-color,box-shadow,transform] duration-300 ${
                  isPro
                    ? 'border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 shadow-[0_0_64px_rgba(99,102,241,0.12)]'
                    : 'border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02]'
                }`}
              >
                {popular && (
                  <div className="absolute right-6 top-6 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {popular}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-bold text-white">{name}</h3>
                  <p className="text-sm text-slate-400">{desc}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tabular-nums text-white">{priceDisplay}</span>
                    {period && <span className="text-sm font-semibold text-slate-500">{period}</span>}
                  </div>
                  {isPro && (
                    <p className="mt-2 text-xs text-emerald-400">
                      {isEnglish ? 'or $84/year (save 20%)' : 'o $84/año (ahorra 20%)'}
                    </p>
                  )}
                </div>

                <div className="flex-1" />

                {isPro && (
                  <div className="mt-4">
                    <Link
                      to="/pricing"
                      className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:scale-105"
                    >
                      <span>{isEnglish ? 'View Details' : 'Ver Detalles'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={secondaryIntroReveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="text-center"
        >
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-indigo-500/20 hover:scale-105"
          >
            <span>{copy.cta}</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
