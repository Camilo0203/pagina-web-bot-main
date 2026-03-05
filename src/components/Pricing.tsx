import { Crown, Sparkles } from 'lucide-react';
import { getDiscordInviteUrl } from '../config';

export default function Pricing() {
  const inviteUrl = getDiscordInviteUrl();
  const hasInvite = Boolean(inviteUrl);

  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade when your community needs more advanced control.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
            <p className="text-sm uppercase tracking-wide text-purple-600 font-semibold mb-3">Free</p>
            <h3 className="text-3xl font-bold text-gray-900">$0</h3>
            <p className="text-gray-600 mt-2">Core moderation, utility, and setup tools.</p>
            <ul className="mt-6 space-y-2 text-gray-700">
              <li>Moderation + automod</li>
              <li>Slash commands</li>
              <li>Community features</li>
            </ul>
            {hasInvite ? (
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                Start Free
              </a>
            ) : (
              <a
                href="#top"
                aria-disabled="true"
                onClick={(event) => event.preventDefault()}
                className="mt-8 inline-flex px-5 py-3 rounded-xl bg-gray-300 text-gray-600 font-semibold cursor-not-allowed"
              >
                Start Free
              </a>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl border border-purple-400/30 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">Popular</div>
            <p className="text-sm uppercase tracking-wide text-white/80 font-semibold mb-3">Premium</p>
            <h3 className="text-3xl font-bold flex items-center gap-2">
              <Crown className="w-7 h-7" />
              $9/mo
            </h3>
            <p className="text-white/90 mt-2">Advanced analytics, priority support, and pro automation.</p>
            <ul className="mt-6 space-y-2 text-white/90">
              <li>Premium dashboards</li>
              <li>Advanced logging + insights</li>
              <li>Priority support queue</li>
            </ul>
            <a
              href="#support"
              className="mt-8 inline-flex px-5 py-3 rounded-xl bg-white text-purple-700 font-semibold hover:bg-white/90 transition-colors items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
