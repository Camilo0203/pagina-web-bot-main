import { BarChart3, ShieldCheck, Settings2 } from 'lucide-react';
import { config } from '../config';

export default function DashboardSection() {
  const hasDashboard = Boolean(config.dashboardUrl);

  return (
    <section id="dashboard" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">Control Everything in One Dashboard</h2>
            <p className="text-lg text-gray-600 mb-8">
              Manage moderation, automations, and engagement settings with an interface built for server owners and moderators.
            </p>

            <div className="space-y-4 text-gray-700 mb-8">
              <p className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-purple-600" /> Role-based moderation controls</p>
              <p className="flex items-center gap-3"><BarChart3 className="w-5 h-5 text-purple-600" /> Live analytics and usage reports</p>
              <p className="flex items-center gap-3"><Settings2 className="w-5 h-5 text-purple-600" /> Fast feature toggles and presets</p>
            </div>

            {hasDashboard ? (
              <a
                href={config.dashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                Open Dashboard
              </a>
            ) : (
              <span className="inline-flex px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold">
                Dashboard coming soon
              </span>
            )}
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl p-8 text-white shadow-2xl border border-white/10">
            <p className="text-sm uppercase tracking-wide text-white/70 mb-3">Preview</p>
            <h3 className="text-2xl font-bold mb-4">Command Activity</h3>
            <div className="space-y-3">
              <div className="h-3 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-[82%] bg-cyan-400"></div></div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-[64%] bg-pink-400"></div></div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden"><div className="h-full w-[91%] bg-emerald-400"></div></div>
            </div>
            <p className="text-white/80 mt-6 text-sm">Real-time insights for moderation, engagement, and feature usage.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
