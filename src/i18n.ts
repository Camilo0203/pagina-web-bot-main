import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      meta: {
        title: 'TON618 | Premium Discord Bot for Moderation, Automations and Ops',
        description:
          'TON618 helps serious Discord communities automate moderation, run workflows, monitor live activity and manage everything from one premium dashboard.',
      },
      nav: {
        features: 'Capabilities',
        architecture: 'Dashboard',
        whyTon: 'Reliability',
        network: 'Live stats',
        primaryCta: 'Invite bot',
        secondaryCta: 'Open dashboard',
        mobilePrimaryCta: 'Invite to Discord',
        mobileSecondaryCta: 'Open dashboard',
        openMenu: 'Open navigation menu',
        closeMenu: 'Close navigation menu',
        homeAria: 'Go to home',
      },
      hero: {
        badge: 'Discord operations platform for serious servers',
        titleMain: 'Run Your Server',
        titleAccent: 'With Precision',
        description:
          'Moderation, automations, tickets, verification and analytics in one Discord bot built to stay fast as your community grows.',
        descriptionSub:
          'Invite TON618 in minutes, configure flows from the dashboard and keep staff aligned with live operational visibility.',
        ctaPrimary: 'Invite TON618',
        ctaSecondary: 'Open dashboard',
        ctaTertiary: 'Read docs',
        inviteUnavailable: 'Set VITE_DISCORD_CLIENT_ID to enable the invite flow.',
        proof: {
          one: 'Automations for moderation, roles and support',
          two: 'Live metrics with graceful fallback',
          three: 'Premium dashboard for operators and staff',
        },
        panelLabel: 'Why teams move fast with TON618',
        scroll: 'Scroll to explore',
      },
      features: {
        tag: 'What You Can Run',
        title: 'Built For',
        titleAccent: 'Real Operations',
        description:
          'TON618 is not a novelty bot. It is a Discord control layer for communities that need repeatable workflows, fast moderation and cleaner operations as volume increases.',
        useCases: {
          moderation: 'Moderate faster with rules, logs and safer defaults.',
          onboarding: 'Automate onboarding, verification and role assignment.',
          support: 'Keep tickets, support and staff actions organized.',
        },
        items: {
          moderation: {
            title: 'Moderation That Scales',
            desc: 'Handle enforcement, role logic and moderation events without turning staff work into manual busywork.',
            status: 'STAFF READY',
          },
          autonomy: {
            title: 'Automation Flows',
            desc: 'Run welcome journeys, verification steps and recurring workflows from configurable modules instead of ad hoc commands.',
            status: 'WORKFLOWS ACTIVE',
          },
          latency: {
            title: 'Fast Response',
            desc: 'Keep commands and operational actions feeling instant with an architecture designed for high-traffic Discord environments.',
            status: 'LOW LATENCY',
          },
          security: {
            title: 'Safer By Default',
            desc: 'Protect core interactions with stable permissions, controlled surfaces and a product experience built for administrators.',
            status: 'HARDENED',
          },
          analytics: {
            title: 'Operational Visibility',
            desc: 'Read live activity, usage and uptime signals so staff can trust what is happening across the bot at a glance.',
            status: 'INSIGHT LIVE',
          },
          network: {
            title: 'Growth-Ready',
            desc: 'Designed for communities that move beyond hobby scale and need consistency across multiple staff workflows.',
            status: 'READY TO EXPAND',
          },
          modular: {
            title: 'Modular Setup',
            desc: 'Enable only the systems your server actually needs and configure them from the dashboard without losing clarity.',
            status: 'CONFIGURABLE',
          },
          comms: {
            title: 'Discord-Native UX',
            desc: 'Every interaction feels grounded in how serious Discord teams already work, from support to moderation to member onboarding.',
            status: 'PLATFORM FIT',
          },
        },
      },
      experience: {
        title: 'See The',
        titleAccent: 'Control Layer',
        subtitle:
          'A cleaner operator experience for teams that need to move quickly without losing context.',
        card1Eyebrow: 'Setup clarity',
        card1Title: 'From command chaos to guided setup',
        card1Desc:
          'Replace scattered staff knowledge with a dashboard that exposes key modules, actions and states in a way new moderators can understand quickly.',
        card2Eyebrow: 'Operator workflow',
        card2Title: 'Built for Discord product workflows',
        card2Desc:
          'Move from invite to configuration to daily operations with a single system, rather than stitching together multiple niche bots and panels.',
      },
      why: {
        tag: 'Why Teams Choose TON618',
        title: 'Reliable Where',
        titleAccent: 'It Matters',
        description:
          'Serious communities need more than flashy commands. TON618 focuses on operational trust: stable behavior, visible metrics, configurable modules and a cleaner experience for owners, moderators and support staff.',
        stats: {
          uptime: 'Reliability',
          uptimeValue: 'Live-backed',
          uptimeSub: 'Status shown on the landing',
          speed: 'Operational fit',
          speedValue: 'Built for staff teams',
          speedSub: 'From invite to daily usage',
        },
        reasons: {
          precision: {
            title: 'Clear product value',
            desc: 'The landing and dashboard now explain what TON618 actually does: moderation, automations, verification, support and live visibility.',
          },
          performance: {
            title: 'Faster team execution',
            desc: 'Reusable flows reduce moderator busywork and help staff respond with more consistency during growth or high activity windows.',
          },
          security: {
            title: 'Trust-oriented experience',
            desc: 'Live telemetry, graceful fallback states and product framing focused on stability improve confidence for administrators evaluating the bot.',
          },
          integration: {
            title: 'One system, fewer gaps',
            desc: 'Dashboard access, docs, support and status all sit in a clear path so users can move from interest to setup without friction.',
          },
        },
      },
      stats: {
        badgeOnline: 'Live data online',
        badgeLoading: 'Refreshing live data',
        badgeOffline: 'Showing fallback snapshot',
        title: 'Live',
        titleAccent: 'Confidence',
        description:
          'These numbers are pulled from live bot telemetry when available, with a verified baseline shown if the live feed is unavailable.',
        lastUpdated: 'Updated {{value}}',
        source: {
          live: 'Source: live Supabase telemetry',
          loading: 'Source: connecting to live telemetry',
          fallback: 'Source: verified fallback snapshot',
        },
        status: {
          syncing: 'Checking the latest bot telemetry now.',
          standby: 'Live telemetry is unavailable right now.',
          fallback: 'The landing keeps a stable baseline visible so trust is not lost during temporary outages.',
          fallbackWithTime: 'Most recent live sync: {{value}}',
        },
        cards: {
          clusters: { label: 'Servers', sub: 'Communities connected' },
          souls: { label: 'Members reached', sub: 'Estimated community footprint' },
          ops: { label: 'Commands executed', sub: 'Operational throughput' },
          stability: { label: 'Uptime', sub: 'Availability target' },
        },
      },
      final: {
        tag: 'Ready To Launch',
        title: 'Invite TON618',
        titleAccent: 'And Configure Fast',
        description:
          'Bring the bot into your server, open the dashboard and give your staff a cleaner way to moderate, automate and support your community.',
        cta: 'Invite the bot',
        secondaryCta: 'Open dashboard',
        docsCta: 'View docs',
        supportCta: 'Join support',
        unavailable: 'The invite URL is disabled until VITE_DISCORD_CLIENT_ID is configured.',
        nodes: {
          active: 'DISCORD-FIRST PRODUCT',
          encryption: 'LIVE METRICS READY',
          stabilized: 'GRACEFUL FALLBACKS',
        },
      },
      footer: {
        tagline:
          'Premium Discord automation for teams that care about moderation quality, operational clarity and a cleaner setup experience.',
        productTitle: 'Product',
        resourcesTitle: 'Resources',
        supportTitle: 'Support',
        govTitle: 'Legal',
        nav: {
          features: 'Capabilities',
          experience: 'Dashboard',
          why: 'Reliability',
          stats: 'Live stats',
          invite: 'Invite bot',
          dashboard: 'Open dashboard',
          docs: 'Documentation',
          status: 'Status page',
          support: 'Support server',
          github: 'GitHub',
        },
        gov: {
          terms: 'terms of service',
          privacy: 'privacy policy',
          cookies: 'cookies policy',
        },
        copyright: '© {{year}} TON618',
        stabilized: 'Discord operations product',
        commanded: 'Built by milo0dev',
        inviteCta: 'Invite TON618',
      },
      legal: {
        close: 'Close',
        core: 'Core Policy',
        update: 'Last policy review',
        status: 'Published',
        terms: {
          title: 'Terms of Service',
          content:
            'By using TON618 you agree to use the bot responsibly, comply with Discord policies and avoid abuse, spam or attempts to disrupt the service. Features, limits and availability may change as the product evolves.',
        },
        privacy: {
          title: 'Privacy Policy',
          content:
            'TON618 only processes the data required to operate bot features, moderation flows, analytics and dashboard access. We do not sell personal data. Server owners can contact support to request data review or removal where applicable.',
        },
        cookies: {
          title: 'Cookies Policy',
          content:
            'This site may use essential and analytics cookies to maintain performance, understand product usage and improve the landing and dashboard experience. Cookie behavior can be controlled from your browser settings.',
        },
      },
    },
  },
  es: {
    translation: {
      meta: {
        title: 'TON618 | Bot premium de Discord para moderación, automatización y operaciones',
        description:
          'TON618 ayuda a comunidades serias de Discord a automatizar moderación, ejecutar flujos, monitorear actividad en vivo y gestionar todo desde un dashboard premium.',
      },
      nav: {
        features: 'Capacidades',
        architecture: 'Dashboard',
        whyTon: 'Confiabilidad',
        network: 'Métricas en vivo',
        primaryCta: 'Invitar bot',
        secondaryCta: 'Abrir dashboard',
        mobilePrimaryCta: 'Invitar a Discord',
        mobileSecondaryCta: 'Abrir dashboard',
        openMenu: 'Abrir menú de navegación',
        closeMenu: 'Cerrar menú de navegación',
        homeAria: 'Ir al inicio',
      },
      hero: {
        badge: 'Plataforma de operaciones para Discord enfocada en servidores serios',
        titleMain: 'Opera Tu Servidor',
        titleAccent: 'Con Precisión',
        description:
          'Moderación, automatizaciones, tickets, verificación y analítica en un solo bot de Discord pensado para mantenerse rápido mientras tu comunidad crece.',
        descriptionSub:
          'Invita TON618 en minutos, configura flujos desde el dashboard y mantén a tu staff alineado con visibilidad operativa en tiempo real.',
        ctaPrimary: 'Invitar TON618',
        ctaSecondary: 'Abrir dashboard',
        ctaTertiary: 'Ver docs',
        inviteUnavailable: 'Configura VITE_DISCORD_CLIENT_ID para habilitar la invitación del bot.',
        proof: {
          one: 'Automatizaciones para moderación, roles y soporte',
          two: 'Métricas en vivo con fallback elegante',
          three: 'Dashboard premium para operadores y staff',
        },
        panelLabel: 'Por qué los equipos avanzan más rápido con TON618',
        scroll: 'Desplázate para explorar',
      },
      features: {
        tag: 'Qué Puedes Operar',
        title: 'Hecho Para',
        titleAccent: 'Operaciones Reales',
        description:
          'TON618 no es un bot de adorno. Es una capa de control para Discord pensada para comunidades que necesitan flujos repetibles, moderación veloz y una operación más limpia cuando el volumen sube.',
        useCases: {
          moderation: 'Modera más rápido con reglas, logs y mejores defaults.',
          onboarding: 'Automatiza onboarding, verificación y asignación de roles.',
          support: 'Mantén tickets, soporte y acciones de staff en orden.',
        },
        items: {
          moderation: {
            title: 'Moderación Que Escala',
            desc: 'Gestiona enforcement, lógica de roles y eventos de moderación sin convertir el trabajo del staff en tareas manuales repetitivas.',
            status: 'LISTO PARA STAFF',
          },
          autonomy: {
            title: 'Flujos Automatizados',
            desc: 'Ejecuta bienvenidas, verificación y procesos recurrentes desde módulos configurables en lugar de depender de comandos dispersos.',
            status: 'FLUJOS ACTIVOS',
          },
          latency: {
            title: 'Respuesta Rápida',
            desc: 'Mantén comandos y acciones operativas con sensación instantánea gracias a una arquitectura orientada a entornos de Discord con alta actividad.',
            status: 'BAJA LATENCIA',
          },
          security: {
            title: 'Más Seguro Por Defecto',
            desc: 'Protege interacciones críticas con permisos estables, superficies controladas y una experiencia pensada para administradores.',
            status: 'ENDURECIDO',
          },
          analytics: {
            title: 'Visibilidad Operativa',
            desc: 'Lee actividad, uso y señales de uptime en vivo para que el staff entienda el estado del bot de un vistazo.',
            status: 'INSIGHT EN VIVO',
          },
          network: {
            title: 'Listo Para Crecer',
            desc: 'Diseñado para comunidades que van más allá de escala hobby y necesitan consistencia entre varios flujos de staff.',
            status: 'LISTO PARA EXPANDIR',
          },
          modular: {
            title: 'Setup Modular',
            desc: 'Activa solo los sistemas que tu servidor necesita y configúralos desde el dashboard sin perder claridad.',
            status: 'CONFIGURABLE',
          },
          comms: {
            title: 'UX Nativa De Discord',
            desc: 'Cada interacción se siente alineada con cómo trabajan los equipos serios de Discord: soporte, moderación y onboarding.',
            status: 'AJUSTE NATIVO',
          },
        },
      },
      experience: {
        title: 'Mira La',
        titleAccent: 'Capa De Control',
        subtitle:
          'Una experiencia de operación más limpia para equipos que necesitan moverse rápido sin perder contexto.',
        card1Eyebrow: 'Claridad de setup',
        card1Title: 'Del caos de comandos a un setup guiado',
        card1Desc:
          'Sustituye conocimiento disperso del staff por un dashboard que expone módulos, acciones y estados clave de una forma que un nuevo moderador puede entender rápido.',
        card2Eyebrow: 'Flujo del operador',
        card2Title: 'Pensado para flujos producto en Discord',
        card2Desc:
          'Pasa de la invitación a la configuración y a la operación diaria con un solo sistema, en vez de coser varios bots y paneles de nicho.',
      },
      why: {
        tag: 'Por Qué Eligen TON618',
        title: 'Confiable Donde',
        titleAccent: 'Más Importa',
        description:
          'Las comunidades serias necesitan más que comandos vistosos. TON618 prioriza confianza operativa: comportamiento estable, métricas visibles, módulos configurables y una experiencia más limpia para owners, moderadores y soporte.',
        stats: {
          uptime: 'Confiabilidad',
          uptimeValue: 'Respaldada en vivo',
          uptimeSub: 'Estado visible en la landing',
          speed: 'Ajuste operativo',
          speedValue: 'Hecho para equipos',
          speedSub: 'De la invitación al uso diario',
        },
        reasons: {
          precision: {
            title: 'Valor de producto claro',
            desc: 'La landing y el dashboard explican con claridad qué resuelve TON618: moderación, automatizaciones, verificación, soporte y visibilidad en vivo.',
          },
          performance: {
            title: 'Mejor ejecución del staff',
            desc: 'Los flujos reutilizables reducen trabajo manual y ayudan a responder con más consistencia en crecimiento o picos de actividad.',
          },
          security: {
            title: 'Experiencia orientada a confianza',
            desc: 'La telemetría en vivo, los fallbacks elegantes y el framing del producto centrado en estabilidad mejoran la confianza de quienes evalúan el bot.',
          },
          integration: {
            title: 'Un sistema, menos huecos',
            desc: 'Dashboard, docs, soporte y status quedan en un mismo recorrido para pasar de interés a setup sin fricción.',
          },
        },
      },
      stats: {
        badgeOnline: 'Datos en vivo online',
        badgeLoading: 'Actualizando datos en vivo',
        badgeOffline: 'Mostrando snapshot base',
        title: 'Confianza',
        titleAccent: 'En Vivo',
        description:
          'Estos números se obtienen de la telemetría en vivo del bot cuando está disponible, con una base verificada si la señal temporalmente falla.',
        lastUpdated: 'Actualizado {{value}}',
        source: {
          live: 'Fuente: telemetría en vivo desde Supabase',
          loading: 'Fuente: conectando con telemetría en vivo',
          fallback: 'Fuente: snapshot base verificado',
        },
        status: {
          syncing: 'Comprobando la telemetría más reciente del bot.',
          standby: 'La telemetría en vivo no está disponible ahora mismo.',
          fallback: 'La landing mantiene una base estable visible para no perder confianza durante incidencias temporales.',
          fallbackWithTime: 'Última sincronización en vivo: {{value}}',
        },
        cards: {
          clusters: { label: 'Servidores', sub: 'Comunidades conectadas' },
          souls: { label: 'Miembros alcanzados', sub: 'Huella estimada de comunidad' },
          ops: { label: 'Comandos ejecutados', sub: 'Rendimiento operativo' },
          stability: { label: 'Uptime', sub: 'Objetivo de disponibilidad' },
        },
      },
      final: {
        tag: 'Listo Para Lanzar',
        title: 'Invita TON618',
        titleAccent: 'Y Configura Rápido',
        description:
          'Lleva el bot a tu servidor, abre el dashboard y da a tu staff una forma más limpia de moderar, automatizar y dar soporte a tu comunidad.',
        cta: 'Invitar el bot',
        secondaryCta: 'Abrir dashboard',
        docsCta: 'Ver docs',
        supportCta: 'Ir a soporte',
        unavailable: 'La URL de invitación queda deshabilitada hasta configurar VITE_DISCORD_CLIENT_ID.',
        nodes: {
          active: 'PRODUCTO HECHO PARA DISCORD',
          encryption: 'MÉTRICAS EN VIVO LISTAS',
          stabilized: 'FALLBACKS ELEGANTES',
        },
      },
      footer: {
        tagline:
          'Automatización premium para Discord enfocada en calidad de moderación, claridad operativa y una experiencia de setup más limpia.',
        productTitle: 'Producto',
        resourcesTitle: 'Recursos',
        supportTitle: 'Soporte',
        govTitle: 'Legal',
        nav: {
          features: 'Capacidades',
          experience: 'Dashboard',
          why: 'Confiabilidad',
          stats: 'Métricas en vivo',
          invite: 'Invitar bot',
          dashboard: 'Abrir dashboard',
          docs: 'Documentación',
          status: 'Página de estado',
          support: 'Servidor de soporte',
          github: 'GitHub',
        },
        gov: {
          terms: 'términos del servicio',
          privacy: 'política de privacidad',
          cookies: 'política de cookies',
        },
        copyright: '© {{year}} TON618',
        stabilized: 'Producto de operaciones para Discord',
        commanded: 'Creado por milo0dev',
        inviteCta: 'Invitar TON618',
      },
      legal: {
        close: 'Cerrar',
        core: 'Política Central',
        update: 'Última revisión',
        status: 'Publicado',
        terms: {
          title: 'Términos de Servicio',
          content:
            'Al usar TON618 aceptas utilizar el bot de forma responsable, cumplir las políticas de Discord y evitar abuso, spam o intentos de afectar el servicio. Las funciones, límites y disponibilidad pueden cambiar a medida que el producto evoluciona.',
        },
        privacy: {
          title: 'Política de Privacidad',
          content:
            'TON618 solo procesa los datos necesarios para operar funciones del bot, flujos de moderación, analítica y acceso al dashboard. No vendemos datos personales. Los owners de servidores pueden contactar soporte para revisar o solicitar eliminación de datos cuando aplique.',
        },
        cookies: {
          title: 'Política de Cookies',
          content:
            'Este sitio puede usar cookies esenciales y de analítica para mantener el rendimiento, entender el uso del producto y mejorar la experiencia de la landing y del dashboard. El comportamiento de cookies puede controlarse desde la configuración del navegador.',
        },
      },
    },
  },
};

function normalizeLanguageCode(language?: string): string {
  return language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function applyDocumentLanguage(language?: string) {
  if (typeof document === 'undefined') {
    return;
  }

  const normalizedLanguage = normalizeLanguageCode(language);
  document.documentElement.lang = normalizedLanguage;
  document.documentElement.setAttribute('xml:lang', normalizedLanguage);
}

const savedLanguage =
  typeof window !== 'undefined'
    ? normalizeLanguageCode(localStorage.getItem('i18nextLng') || 'en')
    : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  const normalizedLanguage = normalizeLanguageCode(lng);

  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', normalizedLanguage);
  }

  applyDocumentLanguage(normalizedLanguage);
});

applyDocumentLanguage(i18n.resolvedLanguage || i18n.language || savedLanguage);

export default i18n;
