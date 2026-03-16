import { motion } from 'framer-motion';
import { Bot, ChevronRight } from 'lucide-react';
import { getDiscordInviteUrl } from '../config';

export default function FinalCTA() {
  const inviteUrl = getDiscordInviteUrl();

  return (
    <section id="join" className="py-40 relative overflow-hidden bg-black">
      {/* Background Deep Space visual */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-10">
            Expand Your <br/>
            <span className="text-premium-gradient">Empire</span>
          </h2>
          
          <p className="text-xl text-slate-400 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
            The singularity is ready. Initiate the synchronization protocol and bring cosmic-scale power to your Discord server today.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-16 py-6 bg-white text-black rounded-2xl font-black text-xl uppercase tracking-[0.2em] hover:scale-110 transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.2)] flex items-center gap-3 overflow-hidden group"
            >
              <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
              <span>Initialize Sync</span>
              <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </a>
          </div>

          <div className="mt-20 flex justify-center gap-12 text-slate-500 font-black text-[10px] uppercase tracking-[0.4em]">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                <span>NODE-01 ACTIVE</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                <span>ENCRYPTION VERIFIED</span>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
