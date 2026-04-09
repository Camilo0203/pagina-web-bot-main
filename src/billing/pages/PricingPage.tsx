import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, Zap, Crown, Users, ArrowRight, Sparkles } from 'lucide-react';
import { GuildSelector } from '../components/GuildSelector';
import { TrustSignals } from '../components/TrustSignals';
import { FAQSection } from '../components/FAQSection';
import { useBillingGuilds } from '../hooks/useBillingGuilds';
import { createBillingCheckout, signInWithDiscord, getCurrentSession } from '../api';
import { PRICING_CONFIG, getPlanPeriod, type BillingCycle, type PricingPlanKey } from '../../config/pricing';
import { config, getDiscordInviteUrl } from '../../config';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { instantReveal, motionViewport, sectionIntro, withDelay, motionStagger, cardStagger, revealUp } from '../../lib/motion';


const planKeys: PricingPlanKey[] = ['free', 'pro', 'enterprise'];

export default function PricingPage() {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanKey | null>(null);
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const inviteUrl = getDiscordInviteUrl();
  
  const { guilds, loading: guildsLoading, error: guildsError } = useBillingGuilds();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getCurrentSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithDiscord(window.location.href);
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(t('billing.toasts.signInError'));
    }
  };

  const handlePlanSelect = (planKey: PricingPlanKey) => {
    if (planKey === 'free') {
      if (inviteUrl) {
        window.location.href = inviteUrl;
      } else {
        toast.error(t('billing.toasts.inviteError'));
      }
      return;
    }

    if (planKey === 'enterprise') {
      const contactUrl = config.supportServerUrl || (config.contactEmail ? `mailto:${config.contactEmail}` : '');
      if (contactUrl) {
        window.location.href = contactUrl;
      } else {
        toast.error(t('billing.toasts.contactError'));
      }
      return;
    }

    if (!isAuthenticated) {
      toast.error(t('billing.toasts.pleaseSignIn'), {
        description: t('billing.toasts.needAuthDesc'),
      });
      handleSignIn();
      return;
    }

    setSelectedPlan(planKey);
    toast.success(t('billing.toasts.selectPlan'), {
      description: t('billing.toasts.selectPlanDesc'),
    });
    
    setTimeout(() => {
      document.getElementById('guild-selector')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };


  const handleProceedToCheckout = async () => {
    if (!selectedPlan || !selectedGuildId) {
      toast.error(t('billing.toasts.missingInfo'), {
        description: t('billing.toasts.selectPlanAndServer'),
      });
      return;
    }

    const selectedGuild = guilds.find(g => g.id === selectedGuildId);
    const billingPlanKey = cycle === 'monthly' ? 'pro_monthly' : 'pro_yearly';

    try {
      setProcessingCheckout(true);
      toast.loading(t('billing.toasts.creatingCheckout', { server: selectedGuild?.name || 'your server' }), { id: 'checkout' });
      
      const response = await createBillingCheckout({
        guild_id: selectedGuildId,
        plan_key: billingPlanKey as any,
      });

      toast.success(t('billing.toasts.redirecting'), { id: 'checkout' });
      window.location.href = response.checkout_url;
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : t('billing.toasts.checkoutFailed');
      
      if (errorMessage.includes('already has an active')) {
        toast.error(t('billing.toasts.serverHasPremium'), {
          id: 'checkout',
          description: t('billing.toasts.serverHasPremiumDesc'),
        });
      } else if (errorMessage.includes('permission')) {
        toast.error(t('billing.toasts.permissionDenied'), {
          id: 'checkout',
          description: t('billing.toasts.needManageServer'),
        });
      } else {
        toast.error(t('billing.toasts.checkoutFailed'), {
          id: 'checkout',
          description: errorMessage,
        });
      }
      
      setProcessingCheckout(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 mb-4">
            <svg
              className="w-8 h-8 animate-spin text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-white font-semibold">{t('billing.loading.title')}</p>
          <p className="text-slate-400 text-sm mt-2">{t('billing.loading.subtitle')}</p>
        </div>
      </div>
    );
  }

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

          {/* Auth prompt - Premium Style */}
          {!isAuthenticated && (
            <section className="py-12 px-4 bg-black">
              <div className="max-w-2xl mx-auto">
                <motion.div
                  variants={motionReveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={motionViewport}
                  className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-8 text-center backdrop-blur-sm"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20">
                    <svg className="h-8 w-8 text-indigo-300" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">
                    {t('billing.auth.title')}
                  </h3>
                  <p className="mb-6 text-sm text-slate-400">
                    {t('billing.auth.subtitle')}
                  </p>
                  <button
                    onClick={handleSignIn}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                    <span>{t('billing.auth.cta')}</span>
                  </button>
                </motion.div>
              </div>
            </section>
          )}

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
                          disabled={processingCheckout && selectedPlan === planKey}
                          className={`w-full rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200 ${
                            isPro
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                          } ${
                            processingCheckout && selectedPlan === planKey
                              ? 'cursor-not-allowed opacity-50'
                              : ''
                          }`}
                        >
                          {processingCheckout && selectedPlan === planKey ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              {t('billing.plans.pro.processing')}
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              {cta}
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* Guild Selector - Premium Style */}
          {isAuthenticated && selectedPlan === 'pro' && (
            <section className="py-12 px-4 bg-black">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  id="guild-selector"
                  variants={motionReveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={motionViewport}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-8 backdrop-blur-xl"
                >
                  {/* Progress Indicator - Minimal */}
                  <div className="mb-8 flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                        ✓
                      </div>
                      <span className="text-xs text-slate-500">{t('billing.steps.plan')}</span>
                    </div>
                    <div className="h-px w-6 bg-white/10" />
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                        2
                      </div>
                      <span className="text-xs font-medium text-white">{t('billing.steps.server')}</span>
                    </div>
                    <div className="h-px w-6 bg-white/10" />
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-slate-500 text-xs font-bold">
                        3
                      </div>
                      <span className="text-xs text-slate-500">{t('billing.steps.pay')}</span>
                    </div>
                  </div>

                  <h2 className="mb-2 text-center text-xl font-bold text-white">
                    {t('billing.serverSelection.title')}
                  </h2>
                  <p className="mb-6 text-center text-sm text-slate-400">
                    {t('billing.serverSelection.subtitle')}
                  </p>

                  {guildsError ? (
                    <div className="py-8 text-center">
                      <p className="mb-4 text-sm text-red-400">{guildsError}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="text-sm text-indigo-400 hover:text-indigo-300"
                      >
                        {t('billing.serverSelection.retry')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <GuildSelector
                        guilds={guilds}
                        selectedGuildId={selectedGuildId}
                        onSelectGuild={setSelectedGuildId}
                        loading={guildsLoading}
                      />

                      {selectedGuildId && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 flex justify-center"
                        >
                          <button
                            onClick={handleProceedToCheckout}
                            disabled={processingCheckout}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {processingCheckout ? (
                              <>
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {t('billing.checkout.processing')}
                              </>
                            ) : (
                              <>
                                {t('billing.checkout.proceed')}
                                <ArrowRight className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.div>
              </div>
            </section>
          )}

          {/* Trust Signals - Premium integrated trust band */}
          <TrustSignals />

          {/* FAQ Section - Premium accordion */}
          <FAQSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}
