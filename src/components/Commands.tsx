import { useState } from 'react';
import { Copy, Check, Shield, Music, Coins, TrendingUp, Zap, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const commandCategories = [
  {
    name: 'Moderation', icon: Shield, gradient: 'from-red-500 to-orange-500',
    commands: [
      { name: '/ban',  description: 'Ban a user from the server',   usage: '/ban @user [reason]' },
      { name: '/kick', description: 'Kick a user from the server',  usage: '/kick @user [reason]' },
      { name: '/warn', description: 'Warn a user',                  usage: '/warn @user [reason]' },
      { name: '/mute', description: 'Mute a user',                  usage: '/mute @user [duration]' },
    ],
  },
  {
    name: 'Music', icon: Music, gradient: 'from-violet-500 to-purple-600',
    commands: [
      { name: '/play',   description: 'Play a song',           usage: '/play [song name or URL]' },
      { name: '/skip',   description: 'Skip the current song', usage: '/skip' },
      { name: '/queue',  description: 'Show the music queue',  usage: '/queue' },
      { name: '/volume', description: 'Set the volume',        usage: '/volume [0-100]' },
    ],
  },
  {
    name: 'Economy', icon: Coins, gradient: 'from-emerald-400 to-teal-500',
    commands: [
      { name: '/balance', description: 'Check your balance',    usage: '/balance [@user]' },
      { name: '/daily',   description: 'Claim daily rewards',   usage: '/daily' },
      { name: '/shop',    description: 'Browse the shop',       usage: '/shop' },
      { name: '/buy',     description: 'Buy an item',           usage: '/buy [item]' },
    ],
  },
  {
    name: 'Leveling', icon: TrendingUp, gradient: 'from-brand-400 to-indigo-600',
    commands: [
      { name: '/level',       description: 'Check your level',         usage: '/level [@user]' },
      { name: '/leaderboard', description: 'View server leaderboard',  usage: '/leaderboard' },
      { name: '/rank',        description: 'Check your rank',          usage: '/rank [@user]' },
    ],
  },
  {
    name: 'Utility', icon: Zap, gradient: 'from-amber-400 to-orange-500',
    commands: [
      { name: '/serverinfo', description: 'Get server information', usage: '/serverinfo' },
      { name: '/userinfo',   description: 'Get user information',   usage: '/userinfo [@user]' },
      { name: '/poll',       description: 'Create a poll',          usage: '/poll [question]' },
    ],
  },
  {
    name: 'Configuration', icon: Settings, gradient: 'from-brand-500 to-violet-600',
    commands: [
      { name: '/setup',  description: 'Setup the bot',             usage: '/setup' },
      { name: '/prefix', description: 'Change command prefix',     usage: '/prefix [new prefix]' },
      { name: '/config', description: 'View bot configuration',    usage: '/config' },
    ],
  },
];

export default function Commands() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="commands" className="py-32 bg-[#010208] relative overflow-hidden">
      {/* Background HUD elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter"
          >
            Tactical <span className="text-brand-gradient">Control</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-widest"
          >
            Direct access to the core SINGULARITY via slash commands.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {commandCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={categoryIndex}
                variants={itemVariants}
                className="hud-border rounded-3xl p-8 flex flex-col h-full hover:border-amber-500/40 transition-all duration-500 group"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.1)] group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{category.name}</h3>
                </div>

                <div className="space-y-4 flex-grow">
                  {category.commands.map((command, commandIndex) => (
                    <div
                      key={commandIndex}
                      className="group/item bg-white/5 rounded-2xl p-5 border border-white/5 hover:border-amber-500/20 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <code className="text-base font-black text-amber-500 uppercase font-mono">
                          {command.name}
                        </code>
                        <button
                          onClick={() => copyCommand(command.usage)}
                          className="p-2 rounded-xl hover:bg-amber-500/20 transition-colors flex-shrink-0"
                          title="Copy command"
                        >
                          {copiedCommand === command.usage ? (
                            <Check className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-slate-500 group-hover/item:text-amber-500" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 mb-4 font-bold">{command.description}</p>
                      <code className="block text-xs font-mono text-white/60 bg-black/40 px-4 py-2.5 rounded-xl border border-white/5 lowercase">
                        {command.usage}
                      </code>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
