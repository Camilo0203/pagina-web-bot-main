import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function VisualExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <section ref={containerRef} id="experience" className="h-[150vh] relative bg-black overflow-hidden flex items-center justify-center">
      {/* Background Distortion/Glow */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] nebula-blur bg-indigo-500/10 blur-[150px] rounded-full"
        ></motion.div>
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] nebula-blur bg-purple-500/10 blur-[150px] rounded-full"
        ></motion.div>
      </div>

      {/* Centerpiece Visual */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 text-center px-4"
      >
        <div className="relative mb-16 inline-block">
          {/* Energy Core Visual */}
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-indigo-500/30 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-full animate-pulse-slow"></div>
            <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,1)]"></div>
            
            {/* Spinning Rings */}
            <div className="absolute inset-[-20px] border border-white/5 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-[-40px] border border-indigo-500/10 rounded-full bg-transparent opacity-50"></div>
          </div>
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-8 max-w-5xl mx-auto leading-none">
          Experience the <br/>
          <span className="text-premium-gradient">Singularity</span>
        </h2>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-[0.2em] opacity-80">
          Scaling communities beyond the limits of known gravity.
        </p>
      </motion.div>

      {/* Floating UI Elements (Parallax) */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[20%] right-[10%] cinematic-glass p-6 rounded-3xl border-indigo-500/20 hidden lg:block"
      >
        <div className="flex flex-col gap-4">
          <div className="w-40 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: ["0%", "80%", "0%"] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="h-full bg-indigo-500"
            ></motion.div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-slate-500">
            <span>FLUX CAPACITY</span>
            <span>0.88c</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-[20%] left-[10%] cinematic-glass p-6 rounded-3xl border-indigo-500/20 hidden lg:block"
      >
        <div className="flex gap-4 items-center">
           <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
           </div>
           <div>
              <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">System Status</div>
              <div className="text-sm font-bold text-white uppercase">Void Stabilized</div>
           </div>
        </div>
      </motion.div>
    </section>
  );
}
