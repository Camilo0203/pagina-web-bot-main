export const defaultMetaTitle = 'TON618 | Premium Discord Control';
export const defaultMetaDescription =
  'TON618 centraliza moderacion, automatizacion y control visual de tu bot con una identidad consistente y oscura.';

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
