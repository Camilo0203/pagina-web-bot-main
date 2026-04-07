import { motion } from 'framer-motion';
import { Shield, RefreshCw, DollarSign, Zap } from 'lucide-react';

export function TrustSignals() {
  const signals = [
    {
      icon: Shield,
      title: 'Secure Checkout',
      description: 'All payments are processed securely through Lemon Squeezy',
      color: 'text-green-400',
    },
    {
      icon: RefreshCw,
      title: 'Cancel Anytime',
      description: 'For subscriptions, cancel anytime with no questions asked',
      color: 'text-blue-400',
    },
    {
      icon: DollarSign,
      title: 'Money-Back Guarantee',
      description: '7-day money-back guarantee on all purchases',
      color: 'text-yellow-400',
    },
    {
      icon: Zap,
      title: 'Instant Activation',
      description: 'Premium features activate within minutes of purchase',
      color: 'text-purple-400',
    },
  ];

  return (
    <section className="py-20 px-4 bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map((signal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-200 hover:border-slate-600 hover:bg-slate-800"
            >
              <div className={`inline-flex rounded-lg bg-slate-900/50 p-3 mb-4`}>
                <signal.icon className={`h-6 w-6 ${signal.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {signal.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {signal.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Powered by Lemon Squeezy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-slate-400 mb-4">Billing powered by</p>
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 backdrop-blur-sm">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="#FFC233"
              />
              <path
                d="M2 17L12 22L22 17V12L12 17L2 12V17Z"
                fill="#FFC233"
              />
            </svg>
            <span className="text-lg font-semibold text-white">
              Lemon Squeezy
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
