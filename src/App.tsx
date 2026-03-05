import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import LiveStats from './components/LiveStats';
import Commands from './components/Commands';
import Pricing from './components/Pricing';
import DashboardSection from './components/DashboardSection';
import DocsSection from './components/DocsSection';
import SetupGuide from './components/SetupGuide';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import SupportSection from './components/SupportSection';
import StatusSection from './components/StatusSection';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import { config } from './config';

type LegalModalType = 'terms' | 'privacy' | 'cookies' | null;

function App() {
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <LiveStats />
      <Commands />
      <Pricing />
      <DashboardSection />
      <DocsSection />
      <SetupGuide />
      <Testimonials />
      <FAQ />
      <SupportSection />
      <StatusSection />
      <Footer onOpenLegal={setLegalModalType} />
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        botName={config.botName}
      />
    </div>
  );
}

export default App;
