import { startTransition, useDeferredValue, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DASHBOARD_GUILD_STORAGE_KEY } from '../constants';
import { getPreferredGuildId } from '../utils';
import type { DashboardGuild } from '../types';

function readStoredGuildId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(DASHBOARD_GUILD_STORAGE_KEY);
}

function persistGuildId(guildId: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DASHBOARD_GUILD_STORAGE_KEY, guildId);
}

export function useGuildSelection(guilds: DashboardGuild[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const deferredGuilds = useDeferredValue(guilds);
  const requestedGuildId = searchParams.get('guild');
  const selectedGuild =
    deferredGuilds.find((guild) => guild.guildId === requestedGuildId) ?? null;

  useEffect(() => {
    if (!deferredGuilds.length) {
      return;
    }

    if (selectedGuild) {
      persistGuildId(selectedGuild.guildId);
      return;
    }

    const nextGuildId = getPreferredGuildId(
      deferredGuilds,
      requestedGuildId,
      readStoredGuildId(),
    );

    if (!nextGuildId) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('guild', nextGuildId);

    startTransition(() => {
      setSearchParams(nextSearchParams, { replace: true });
    });
  }, [deferredGuilds, requestedGuildId, searchParams, selectedGuild, setSearchParams]);

  function setSelectedGuildId(guildId: string) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('guild', guildId);
    persistGuildId(guildId);

    startTransition(() => {
      setSearchParams(nextSearchParams, { replace: true });
    });
  }

  return {
    selectedGuild,
    selectedGuildId: selectedGuild?.guildId ?? null,
    setSelectedGuildId,
  };
}
