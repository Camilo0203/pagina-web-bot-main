import { useState, useEffect } from 'react';
import { Bot, Menu, X, ChevronRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDiscordLoginUrl } from '../config';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loginUrl = getDiscordLoginUrl();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative cinematic-glass rounded-[2rem] border-white/5 px-6 py-3 flex items-center justify-between transition-all duration-500 ${scrolled ? 'shadow-2xl shadow-indigo-500/10 border-white/10' : ''}`}>
          
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-all duration-500">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black text-white uppercase tracking-tighter">TON618</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Experience', 'Why', 'Stats'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <Shield className="w-3 h-3 text-indigo-400" />
               <span>V-STABLE</span>
            </div>

            <a
              href={loginUrl}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] group"
            >
              <span>Initialize</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 px-4 pt-4"
          >
            <div className="cinematic-glass rounded-3xl border-white/10 p-8 flex flex-col gap-6 shadow-2xl">
              {['Features', 'Experience', 'Why', 'Stats'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-black uppercase tracking-widest text-slate-400 hover:text-white"
                >
                  {item}
                </a>
              ))}
              <hr className="border-white/5" />
              <a
                href={loginUrl}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest"
              >
                <span>Initialize Login</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
