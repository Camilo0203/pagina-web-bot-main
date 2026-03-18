import { useEffect, useState } from 'react';
import { DASHBOARD_SECTION_STORAGE_PREFIX } from '../constants';
import { dashboardSectionIds } from '../schemas';
import type { DashboardSectionId } from '../types';

function isDashboardSectionId(value: string | null): value is DashboardSectionId {
  return Boolean(value && dashboardSectionIds.includes(value as DashboardSectionId));
}

function readStoredSection(guildId: string): DashboardSectionId | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = window.localStorage.getItem(`${DASHBOARD_SECTION_STORAGE_PREFIX}${guildId}`);
  return isDashboardSectionId(value) ? value : null;
}

function persistSection(guildId: string, section: DashboardSectionId) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(`${DASHBOARD_SECTION_STORAGE_PREFIX}${guildId}`, section);
}

export function usePersistentDashboardSection(
  selectedGuildId: string | null,
  defaultSection: DashboardSectionId | null | undefined,
) {
  const [activeSection, setActiveSection] = useState<DashboardSectionId>('overview');

  useEffect(() => {
    if (!selectedGuildId) {
      return;
    }

    const stored = readStoredSection(selectedGuildId);
    if (stored) {
      setActiveSection(stored);
      return;
    }

    setActiveSection(defaultSection ?? 'overview');
  }, [defaultSection, selectedGuildId]);

  useEffect(() => {
    if (!selectedGuildId) {
      return;
    }

    persistSection(selectedGuildId, activeSection);
  }, [activeSection, selectedGuildId]);

  return {
    activeSection,
    setActiveSection,
  };
}
