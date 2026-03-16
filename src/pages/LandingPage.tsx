import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
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
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-x-hidden">
      <Helmet>
        <title>TON618 | Discord Bot Beyond Gravity</title>
        <meta name="description" content="The most massive Discord automation utility in the known universe. Premium, cinematic, and powerful." />
      </Helmet>

      {/* Global Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-black"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent animate-scanline"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main>
          {/* Section 1: Hero */}
          <Hero />

          {/* Section 2: Features */}
          <Features />

          {/* Section 3: Experience (Visual/Immersive) */}
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
