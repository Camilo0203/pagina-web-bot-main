import type { Variants } from 'framer-motion';

/**
 * Variantes de animación reutilizables para Framer Motion
 * Centralizadas para mantener consistencia en toda la aplicación
 */

// Animaciones básicas de fade
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 15 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -15 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -15 },
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 15 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 15 },
};

// Animaciones con escala
export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.985 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.985 },
};

export const scaleIn: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

// Animaciones para listas (con stagger)
export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, scale: 0.98, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Animaciones para modales y overlays
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

// Animaciones para menús desplegables
export const dropdownMenu: Variants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
};

// Variantes instantáneas (para reduced motion)
export const instantReveal: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
};

/**
 * Función helper para crear variantes con delays personalizados
 */
export function withDelay(variants: Variants, delay: number): Variants {
  return {
    ...variants,
    animate: {
      ...variants.animate,
      transition: {
        ...(typeof variants.animate === 'object' && 'transition' in variants.animate 
          ? variants.animate.transition 
          : {}),
        delay,
      },
    },
  };
}

/**
 * Función helper para crear variantes con duración personalizada
 */
export function withDuration(variants: Variants, duration: number): Variants {
  return {
    ...variants,
    animate: {
      ...variants.animate,
      transition: {
        ...(typeof variants.animate === 'object' && 'transition' in variants.animate 
          ? variants.animate.transition 
          : {}),
        duration,
      },
    },
  };
}

/**
 * Configuraciones de transición comunes
 */
export const transitions = {
  smooth: { duration: 0.6, ease: 'easeOut' },
  spring: { type: 'spring', damping: 25, stiffness: 300 },
  fast: { duration: 0.3, ease: 'easeOut' },
  slow: { duration: 0.8, ease: 'easeOut' },
} as const;

/**
 * Viewport settings para whileInView
 */
export const viewportSettings = {
  once: true,
  margin: '-50px',
} as const;
