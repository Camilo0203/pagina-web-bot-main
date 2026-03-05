import { useEffect, useState } from 'react';
import { Server, Users, Zap, Clock } from 'lucide-react';
import { defaultBotStats, useBotStats } from '../hooks/useBotStats';

interface AnimatedStats {
  servers: number;
  users: number;
  commands: number;
  uptimePercentage: number;
}

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleString();
}

export default function LiveStats() {
  const { stats, loading, error, lastUpdated } = useBotStats();
  const [animated, setAnimated] = useState<AnimatedStats>(defaultBotStats);

  useEffect(() => {
    const start = { ...animated };
    const target = {
      servers: stats.servers,
      users: stats.users,
      commands: stats.commands,
      uptimePercentage: stats.uptimePercentage,
    };

    const durationMs = 800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);

      setAnimated({
        servers: Math.round(start.servers + (target.servers - start.servers) * progress),
        users: Math.round(start.users + (target.users - start.users) * progress),
        commands: Math.round(start.commands + (target.commands - start.commands) * progress),
        uptimePercentage: Number((start.uptimePercentage + (target.uptimePercentage - start.uptimePercentage) * progress).toFixed(2)),
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.servers, stats.users, stats.commands, stats.uptimePercentage]);

  const liveUnavailable = Boolean(error);

  const statCards = [
    {
      icon: Server,
      label: 'Active Servers',
      value: animated.servers.toLocaleString(),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      label: 'Total Users',
      value: animated.users.toLocaleString(),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      label: 'Commands Executed',
      value: animated.commands.toLocaleString(),
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Clock,
      label: 'Uptime',
      value: `${animated.uptimePercentage.toFixed(2)}%`,
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section id="stats" className="py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djYuOTEzYzAtLjUtLjItLjktLjYtMS4ybC00LTQuMGMtLjQtLjQtLjktLjYtMS40LS42SDI0Yy0xLjEgMC0yIC45LTIgMnYxMmMwIDEuMS45IDIgMiAyaDE2YzEuMSAwIDItLjkgMi0yVjM2YzAtMS4xLS45LTItMi0yem0tNiAxOGgtNHYtNGg0djR6bTAtOGgtNHYtNGg0djR6bTggOGgtNHYtNGg0djR6bTAtOGgtNHYtNGg0djR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">Live Statistics</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Trusted by Thousands</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Join the growing community of Discord servers using our bot every day.
          </p>
          {!loading && liveUnavailable && (
            <p className="mt-4 text-sm text-white/65">Live stats unavailable. Showing latest fallback values.</p>
          )}
          {!loading && !liveUnavailable && lastUpdated && (
            <p className="mt-4 text-sm text-white/65">Last updated {formatDate(lastUpdated)}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl blur-xl from-purple-500 to-pink-500"></div>

                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>

                  <div className="text-white/70">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
