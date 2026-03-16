import { useEffect, useState } from 'react';
import { Server, Users, Zap, Clock } from 'lucide-react';
import { defaultBotStats, useBotStats } from '../hooks/useBotStats';
import { motion } from 'framer-motion';

interface AnimatedStats {
  servers: number;
  users: number;
  commands: number;
  uptimePercentage: number;
}

export default function LiveStats() {
  const { stats, error } = useBotStats();
  const [animated, setAnimated] = useState<AnimatedStats>(defaultBotStats);

  useEffect(() => {
    const start = { ...animated };
    const target = { servers: stats.servers, users: stats.users, commands: stats.commands, uptimePercentage: stats.uptimePercentage };
    const durationMs = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      // Easing function for smoother counter
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      setAnimated({
        servers: Math.round(start.servers + (target.servers - start.servers) * easeOutExpo),
        users: Math.round(start.users + (target.users - start.users) * easeOutExpo),
        commands: Math.round(start.commands + (target.commands - start.commands) * easeOutExpo),
        uptimePercentage: Number((start.uptimePercentage + (target.uptimePercentage - start.uptimePercentage) * easeOutExpo).toFixed(2)),
      });
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [stats.servers, stats.users, stats.commands, stats.uptimePercentage]);

  const liveUnavailable = Boolean(error);

  const statCards = [
    { icon: Server, label: 'Active Clusters',     value: animated.servers.toLocaleString(),              accent: 'from-indigo-500 to-blue-500' },
    { icon: Users,  label: 'Synchronized Souls',    value: animated.users.toLocaleString(),                accent: 'from-purple-500 to-indigo-500' },
    { icon: Zap,    label: 'Operations Executed',   value: animated.commands.toLocaleString(),             accent: 'from-cyan-400 to-blue-500' },
    { icon: Clock,  label: 'Stability Index',       value: `${animated.uptimePercentage.toFixed(2)}%`,     accent: 'from-blue-600 to-cyan-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section
      id="stats"
      className="py-32 relative overflow-hidden bg-black"
    >
      {/* Background Nebulae */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 cinematic-glass rounded-full border border-white/10 mb-8 shadow-indigo-500/10 shadow-lg">
            <div className={`w-2 h-2 rounded-full ${liveUnavailable ? 'bg-red-500' : 'bg-cyan-400 animate-pulse'}`}></div>
            <span className="text-white font-black text-[10px] uppercase tracking-[0.3em]">{liveUnavailable ? 'Restricted Feed' : 'Real-time Signal'}</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
            Verified <span className="text-premium-gradient">Density</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Live telemetry streamed from the event horizon of our global infrastructure.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div variants={itemVariants} key={stat.label} className="group">
                <div className="hud-border rounded-[2.5rem] p-10 hover:border-indigo-500/40 transition-all duration-700 flex flex-col items-center text-center">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.accent} bg-opacity-10 mb-8 group-hover:scale-110 transition-transform duration-700`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                  <div className="text-indigo-400/50 font-black text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
