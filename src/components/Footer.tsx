import { Bot, Twitter, Github, MessageCircle, Mail } from 'lucide-react';
import { config } from '../config';

interface FooterProps {
  onOpenLegal: (type: 'terms' | 'privacy' | 'cookies') => void;
}

export default function Footer({ onOpenLegal }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-white/5 pt-32 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-tighter">TON618</span>
            </div>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed mb-8">
              Extreme-scale Discord automation forged in the void. Engineered for stability, precision, and absolute dominance in community management.
            </p>
            <div className="flex gap-4">
               {[
                 { url: config.twitterUrl,      Icon: Twitter,        label: 'Twitter' },
                 { url: config.githubUrl,       Icon: Github,         label: 'GitHub' },
                 { url: config.supportServerUrl,Icon: MessageCircle,  label: 'Discord' },
                 { url: config.contactEmail ? `mailto:${config.contactEmail}` : null, Icon: Mail, label: 'Email' },
               ].filter(s => s.url).map(({ url, Icon, label }) => (
                 <a key={label} href={url!} target={label !== 'Email' ? '_blank' : undefined}
                   rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                   className="w-12 h-12 cinematic-glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:scale-110"
                   aria-label={label}>
                   <Icon className="w-5 h-5" />
                 </a>
               ))}
            </div>
          </div>

          <div>
             <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-10">Navigation</h3>
             <ul className="space-y-4">
                {['Features', 'Stats', 'Commands', 'Documentation'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm text-slate-500 hover:text-indigo-400 font-bold uppercase tracking-widest transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
             </ul>
          </div>

          <div>
             <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-10">Governance</h3>
             <ul className="space-y-4">
                {(['terms','privacy','cookies'] as const).map((type) => (
                  <li key={type}>
                    <button type="button" onClick={() => onOpenLegal(type)}
                      className="text-sm text-slate-500 hover:text-indigo-400 font-bold uppercase tracking-widest transition-colors text-left">
                      {type} protocol
                    </button>
                  </li>
                ))}
             </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                &copy; {currentYear} TON618 PROJECT
              </span>
              <div className="w-[1px] h-3 bg-white/10"></div>
              <span className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.3em]">
                VOID STABILIZED NODE
              </span>
           </div>
           
           <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
              COMMANDED BY MILO0DEV
           </div>
        </div>
      </div>
    </footer>
  );
}
