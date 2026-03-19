import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

function resolveSupabaseProjectRef(url: string): string | null {
  try {
    return new URL(url).hostname.split('.')[0] ?? null;
  } catch {
    return null;
  }
}

export const SUPABASE_AUTH_STORAGE_KEY =
  config.supabaseUrl
    ? `sb-${resolveSupabaseProjectRef(config.supabaseUrl) ?? 'dashboard'}-auth-token`
    : 'sb-dashboard-auth-token';

export const supabase: SupabaseClient | null =
  config.supabaseUrl && config.supabaseAnonKey
    ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: false,
          persistSession: true,
          autoRefreshToken: true,
          storageKey: SUPABASE_AUTH_STORAGE_KEY,
        },
        global: {
          headers: {
            'X-Client-Info': `${config.botName}-dashboard`,
          },
        },
      })
    : null;

function clearStorageKey(storage: Storage | null, key: string) {
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // Ignoramos errores de storage para no romper el flujo de recuperacion auth.
  }
}

export function clearSupabaseAuthStorage() {
  if (typeof window === 'undefined') {
    return;
  }

  clearStorageKey(window.localStorage, SUPABASE_AUTH_STORAGE_KEY);
  clearStorageKey(window.sessionStorage, SUPABASE_AUTH_STORAGE_KEY);
}
