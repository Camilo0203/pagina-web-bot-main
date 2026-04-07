// Pricing page for TON618 Bot premium plans
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PricingHero } from '../components/PricingHero';
import { PricingCards } from '../components/PricingCards';
import { GuildSelector } from '../components/GuildSelector';
import { DonationSection } from '../components/DonationSection';
import { TrustSignals } from '../components/TrustSignals';
import { FAQSection } from '../components/FAQSection';
import { useBillingGuilds } from '../hooks/useBillingGuilds';
import { createBillingCheckout, signInWithDiscord, getCurrentSession } from '../api';
import type { PlanKey } from '../types';


export default function PricingPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [processingDonation, setProcessingDonation] = useState(false);
  
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
      toast.error('Failed to sign in with Discord');
    }
  };

  const handlePlanSelect = (planKey: PlanKey) => {
    if (planKey === 'donate') {
      handleDonation();
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please sign in with Discord first');
      handleSignIn();
      return;
    }

    setSelectedPlan(planKey);
    
    // Scroll to guild selector
    setTimeout(() => {
      document.getElementById('guild-selector')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleDonation = async () => {
    try {
      setProcessingDonation(true);
      const response = await createBillingCheckout({ plan_key: 'donate' });
      window.location.href = response.checkout_url;
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create donation checkout');
    } finally {
      setProcessingDonation(false);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!selectedPlan || !selectedGuildId) {
      toast.error('Please select a plan and server');
      return;
    }

    try {
      setProcessingCheckout(true);
      
      const response = await createBillingCheckout({
        guild_id: selectedGuildId,
        plan_key: selectedPlan,
      });

      // Redirect to Lemon Squeezy checkout
      window.location.href = response.checkout_url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create checkout');
      setProcessingCheckout(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <PricingHero />

      {/* Auth prompt */}
      {!isAuthenticated && (
        <section className="py-12 px-4 bg-slate-950">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-6 text-center backdrop-blur-sm"
            >
              <p className="text-lg mb-4 text-white">Sign in with Discord to get started</p>
              <button
                onClick={handleSignIn}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                Sign in with Discord
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Pricing Cards */}
      <PricingCards
        onSelectPlan={handlePlanSelect}
        loading={processingCheckout}
        selectedPlan={selectedPlan}
      />

      {/* Guild Selector */}
      {isAuthenticated && selectedPlan && selectedPlan !== 'donate' && (
        <section className="py-12 px-4 bg-slate-900">
          <div className="max-w-4xl mx-auto">
            <motion.div
              id="guild-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Select a Server
              </h2>
              
              {guildsError ? (
                <div className="text-center py-12">
                  <p className="text-red-400 mb-4">{guildsError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Try again
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 flex justify-center"
                    >
                      <button
                        onClick={handleProceedToCheckout}
                        disabled={processingCheckout}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {processingCheckout ? 'Creating Checkout...' : 'Proceed to Checkout'}
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Donation Section */}
      <DonationSection
        onDonate={handleDonation}
        loading={processingDonation}
      />

      {/* Trust Signals */}
      <TrustSignals />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
