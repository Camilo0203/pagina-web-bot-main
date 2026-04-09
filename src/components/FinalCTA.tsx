import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { getDiscordInviteUrl } from '../config';
import Logo from './Logo';
import { instantReveal, motionViewport, sectionIntro } from '../lib/motion';

export default function FinalCTA() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const inviteUrl = getDiscordInviteUrl();
  const canInvite = Boolean(inviteUrl);
  const reveal = shouldReduceMotion ? instantReveal : sectionIntro;

  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-black py-32 sm:py-40"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950/10 to-black" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={motionViewport}
          className="mx-auto max-w-4xl"
        >
          <h2
            id="final-cta-heading"
            className="mb-8 text-5xl font-black uppercase leading-[0.92] tracking-tightest text-white sm:text-6xl lg:text-8xl"
          >
            {t('final.title')} <br />
            <span className="headline-accent headline-accent-solid">
              {t('final.titleAccent')}
            </span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed text-slate-300 md:text-xl">
            {t('final.description')}
          </p>

          <div className="flex flex-col items-center justify-center gap-6">
            {canInvite ? (
              <a href={inviteUrl} target="_blank" rel="noopener noreferrer" className="btn-premium-primary group text-lg !px-10 !py-6">
                <Logo size="xs" withText={false} frameClassName="border-black/5 bg-white/10 shadow-none" imageClassName="scale-[1.02]" />
                <span>{t('final.cta')}</span>
                <Sparkles className={`h-5 w-5 ${shouldReduceMotion ? '' : 'transition-transform duration-200 group-hover:rotate-12'}`} />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="btn-premium-primary cursor-not-allowed text-lg opacity-60 !px-10 !py-6"
                title={t('final.unavailable')}
              >
                <Logo size="xs" withText={false} frameClassName="border-black/5 bg-white/10 shadow-none" imageClassName="scale-[1.02]" />
                <span>{t('final.cta')}</span>
                <Sparkles className="h-5 w-5" />
              </button>
            )}

            <p className="text-sm text-slate-500">
              {t('final.subtitle')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
