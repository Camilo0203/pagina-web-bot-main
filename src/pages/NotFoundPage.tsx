import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookOpen, MessageCircle } from 'lucide-react';
import { config } from '../config';
import Logo from '../components/Logo';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const supportHref = config.supportServerUrl || (config.contactEmail ? `mailto:${config.contactEmail}` : '');

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <Helmet>
        <title>{config.botName} | {t('notFound.pageTitle')}</title>
      </Helmet>
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <Logo size="lg" subtitle={t('notFound.subtitle')} className="mb-6" />
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-brand-300">
          {t('notFound.errorCode')}
        </p>
        <h1 className="mb-4 text-4xl font-bold">{t('notFound.title')}</h1>
        <p className="mb-8 leading-relaxed text-slate-300">
          {t('notFound.description')}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition-transform hover:scale-[1.02]"
          >
            <Home className="h-4 w-4" />
            {t('notFound.goHome')}
          </Link>
          {config.docsUrl ? (
            <a
              href={config.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/15"
            >
              <BookOpen className="h-4 w-4" />
              {t('notFound.goDocs')}
            </a>
          ) : null}
          {supportHref ? (
            <a
              href={supportHref}
              target={supportHref.startsWith('mailto:') ? undefined : '_blank'}
              rel={supportHref.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/15"
            >
              <MessageCircle className="h-4 w-4" />
              {t('notFound.goSupport')}
            </a>
          ) : null}
        </div>
      </div>
    </main>
  );
}
