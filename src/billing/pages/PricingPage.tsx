import { useState } from 'react';
import { toast } from 'sonner';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, Zap, Crown, Users, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { TrustSignals } from '../components/TrustSignals';
import { FAQSection } from '../components/FAQSection';
import { PRICING_CONFIG, getPlanPeriod, type BillingCycle, type PricingPlanKey } from '../../config/pricing';
import { config, getDiscordInviteUrl } from '../../config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { instantReveal, motionViewport, sectionIntro, withDelay, motionStagger, cardStagger, revealUp } from '../../lib/motion';


const planKeys: PricingPlanKey[] = ['free', 'pro', 'enterprise'];

// Helper to get the manual purchase/contact URL
function getManualPurchaseUrl(): string {
  return config.supportServerUrl || (config.contactEmail ? `mailto:${config.contactEmail}` : '');
}

export default function PricingPage() {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const inviteUrl = getDiscordInviteUrl();

  const handlePlanSelect = (planKey: PricingPlanKey) => {
    if (planKey === 'free') {
      if (inviteUrl) {
        window.location.href = inviteUrl;
      } else {
        toast.error(t('billing.toasts.inviteError'));
      }
      return;
    }

    // Pro and Enterprise both use manual Discord-first activation
    const contactUrl = getManualPurchaseUrl();
    if (contactUrl) {
      window.location.href = contactUrl;
    } else {
      toast.error(t('billing.toasts.contactError'));
    }
  };

  const motionReveal = shouldReduceMotion ? instantReveal : sectionIntro;
  const secondaryReveal = shouldReduceMotion ? instantReveal : withDelay(sectionIntro, motionStagger.tight);
  const cardsReveal = shouldReduceMotion ? instantReveal : cardStagger;
  const cardReveal = shouldReduceMotion ? instantReveal : revealUp;

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-indigo-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-cinematic-atmosphere absolute inset-0"></div>
        <div className="bg-cinematic-texture absolute inset-0 opacity-40"></div>
        <div className="bg-film-grain absolute inset-0 opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-black"></div>
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/5 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <header>
          <Navbar />
        </header>

        <main className="relative">
          {/* Hero Section - Premium Style */}
          <section className="relative overflow-hidden bg-black py-16 px-4 sm:py-24">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="relative mx-auto max-w-5xl">
              <motion.div
                variants={motionReveal}
                initial="hidden"
                animate="show"
                className="text-center"
              >
                <motion.div 
                  variants={secondaryReveal}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-2"
                >
                  <Sparkles className="h-3 w-3 text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wide-readable text-indigo-300">
                    {t('billing.hero.eyebrow')}
                  </span>
                </motion.div>

                <motion.h1 
                  variants={secondaryReveal}
                  className="text-4xl font-black uppercase tracking-tightest text-white sm:text-5xl lg:text-6xl mb-6"
                >
                  {t('billing.hero.title')} <br />
                  <span className="headline-accent headline-accent-solid">
                    {t('billing.hero.titleAccent')}
                  </span>
                </motion.h1>

                <motion.p 
                  variants={secondaryReveal}
                  className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400"
                >
                  {t('billing.hero.description')}
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* V1 Manual Activation Notice */}
          <section className="py-12 px-4 bg-black">
            <div className="max-w-3xl mx-auto">
              <motion.div
                variants={motionReveal}
                initial="hidden"
                whileInView="show"
                viewport={motionViewport}
                className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-8 text-center backdrop-blur-sm"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20">
                  <MessageCircle className="h-8 w-8 text-indigo-300" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  {t('billing.manual.title')}
                </h3>
                <p className="mb-4 text-sm text-slate-400">
                  {t('billing.manual.description')}
                </p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                  <p className="text-xs text-slate-300">
                    <strong className="text-indigo-300">{t('billing.manual.stepsTitle')}</strong>
                  </p>
                  <ol className="mt-2 space-y-1 text-xs text-slate-400 list-decimal list-inside">
                    <li>{t('billing.manual.step1')}</li>
                    <li>{t('billing.manual.step2')}</li>
                    <li>{t('billing.manual.step3')}</li>
                  </ol>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Pricing Cards - Premium Unified Style */}
          <section id="pricing-cards" className="py-16 px-4 bg-black">
            <div className="mx-auto max-w-6xl">
              {/* Toggle */}
              <motion.div 
                variants={motionReveal}
                initial="hidden"
                whileInView="show"
                viewport={motionViewport}
                className="mb-12 flex justify-center"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => setCycle('monthly')}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                      cycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('billing.toggle.monthly')}
                  </button>
                  <button
                    onClick={() => setCycle('yearly')}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                      cycle === 'yearly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('billing.toggle.yearly')}
                    <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      {t('billing.toggle.discount')}
                    </span>
                  </button>
                </div>
              </motion.div>

              {/* Plans Grid - Editorial Layout */}
              <motion.div
                variants={cardsReveal}
                initial="hidden"
                whileInView="show"
                viewport={motionViewport}
                className="grid grid-cols-1 gap-6 md:grid-cols-3"
              >
                {planKeys.map((planKey) => {
                  const planConfig = PRICING_CONFIG[planKey];
                  const isPro = planKey === 'pro';
                  const isEnterprise = planKey === 'enterprise';
                  const name = planConfig.name[lang];
                  const desc = planConfig.description[lang];
                  const features = planConfig.features[lang];
                  const cta = planConfig.cta[lang];
                  const priceDisplay = planConfig.price[cycle].display;
                  const period = getPlanPeriod(planKey, cycle, lang);
                  
                  const isYearly = cycle === 'yearly' && isPro;
                  const effectiveMonthlyDisplay = isYearly && 'effectiveMonthly' in planConfig
                    ? (planConfig.effectiveMonthly as any).yearly.display
                    : null;

                  return (
                    <motion.div
                      key={planKey}
                      variants={cardReveal}
                      className={`relative flex flex-col overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                        isPro
                          ? 'border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 shadow-[0_0_40px_rgba(99,102,241,0.15)]'
                          : 'border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="relative p-6 pb-4">
                        {isPro && (
                          <div className="absolute right-4 top-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                              <Crown className="h-3 w-3" />
                              {t('billing.plans.pro.popular')}
                            </span>
                          </div>
                        )}
                        
                        <div className={`mb-3 inline-flex rounded-xl ${isPro ? 'bg-indigo-500/20' : 'bg-white/5'} p-2.5`}>
                          {isPro ? (
                            <Crown className="h-5 w-5 text-indigo-300" />
                          ) : isEnterprise ? (
                            <Users className="h-5 w-5 text-slate-400" />
                          ) : (
                            <Zap className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        
                        <h3 className="text-lg font-bold text-white">{name}</h3>
                        <p className="mt-1 text-xs text-slate-400">{desc}</p>
                      </div>

                      {/* Price */}
                      <div className="px-6 py-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-white">{priceDisplay}</span>
                          {period && <span className="text-sm text-slate-500">{period}</span>}
                        </div>
                        {effectiveMonthlyDisplay && (
                          <p className="mt-1 text-xs font-medium text-emerald-400">
                            {effectiveMonthlyDisplay}{t('billing.billingInfo.monthly')}
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex-1 px-6 py-4">
                        <ul className="space-y-2.5">
                          {features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2.5">
                              <Check className="h-4 w-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                              <span className="text-sm text-slate-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className="p-6 pt-2">
                        <button
                          onClick={() => handlePlanSelect(planKey)}
                          className={`w-full rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200 ${
                            isPro
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                          }`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {cta}
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* Lower Section - Unified Trust & FAQ - Cinematic continuity */}
          <section className="relative overflow-hidden bg-black py-20 sm:py-28">
            {/* Continuous background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950/[0.03] to-black" />
            
            {/* Atmospheric glows */}
            <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.015] blur-[150px]" />
            <div className="absolute right-0 bottom-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.015] blur-[120px]" />

            {/* Top subtle line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            <div className="relative z-10">
              {/* Trust Signals Band */}
              <div className="mb-20 sm:mb-28">
                <TrustSignals />
              </div>

              {/* FAQ Section */}
              <FAQSection />
            </div>

            {/* Bottom subtle line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
