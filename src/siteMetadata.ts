export const defaultMetaTitle = 'TON618 | Premium Discord Bot for Moderation, Automations and Ops';
export const defaultMetaDescription =
  'TON618 centralizes Discord moderation, automations, support flows and live operational visibility from one premium dashboard.';

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
