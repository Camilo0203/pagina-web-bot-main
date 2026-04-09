// Guild selector component for choosing which server to upgrade
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-white font-semibold mb-2">
          {t('billing.serverSelection.noServers.title')}
        </p>
        <p className="text-slate-400 mb-4 max-w-md mx-auto">
          {t('billing.serverSelection.noServers.description')}
        </p>
        <a
          href="https://discord.com/developers/docs/topics/permissions#permissions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-400 hover:text-indigo-300 underline"
        >
          {t('billing.serverSelection.noServers.learnMore')}
        </a>
      </div>
    );
  }

  const availableGuilds = guilds.filter(g => !g.has_premium);
  const premiumGuilds = guilds.filter(g => g.has_premium);

  return (
    <div className="space-y-4">
      {/* Helper text */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-300 flex items-start gap-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {t('billing.serverSelection.helperText')}
          </span>
        </p>
      </div>

      {availableGuilds.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
            {t('billing.serverSelection.availableServers')} ({availableGuilds.length})
          </h3>
          <div className="grid gap-3">
            {availableGuilds.map((guild) => (
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
                    <span>{t('billing.serverSelection.premiumBadge')}</span>
                  </div>
                )}
              </div>
              
              {guild.has_premium && guild.plan_key && (
                <p className="text-sm text-slate-400 mt-1">
                  {guild.lifetime 
                    ? t('billing.serverSelection.lifetimeAccess')
                    : `${guild.plan_key.replace('_', ' ')} - ${
                        guild.ends_at 
                          ? t('billing.serverSelection.expires', { date: new Date(guild.ends_at).toLocaleDateString() })
                          : t('billing.serverSelection.active')
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
      )}

      {premiumGuilds.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
            {t('billing.serverSelection.alreadyPremium')} ({premiumGuilds.length})
          </h3>
          <div className="grid gap-3">
            {premiumGuilds.map((guild) => (
              <motion.div
                key={guild.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700 opacity-60"
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
                    <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-xs">
                      <Crown className="w-3 h-3" />
                      <span>{t('billing.serverSelection.premiumBadge')}</span>
                    </div>
                  </div>
                  
                  {guild.plan_key && (
                    <p className="text-sm text-slate-400 mt-1">
                      {guild.lifetime 
                        ? t('billing.serverSelection.lifetimeAccess')
                        : `${guild.plan_key.replace('_', ' ')} - ${
                            guild.ends_at 
                              ? t('billing.serverSelection.expires', { date: new Date(guild.ends_at).toLocaleDateString() })
                              : t('billing.serverSelection.active')
                          }`
                      }
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
