import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { History, Tag } from 'lucide-react';

const entryIds = ['e1', 'e2', 'e3', 'e4'] as const;

export default function Changelog() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="changelog" aria-labelledby="changelog-heading" className="relative overflow-hidden bg-black py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-2"
          >
            <History className="h-3 w-3 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-wide-readable text-indigo-300">{t('changelog.tag')}</span>
          </motion.div>

          <motion.h2
            id="changelog-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black uppercase leading-[0.92] tracking-tightest text-white sm:text-6xl lg:text-7xl"
          >
            {t('changelog.title')}{' '}
            <span className="headline-accent headline-accent-solid">{t('changelog.titleAccent')}</span>
          </motion.h2>
        </div>

        <div className="relative space-y-8">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-indigo-500/40 via-white/10 to-transparent md:left-1/2 md:-translate-x-px" />

          {entryIds.map((id, i) => {
            const isLeft = i % 2 === 0;
            const renderContent = (alignmentClass = '') => (
              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 backdrop-blur-xl">
                <div className={`mb-3 flex flex-wrap items-center gap-2 ${alignmentClass}`}>
                  <Tag className="h-3 w-3 text-indigo-400 md:hidden" />
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-indigo-300">
                    {t(`changelog.entries.${id}.version`)}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {t(`changelog.entries.${id}.date`)}
                  </span>
                </div>

                <h3 className="mb-2 text-base font-bold text-white">
                  {t(`changelog.entries.${id}.title`)}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-slate-400">
                  {t(`changelog.entries.${id}.desc`)}
                </p>
              </div>
            );

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : i * 0.08 }}
                className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] md:items-start"
              >
                {isLeft ? (
                  <>
                    <div className="hidden md:block md:text-right">{renderContent('md:justify-end')}</div>
                    <div className="relative flex justify-center">
                      <div className="mt-5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-slate-950" />
                    </div>
                    <div className="hidden md:block" />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block" />
                    <div className="relative flex justify-center">
                      <div className="mt-5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-slate-950" />
                    </div>
                    <div className="hidden md:block">{renderContent()}</div>
                  </>
                )}

                <div className="relative md:hidden">
                  <div className="absolute left-[-1.45rem] top-5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-slate-950" />
                  {renderContent()}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
