import { ChevronRight, Sparkles, Activity } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getDiscordInviteUrl, getDashboardUrl } from '../config';
import { useRef } from 'react';

export default function Hero() {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inviteUrl = getDiscordInviteUrl();
  const dashboardUrl = getDashboardUrl();

  const { scrollY } = useScroll();
  
  // Optimized scroll transforms
  const ySingularity = useTransform(scrollY, [0, 500], [0, 80]);
  const scaleSingularity = useTransform(scrollY, [0, 500], [1, 1.1]);
  const rotateSingularity = useTransform(scrollY, [0, 2000], [0, 180]);

  return (
    <section ref={containerRef} id="top" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,20,50,0.8)_0%,rgba(1,1,3,1)_100%)]"></div>
        
        {/* NEBULA LAYERS - Optimized transforms */}
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] nebula-blur bg-indigo-600/10" style={{ transform: 'translate3d(0,0,0)' }}></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] nebula-blur bg-purple-600/10" style={{ transform: 'translate3d(0,0,0)' }}></div>
      </div>

      {/* THE DEFINITIVE SINGULARITY (TON 618 SUPERMASSIVE PRESENCE) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <motion.div 
          style={{ 
            y: shouldReduceMotion ? 0 : ySingularity, 
            scale: shouldReduceMotion ? 1 : scaleSingularity, 
            rotate: shouldReduceMotion ? 0 : rotateSingularity,
            willChange: 'transform'
          }}
          className="relative w-full h-full max-w-[1600px] max-h-[1600px] flex items-center justify-center animate-drift-slow"
        >
          {/* A. COSMIC ATMOSPHERE (Deep Background Glow) */}
          <div className="absolute w-[100%] h-[100%] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[120px] animate-pulse-soft"></div>
          
          {/* B. GRAVITATIONAL LENSING & RINGS (Visible Structure) */}
          <div className="relative w-[500px] h-[500px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px] flex items-center justify-center">
            
            {/* 1. Primary Accretion Disk (Energy Flow - Visible & Cinematic) */}
            <div 
              className="absolute inset-[10%] rounded-full blur-[2px] animate-shimmer-energy opacity-60"
              style={{
                background: 'conic-gradient(from 180deg at 50% 50%, transparent 0%, rgba(99,102,241,0.2) 20%, rgba(167,139,250,0.3) 45%, rgba(199,210,254,0.4) 50%, rgba(167,139,250,0.3) 55%, rgba(99,102,241,0.2) 80%, transparent 100%)',
                maskImage: 'radial-gradient(circle at center, transparent 38%, black 45%, black 55%, transparent 65%)',
                WebkitMaskImage: 'radial-gradient(circle at center, transparent 38%, black 45%, black 55%, transparent 65%)',
                transform: 'rotateX(60deg) rotateZ(0deg)'
              }}
            ></div>

            {/* 2. Secondary High-Energy Ring (Fine Detail) */}
            <div 
              className="absolute inset-[15%] rounded-full border-[1px] border-indigo-400/30 animate-orbit-slow"
              style={{ 
                maskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)',
                WebkitMaskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)'
              }}
            ></div>

            {/* 3. Event Horizon Boundary (The Interface) */}
            <div className="absolute w-[35%] h-[35%] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2)_0%,rgba(0,0,0,0)_70%)] blur-2xl animate-pulse"></div>
            
            {/* 4. THE VOID CORE (Deep Depth - NOT a flat circle) */}
            <div className="absolute w-[30%] h-[30%] rounded-full bg-black/80 blur-[60px] flex items-center justify-center">
               <div className="w-[40%] h-[40%] bg-indigo-950/50 rounded-full blur-[20px]"></div>
            </div>

            {/* 5. Cinematic Light Streaks (Lensing Artifacts) */}
            {!shouldReduceMotion && (
              <div className="absolute inset-0 animate-lensing-flare">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent blur-[1px]"></div>
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-400/10 to-transparent blur-[1px]"></div>
              </div>
            )}
          </div>

          {/* C. DEFINITIVE DARK TENSITY (Frame for Legibility) */}
          <div className="absolute w-[60%] h-[60%] rounded-full bg-black/70 blur-[150px] mix-blend-multiply pointer-events-none"></div>
          
          {/* D. AMBIENT SINGULARITY SPARKS (Refined Particles) */}
          {!shouldReduceMotion && [...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-300/40 rounded-full blur-[1px]"
              animate={{ 
                scale: [0, 1.5, 0],
                opacity: [0, 0.5, 0],
                x: [0, (i - 1) * 200],
                y: [0, (i % 2 === 0 ? 1 : -1) * 150]
              }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, delay: i * 3 }}
              style={{ top: '50%', left: '50%' }}
            />
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* STATUS BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 group cursor-default"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.3em]">{t('hero.badge')}</span>
          <Activity className="w-3 h-3 text-indigo-500 opacity-50 group-hover:rotate-180 transition-transform duration-700" />
        </motion.div>

        {/* MAIN HEADLINE */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[10vw] md:text-[8vw] lg:text-[7.5vw] font-extrabold leading-[0.85] tracking-tightest uppercase mb-6"
        >
          {t('hero.titleMain')} <br/>
          <span className="text-premium-gradient text-shadow-glow">{t('hero.titleAccent')}</span>
        </motion.h1>

        {/* SUBHEADLINE */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed tracking-tight"
        >
          {t('hero.description')} <br className="hidden md:block"/>
          <span className="text-slate-600 font-normal">{t('hero.descriptionSub')}</span>
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <a href={inviteUrl} className="btn-premium-primary group">
            <Sparkles className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12 text-indigo-900" />
            <span>{t('hero.ctaPrimary')}</span>
          </a>

          <a href={dashboardUrl} className="btn-premium-outline group">
            <span>{t('hero.ctaSecondary')}</span>
            <ChevronRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>

      {/* AMBIENT SCROLL INDICATOR */}
      <motion.div 
        animate={shouldReduceMotion ? {} : { y: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20 hover:opacity-100 transition-opacity duration-500 cursor-default"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent"></div>
        <span className="text-[9px] uppercase tracking-[0.5em] font-black text-indigo-200">{t('hero.scroll')}</span>
      </motion.div>
    </section>
  );
}

