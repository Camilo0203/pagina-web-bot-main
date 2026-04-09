import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { motionViewport, sectionIntro, withDelay, motionStagger, accordionTransition } from '../../lib/motion';

export function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  const motionReveal = shouldReduceMotion ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : sectionIntro;
  const secondaryReveal = shouldReduceMotion ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : withDelay(sectionIntro, motionStagger.tight);

  const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-20">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Header */}
        <motion.div
          variants={motionReveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-400">
            {t('billing.faq.eyebrow')}
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {t('billing.faq.title')}
          </h2>
        </motion.div>

        {/* FAQ Items - Premium accordion */}
        <div className="space-y-3">
          {faqKeys.map((key, index) => (
            <motion.div
              key={index}
              variants={secondaryReveal}
              initial="hidden"
              whileInView="show"
              viewport={motionViewport}
            >
              <button
                onClick={() => toggleItem(index)}
                className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 sm:p-5 ${
                  openIndex === index
                    ? 'border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5'
                    : 'border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`text-sm font-semibold pr-8 sm:text-base ${
                    openIndex === index ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {t(`billing.faq.questions.${key}.question`)}
                  </h3>
                  <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                    openIndex === index ? 'bg-indigo-500/20' : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openIndex === index ? 'rotate-180 text-indigo-400' : 'text-slate-500'
                      }`}
                    />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={accordionTransition}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-white/10 pt-3 mt-3 text-sm leading-relaxed text-slate-400">
                        {t(`billing.faq.questions.${key}.answer`)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Contact support - elegant footer */}
        <motion.div
          variants={secondaryReveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="mt-10 flex items-center justify-center gap-2 text-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2">
            <MessageCircle className="h-4 w-4 text-indigo-400" />
            <p className="text-sm text-slate-400">
              {t('billing.faq.stillHaveQuestions')}{' '}
              <a
                href="mailto:support@ton618.io"
                className="font-medium text-white transition-colors hover:text-indigo-400"
              >
                {t('billing.faq.getInTouch')}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
