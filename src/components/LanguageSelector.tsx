import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'es', name: 'Español', short: 'ES' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 cinematic-glass border border-white/5 hover:border-indigo-500/30 group"
      >
        <Globe className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform duration-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
          {currentLanguage.short}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-40 overflow-hidden cinematic-glass border border-white/10 rounded-2xl shadow-3xl z-[100]"
          >
            <div className="p-2 flex flex-col gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                    i18n.language === lang.code 
                      ? 'bg-indigo-500/20 text-white' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">{lang.name}</span>
                  {i18n.language === lang.code && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Decorative bottom line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
