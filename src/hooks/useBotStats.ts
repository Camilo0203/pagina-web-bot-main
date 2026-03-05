import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface BotStats {
  servers: number;
  users: number;
  commands: number;
  uptimePercentage: number;
}

interface BotStatsRow {
  servers: number | null;
  users: number | null;
  commands_executed: number | null;
  uptime_percentage: number | null;
  updated_at: string | null;
}

export const defaultBotStats: BotStats = {
  servers: 52847,
  users: 12456789,
  commands: 45678912,
  uptimePercentage: 99.9,
};

interface UseBotStatsResult {
  stats: BotStats;
  loading: boolean;
  error: string;
  lastUpdated: string;
}

export function useBotStats(): UseBotStatsResult {
  const [stats, setStats] = useState<BotStats>(defaultBotStats);
  const [loading, setLoading] = useState<boolean>(Boolean(supabase));
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('Supabase not configured');
      return;
    }

    const client = supabase;
    let isMounted = true;

    const fetchStats = async () => {
      const { data, error: queryError } = await client
        .from('bot_stats')
        .select('servers, users, commands_executed, uptime_percentage, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle<BotStatsRow>();

      if (!isMounted) {
        return;
      }

      if (queryError || !data) {
        setError('Live stats unavailable');
        setLoading(false);
        return;
      }

      setStats({
        servers: data.servers ?? defaultBotStats.servers,
        users: data.users ?? defaultBotStats.users,
        commands: data.commands_executed ?? defaultBotStats.commands,
        uptimePercentage: data.uptime_percentage ?? defaultBotStats.uptimePercentage,
      });
      setLastUpdated(data.updated_at ?? '');
      setError('');
      setLoading(false);
    };

    void fetchStats();
    const pollId = setInterval(() => {
      void fetchStats();
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(pollId);
    };
  }, []);

  return { stats, loading, error, lastUpdated };
}
