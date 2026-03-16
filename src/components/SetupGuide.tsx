import { Bot, Settings, SlidersHorizontal, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getDashboardUrl,
  getDiscordInviteUrl,
  isDashboardExternal,
} from '../config';

const steps = [
  {
    icon: Bot,
    title: 'Invite the bot',
    description: 'Authorize the bot in your Discord server with the proper permissions.',
    href: '#top',
    linkLabel: 'Invite now',
  },
  {
    icon: Settings,
    title: 'Run /setup',
    description: 'Use the guided slash command to initialize categories and permissions.',
    href: '#commands',
    linkLabel: 'View commands',
  },
  {
    icon: SlidersHorizontal,
    title: 'Configure modules',
    description: 'Enable only the features your community needs from dashboard or commands.',
    href: '/dashboard',
    linkLabel: 'Open dashboard',
  },
  {
    icon: PartyPopper,
    title: 'Launch and enjoy',
    description: 'Welcome members, automate moderation, and keep engagement high.',
    href: '#support',
    linkLabel: 'Get support',
  },
];

export default function SetupGuide() {
  const inviteUrl = getDiscordInviteUrl();
  const dashboardHref = getDashboardUrl();
  const dashboardExternal = isDashboardExternal();

  return (
    <section id="guide" className="py-32 bg-[#010208] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Horizon <span className="text-brand-gradient">Sync</span></h2>
          <p className="text-xl text-slate-400 font-bold uppercase tracking-widest">Establish your server's presence in four cycles.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const href = index === 0 && inviteUrl
              ? inviteUrl
              : index === 2
                ? dashboardHref
                : step.href;
            const external = index === 0
              ? Boolean(inviteUrl)
              : index === 2
                ? dashboardExternal
                : false;

            return (
              <article key={step.title} className="hud-border rounded-3xl p-8 flex flex-col transition-all duration-500 hover:border-amber-500/40 group">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-6 h-6 text-amber-500" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500/60 font-black mb-3">Cycle 0{index + 1}</p>
                <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{step.title}</h3>
                <p className="text-slate-400 mb-8 text-sm font-bold leading-relaxed">{step.description}</p>

                <div className="mt-auto">
                  {index === 2 && !external ? (
                    <Link
                      to={href}
                      className="text-amber-500 font-black uppercase text-xs tracking-widest hover:text-amber-400 transition-colors inline-flex items-center gap-2 group/link"
                    >
                      {step.linkLabel}
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  ) : (
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="text-amber-500 font-black uppercase text-xs tracking-widest hover:text-amber-400 transition-colors inline-flex items-center gap-2 group/link"
                    >
                      {step.linkLabel}
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
