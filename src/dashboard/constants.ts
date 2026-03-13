import {
  Activity,
  BarChart3,
  LayoutGrid,
  Settings,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';
import type { DashboardSectionId } from './types';

export const DASHBOARD_GUILD_STORAGE_KEY = 'dashboard:last-guild-id';

export const dashboardQueryKeys = {
  auth: ['dashboard', 'auth'] as const,
  guilds: ['dashboard', 'guilds'] as const,
  config: (guildId: string) => ['dashboard', 'config', guildId] as const,
  activity: (guildId: string) => ['dashboard', 'activity', guildId] as const,
  metrics: (guildId: string) => ['dashboard', 'metrics', guildId] as const,
};

export interface DashboardSectionMeta {
  id: DashboardSectionId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const dashboardSections: DashboardSectionMeta[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Estado del servidor, modulos activos y resumen operativo.',
    icon: LayoutGrid,
  },
  {
    id: 'general',
    label: 'General',
    description: 'Idioma, modo de comandos, zona horaria y preferencias del panel.',
    icon: Settings,
  },
  {
    id: 'moderation',
    label: 'Moderacion',
    description: 'Controles base de spam, caps, duplicados y anti-raid.',
    icon: ShieldAlert,
  },
  {
    id: 'activity',
    label: 'Activity',
    description: 'Historial de guardados y eventos recientes del panel.',
    icon: Activity,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Comandos, moderacion, usuarios activos y uptime por servidor.',
    icon: BarChart3,
  },
];
