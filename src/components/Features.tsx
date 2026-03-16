import { Shield, Zap, Bot, BarChart3, Lock, Cpu, Globe, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { 
    icon: Shield,    
    title: 'Advanced Moderation',    
    description: 'Establish absolute order with the most precise moderation engine. Automated guards that vanish threats before they manifest.',
    accent: 'from-indigo-500 to-blue-500'
  },
  { 
    icon: Cpu,       
    title: 'Intelligent Automation', 
    description: 'Neural-grade workflows that learn your server\'s architecture. Automate everything from roles to complex community logic.',
    accent: 'from-purple-500 to-indigo-500'
  },
  { 
    icon: Zap,       
    title: 'Instant Execution',      
    description: 'Zero-latency command processing powered by over-clocked shard clusters. Response times that defy traditional gravity.',
    accent: 'from-cyan-400 to-blue-500'
  },
  { 
    icon: Lock,      
    title: 'Sovereign Security',     
    description: 'End-to-end data encryption and sophisticated threat detection protocols. Your community integrity is our biological imperative.',
    accent: 'from-blue-600 to-indigo-600'
  },
  { 
    icon: BarChart3,  
    title: 'Deep Analytics',         
    description: 'Exhaustive data visualization of your server\'s pulse. Map every interaction within your digital ecosystem in real-time.',
    accent: 'from-violet-500 to-purple-600'
  },
  { 
    icon: Globe,     
    title: 'Global Scalability',    
    description: 'Architected to sustain millions of members without friction. TON618 expands with your vision, limitless and stable.',
    accent: 'from-cyan-500 to-blue-400'
  },
  { 
    icon: Scale,     
    title: 'Balanced Governance',   
    description: 'Sophisticated leveling and reputation systems that encourage quality engagement. Meritocracy, automated flawlessly.',
    accent: 'from-indigo-400 to-cyan-500'
  },
  { 
    icon: Bot,       
    title: 'Custom Core',           
    description: 'Highly modular configuration patterns. Tailor the Singularity to your server\'s specific DNA without compromise.',
    accent: 'from-purple-400 to-indigo-500'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-black">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] nebula-blur bg-indigo-500/10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] nebula-blur bg-purple-500/5"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-[1px] bg-indigo-500"></div>
              <span className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Biological Superiority</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black text-white leading-none uppercase tracking-[-0.02em]"
            >
              Master the <br/>
              <span className="text-premium-gradient">Infinite Horizon</span>
            </motion.h2>
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-sm font-medium leading-relaxed"
          >
            A suite of high-precision instruments designed for the next generation of digital communities. 
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <div className="hud-border rounded-[2.5rem] p-8 h-full flex flex-col hover:border-indigo-500/30 transition-all duration-700">
                  {/* Icon Wrapper */}
                  <div className="relative mb-10 w-16 h-16 flex items-center justify-center">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-5 rounded-2xl group-hover:opacity-15 transition-opacity duration-700`}></div>
                    <Icon className="w-7 h-7 text-white/90 group-hover:text-cyan-400 transition-colors duration-700" />
                  </div>

                  <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 group-hover:text-slate-400 transition-colors duration-700">{feature.description}</p>
                  
                  <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500/50 group-hover:text-indigo-400 transition-colors duration-700">
                    <span>Protocol Ready</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
