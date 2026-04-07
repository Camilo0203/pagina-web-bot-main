import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';

interface DonationSectionProps {
  onDonate: () => void;
  loading?: boolean;
}

export function DonationSection({ onDonate, loading }: DonationSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-8 sm:p-12 backdrop-blur-sm"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          
          <div className="relative text-center">
            {/* Icon */}
            <div className="inline-flex rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-4 mb-6">
              <Heart className="h-12 w-12 text-pink-400" fill="currentColor" />
            </div>

            {/* Headline */}
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {t('pricing.donation.title')}
            </h2>

            {/* Description */}
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              {t('pricing.donation.description')}
            </p>

            {/* Important Notice - Donations don't activate premium */}
            <div className="mt-6 max-w-lg mx-auto">
              <div className="rounded-xl bg-orange-500/10 border-2 border-orange-500/30 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 text-orange-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-orange-300 mb-1">
                      Important: Donations do NOT activate premium features
                    </p>
                    <p className="text-xs text-orange-200/80">
                      {t('pricing.donation.disclaimer')} To get premium features, please purchase a Pro plan above.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onDonate}
              disabled={loading}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-pink-500/50 transition-all duration-200 hover:from-pink-700 hover:to-purple-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
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
                  Loading...
                </>
              ) : (
                <>
                  {t('pricing.donation.cta')}
                  <Heart className="h-5 w-5" fill="currentColor" />
                </>
              )}
            </button>

            {/* Additional info */}
            <div className="mt-6 space-y-2">
              <p className="text-sm text-slate-400">
                • Donations support development and server costs
              </p>
              <p className="text-sm text-slate-400">
                • All donations are processed securely through Lemon Squeezy
              </p>
              <p className="text-sm text-slate-400">
                • You'll receive a confirmation email after donating
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
