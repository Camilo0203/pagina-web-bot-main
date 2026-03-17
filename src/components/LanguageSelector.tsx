import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'es', name: 'Español', short: 'ES' },
];

const normalizeLanguageCode = (language?: string) =>
  language?.toLowerCase().startsWith('es') ? 'es' : 'en';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedLanguage = normalizeLanguageCode(i18n.resolvedLanguage || i18n.language);

  const currentLanguage =
    languages.find((language) => language.code === normalizedLanguage) || languages[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | PointerEvent | TouchEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    setIsOpen(false);
  };

  const getIsActiveLanguage = (code: string) => code === normalizedLanguage;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center rounded-xl border border-white/5 cinematic-glass sm:hidden">
        {languages.map((language) => {
          const isActive = getIsActiveLanguage(language.code);

          return (
            <button
              key={language.code}
              type="button"
              onClick={() => toggleLanguage(language.code)}
              aria-pressed={isActive}
              className={`flex min-w-[3.25rem] items-center justify-center px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive
                  ? 'bg-indigo-500/20 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language.short}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="hidden items-center gap-2 rounded-xl border border-white/5 px-4 py-2 transition-all duration-300 cinematic-glass group hover:border-indigo-500/30 sm:flex"
        aria-label="Change language"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'language-selector-menu' : undefined}
      >
        <Globe className="h-4 w-4 text-indigo-400 transition-transform duration-500 group-hover:rotate-12" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
          {currentLanguage.short}
        </span>
        <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="language-selector-menu"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="menu"
            className="absolute right-0 top-[calc(100%+0.75rem)] z-[140] hidden w-40 overflow-hidden rounded-2xl border border-white/10 cinematic-glass shadow-3xl sm:block"
          >
            <div className="flex flex-col gap-1 p-2">
              {languages.map((language) => {
                const isActive = getIsActiveLanguage(language.code);

                return (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() => toggleLanguage(language.code)}
                    role="menuitemradio"
                    aria-checked={isActive}
                    className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? 'bg-indigo-500/20 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest">{language.name}</span>
                    {isActive ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
