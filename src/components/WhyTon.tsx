import { motion } from 'framer-motion';
import { Target, Zap, ShieldCheck, Cpu } from 'lucide-react';

const reasons = [
  {
    icon: Target,
    title: "Unmatched Precision",
    description: "Every command is executed with absolute accuracy. No edge cases, no failures. Just pure technical dominance."
  },
  {
    icon: Zap,
    title: "Quantum Performance",
    description: "Built on a custom high-concurrency engine that processes thousands of operations per second with sub-millisecond latency."
  },
  {
    icon: ShieldCheck,
    title: "Fortress Security",
    description: "Advanced threat mitigation that goes beyond simple filtering. We protect your community with corporate-grade protocols."
  },
  {
    icon: Cpu,
    title: "Neural Integration",
    description: "A bot that adapts to your server's unique needs. Modular, intelligent, and designed to evolve with your community."
  }
];

export default function WhyTon() {
  return (
    <section id="why" className="py-32 bg-[#02040a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500 mb-6 block">Elite Engineering</span>
            <h2 className="text-5xl md:text-6xl font-black text-white uppercase leading-none mb-8">
              Why <span className="text-premium-gradient">TON618</span> Stands Alone
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
              In a universe of generic templates, TON618 is the only utility forged with the scale and power of a supermassive singularity. We don't just manage servers; we stabilize them.
            </p>
            
            <div className="flex flex-wrap gap-4">
               <div className="px-6 py-4 cinematic-glass rounded-2xl border-indigo-500/20">
                  <div className="text-2xl font-black text-white">99.99%</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Uptime Verified</div>
               </div>
               <div className="px-6 py-4 cinematic-glass rounded-2xl border-indigo-500/20">
                  <div className="text-2xl font-black text-white">&lt; 15ms</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global Latency</div>
               </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="p-8 hud-border rounded-[2rem] hover:border-indigo-500/40 transition-all duration-500 translate-y-0 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6">
                  <reason.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">{reason.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
