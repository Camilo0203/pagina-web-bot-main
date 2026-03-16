import { Bot, ChevronRight, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDiscordInviteUrl, getDashboardUrl } from '../config';

export default function Hero() {
  const inviteUrl = getDiscordInviteUrl();
  const dashboardUrl = getDashboardUrl();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="top" className="relative min-h-[110vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Cinematic Background: The Singularity */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {/* Deep Space Gradients */}
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]"></div>
        
        {/* Particle Field (Static base + Animated overlays) */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="relative w-full h-full flex items-center justify-center">
           {/* Quasar Accretion Disk - Layer 1 (Slow Rotation) */}
           <div className="absolute w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_60%)] animate-rotate-quasar opacity-30"></div>
           
           {/* Layer 2 (Faster/Inverse) - Core Glow */}
           <div className="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] border-[0.5px] border-indigo-500/10 rounded-full animate-spin-reverse opacity-20"></div>

           {/* The Core Photonic Ring */}
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 2, ease: "easeOut" }}
             className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full"
             style={{
               background: 'radial-gradient(circle at center, transparent 40%, rgba(99,102,241,0.15) 50%, rgba(168,85,247,0.1) 60%, transparent 80%)',
               filter: 'blur(30px)'
             }}
           ></motion.div>

           {/* The Singularity (The Void) */}
           <div className="relative z-10 w-40 h-40 md:w-64 md:h-64 rounded-full bg-black singularity-void flex items-center justify-center border border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-3xl"
              ></motion.div>
           </div>
           
           {/* Gravitational Lens Particles (Strategic placement) */}
           {[...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-0.5 h-0.5 bg-cyan-400/30 rounded-full"
               initial={{ 
                 x: Math.random() * 400 - 200, 
                 y: Math.random() * 400 - 200,
                 opacity: 0 
               }}
               animate={{ 
                 x: [null, Math.random() * 600 - 300],
                 y: [null, Math.random() * 600 - 300],
                 opacity: [0, 0.6, 0],
                 scale: [0, 1.5, 0]
               }}
               transition={{ 
                 duration: 10 + Math.random() * 10, 
                 repeat: Infinity, 
                 delay: i * 0.5 
               }}
             />
           ))}
        </div>
      </div>

      <motion.div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-10">
          <div className="px-6 py-2 cinematic-glass rounded-full border border-indigo-500/20">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-cyan-400">Stability Verified v2.4.0</span>
          </div>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black leading-none mb-4 tracking-[-0.05em] uppercase">
          TON<span className="text-premium-gradient">618</span>
        </motion.h1>

        <motion.h2 variants={itemVariants} className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-medium tracking-tight leading-relaxed">
          Command your Discord universe with absolute precision. <br className="hidden md:block"/>
          <span className="text-slate-500 font-normal">The most massive automation utility forged in cosmic scale.</span>
        </motion.h2>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button-primary group"
          >
            <Bot className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" />
            <span>Add to Discord</span>
            <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
          </a>

          <a
            href={dashboardUrl}
            className="premium-button-outline group"
          >
            <LayoutDashboard className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" />
            <span>Command HUD</span>
          </a>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to Explore</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
