// Guild selector component for choosing which server to upgrade
import { motion } from 'framer-motion';
import { Crown, ChevronRight, Loader2 } from 'lucide-react';
import type { GuildSummary } from '../types';

interface GuildSelectorProps {
  guilds: GuildSummary[];
  selectedGuildId: string | null;
  onSelectGuild: (guildId: string) => void;
  loading?: boolean;
}

export function GuildSelector({ 
  guilds, 
  selectedGuildId, 
  onSelectGuild,
  loading = false 
}: GuildSelectorProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (guilds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">
          No servers found where you have admin permissions.
        </p>
        <p className="text-sm text-slate-500">
          Make sure you have MANAGE_GUILD permission in at least one server.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white mb-4">
        Select a Server
      </h3>
      
      <div className="grid gap-3">
        {guilds.map((guild) => (
          <motion.button
            key={guild.id}
            onClick={() => onSelectGuild(guild.id)}
            disabled={guild.has_premium}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: guild.has_premium ? 1 : 1.02 }}
            className={`
              relative flex items-center gap-4 p-4 rounded-xl transition-all duration-200
              ${selectedGuildId === guild.id
                ? 'bg-indigo-600 border-2 border-indigo-400'
                : guild.has_premium
                ? 'bg-slate-800/30 border border-slate-700 opacity-60 cursor-not-allowed'
                : 'bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50'
              }
            `}
          >
            {guild.icon_url ? (
              <img
                src={guild.icon_url}
                alt={guild.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                {guild.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white">{guild.name}</h4>
                {guild.has_premium && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-xs">
                    <Crown className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}
              </div>
              
              {guild.has_premium && guild.plan_key && (
                <p className="text-sm text-slate-400 mt-1">
                  {guild.lifetime 
                    ? 'Lifetime Access' 
                    : `${guild.plan_key.replace('_', ' ')} - ${
                        guild.ends_at 
                          ? `Expires ${new Date(guild.ends_at).toLocaleDateString()}`
                          : 'Active'
                      }`
                  }
                </p>
              )}
            </div>

            {!guild.has_premium && (
              <ChevronRight className={`w-5 h-5 ${
                selectedGuildId === guild.id ? 'text-white' : 'text-slate-400'
              }`} />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
