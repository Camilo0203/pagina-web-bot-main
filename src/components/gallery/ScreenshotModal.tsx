import { useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Monitor, Users, MessageSquare, Activity, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getGradient, getIcon, type ScreenshotType } from './galleryHelpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshots: Array<{
    type: ScreenshotType;
    title: string;
    description: string;
  }>;
  activeIndex: number;
  onNavigate: (index: number) => void;
}

function DashboardScreenshotLarge({ type, title, description }: { type: string; title: string; description: string }) {
  const Icon = getIcon(type);
  const gradient = getGradient(type);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-3 w-3 rounded-full bg-red-400/60"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              className="h-3 w-3 rounded-full bg-yellow-400/60"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              className="h-3 w-3 rounded-full bg-emerald-400/60"
            />
          </div>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-indigo-400" />
            <span className="text-base font-semibold text-slate-200" id="modal-title">{title}</span>
          </div>
        </div>
        <Settings className="h-4 w-4 text-slate-500" />
      </div>

      {/* Content area */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="flex flex-col gap-3">
          {[Monitor, Users, MessageSquare, Activity].map((IconComponent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5"
            >
              <IconComponent className="h-5 w-5 text-slate-400" />
            </motion.div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          {/* Metrics cards with animation */}
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-lg bg-gradient-to-br ${gradient} p-4 backdrop-blur-sm`}
              >
                <div className="mb-2 h-2 w-16 rounded bg-white/20"></div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '4rem' }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                  className="h-5 rounded bg-white/30"
                />
              </motion.div>
            ))}
          </div>

          {/* Animated chart */}
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-end gap-2">
              {[12, 16, 10, 20, 14, 18, 16, 22].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height * 4}px` }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                  className="w-3 rounded-t bg-indigo-500/50"
                />
              ))}
            </div>
            <div className="h-2 w-full rounded bg-white/5"></div>
          </div>

          {/* Animated list */}
          <div className="space-y-2">
            {[{ color: 'bg-cyan-400/60' }, { color: 'bg-emerald-400/60' }, { color: 'bg-purple-400/60' }].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }}
                className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                />
                <div className="h-2 flex-1 rounded bg-white/10"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-white/10 pt-4">
        <p className="text-base leading-relaxed text-slate-300">{description}</p>
      </div>
    </div>
  );
}

export default function ScreenshotModal({ isOpen, onClose, screenshots, activeIndex, onNavigate }: ModalProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(Math.max(0, activeIndex - 1));
      if (e.key === 'ArrowRight') onNavigate(Math.min(screenshots.length - 1, activeIndex + 1));
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, activeIndex, screenshots.length, onClose, onNavigate]);

  if (!isOpen) return null;

  const currentScreenshot = screenshots[activeIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            className="relative mx-4 max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -right-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20"
              aria-label={t('gallery.modal.close')}
            >
              <X className="h-5 w-5 text-white" />
            </button>

            {/* Navigation buttons */}
            {activeIndex > 0 && (
              <button
                onClick={() => onNavigate(activeIndex - 1)}
                className="absolute -left-16 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20"
                aria-label={t('gallery.modal.previous')}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
            )}

            {activeIndex < screenshots.length - 1 && (
              <button
                onClick={() => onNavigate(activeIndex + 1)}
                className="absolute -right-16 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20"
                aria-label={t('gallery.modal.next')}
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            )}

            {/* Modal content */}
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-2xl">
              <DashboardScreenshotLarge type={currentScreenshot.type} title={currentScreenshot.title} description={currentScreenshot.description} />
              
              {/* Position indicator */}
              <div className="mt-6 text-center">
                <span className="text-sm text-slate-400">
                  {t('gallery.modal.position', { current: activeIndex + 1, total: screenshots.length })}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
