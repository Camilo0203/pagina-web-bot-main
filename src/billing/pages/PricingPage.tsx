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
      toast.error('Please sign in with Discord to continue', {
        description: 'You need to authenticate to purchase premium plans',
      });
      handleSignIn();
      return;
    }

    setSelectedPlan(planKey);
    toast.success('Plan selected!', {
      description: 'Now choose which server to upgrade',
    });
    
    // Scroll to guild selector
    setTimeout(() => {
      document.getElementById('guild-selector')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleDonation = async () => {
    if (!isAuthenticated) {
      toast.error('Sign in required', {
        description: 'Please sign in with Discord to make a donation',
      });
      handleSignIn();
      return;
    }

    try {
      setProcessingDonation(true);
      toast.loading('Creating donation checkout...', { id: 'donation' });
      const response = await createBillingCheckout({ plan_key: 'donate' });
      toast.success('Redirecting to checkout...', { id: 'donation' });
      window.location.href = response.checkout_url;
    } catch (error) {
      console.error('Donation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create donation checkout';
      toast.error('Donation failed', {
        id: 'donation',
        description: errorMessage,
      });
      setProcessingDonation(false);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!selectedPlan || !selectedGuildId) {
      toast.error('Missing information', {
        description: 'Please select both a plan and a server',
      });
      return;
    }

    const selectedGuild = guilds.find(g => g.id === selectedGuildId);

    try {
      setProcessingCheckout(true);
      toast.loading(`Creating checkout for ${selectedGuild?.name || 'your server'}...`, { id: 'checkout' });
      
      const response = await createBillingCheckout({
        guild_id: selectedGuildId,
        plan_key: selectedPlan,
      });

      toast.success('Redirecting to secure checkout...', { id: 'checkout' });
      // Redirect to Lemon Squeezy checkout
      window.location.href = response.checkout_url;
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout';
      
      // Parse specific error messages
      if (errorMessage.includes('already has an active')) {
        toast.error('Server already has premium', {
          id: 'checkout',
          description: 'This server already has an active premium subscription',
        });
      } else if (errorMessage.includes('permission')) {
        toast.error('Permission denied', {
          id: 'checkout',
          description: 'You need Manage Server permission to upgrade this server',
        });
      } else {
        toast.error('Checkout failed', {
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
          <p className="text-white font-semibold">Loading pricing...</p>
          <p className="text-slate-400 text-sm mt-2">Checking authentication status</p>
        </div>
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
              {/* Progress Indicator */}
              <div className="mb-6 flex items-center justify-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-slate-400">Plan Selected</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-600" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    2
                  </div>
                  <span className="text-white font-medium">Choose Server</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-600" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-slate-400 text-xs font-bold">
                    3
                  </div>
                  <span className="text-slate-400">Checkout</span>
                </div>
              </div>

              {/* Selected Plan Info */}
              <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <p className="text-sm text-indigo-300 text-center">
                  Selected: <span className="font-semibold">{selectedPlan.replace('_', ' ').toUpperCase()}</span>
                </p>
              </div>

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
