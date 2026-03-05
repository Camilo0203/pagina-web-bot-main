import { LifeBuoy, Mail, MessageCircle } from 'lucide-react';
import { config } from '../config';

export default function SupportSection() {
  const hasSupportServer = Boolean(config.supportServerUrl);
  const hasEmail = Boolean(config.contactEmail);

  return (
    <section id="support" className="py-24 bg-gradient-to-br from-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <LifeBuoy className="w-4 h-4" />
            Support
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Need Help?</h2>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">Our team can help you set up, troubleshoot, and optimize your bot experience.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {hasSupportServer ? (
            <a
              href={config.supportServerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-white text-purple-700 font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Join Support Server
            </a>
          ) : (
            <span className="px-6 py-3 rounded-xl bg-white/20 text-white/75 font-semibold cursor-not-allowed">Support server unavailable</span>
          )}

          {hasEmail ? (
            <a
              href={`mailto:${config.contactEmail}`}
              className="px-6 py-3 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
          ) : (
            <span className="px-6 py-3 rounded-xl border border-white/20 text-white/60 font-semibold cursor-not-allowed">Email unavailable</span>
          )}
        </div>
      </div>
    </section>
  );
}
