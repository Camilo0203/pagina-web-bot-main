import { Crown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDiscordInviteUrl } from '../config';

export default function Pricing() {
  const inviteUrl = getDiscordInviteUrl();
  const hasInvite = Boolean(inviteUrl);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="pricing" className="py-32 bg-[#010208] relative overflow-hidden">
      {/* Background stardust */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter"
          >
            Resource <span className="text-brand-gradient">Allocation</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-widest"
          >
            Scale your server's mass with our orbital tiers.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto items-stretch"
        >
          {/* Free plan */}
          <motion.div variants={itemVariants} className="flex flex-col h-full hud-border rounded-3xl p-10 transition-all duration-500 hover:border-amber-500/30 group">
            <div className="flex justify-between items-start mb-8">
               <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black">Tier 01 // Standard</p>
               <div className="p-2 rounded-xl bg-white/5 group-hover:bg-amber-500/10 transition-colors">
                  <Sparkles className="w-5 h-5 text-slate-600 group-hover:text-amber-500" />
               </div>
            </div>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-6xl font-black text-white">$0</span>
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">/ eternity</span>
            </div>
            <p className="text-slate-400 font-bold mb-10 leading-relaxed uppercase text-xs tracking-wider">Core moderation, basic automation, and horizon sync.</p>
            
            <div className="space-y-4 mb-12 flex-grow">
               {[
                 'Standard Automod',
                 'Basic Slash Commands',
                 'Community Pulse Statistics'
               ].map((feature) => (
                 <div key={feature} className="flex items-center gap-3">
                   <div className="w-1 h-1 bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
                   <span className="text-sm text-slate-300 font-bold uppercase tracking-wider">{feature}</span>
                 </div>
               ))}
            </div>

            {hasInvite ? (
              <a href={inviteUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex justify-center px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all duration-300 hover:scale-105">
                Establish Link
              </a>
            ) : (
              <button disabled className="inline-flex justify-center px-8 py-5 rounded-2xl bg-white/5 border border-white/5 text-slate-600 font-black uppercase tracking-widest cursor-not-allowed">
                Link Offline
              </button>
            )}
          </motion.div>

          {/* Premium plan */}
          <motion.div variants={itemVariants} className="flex flex-col h-full hud-border rounded-3xl p-10 border-amber-500/20 bg-amber-500/[0.02] shadow-[0_0_50px_rgba(245,158,11,0.05)] relative overflow-hidden transition-all duration-500 hover:border-amber-500/50 hover:shadow-[0_0_80px_rgba(245,158,11,0.1)] group">
            {/* Accretion glow inside card */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-[80px] pointer-events-none group-hover:opacity-100 transition-opacity opacity-50"></div>

            <div className="flex justify-between items-start mb-8">
               <p className="text-xs uppercase tracking-[0.3em] text-amber-500 font-black">Tier 02 // Singularity</p>
               <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest">Priority</div>
            </div>
            
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-6xl font-black text-white">$9.99</span>
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">/ cycle</span>
            </div>
            <p className="text-slate-400 font-bold mb-10 leading-relaxed uppercase text-xs tracking-wider">Advanced analytics, priority response, and pro stabilization.</p>
            
            <div className="space-y-4 mb-12 flex-grow">
               {[
                 'Advanced Neural Logging',
                 'Exclusive HUD Themes',
                 'Horizon Support Priority'
               ].map((feature) => (
                 <div key={feature} className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
                   <span className="text-sm text-white font-black uppercase tracking-wider">{feature}</span>
                 </div>
               ))}
            </div>

            <a href="#support"
              className="inline-flex justify-center px-8 py-5 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] items-center gap-3">
              <Crown className="w-5 h-5" />
              Priority Access
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
