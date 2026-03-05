import { Bot, ExternalLink, LayoutDashboard } from 'lucide-react';
import { getDiscordInviteUrl, config } from '../config';

export default function Hero() {
  const inviteUrl = getDiscordInviteUrl();
  const inviteEnabled = Boolean(inviteUrl);

  const dashboardHref = config.dashboardUrl || '#dashboard';
  const supportHref = config.supportServerUrl || '#support';
  const dashboardExternal = Boolean(config.dashboardUrl);
  const supportExternal = Boolean(config.supportServerUrl);

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTEwIDBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0xMCAwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptLTIwIDEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMTAgMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTEwIDBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wIDEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptLTEwIDBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0tMTAgMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <Bot className="w-16 h-16 text-white" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
          The Ultimate Discord Bot
          <br />
          <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
            for Your Community
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
          Powerful moderation, engaging features, and seamless automation.
          Elevate your Discord server to the next level.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={inviteEnabled ? inviteUrl : '#top'}
            target={inviteEnabled ? '_blank' : undefined}
            rel={inviteEnabled ? 'noopener noreferrer' : undefined}
            aria-disabled={!inviteEnabled}
            onClick={(event) => {
              if (!inviteEnabled) {
                event.preventDefault();
              }
            }}
            className={`group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-2xl flex items-center gap-2 ${
              inviteEnabled
                ? 'bg-white text-purple-600 hover:bg-opacity-90 hover:shadow-white/50 hover:scale-105'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-70'
            }`}
          >
            <Bot className="w-5 h-5" />
            Invite Bot
          </a>

          <a
            href={dashboardHref}
            target={dashboardExternal ? '_blank' : undefined}
            rel={dashboardExternal ? 'noopener noreferrer' : undefined}
            className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <LayoutDashboard className="w-5 h-5" />
            Open Dashboard
          </a>

          <a
            href={supportHref}
            target={supportExternal ? '_blank' : undefined}
            rel={supportExternal ? 'noopener noreferrer' : undefined}
            className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            Support Server
          </a>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
            <div className="text-white/80">Servers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">10M+</div>
            <div className="text-white/80">Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-white/80">Uptime</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/80">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
