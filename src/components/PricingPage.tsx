import { useState } from 'react';
import { PricingCard } from './PricingCard';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelectPlan = async (planType: string) => {
    setLoading(planType);

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/dashboard/auth');
        return;
      }

      if (planType === 'donation') {
        if (!supabase) {
          throw new Error('Supabase client not initialized');
        }
        const { data, error } = await supabase.functions.invoke('lemon-create-checkout', {
          body: { plan_type: 'donation' },
        });

        if (error) throw error;

        if (data?.url) {
          window.location.href = data.url;
        }
      } else {
        navigate(`/dashboard?section=billing&plan=${planType}`);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock the full potential of TON618 Bot with premium features designed for serious server management.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <PricingCard
            name="Pro Monthly"
            price="$9.99"
            interval="month"
            description="Perfect for trying out premium features"
            icon="zap"
            features={[
              'Up to 50 custom commands',
              '20 auto-role configurations',
              '10 welcome message templates',
              'Advanced moderation tools',
              'Custom embed builder',
              'Priority support',
              'Server analytics dashboard',
              'Cancel anytime',
            ]}
            onSelect={() => handleSelectPlan('monthly')}
            loading={loading === 'monthly'}
          />

          <PricingCard
            name="Pro Yearly"
            price="$99.99"
            interval="year"
            description="Best value - Save 17% annually"
            icon="crown"
            highlighted
            badge="BEST VALUE"
            features={[
              'Everything in Monthly',
              'Save $20 per year',
              'Priority feature requests',
              'Early access to new features',
              'Dedicated support channel',
              'Custom bot status (coming soon)',
              'Advanced analytics',
              'Yearly billing',
            ]}
            onSelect={() => handleSelectPlan('yearly')}
            loading={loading === 'yearly'}
          />

          <PricingCard
            name="Lifetime"
            price="$299.99"
            description="One-time payment, forever access"
            icon="sparkles"
            badge="UNLIMITED"
            features={[
              'Everything in Pro',
              '100 custom commands',
              '50 auto-role configurations',
              '20 welcome message templates',
              'Lifetime updates',
              'VIP support',
              'Exclusive features',
              'No recurring payments',
              'Priority bug fixes',
            ]}
            onSelect={() => handleSelectPlan('lifetime')}
            loading={loading === 'lifetime'}
          />
        </div>

        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-8 text-center">
          <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Support Development</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Love TON618 Bot? Consider making a donation to support ongoing development and server costs.
            Every contribution helps us build better features for the community!
          </p>
          <button
            onClick={() => handleSelectPlan('donation')}
            disabled={loading === 'donation'}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 disabled:opacity-50"
          >
            {loading === 'donation' ? 'Processing...' : 'Make a Donation ❤️'}
          </button>
        </div>

        <div className="mt-16 text-center text-gray-400 text-sm">
          <p>All plans include a 7-day money-back guarantee. No questions asked.</p>
          <p className="mt-2">Secure payments powered by Lemon Squeezy 🍋</p>
        </div>
      </div>
    </div>
  );
}
