import { useEffect } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import {
  exchangeDashboardCodeForSession,
  fetchDashboardGuilds,
  fetchGuildActivity,
  fetchGuildConfig,
  fetchGuildMetrics,
  getDashboardSession,
  saveGuildConfig,
  signInWithDiscord,
  signOutDashboard,
  syncDiscordGuilds,
} from '../api';
import { dashboardQueryKeys } from '../constants';
import type { GuildConfig } from '../types';

export function useDashboardAuth() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.auth });
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.guilds });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return useQuery({
    queryKey: dashboardQueryKeys.auth,
    queryFn: getDashboardSession,
  });
}

export function useDashboardGuilds(enabled: boolean) {
  return useQuery({
    queryKey: dashboardQueryKeys.guilds,
    queryFn: fetchDashboardGuilds,
    enabled,
  });
}

export function useGuildConfig(guildId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: dashboardQueryKeys.config(guildId ?? 'idle'),
    queryFn: () => fetchGuildConfig(guildId ?? ''),
    enabled: enabled && Boolean(guildId),
  });
}

export function useGuildActivity(guildId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: dashboardQueryKeys.activity(guildId ?? 'idle'),
    queryFn: () => fetchGuildActivity(guildId ?? ''),
    enabled: enabled && Boolean(guildId),
  });
}

export function useGuildMetrics(guildId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: dashboardQueryKeys.metrics(guildId ?? 'idle'),
    queryFn: () => fetchGuildMetrics(guildId ?? ''),
    enabled: enabled && Boolean(guildId),
  });
}

export function useSignInWithDiscord() {
  return useMutation({
    mutationFn: signInWithDiscord,
  });
}

export function useSignOutDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOutDashboard,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.auth });
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.guilds });
    },
  });
}

export function useExchangeDashboardCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exchangeDashboardCodeForSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.auth });
    },
  });
}

export function useSyncDashboardGuilds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncDiscordGuilds,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.guilds });
    },
  });
}

export function useSaveGuildConfig(guildId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<GuildConfig, 'generalSettings' | 'moderationSettings' | 'dashboardPreferences'>) =>
      saveGuildConfig(guildId ?? '', payload),
    onSuccess: async () => {
      if (!guildId) {
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.config(guildId) }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.activity(guildId) }),
      ]);
    },
  });
}
