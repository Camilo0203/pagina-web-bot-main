import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Bot } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';

const DashboardPage = lazy(() => import('./dashboard/DashboardPage'));
const AuthCallbackPage = lazy(() => import('./dashboard/AuthCallbackPage'));

function AppLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg">
          <Bot className="h-7 w-7" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Cargando experiencia</p>
          <p className="text-sm text-slate-300">Preparando el panel y la navegación.</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<AppLoadingFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
