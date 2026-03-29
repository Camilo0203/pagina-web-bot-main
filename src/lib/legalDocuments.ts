import type { TFunction } from 'i18next';

export type LegalDocumentType = 'terms' | 'privacy' | 'cookies';
export const LEGAL_DOCUMENT_TYPES: LegalDocumentType[] = ['terms', 'privacy', 'cookies'];

export interface LegalDocumentSection {
  heading: string;
  body: string[];
  points: string[];
}

export interface LegalDocumentContent {
  type: LegalDocumentType;
  title: string;
  summary: string;
  metaDescription: string;
  lastUpdated: string;
  highlights: string[];
  sections: LegalDocumentSection[];
}

function toStringArray(value: unknown): string[] {
  if (typeof value === 'string') {
    return value.trim() ? [value] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function normalizeLegalDocumentSection(value: unknown): LegalDocumentSection | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const section = value as Record<string, unknown>;
  if (typeof section.heading !== 'string') {
    return null;
  }

  const body = toStringArray(section.body);
  if (!body.length) {
    return null;
  }

  return {
    heading: section.heading,
    body,
    points: toStringArray(section.points),
  };
}

export function getLegalDocumentContent(
  t: TFunction,
  type: LegalDocumentType,
): LegalDocumentContent {
  const rawSections = t(`legal.${type}.sections`, {
    returnObjects: true,
    defaultValue: [],
  }) as unknown;
  const rawHighlights = t(`legal.${type}.highlights`, {
    returnObjects: true,
    defaultValue: [],
  }) as unknown;

  const sections = Array.isArray(rawSections)
    ? rawSections
      .map((section) => normalizeLegalDocumentSection(section))
      .filter((section): section is LegalDocumentSection => Boolean(section))
    : [];

  return {
    type,
    title: t(`legal.${type}.title`),
    summary: t(`legal.${type}.content`),
    metaDescription: t(`legal.${type}.metaDescription`),
    lastUpdated: t('legal.lastUpdatedDate'),
    highlights: toStringArray(rawHighlights),
    sections,
  };
}
