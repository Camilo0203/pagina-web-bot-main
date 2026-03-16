import { BookOpen, TerminalSquare } from 'lucide-react';
import { config } from '../config';

export default function DocsSection() {
  return (
    <section id="docs" className="py-32 bg-[#010208] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Core <span className="text-brand-gradient">Protocols</span></h2>
          <p className="text-xl text-slate-400 font-bold uppercase tracking-widest max-w-2xl mx-auto">
            Technical specifications for high-mass server management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="hud-border rounded-3xl p-10 flex flex-col items-center text-center transition-all duration-500 hover:border-amber-500/40 group">
            <div className="p-4 rounded-2xl bg-amber-500/10 mb-8 shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform duration-500">
              <BookOpen className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Main Frame</h3>
            <p className="text-slate-400 font-bold mb-10 leading-relaxed uppercase text-xs tracking-wider">Comprehensive guides, neural maps, and integration manifests.</p>
            {config.docsUrl ? (
              <a
                href={config.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-10 py-4 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
              >
                Access Core
              </a>
            ) : (
              <a href="#guide" className="inline-flex px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all duration-300 hover:scale-105">
                Baseline Guide
              </a>
            )}
          </div>

          <div className="hud-border rounded-3xl p-10 flex flex-col items-center text-center transition-all duration-500 hover:border-amber-500/40 group">
            <div className="p-4 rounded-2xl bg-amber-500/10 mb-8 shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform duration-500">
              <TerminalSquare className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">Command Manifest</h3>
            <p className="text-slate-400 font-bold mb-10 leading-relaxed uppercase text-xs tracking-wider">Direct slash command reference and syntax stabilization logs.</p>
            <a href="#commands" className="inline-flex px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all duration-300 hover:scale-105">
              View Manifest
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
