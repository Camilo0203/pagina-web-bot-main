import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import LiveStats from '../components/LiveStats';
import VisualExperience from '../components/VisualExperience';
import WhyTon from '../components/WhyTon';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import LegalModal from '../components/LegalModal';
import { config } from '../config';

type LegalModalType = 'terms' | 'privacy' | 'cookies' | null;

export default function LandingPage() {
  const { t } = useTranslation();
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-x-hidden">
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="theme-color" content="#05060f" />
        <meta property="og:title" content={t('meta.title')} />
        <meta property="og:description" content={t('meta.description')} />
        <meta property="og:image" content="/logo-ton618.png" />
        <meta name="twitter:title" content={t('meta.title')} />
        <meta name="twitter:description" content={t('meta.description')} />
        <meta name="twitter:image" content="/logo-ton618.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Helmet>

      {/* Global Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-cinematic-atmosphere absolute inset-0"></div>
        <div className="bg-cinematic-texture absolute inset-0 opacity-40"></div>
        <div className="bg-film-grain absolute inset-0 opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-black"></div>
        <div className="scanline-sweep absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main>
          {/* Section 1: Hero */}
          <Hero />

          {/* Section 2: Features */}
          <Features />

          {/* Section 3: Experience */}
          <VisualExperience />

          {/* Section 4: Why TON618 */}
          <WhyTon />

          {/* Section 5: Stats */}
          <LiveStats />

          {/* Section 6: Final CTA */}
          <FinalCTA />
        </main>

        {/* Section 7: Footer */}
        <Footer onOpenLegal={setLegalModalType} />

        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
          botName={config.botName}
        />
      </div>
    </div>
  );
}
