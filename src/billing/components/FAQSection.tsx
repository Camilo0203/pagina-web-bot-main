import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { config } from '../../config';
import { motionViewport, sectionIntro, withDelay, motionStagger, accordionTransition } from '../../lib/motion';

function getContactUrl(): string {
  // Priority: support server -> contact email
  return config.supportServerUrl || (config.contactEmail ? `mailto:${config.contactEmail}` : '#');
}

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
    <section className="relative">
      {/* Ambient background glow */}
      <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/[0.02] blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/[0.02] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Editorial Header - cinematic style */}
        <motion.div
          variants={motionReveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="mb-12 text-center"
        >
          <motion.p 
            variants={secondaryReveal}
            className="mb-4 text-xs font-bold uppercase tracking-wide-readable text-indigo-400"
          >
            {t('billing.faq.eyebrow')}
          </motion.p>
          <motion.h2 
            variants={secondaryReveal}
            className="text-3xl font-black uppercase leading-[0.92] tracking-tightest text-white sm:text-4xl"
          >
            {t('billing.faq.title')}
          </motion.h2>
        </motion.div>

        {/* FAQ Items - Editorial tech-card style */}
        <div className="space-y-4">
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
                className={`group w-full text-left transition-all duration-300 ${
                  openIndex === index ? 'tech-card' : 'tech-card opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-4 p-6">
                  {/* Question number indicator */}
                  <div className="flex items-start gap-4">
                    <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                      openIndex === index 
                        ? 'bg-indigo-500/20 text-indigo-300' 
                        : 'bg-white/5 text-slate-500 group-hover:bg-white/10'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className={`text-base font-semibold leading-snug transition-colors duration-300 ${
                      openIndex === index ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {t(`billing.faq.questions.${key}.question`)}
                    </h3>
                  </div>

                  {/* Chevron with premium treatment */}
                  <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    openIndex === index 
                      ? 'bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <ChevronDown
                      className={`h-4 w-4 transition-all duration-300 ${
                        openIndex === index 
                          ? 'rotate-180 text-indigo-400' 
                          : 'text-slate-500 group-hover:text-slate-400'
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
                      <div className="border-t border-white/10 px-6 pb-6 pt-4">
                        <div className="flex gap-4">
                          {/* Indentation line */}
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                            <div className="h-full w-px bg-gradient-to-b from-indigo-500/30 to-transparent" />
                          </div>
                          <p className="text-sm leading-relaxed text-slate-400">
                            {t(`billing.faq.questions.${key}.answer`)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Contact support - premium pill style */}
        <motion.div
          variants={secondaryReveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="mt-12 flex items-center justify-center"
        >
          <div className="premium-pill flex items-center gap-3 px-6 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10">
              <HelpCircle className="h-4 w-4 text-indigo-400" />
            </div>
            <p className="mt-4 text-sm text-slate-400">
              {t('billing.faq.stillHaveQuestions')}{' '}
              <a
                href={getContactUrl()}
                className="font-medium text-white transition-colors hover:text-indigo-300"
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
