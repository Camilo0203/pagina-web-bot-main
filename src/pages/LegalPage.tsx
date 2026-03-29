import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Mail, MessageCircle } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';
import { config, getAbsoluteAssetUrl, getCanonicalUrl } from '../config';
import {
  LEGAL_DOCUMENT_TYPES,
  getLegalDocumentContent,
  type LegalDocumentType,
} from '../lib/legalDocuments';

interface LegalPageProps {
  type: LegalDocumentType;
}

export default function LegalPage({ type }: LegalPageProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const document = getLegalDocumentContent(t, type);
  const canonicalUrl = getCanonicalUrl(location.pathname);
  const socialImageUrl = getAbsoluteAssetUrl(config.socialImagePath);
  const locale = i18n.language.startsWith('es') ? 'es_ES' : 'en_US';
  const sectionEntries = document.sections.map((section, index) => ({
    ...section,
    id: `${document.type}-section-${index + 1}`,
    number: String(index + 1).padStart(2, '0'),
  }));
  const contactLinks = [
    config.supportServerUrl
      ? {
          href: config.supportServerUrl,
          title: t('legal.page.supportLinkLabel'),
          value: t('legal.page.supportCta'),
          icon: MessageCircle,
          external: true,
        }
      : null,
    config.contactEmail
      ? {
          href: `mailto:${config.contactEmail}`,
          title: t('legal.page.emailLinkLabel'),
          value: config.contactEmail,
          icon: Mail,
          external: false,
        }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    title: string;
    value: string;
    icon: typeof MessageCircle;
    external: boolean;
  }>;

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-indigo-500/30">
      <Helmet>
        <html lang={i18n.language.startsWith('es') ? 'es' : 'en'} />
        <title>{`${config.botName} | ${document.title}`}</title>
        <meta name="description" content={document.metaDescription} />
        <meta name="robots" content="index,follow" />
        <meta name="theme-color" content="#05060f" />
        <meta name="color-scheme" content="dark" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={config.botName} />
        <meta property="og:title" content={`${config.botName} | ${document.title}`} />
        <meta property="og:description" content={document.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={socialImageUrl} />
        <meta property="og:locale" content={locale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${config.botName} | ${document.title}`} />
        <meta name="twitter:description" content={document.metaDescription} />
        <meta name="twitter:image" content={socialImageUrl} />
      </Helmet>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-cinematic-atmosphere absolute inset-0" />
        <div className="bg-cinematic-texture absolute inset-0 opacity-35" />
        <div className="bg-film-grain absolute inset-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040612] via-black/80 to-black" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/8 bg-black/45 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="flex items-center justify-between gap-4 sm:gap-5 lg:min-w-0">
              <Link
                to="/"
                className="inline-flex min-w-0 items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 transition hover:border-white/15 hover:bg-white/[0.05]"
              >
                <Logo size="md" subtitle={config.botName} withText={false} frameClassName="h-14 w-14" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-indigo-300">
                    {t('legal.page.eyebrow')}
                  </p>
                  <p className="text-sm font-semibold text-white">{t('legal.page.backToSite')}</p>
                </div>
              </Link>

              <div className="shrink-0 lg:hidden">
                <LanguageSelector />
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:min-w-0 lg:flex-1 lg:flex-row lg:items-center lg:justify-end lg:gap-4">
              <nav
                aria-label={t('legal.page.navLabel')}
                className="flex flex-wrap gap-2 lg:min-w-0 lg:flex-1 lg:justify-end"
              >
                {LEGAL_DOCUMENT_TYPES.map((documentType) => {
                  const href = `/${documentType}`;
                  const isActive = location.pathname === href;

                  return (
                    <Link
                      key={documentType}
                      to={href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-tight-readable transition ${
                        isActive
                          ? 'border-indigo-400/50 bg-indigo-500/15 text-white'
                          : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {t(`legal.${documentType}.title`)}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden lg:block lg:shrink-0">
                <LanguageSelector mode="desktop" desktopMenuPlacement="bottom" />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-12">
            <div className="mb-10 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-amber-300">
                {t('legal.core')}
              </span>
              <span>{`${t('legal.update')}: ${document.lastUpdated}`}</span>
              <span>{t('legal.status')}</span>
            </div>

            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t('legal.page.backToSite')}</span>
            </Link>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)] lg:items-start">
              <div>
                <div className="max-w-3xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-300">
                    {t('legal.page.publicLabel')}
                  </p>
                  <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-white md:text-6xl">
                    {document.title}
                  </h1>
                  <p className="mt-6 text-base leading-relaxed text-slate-300 md:text-lg">
                    {document.summary}
                  </p>
                </div>

                {document.highlights.length ? (
                  <section className="mt-10">
                    <h2 className="text-sm font-bold uppercase tracking-[0.26em] text-slate-400">
                      {t('legal.page.highlightsTitle')}
                    </h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {document.highlights.map((highlight, highlightIndex) => (
                        <div
                          key={`${document.type}-highlight-${highlightIndex}`}
                          className="rounded-[1.35rem] border border-white/8 bg-black/25 px-5 py-4 text-sm leading-7 text-slate-200"
                        >
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                <div className="mt-10 grid gap-6">
                  {sectionEntries.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-28 rounded-[1.6rem] border border-white/8 bg-black/30 p-6 md:p-7"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/25 bg-indigo-500/10 text-xs font-black tracking-[0.24em] text-indigo-200">
                          {section.number}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
                            {t('legal.page.sectionLabel', { index: Number(section.number) })}
                          </p>
                          <h2 className="mt-3 text-xl font-bold text-white md:text-[1.65rem]">
                            {section.heading}
                          </h2>
                          <div className="mt-5 space-y-4">
                            {section.body.map((paragraph, paragraphIndex) => (
                              <p
                                key={`${section.id}-body-${paragraphIndex}`}
                                className="text-sm leading-8 text-slate-300 md:text-base"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>

                          {section.points.length ? (
                            <ul className="mt-5 grid gap-3">
                              {section.points.map((point, pointIndex) => (
                                <li
                                  key={`${section.id}-point-${pointIndex}`}
                                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-slate-200"
                                >
                                  {point}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </div>
                    </section>
                  ))}
                </div>
              </div>

              <aside className="space-y-6 lg:sticky lg:top-24">
                <section className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-6">
                  <h2 className="text-lg font-bold text-white">{t('legal.page.sectionNavTitle')}</h2>
                  <nav aria-label={t('legal.page.sectionNavTitle')} className="mt-4 grid gap-2">
                    {sectionEntries.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
                      >
                        {section.heading}
                      </a>
                    ))}
                  </nav>
                </section>

                <section className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-6">
                  <h2 className="text-lg font-bold text-white">{t('legal.page.contactTitle')}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {t('legal.page.contactDescription')}
                  </p>

                  {contactLinks.length ? (
                    <div className="mt-5 grid gap-3">
                      {contactLinks.map(({ href, title, value, icon: Icon, external }) => (
                        <a
                          key={href}
                          href={href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                          className="group flex items-start gap-3 rounded-[1.3rem] border border-white/10 bg-black/30 p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                        >
                          <span className="mt-0.5 rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-200">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                              {title}
                            </span>
                            <span className="mt-2 block break-all text-sm font-semibold text-white">
                              {value}
                            </span>
                          </span>
                          {external ? <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-white" /> : null}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 rounded-[1.3rem] border border-dashed border-white/12 bg-black/25 px-4 py-4 text-sm leading-7 text-slate-300">
                      {t('legal.page.contactUnavailable')}
                    </p>
                  )}
                </section>

                <section className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-6">
                  <h2 className="text-lg font-bold text-white">{t('legal.page.relatedTitle')}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {t('legal.page.relatedDescription')}
                  </p>
                  <div className="mt-5 grid gap-3">
                    {LEGAL_DOCUMENT_TYPES.map((documentType) => {
                      const isActive = documentType === type;

                      return (
                        <Link
                          key={documentType}
                          to={`/${documentType}`}
                          aria-current={isActive ? 'page' : undefined}
                          className={`rounded-[1.3rem] border px-4 py-3 text-sm font-semibold transition ${
                            isActive
                              ? 'border-indigo-400/45 bg-indigo-500/12 text-white'
                              : 'border-white/10 bg-black/30 text-slate-200 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {t(`legal.${documentType}.title`)}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
