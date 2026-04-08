import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRICING_CONFIG } from '../config/pricing';
import { instantReveal, motionViewport, sectionIntro, withDelay, motionStagger } from '../lib/motion';

export default function PricingPreview() {
  const { t } = useTranslation();
  const isEnglish = t('nav.docs') === 'Docs';
  const shouldReduceMotion = useReducedMotion();
  const introReveal = shouldReduceMotion ? instantReveal : sectionIntro;
  const secondaryIntroReveal = shouldReduceMotion ? instantReveal : withDelay(sectionIntro, motionStagger.tight);
  const lang = isEnglish ? 'en' : 'es';

  const plans = [
    {
      key: 'free',
      name: PRICING_CONFIG.free.name[lang],
      price: isEnglish ? 'Free' : 'Gratis',
      note: isEnglish ? 'Forever' : 'Siempre',
    },
    {
      key: 'pro',
      name: PRICING_CONFIG.pro.name[lang],
      price: '$9',
      note: isEnglish ? '/month' : '/mes',
      highlight: true,
    },
    {
      key: 'enterprise',
      name: PRICING_CONFIG.enterprise.name[lang],
      price: isEnglish ? 'Custom' : 'Personalizado',
      note: isEnglish ? 'Contact us' : 'Contactar',
    },
  ];

  return (
    <section id="pricing-preview" aria-labelledby="pricing-preview-heading" className="relative overflow-hidden bg-black py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <motion.p
            variants={introReveal}
            initial="hidden"
            whileInView="show"
            viewport={motionViewport}
            className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400"
          >
            {isEnglish ? 'Pricing' : 'Precios'}
          </motion.p>

          <motion.h2
            id="pricing-preview-heading"
            variants={secondaryIntroReveal}
            initial="hidden"
            whileInView="show"
            viewport={motionViewport}
            className="mb-4 text-3xl font-bold text-white sm:text-4xl"
          >
            {isEnglish ? 'Start free. Upgrade when ready.' : 'Empieza gratis. Mejora cuando quieras.'}
          </motion.h2>
        </div>

        <motion.div
          variants={secondaryIntroReveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl"
        >
          <div className="grid grid-cols-3 gap-px bg-white/5">
            {plans.map((plan) => (
              <div
                key={plan.key}
                className={`relative bg-black p-6 text-center ${
                  plan.highlight ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/5' : ''
                }`}
              >
                {plan.highlight && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      {isEnglish ? 'Popular' : 'Popular'}
                    </span>
                  </div>
                )}
                <h3 className="mb-2 text-sm font-semibold text-slate-400">{plan.name}</h3>
                <div className="mb-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                </div>
                <p className="text-xs text-slate-500">{plan.note}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 bg-black/50 p-6">
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div className="flex flex-col gap-2">
                <Check className="mx-auto h-4 w-4 text-emerald-400" />
                <span className="text-slate-400">{isEnglish ? 'Core features' : 'Funciones básicas'}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Check className="mx-auto h-4 w-4 text-emerald-400" />
                <span className="text-slate-400">{isEnglish ? 'Advanced ops' : 'Ops avanzadas'}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Check className="mx-auto h-4 w-4 text-emerald-400" />
                <span className="text-slate-400">{isEnglish ? 'Multi-server' : 'Multi-servidor'}</span>
              </div>
            </div>
          </div>
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
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-indigo-700 hover:scale-105"
          >
            <span>{isEnglish ? 'View full pricing' : 'Ver precios completos'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
