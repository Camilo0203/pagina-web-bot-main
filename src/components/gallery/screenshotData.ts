import dashboardOverview from '../../../landing_1440.png';
import heroThumb from '../../../ton618-hero-thumb.png';
import lensingArcThumb from '../../../lensing-arc-thumb.png';
import cosmicHazeThumb from '../../../cosmic-haze-thumb.png';
import type { ScreenshotType } from './galleryHelpers';

export interface ScreenshotEntry {
  type: ScreenshotType;
  title: string;
  description: string;
  image: string;
}

export function buildScreenshotEntries(
  t: (key: string) => string,
): ScreenshotEntry[] {
  return [
    {
      type: 'overview',
      title: t('gallery.screenshots.overview.title'),
      description: t('gallery.screenshots.overview.desc'),
      image: dashboardOverview,
    },
    {
      type: 'moderation',
      title: t('gallery.screenshots.moderation.title'),
      description: t('gallery.screenshots.moderation.desc'),
      image: heroThumb,
    },
    {
      type: 'automation',
      title: t('gallery.screenshots.automation.title'),
      description: t('gallery.screenshots.automation.desc'),
      image: lensingArcThumb,
    },
    {
      type: 'analytics',
      title: t('gallery.screenshots.analytics.title'),
      description: t('gallery.screenshots.analytics.desc'),
      image: cosmicHazeThumb,
    },
  ];
}
