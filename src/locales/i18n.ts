import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en';
import { es } from './es';

const resources = {
  en,
  es,
};

function normalizeLanguageCode(language?: string): string {
  return language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function updateManifestLanguage(language: string) {
  if (typeof window === 'undefined') return;

  const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
  if (!link) return;

  const manifestUrl = link.dataset.originalHref || link.href;
  if (!link.dataset.originalHref) {
    link.dataset.originalHref = manifestUrl;
  }

  fetch(manifestUrl)
    .then((res) => {
      if (!res.ok) throw new Error('Manifest not found');
      return res.json();
    })
    .then((manifest) => {
      const isEs = language === 'es';

      manifest.name = isEs
        ? 'TON618 | Bot premium de Discord'
        : 'TON618 | Premium Discord Bot';
      manifest.short_name = isEs ? 'TON618 Panel' : 'TON618 Dashboard';
      manifest.description = isEs
        ? 'Bot premium de Discord para moderación, automatización y operaciones.'
        : 'Premium Discord Bot for Moderation, Automations and Ops.';

      const blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
      link.href = URL.createObjectURL(blob);
    })
    .catch(() => { });
}

function applyDocumentLanguage(language?: string) {
  if (typeof document === 'undefined') {
    return;
  }

  const normalizedLanguage = normalizeLanguageCode(language);
  document.documentElement.lang = normalizedLanguage;
  document.documentElement.setAttribute('xml:lang', normalizedLanguage);

  updateManifestLanguage(normalizedLanguage);
}

const savedLanguage =
  typeof window !== 'undefined'
    ? normalizeLanguageCode(localStorage.getItem('i18nextLng') || 'en')
    : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'es'],
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  cleanCode: true,
  initImmediate: false,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  const normalizedLanguage = normalizeLanguageCode(lng);

  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', normalizedLanguage);
  }

  applyDocumentLanguage(normalizedLanguage);
});

applyDocumentLanguage(i18n.resolvedLanguage || i18n.language || savedLanguage);

export default i18n;