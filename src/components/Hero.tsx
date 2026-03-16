import { Bot, ExternalLink, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDiscordInviteUrl, config } from '../config';
import { useTranslation } from 'react-i18next';
import { motion, Variants } from 'framer-motion';
import { getDashboardUrl, isDashboardExternal } from '../config';
import { useState } from 'react';

export default function Hero() {
  const [isActive, setIsActive] = useState(false);
  const inviteUrl = getDiscordInviteUrl();
  const inviteEnabled = Boolean(inviteUrl);
  const { t } = useTranslation();

  const dashboardHref = getDashboardUrl();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#010208]">
      {/* Hyper-Void Reactive Black Hole */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {/* Distant Stars */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

        {/* Global Glow */}
        <div className={`absolute w-[100vw] h-[100vh] bg-amber-600/5 blur-[150px] transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-40'}`}></div>

        <div className="relative w-[500px] h-[500px] md:w-[800px] md:h-[800px] flex items-center justify-center">
          {/* External Accretion Disk (Slow) */}
          <div className={`absolute inset-0 border-[1px] border-amber-500/10 rounded-full animate-spin-slow transition-all duration-700 ${isActive ? 'scale-110 opacity-40' : 'scale-100 opacity-20'}`}></div>
          
          {/* Secondary Accretion Layer (Reverse) */}
          <div className={`absolute inset-16 border-t border-b border-amber-500/20 rounded-full animate-spin-reverse transition-all duration-700 ${isActive ? 'scale-105 opacity-60' : 'scale-100 opacity-30'}`}></div>

          {/* Core Photon Ring */}
          <div className={`absolute inset-32 bg-gradient-to-r from-amber-600/40 via-orange-500/20 to-amber-600/40 rounded-full blur-[40px] transition-all duration-500 ${isActive ? 'scale-125 opacity-100 active-accretion' : 'scale-100 opacity-60'}`}></div>

          {/* The Event Horizon (The Void) */}
          <div className={`relative z-10 w-48 h-48 md:w-64 md:h-64 bg-black rounded-full shadow-[0_0_100px_rgba(245,158,11,0.5)] flex items-center justify-center border border-amber-500/10 transition-transform duration-700 ${isActive ? 'scale-90' : 'scale-100'}`}>
             {/* Center Singularity Pulse */}
             <div className="w-full h-full rounded-full bg-black animate-pulse shadow-[inset_0_0_40px_rgba(245,158,11,0.2)]"></div>
          </div>
          
          {/* Gravitational Lens Particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/40 rounded-full animate-float"
              style={{
                top: `${40 + Math.random() * 20}%`,
                left: `${40 + Math.random() * 20}%`,
                transform: `rotate(${i * 24}deg) translateX(${150 + Math.random() * 100}px)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <motion.div
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="p-4 hud-border rounded-3xl event-horizon-glow transform hover:scale-110 transition-all duration-500">
            <Bot className="w-16 h-16 text-amber-500" />
          </div>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tighter uppercase">
          <span className="opacity-80">TON</span>
          <span className="text-brand-gradient">618</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-400 mb-14 max-w-2xl mx-auto font-bold uppercase tracking-widest leading-relaxed">
          {t('hero.description', 'Absolute power stabilized. The most massive Discord automation utility in the known universe.')}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <a
            href={inviteEnabled ? inviteUrl : '#top'}
            target={inviteEnabled ? '_blank' : undefined}
            rel={inviteEnabled ? 'noopener noreferrer' : undefined}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            className="group relative px-12 py-6 rounded-2xl font-black text-xl bg-amber-500 text-black hover:bg-amber-400 transition-all duration-300 shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:shadow-[0_0_70px_rgba(245,158,11,0.7)] hover:scale-110 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
            <Bot className="w-7 h-7" />
            {t('hero.invite', 'INITIATE SYNC')}
          </a>

          <Link
            to={dashboardHref}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            className="px-12 py-6 hud-border text-white rounded-2xl font-black text-xl hover:bg-white/5 transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            <LayoutDashboard className="w-7 h-7" />
            {t('hero.dashboard', 'COMMAND HUD')}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
