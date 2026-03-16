import { Shield, Music, Coins, TrendingUp, Zap, FileText, Bell, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Shield,    title: 'Advanced Moderation',    description: 'Keep your server safe with powerful moderation tools including auto-mod, warnings, kicks, and bans.',                   gradient: 'from-red-500 to-orange-500' },
  { icon: Zap,       title: 'Auto Moderation',         description: 'Intelligent spam detection, link filtering, and custom word blacklists that work automatically.',                       gradient: 'from-amber-400 to-orange-500' },
  { icon: Music,     title: 'Music Player',            description: 'High-quality music streaming from YouTube, Spotify, and more with advanced queue management.',                          gradient: 'from-violet-500 to-purple-600' },
  { icon: Coins,     title: 'Economy System',          description: 'Engage your community with a full economy system, virtual currency, shop, and trading.',                               gradient: 'from-emerald-400 to-teal-500' },
  { icon: TrendingUp,title: 'Leveling & XP',           description: 'Reward active members with XP, levels, and custom roles based on their activity.',                                    gradient: 'from-brand-400 to-indigo-600' },
  { icon: Bot,       title: 'Server Automation',       description: 'Automate welcome messages, role assignments, announcements, and custom workflows.',                                    gradient: 'from-brand-500 to-violet-600' },
  { icon: FileText,  title: 'Comprehensive Logging',   description: 'Track all server activities with detailed logs for messages, members, roles, and more.',                               gradient: 'from-purple-500 to-violet-600' },
  { icon: Bell,      title: 'Custom Notifications',    description: 'Set up custom alerts for Twitch, YouTube, Twitter, Reddit, and other platforms.',                                     gradient: 'from-cyan-400 to-brand-500' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="py-32 bg-[#020617] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter"
          >
            Power Beyond the <span className="text-brand-gradient">Horizon</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            TON618 provides the most massive toolset ever created for Discord. Unstable power, stabilized for your server.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative gravitational-lens rounded-3xl p-8 border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] overflow-hidden"
              >
                {/* Hover light effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 mb-6 group-hover:bg-amber-500/20 transition-all duration-500 group-hover:scale-110">
                    <Icon className="w-8 h-8 text-amber-500" />
                  </div>

                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm font-medium">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
