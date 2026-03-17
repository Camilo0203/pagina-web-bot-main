import clsx from 'clsx';
import { config } from '../config';

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LogoProps {
  size?: LogoSize;
  withText?: boolean;
  className?: string;
  imageClassName?: string;
  frameClassName?: string;
  textClassName?: string;
  subtitle?: string;
  alt?: string;
}

const sizeStyles: Record<LogoSize, { frame: string; title: string; subtitle: string; gap: string }> = {
  xs: { frame: 'h-10 w-10', title: 'text-sm', subtitle: 'text-[9px]', gap: 'gap-2.5' },
  sm: { frame: 'h-12 w-12', title: 'text-base', subtitle: 'text-[10px]', gap: 'gap-3' },
  md: { frame: 'h-14 w-14', title: 'text-lg', subtitle: 'text-[10px]', gap: 'gap-3.5' },
  lg: { frame: 'h-20 w-20', title: 'text-[1.4rem]', subtitle: 'text-[11px]', gap: 'gap-4.5' },
  xl: { frame: 'h-28 w-28 md:h-32 md:w-32 lg:h-36 lg:w-36', title: 'text-[1.9rem] md:text-[2.15rem]', subtitle: 'text-[11px] md:text-xs', gap: 'gap-6' },
};

export default function Logo({
  size = 'md',
  withText = true,
  className,
  imageClassName,
  frameClassName,
  textClassName,
  subtitle,
  alt,
}: LogoProps) {
  const styles = sizeStyles[size];

  return (
    <div className={clsx('flex items-center', styles.gap, className)}>
      <div
        className={clsx(
          'relative flex shrink-0 items-center justify-center overflow-visible',
          styles.frame,
          frameClassName,
        )}
      >
        <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),rgba(99,102,241,0.1)_38%,transparent_72%)] blur-xl" />
        <img
          src="/logo-ton618-transparent.png"
          alt={alt ?? `${config.botName} logo`}
          className={clsx(
            'relative z-[1] h-full w-full scale-[1.08] object-contain drop-shadow-[0_10px_26px_rgba(99,102,241,0.18)]',
            imageClassName,
          )}
          loading="eager"
          decoding="async"
        />
      </div>
      {withText ? (
        <div className="min-w-0">
          {subtitle ? (
            <p className={clsx('truncate font-semibold uppercase tracking-[0.28em] text-brand-200/90', styles.subtitle)}>
              {subtitle}
            </p>
          ) : null}
          <p className={clsx('truncate font-black uppercase tracking-[-0.05em] text-white', styles.title, textClassName)}>
            {config.botName}
          </p>
        </div>
      ) : null}
    </div>
  );
}
