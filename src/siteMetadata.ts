export const defaultMetaTitle = 'TON618 | Discord Ops Console for Tickets, SLA and Playbooks';
export const defaultMetaDescription =
  'TON618 gives Discord staff teams a live ops console with support inbox, SLA visibility, incident mode and guided playbooks.';

export const socialImagePath = '/social-preview.png';
export const faviconPath = '/favicon.png';
export const appleTouchIconPath = '/apple-touch-icon.png';
export const manifestPath = '/site.webmanifest';

export function normalizeSiteUrl(value?: string): string {
  return (value || '').trim().replace(/\/+$/, '');
}

export function buildAbsoluteUrl(origin: string, path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!origin) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}
