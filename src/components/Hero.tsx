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
  
  // Parallax and scale for deep space depth
  const ySingularity = useTransform(scrollY, [0, 800], [0, 150]);
  const scaleSingularity = useTransform(scrollY, [0, 800], [1, 1.2]);
  const opacityGradient = useTransform(scrollY, [0, 500], [1, 0.3]);

  return (
    <section ref={containerRef} id="top" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#010103]">
      {/* 1. LAYER: COSMIC ATMOSPHERE */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,12,30,0.6)_0%,rgba(1,1,3,1)_100%)]"></div>
        <div className="absolute inset-0 opacity-20 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        {/* ASYMMETRIC NEBULA CLOUDS */}
        <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] nebula-blur bg-indigo-900/15 animate-drift-cosmic"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] nebula-blur bg-purple-900/10 animate-drift-cosmic" style={{ animationDelay: '-20s', animationDirection: 'reverse' }}></div>
      </div>

      {/* 2. LAYER: THE SUPERMASSIVE SINGULARITY (TON 618) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
        <motion.div 
          style={{ 
            y: shouldReduceMotion ? 0 : ySingularity, 
            scale: shouldReduceMotion ? 1 : scaleSingularity,
            opacity: opacityGradient,
            willChange: 'transform, opacity'
          }}
          className="relative w-full h-full max-w-[1600px] max-h-[1600px] flex items-center justify-center"
        >
          {/* A. GRAVITATIONAL LENSING (Back-warp of the disk) */}
          <div className="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] lg:w-[1200px] lg:h-[1200px] lensing-warp-asymmetric opacity-60 animate-singularity-breathing"></div>

          {/* B. THE REAL ACCRETION DISK (Inclined & Multi-layered) */}
          <div className="relative w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] lg:w-[1300px] lg:h-[1300px] flex items-center justify-center">
            
            {/* BACK SIDE OF THE DISK (Bending over the hole) */}
            <div 
              className="absolute inset-0 accretion-disk-premium animate-accretion-flow opacity-40"
              style={{ transform: 'rotateX(80deg) rotateZ(180deg) scaleY(0.5) translateY(-10%)', filter: 'blur(3px)' }}
            ></div>

            {/* FRONT SIDE OF THE DISK (Inclined Band) */}
            <div 
              className="absolute inset-[-5%] accretion-disk-premium animate-accretion-flow animate-disk-shimmer"
              style={{ 
                maskImage: 'radial-gradient(circle at center, transparent 35%, black 40%, black 50%, transparent 65%)',
                WebkitMaskImage: 'radial-gradient(circle at center, transparent 35%, black 40%, black 50%, transparent 65%)',
                transform: 'rotateX(75deg) rotateZ(0deg)',
                zIndex: 5 
              }}
            ></div>

            {/* HIGH-ENERGY INNER DUST (Asymmetric flow) */}
            <div 
              className="absolute w-[80%] h-[80%] accretion-disk-premium animate-energy-surge opacity-30"
              style={{ 
                transform: 'rotateX(70deg) rotateZ(45deg) scale(0.9)', 
                animationDuration: '8s',
                filter: 'hue-rotate(20deg) blur(5px)'
              }}
            ></div>

            {/* C. THE VOID CORE (Supermassive Mass) */}
            <div className="absolute w-[32%] h-[32%] z-10 flex items-center justify-center">
              {/* Event Horizon Glow (Sharp Interface) */}
              <div className="absolute inset-0 rounded-full border-[1.5px] border-indigo-500/40 blur-[1px]"></div>
              
              {/* The Actual Void (Nested Depth) */}
              <div className="absolute inset-[2%] rounded-full singularity-void animate-core-pulse flex items-center justify-center">
                  <div className="w-[40%] h-[40%] bg-[#05060f] rounded-full blur-[20px] opacity-80"></div>
              </div>
            </div>

            {/* D. SPATIAL WARP FRAGMENTS (Asymmetric Lensing) */}
            {!shouldReduceMotion && [...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="warp-fragment"
                style={{ 
                  width: `${150 + i * 50}px`,
                  top: `${45 + (i * 2)}%`,
                  left: `${20 + (i * 10)}%`,
                  transform: `rotate(${i * 15}deg)`,
                  opacity: 0.15 + (i * 0.05),
                  animation: `shimmer-energy ${10 + i * 2}s infinite alternate`
                }}
              ></div>
            ))}
          </div>

          {/* E. ATMOSPHERIC SPILL (Integration) */}
          <div className="absolute w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[150px] mix-blend-color-dodge animate-pulse-soft"></div>
        </motion.div>
      </div>

      {/* 3. LAYER: UI CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        {/* LEGIBILITY PROTECTION (Subtle Frame) */}
        <div className="absolute inset-[-150px] bg-black/30 blur-[120px] -z-10 pointer-events-none rounded-full"></div>

        {/* STATUS BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-12 group cursor-default"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.4em]">{t('hero.badge')}</span>
          <Activity className="w-3.5 h-3.5 text-indigo-500 opacity-60 group-hover:rotate-180 transition-transform duration-1000" />
        </motion.div>

        {/* MAIN HEADLINE */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11vw] md:text-[9vw] lg:text-[8vw] font-black leading-[0.8] tracking-tightest uppercase mb-8"
        >
          {t('hero.titleMain')} <br/>
          <span className="text-premium-gradient text-shadow-glow">{t('hero.titleAccent')}</span>
        </motion.h1>

        {/* SUBHEADLINE */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto mb-14 font-medium leading-relaxed tracking-tight"
        >
          {t('hero.description')} <br className="hidden md:block"/>
          <span className="text-slate-500 font-normal mt-2 block">{t('hero.descriptionSub')}</span>
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <a href={inviteUrl} className="btn-premium-primary group shadow-indigo-500/10 hover:shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" />
            <span>{t('hero.ctaPrimary')}</span>
          </a>

          <a href={dashboardUrl} className="btn-premium-outline group backdrop-blur-2xl">
            <span>{t('hero.ctaSecondary')}</span>
            <ChevronRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>

      {/* AMBIENT SCROLL INDICATOR */}
      <motion.div 
        animate={shouldReduceMotion ? {} : { y: [0, 12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-all duration-700 pointer-events-none"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-indigo-500/60 to-transparent"></div>
        <span className="text-[10px] uppercase tracking-[0.6em] font-black text-indigo-300/60">{t('hero.scroll')}</span>
      </motion.div>
    </section>
  );
}
