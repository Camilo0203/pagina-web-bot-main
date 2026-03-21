import { useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Monitor, Users, MessageSquare, Activity, Settings } from 'lucide-react';
import { getGradient, getIcon, getCTALinks, type ScreenshotType } from './galleryHelpers';

interface DashboardScreenshotProps {
  title: string;
  description: string;
  delay: number;
  type: ScreenshotType;
  onClick: () => void;
}

export default function DashboardScreenshot({ title, description, delay, type, onClick }: DashboardScreenshotProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const Icon = getIcon(type);
  const gradient = getGradient(type);
  const links = getCTALinks(type);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : delay }}
      className="group relative"
    >
      <div 
        className="relative cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:border-white/20 hover:shadow-[0_20px_60px_rgba(99,102,241,0.2)]"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        aria-label={`View ${title} in detail`}
      >
        {/* Header simulado */}
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <motion.div
                animate={isInView ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2.5 w-2.5 rounded-full bg-red-400/60"
              />
              <motion.div
                animate={isInView ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                className="h-2.5 w-2.5 rounded-full bg-yellow-400/60"
              />
              <motion.div
                animate={isInView ? { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                className="h-2.5 w-2.5 rounded-full bg-emerald-400/60"
              />
            </div>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">{title}</span>
            </div>
          </div>
          <Settings className="h-3.5 w-3.5 text-slate-500" />
        </div>

        {/* Sidebar simulado */}
        <div className="mb-4 flex gap-4">
          <div className="flex flex-col gap-2">
            {[Monitor, Users, MessageSquare, Activity].map((IconComponent, i) => (
              <div key={i} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                <IconComponent className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>

          {/* Área de contenido */}
          <div className="flex-1 space-y-3">
            {/* Tarjetas de métricas */}
            <div className="grid grid-cols-2 gap-2">
              {[0, 1].map((i) => (
                <div key={i} className={`rounded-lg bg-gradient-to-br ${gradient} p-3 backdrop-blur-sm`}>
                  <div className="mb-1 h-2 w-12 rounded bg-white/20"></div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '4rem' } : {}}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    className="h-4 rounded bg-white/30"
                  />
                </div>
              ))}
            </div>

            {/* Gráfica simulada con animación */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div className="mb-2 flex items-end gap-1">
                {[12, 16, 10, 20, 14, 18, 16, 22].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${height * 3}px` } : {}}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                    className="w-2 rounded-t bg-indigo-500/50"
                  />
                ))}
              </div>
              <div className="h-1.5 w-full rounded bg-white/5"></div>
            </div>

            {/* Lista simulada */}
            <div className="space-y-2">
              {[{ color: 'bg-cyan-400/60' }, { color: 'bg-emerald-400/60' }, { color: 'bg-purple-400/60' }].map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-white/[0.03] p-2">
                  <motion.div
                    animate={isInView ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className={`h-2 w-2 rounded-full ${item.color}`}
                  />
                  <div className="h-2 flex-1 rounded bg-white/10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-sm font-medium leading-relaxed text-slate-400">{description}</p>
        </div>

        {/* CTAs */}
        <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
          <a
            href={links.primary}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-center text-xs font-semibold text-white transition-all hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/50"
          >
            {t(`gallery.ctas.${type}.primary`)}
          </a>
          <a
            href={links.secondary}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-center text-xs font-semibold text-slate-300 transition-all hover:bg-white/10"
          >
            {t(`gallery.ctas.${type}.secondary`)}
          </a>
        </div>

        {/* Glow effect on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className={`absolute inset-0 rounded-[1.5rem] bg-gradient-to-br ${gradient} blur-xl`}></div>
        </div>
      </div>
    </motion.div>
  );
}
