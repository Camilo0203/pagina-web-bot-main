import { BarChart3, ShieldCheck, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getDashboardUrl, isDashboardExternal } from '../config';

export default function DashboardSection() {
  const dashboardHref = getDashboardUrl();
  const dashboardExternal = isDashboardExternal();

  return (
    <section id="dashboard" className="py-32 bg-[#010208] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter">Singularity <span className="text-brand-gradient">HUD</span></h2>
            <p className="text-xl text-slate-400 font-bold uppercase tracking-widest mb-10 leading-relaxed">
              Command the void with the most advanced management interface in the cluster.
            </p>

            <div className="space-y-6 mb-12">
               {[
                 { icon: ShieldCheck, text: 'Neural-linked moderation' },
                 { icon: BarChart3, text: 'Stellar activity mapping' },
                 { icon: Settings2, text: 'Real-time protocol toggles' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                       <item.icon className="w-6 h-6 text-amber-500" />
                    </div>
                    <span className="text-white font-black uppercase text-sm tracking-widest">{item.text}</span>
                 </div>
               ))}
            </div>

            {dashboardExternal ? (
              <a
                href={dashboardHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-10 py-5 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] hover:scale-110"
              >
                Access HUD
              </a>
            ) : (
              <Link
                to={dashboardHref}
                className="inline-flex px-10 py-5 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-amber-400 transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] hover:scale-110"
              >
                Access HUD
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hud-border rounded-[40px] p-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none group-hover:opacity-100 transition-opacity"></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500/60 font-black mb-6">Manifest Preview // Active</p>
            <h3 className="text-3xl font-black text-white mb-10 uppercase tracking-tight">Mass Flux</h3>
            <div className="space-y-6">
              {[82, 64, 91].map((val, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Protocol {i + 1}</span>
                      <span className="text-amber-500">{val}%</span>
                   </div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <motion.div 
                        initial={{ width: 0 }} 
                        whileInView={{ width: `${val}%` }} 
                        transition={{ duration: 1.5, delay: 0.5 + i*0.2, ease: "circOut" }} 
                        className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                     ></motion.div>
                   </div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-white/5">
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">System status: Normal. All singularities stabilized within range.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
