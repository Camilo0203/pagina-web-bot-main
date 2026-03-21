import type { User } from '@supabase/supabase-js';
import type { DashboardGuild } from '../types';

export function resolveGuildIconUrl(guild: Pick<DashboardGuild, 'guildId' | 'guildIcon'>): string | null {
  if (!guild.guildIcon) {
    return null;
  }

  return `https://cdn.discordapp.com/icons/${guild.guildId}/${guild.guildIcon}.png?size=128`;
}

export function resolveGuildInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'DS'
  );
}

export function resolveUserAvatarUrl(user: User | null): string | null {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  const avatarUrl = typeof metadata?.avatar_url === 'string' ? metadata.avatar_url : null;
  const avatar = typeof metadata?.avatar === 'string' ? metadata.avatar : null;
  const providerId = typeof metadata?.provider_id === 'string' ? metadata.provider_id : null;

  if (avatarUrl) {
    return avatarUrl;
  }

  if (avatar && providerId) {
    return `https://cdn.discordapp.com/avatars/${providerId}/${avatar}.png?size=128`;
  }

  return null;
}

export function formatDateTime(value: string | null, locale = 'es-CO'): string {
  if (!value) {
    return 'Sin registro';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Sin registro';
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

export function formatMetricDate(value: string, locale = 'es-CO'): string {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

export function formatRelativeTime(value: string | null, locale = 'es-CO'): string {
  if (!value) {
    return 'Sin actividad';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Fecha invalida';
  }

  const diffMs = parsed.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60_000);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, 'day');
}
