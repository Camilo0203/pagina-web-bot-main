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
        docs: 'Docs',
        status: 'Status',
        support: 'Support',
        primaryCta: 'Invite bot',
        secondaryCta: 'Open dashboard',
        mobilePrimaryCta: 'Invite to Discord',
        mobileSecondaryCta: 'Open dashboard',
        openMenu: 'Open navigation menu',
        closeMenu: 'Close navigation menu',
        homeAria: 'Go to home',
        primaryAria: 'Primary navigation',
      },
      languageSelector: {
        triggerLabel: 'Change language',
        menuLabel: 'Language selector',
      },
      app: {
        loadingTitle: 'Loading experience',
        loadingDescription: 'Preparing the dashboard and navigation.',
      },
      landing: {
        skipToContent: 'Skip to content',
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
        highlightsAria: 'Product highlights',
      },
      docsSection: {
        eyebrow: 'Operational resources',
        title: 'Everything Needed',
        titleAccent: 'To Evaluate And Launch',
        description:
          'TON618 does not stop at a polished landing page: it exposes value, opens the dashboard and keeps the resources a serious team expects before adopting the product.',
        cards: {
          docs: {
            title: 'Operational documentation',
            description:
              'Setup guidance, module coverage and operating notes so teams can move from installation to real usage without tribal knowledge.',
            ctaExternal: 'Open docs',
            ctaFallback: 'Review launch path',
          },
          dashboard: {
            title: 'Dashboard for staff',
            description:
              'Open configuration, tickets and operational follow-up from a panel that already degrades gracefully when a secondary source fails.',
            cta: 'Open dashboard',
          },
          support: {
            title: 'Support and trust path',
            description:
              'Support, contact and launch guidance stay visible to reduce friction during evaluation, onboarding and incident handling.',
            ctaExternal: 'Open support',
            ctaFallback: 'Go to launch CTA',
          },
        },
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
          configFallback: 'Live telemetry is not configured in this environment.',
          networkFallback: 'Live telemetry could not be reached from this environment.',
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
      dashboardAuth: {
        pageTitle: 'Auth',
        oauthLabel: 'Discord OAuth',
        pageHeading: 'Access to {{name}}',
        pageDescription:
          'We are validating the secure session and syncing server access without changing your current configuration.',
        errorEyebrow: 'Access was not completed',
        errorTitle: 'We need one action to continue.',
        retrySync: 'Retry sync',
        restartLogin: 'Restart Discord login',
        successEyebrowRedirecting: 'Finishing access',
        successEyebrowLoading: 'Access in progress',
        syncingDescription:
          'We are preparing the authenticated account so you can enter the dashboard with your manageable guilds already resolved.',
        holdingContextDescription:
          'The callback keeps your login context so you do not lose the server you wanted to open.',
        authCard: {
          missingConfigEyebrow: 'Configuration required',
          missingConfigTitle: 'Supabase connection missing',
          missingConfigDescription:
            'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable Discord login, sync servers and persist bot settings.',
          protectedAccess: 'Protected access',
          cardTitle: 'Sign in to enter the control panel',
          cardDescription:
            'Use Discord to validate your session, sync manageable guilds and operate the dashboard with real permissions.',
          loadingCta: 'Connecting...',
          cta: 'Continue with Discord',
          trustLine: 'Secure encryption - Server sync - Supabase access',
          trustFooter: 'TON618 keeps the branding and official Discord OAuth flow',
        },
        state: {
          preparing: 'Preparing Discord authentication...',
          exchanging: 'Exchanging code for a secure session...',
          syncing: 'Syncing manageable servers with Supabase...',
          redirectingWithGuilds: 'Ready. Redirecting to the panel with your synced servers...',
          redirectingWithoutGuilds: 'Ready. Redirecting to the dashboard to continue with the authenticated account...',
          retryingSync: 'Retrying server sync...',
          secureAccessFailed: 'Secure access could not be completed.',
        },
        errors: {
          sessionValidationFailed: 'The current dashboard session could not be validated.',
          userLoadFailed: 'The authenticated dashboard user could not be loaded.',
          startLoginFailed: 'Discord sign-in for the dashboard could not be started.',
          signOutFailed: 'The dashboard session could not be closed.',
          restartLoginFailed: 'Discord login could not be restarted.',
          restartLoginAction: 'Could not restart login with Discord.',
          missingSessionAfterCallback:
            'There is no valid dashboard session after the callback. Start sign-in again from the dashboard.',
          missingProviderToken:
            'Discord did not return a provider token. Repeat the login to sync servers.',
          invalidSession:
            'The dashboard session is invalid or expired. Restart the login to continue.',
          callbackFailed: 'The dashboard callback could not be completed.',
          missingOauthCode: 'A valid OAuth code did not reach the callback.',
          syncMissingToken: 'A valid provider token did not arrive to sync servers.',
          syncEmptyResponse: 'The sync-discord-guilds function returned an empty response.',
          syncFailed: 'Manageable servers could not be synced with Supabase.',
          exchangeFailed: 'The OAuth code could not be exchanged with Supabase.',
          exchangeTimeout:
            'The OAuth exchange took too long ({{seconds}}s). Check the network, Supabase Auth and the redirect URL configuration.',
          syncTimeout:
            'The initial server sync took too long ({{seconds}}s). Check the sync-discord-guilds function, the network and Supabase status.',
        },
      },
      dashboard: {
        pageTitle: 'Dashboard',
        metaDescription: 'Professional dashboard to manage your Discord bot configuration, activity and analytics.',
        inbox: {
          workflow: {
            new: 'New',
            triage: 'Triage',
            waitingStaff: 'Waiting on staff',
            waitingUser: 'Waiting on user',
            escalated: 'Escalated',
            resolved: 'Resolved',
            closed: 'Closed'
          },
          filters: {
            all: 'All',
            open: 'Open',
            closed: 'Closed',
            urgent: 'Urgent',
            high: 'High',
            normal: 'Normal',
            low: 'Low',
            breached: 'Breached',
            warning: 'Warning',
            healthy: 'Healthy',
            paused: 'Paused',
            resolved: 'Resolved',
            allQueue: 'Entire queue',
            unclaimed: 'Unclaimed',
            claimed: 'Claimed',
            unassigned: 'Unassigned',
            assigned: 'Assigned',
            allCategories: 'All categories'
          },
          visibility: {
            internal: 'Internal',
            public: 'Customer',
            system: 'System'
          },
          actions: {
            claim: 'claim the ticket',
            unclaim: 'unclaim the ticket',
            assignSelf: 'assign yourself the ticket',
            unassign: 'unassign the ticket',
            setStatus: 'update the status',
            close: 'close the ticket',
            reopen: 'reopen the ticket',
            addNote: 'save the internal note',
            addTag: 'add the tag',
            removeTag: 'remove the tag',
            replyCustomer: 'send the reply',
            postMacro: 'post the macro',
            setPriority: 'update the priority',
            fallback: 'execute the action'
          }
        },
        overview: {
          status: { active: 'Ready', basic: 'In progress', needsAttention: 'Review', pending: 'Pending' },
          degraded: 'The overview is still available with partial data',
          center: { eyebrow: 'Overview', title: 'Server operational center', desc: 'The overview summarizes technical health, ongoing support, and the most impactful task for the admin right now.' },
          nextStep: { label: 'Current priority', ready: 'The base path is already covered', emptyDesc: 'The overview does not detect pending critical steps in the main checklist.', emptySummary: 'From here you can proceed to support, analytics, or module refinement.', count: '{{completed}}/{{total}} steps ready', allDone: 'All up to date', cta: 'Open recommended task', toSupport: 'Go to active support', toActivity: 'Review recent activity' },
          quickList: { bridge: { label: 'Bridge', ok: 'Bridge operational.' }, support: { label: 'Support', open: '{{count}} open', breached: '{{breached}} SLA breached. {{warning}} in alert.', warning: '{{warning}} in alert.', clean: 'No SLA breaches.' }, backups: { label: 'Backups', pending: 'Pending', recent: 'Recent backup.', empty: 'Create the first backup.' } },
          summary: { label: 'Admin reading', fallbackTitle: 'The server is stable with a clear next action.', fallbackDesc: 'Use the overview to quickly jump to support, system, or the module that is not yet closed.' },
          checklist: { eyebrow: 'Checklist and actions', title: 'What to do next', desc: 'The checklist maintains the base path and quick actions cut the distance to the most urgent problem.', ctaReady: 'Ready' },
          actions: { label: 'Quick actions', title: 'Direct entries to operate', now: 'Now' },
          alerts: { label: 'Operational alerts', title: 'What should not be postponed', emptyTitle: 'No critical alerts visible.', emptyDesc: 'You can move on to optimizing modules or reviewing usage trends.' },
          coverage: { eyebrow: 'Coverage', title: 'Status by module', desc: 'Each block summarizes how operational each area is and lets you jump directly where closure is missing.', groups: { attention: { title: 'Review now', desc: 'Impacts support, health, or server consistency.', empty: 'No modules demanding immediate review.' }, progress: { title: 'In progress', desc: 'They have a base, but should not be considered closed yet.', empty: 'No modules halfway done.' }, ready: { title: 'Operational', desc: 'Current configuration allows using them safely.', empty: 'No modules completely closed yet.' } } },
          pulse: { bridgeTitle: 'Synchronization and bridge', connected: 'System connected to server', pending: 'Installation pending', bridgeDesc: 'The bridge will translate its technical state into easy-to-follow signals here.', syncFacts: { bridge: 'Bridge', heartbeat: 'Heartbeat', inventory: 'Inventory', config: 'Applied config' }, details: { changes: { label: 'Pending changes', empty: 'No pending queue.' }, support: { label: 'Open tickets', empty: 'No current support load.' }, backup: { label: 'Last backup', none: 'Does not exist yet', ready: 'You can go back if needed.', create: 'Create one before sensitive changes.' }, base: { label: 'Base checklist', none: 'No pending base tasks.' } } },
          pulseStats: { title: 'Server pulse', desc: 'Quick reading of size, visible telemetry, and panel coverage.', facts: { members: 'Members', noData: 'No data', snapshot: 'Last snapshot', pending: 'Pending', events: 'Recent events', tickets: 'Open tickets' }, info: 'The last visible window shows {{commands}} commands and {{members}} active members in the most recent snapshot.' },
          activity: { title: 'Recent activity', desc: 'Useful to validate if bot changes and processes are leaving an operational trail.', empty: 'When the bot publishes changes, backups, or tickets, they will appear here as recent signals.' },
          notes: { title: 'Operation notes', desc: 'Quick context to know if visible health matches expected state.', empty: 'No additional notes. The dashboard detects no tensions between bridge, tickets, and backups.' }
        },
        tickets: {
          onboarding: { eyebrow: 'Onboarding', title: 'Install the bot to enable ticket configuration', desc: 'Once the bot is in, we can apply limits, SLA, auto-assignment, and incident mode to the real ticket flow.' },
          main: { eyebrow: 'Tickets and SLA', title: 'Ticket system operation', desc: 'Here you decide how much load the queue handles, how long it takes to ask for help, and when it should escalate or report automatically.', save: 'Save ticket operation' },
          inventoryNotice: { title: 'Incomplete operational inventory', message: 'Missing synced channels, roles, or categories. You can review the configuration, but you should re-sync before closing escalations or incidents.' },
          capacity: { title: 'Capacity and times', desc: 'These values define how much work the queue can take, how long the user waits, and when the system considers a ticket needs help.', maxTickets: 'Max tickets per user', globalLimit: 'Global limit', cooldown: 'Cooldown (min)', minDays: 'Min days in server', autoClose: 'Auto close (min)', slaMinutes: 'SLA alert (min)', smartPing: 'Smart ping (min)', slaEscalation: 'SLA escalation (min)' },
          automation: { title: 'Automations and experience', desc: 'Auto-assign, incident mode, reports, and DMs are managed separately so the admin knows what they are enabling.', autoAssign: { label: 'Auto-assignment', desc: 'Automatically assigns new tickets.' }, requireOnline: { label: 'Online only', desc: 'Avoids assigning disconnected staff.' }, respectAway: { label: 'Respect away', desc: 'Does not assign to away members.' }, dailyReport: { label: 'Daily SLA report', desc: 'Sends a daily summary of breached or at-risk tickets.' }, incidentMode: { label: 'Incident mode', desc: 'Pauses specific categories and shows a special message.' }, dmOpen: { label: 'DM on open', desc: 'Confirms to the user that the ticket was created.' }, dmClose: { label: 'DM on close', desc: 'Notifies when the ticket is closed.' }, dmTranscripts: { label: 'Send transcripts', desc: 'Shares transcripts via DM when applicable.' }, dmAlerts: { label: 'DM alerts', desc: 'Allows direct messages related to SLA or events.' }, slaEscalation: { label: 'Auto escalation', desc: 'Escalates breached tickets to an additional role or channel.' } },
          escalation: { title: 'Escalation and reports', desc: 'Roles and channels used when a ticket needs extra visibility or daily tracking.', roleLabel: 'Escalation role', channelLabel: 'Escalation channel', reportLabel: 'Daily report channel', incidentLabel: 'Incident mode message', notConfigured: 'Not configured', useFallback: 'Use bot fallback' },
          advanced: { title: 'Advanced rules', desc: 'Fine-tune SLA or escalation overrides by priority and category without touching the general baseline.', slaOverrides: 'SLA overrides by priority', pausedCategories: 'Categories paused in incident', noCategories: 'The inventory has not published configurable ticket categories yet.', missingCategory: 'The paused category {{id}} no longer exists in the inventory.' },
          priority: { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' }
        },
        general: {
          onboarding: { eyebrow: 'Installation required', title: 'Invite the bot before editing configurations', desc: 'When the bot is installed in this server, we can maintain persistent language, invocation, and dashboard preferences.' },
          main: { eyebrow: 'General', title: 'Essential server configuration', desc: 'Define language, commands, and base rules so the dashboard and the bot understand each other from the first minute.', save: 'Save operational base' },
          locale: { title: 'Language and operation', desc: 'These settings define the bot\'s base tone, the timezone for reports, and how members invoke commands.', language: { label: 'Base language', hint: 'This language is used in messages, panels, and main bot replies.', es: 'Spanish', en: 'English' }, timezone: { label: 'Timezone', hint: 'Affects visible times, reports, and scheduled automations.' }, commandMode: { label: 'Command mode', hint: 'Choose if the user invokes the bot by mention or with a short prefix.', mention: 'Bot mention', prefix: 'Prefix' }, prefix: { label: 'Prefix', hint: 'Only used if you enable prefix mode.' } },
          moderation: { title: 'General moderation preset', desc: 'Acts as an operational intent for the backend and makes clear what level of intervention the staff expects.', relaxed: { label: 'Relaxed', desc: 'More flexible and less automatic intervention.' }, balanced: { label: 'Balanced', desc: 'Balance between protection and comfort.' }, strict: { label: 'Strict', desc: 'More discipline and less tolerance to noise.' } },
          prefs: { eyebrow: 'Dashboard', title: 'Team preferences', desc: 'Presentation settings so the team goes straight back to their most used task.', defaultSection: 'Initial screen', compactMode: { label: 'Compact mode', desc: 'Reduces visual density for long moderation sessions.' }, advancedCards: { label: 'Advanced cards', desc: 'Shows extra context, recommendations, and extended operational health.' }, notice: 'Changes are sent to an audited queue. The bot applies and confirms them later in the Overview view.' },
          sections: { overview: 'Overview', inbox: 'Support inbox', general: 'Initial configuration', server_roles: 'Roles and channels', tickets: 'Tickets', verification: 'Access verification', welcome: 'Welcome', suggestions: 'Community suggestions', modlogs: 'Moderation logs', commands: 'Commands', system: 'Bot system', activity: 'Recent activity', analytics: 'Analytics' }
        },
        serverRoles: {
          onboarding: { eyebrow: 'Onboarding', title: 'Instala el bot para publicar canales y roles en la dashboard', desc: 'Este modulo usa inventario real del servidor. Cuando el bot este dentro, cargaremos canales, roles y paneles disponibles.' },
          main: { eyebrow: 'Roles y canales', title: 'Base operativa del servidor', desc: 'Estos canales y roles destraban tickets, logs y automatizaciones. Si esto queda bien, el resto del panel avanza mucho mas rapido.', save: 'Guardar asignaciones' },
          notices: { emptyTitle: 'Inventario no disponible', emptyMessage: 'Todavia no llegaron roles o canales desde el bot. Puedes revisar la configuracion actual, pero conviene re-sincronizar antes de guardar.', staleTitle: 'Inventario desactualizado', staleMessage: 'El snapshot del servidor no parece reciente. Si acabas de crear canales o roles, re-sincroniza antes de asignarlos aqui.' },
          channels: {
            title: 'Canales de operacion', desc: 'Conecta los espacios donde el bot publicara paneles, guardara trazas y mantendra contadores visibles para el staff.',
            dashboard: { label: 'Canal principal del panel', hint: 'Punto de entrada del dashboard operativo dentro de Discord.' },
            ticketPanel: { label: 'Canal del panel de tickets', hint: 'Aqui se publica el punto de arranque del flujo de soporte.' },
            logs: { label: 'Canal de registros generales', hint: 'Logs transversales del bot y del bridge.' },
            transcript: { label: 'Canal de transcripciones', hint: 'Donde se guardan cierres y transcripts de tickets.' },
            weeklyReport: { label: 'Canal de reporte semanal', hint: 'Recepcion de resumenes operativos programados.' },
            liveMembers: { label: 'Canal contador de miembros', hint: 'Canal de voz usado como contador visible.' },
            liveRoleCount: { label: 'Canal contador por rol', hint: 'Canal de voz usado para mostrar el total de un rol concreto.' },
            liveRole: { label: 'Rol mostrado en contador', hint: 'Rol que alimenta el contador por rol.' }
          },
          access: {
            eyebrow: 'Accesos', title: 'Roles esenciales', desc: 'El bot usa estos roles para dar acceso al staff, separar permisos y operar flujos sensibles sin confusion.',
            sectionTitle: 'Accesos del staff', sectionDesc: 'Estas asignaciones resuelven permisos transversales para soporte, acciones sensibles y filtros por nivel de acceso.',
            support: { label: 'Rol del equipo de soporte', hint: 'Base para auto-asignacion, escalados y visibilidad operativa.' },
            admin: { label: 'Rol administrador del bot', hint: 'Bypass y acciones delicadas del bot.' },
            verify: { label: 'Rol minimo para crear tickets', hint: 'Usado como piso de acceso si el backend lo aplica.' }
          },
          footerNote: 'Todos los selectores salen del inventario sincronizado por el bot. Si aqui falta un rol o canal, primero re-sincroniza el servidor y luego vuelve a esta pantalla.',
          notConfigured: 'No configurado',
          validation: {
            dashboard: 'Canal principal del panel', ticketPanel: 'Canal del panel de tickets', logs: 'Canal de registros', transcript: 'Canal de transcripciones', weeklyReport: 'Canal de reporte semanal', liveMembers: 'Canal contador de miembros', liveRoleCount: 'Canal contador por rol', liveRole: 'Rol del contador', support: 'Rol del equipo de soporte', admin: 'Rol administrador', verify: 'Rol minimo para tickets'
          }
        },
        welcome: {
          onboarding: { eyebrow: 'Onboarding', title: 'Instala el bot para editar bienvenida y despedida', desc: 'Estos mensajes se aplican en eventos reales de miembros. El bot necesita estar dentro del servidor para ejecutarlos.' },
          main: { eyebrow: 'Bienvenida', title: 'Experiencia de bienvenida', desc: 'Prepara el primer mensaje que vera un miembro nuevo, si recibira DM y si saldra con un autorrol base.', save: 'Guardar experiencia' },
          notices: { emptyTitle: 'Inventario sin publicar', emptyMessage: 'Los canales y roles del servidor todavia no estan disponibles para validar bienvenida, despedida o autoroles.' },
          welcome: {
            enableLabel: 'Activar bienvenida',
            enableDesc: 'Publica embeds de bienvenida y opcionalmente DM al usuario.',
            sectionTitle: 'Bienvenida publica',
            sectionDesc: 'Deja lista la pieza publica que ve el servidor y la automatizacion opcional por DM o autorrol.',
            channelLabel: 'Canal bienvenida',
            autoroleLabel: 'Autorole',
            titleLabel: 'Titulo',
            messageLabel: 'Mensaje',
            colorLabel: 'Color HEX',
            bannerLabel: 'Banner',
            footerLabel: 'Footer',
            thumbnailLabel: 'Mostrar thumbnail',
            dmLabel: 'Enviar DM',
            dmMessageLabel: 'Mensaje DM'
          },
          goodbye: {
            title: 'Despedida',
            desc: 'Configura el mensaje que deja trazabilidad cuando alguien abandona el servidor.',
            enableLabel: 'Activar despedida',
            enableDesc: 'Publica embed cuando un miembro sale del servidor.',
            channelLabel: 'Canal despedida',
            titleLabel: 'Titulo',
            messageLabel: 'Mensaje',
            colorLabel: 'Color HEX',
            thumbnailLabel: 'Mostrar thumbnail',
            footerLabel: 'Footer'
          },
          notConfigured: 'No configurado'
        },
        verification: {
          onboarding: { eyebrow: 'Onboarding', title: 'Instala el bot para administrar la verificacion', desc: 'El panel de verificacion depende del inventario y de los handlers activos del bot dentro del servidor.' },
          main: { eyebrow: 'Verificacion', title: 'Flujo de acceso al servidor', desc: 'Configura como entra la gente al servidor, que rol recibe al completar el proceso y que pasa si llega una oleada sospechosa.', save: 'Guardar acceso' },
          notices: { emptyTitle: 'Inventario incompleto', emptyMessage: 'No llegaron roles o canales suficientes para validar el flujo completo de verificacion.' },
          flow: {
            title: 'Flujo principal', desc: 'Primero define donde vive el panel y que roles participan. Luego decide el modo exacto de verificacion.',
            enabled: { label: 'Sistema activo', desc: 'Activa el panel y las reglas de acceso verificable.' },
            channel: 'Canal del panel', logs: 'Canal de logs', verifiedRole: 'Rol verificado', unverifiedRole: 'Rol no verificado',
            mode: { label: 'Modo', button: 'Boton', code: 'Codigo', question: 'Pregunta' },
            autokick: { label: 'Autokick (horas)', hint: '0 desactiva el retiro automatico.' }
          },
          visual: {
            title: 'Panel visual y antiraid', desc: 'Textos, apariencia y reglas defensivas para que el acceso sea claro para miembros y seguro para el staff.',
            titleLabel: 'Titulo', descLabel: 'Descripcion', colorLabel: 'Color HEX', imageLabel: 'Imagen',
            questionLabel: 'Pregunta', answerLabel: 'Respuesta esperada',
            antiraid: { label: 'Antiraid', desc: 'Controla joins anormales antes de verificar.' },
            dm: { label: 'DM al verificar', desc: 'Confirma por mensaje directo cuando alguien completa el proceso.' },
            thresholds: { joins: 'Joins umbral', window: 'Ventana (seg)', action: 'Accion' }
          },
          notConfigured: 'No configurado'
        },
        suggestions: {
          onboarding: { eyebrow: 'Onboarding', title: 'Instala el bot para gestionar sugerencias', desc: 'Este modulo refleja el sistema real de sugerencias del bot y sus canales asociados.' },
          main: { eyebrow: 'Sugerencias', title: 'Canales y experiencia del usuario', desc: 'Define donde nacen las ideas de la comunidad, donde las revisa el staff y donde se publica el resultado.', save: 'Guardar flujo de sugerencias' },
          notices: { emptyTitle: 'Sin canales sincronizados', emptyMessage: 'Todavia no recibimos canales desde el inventario del servidor. Re-sincroniza para poder elegir destinos reales.' },
          destinations: {
            title: 'Destinos del flujo', desc: 'Separa el canal donde escriben los miembros del circuito de revision y de los canales donde publicas decisiones.',
            enableLabel: 'Activar sugerencias', enableDesc: 'Permite usar el flujo `/suggest` del bot.',
            base: { label: 'Canal base', hint: 'Donde la comunidad deja sugerencias nuevas.' },
            logs: { label: 'Canal logs', hint: 'Revision interna del staff y trazabilidad.' },
            approved: { label: 'Canal aprobadas', hint: 'Publicacion de sugerencias aceptadas.' },
            rejected: { label: 'Canal rechazadas', hint: 'Publicacion de sugerencias rechazadas.' }
          },
          moderation: {
            title: 'Reglas de moderacion', desc: 'Condiciones que cambian la experiencia del usuario y la forma en que el staff cierra cada sugerencia.',
            cooldown: { label: 'Cooldown (min)', hint: 'Tiempo minimo entre sugerencias consecutivas por usuario.' },
            dm: { label: 'Enviar DM al resolver', desc: 'El usuario recibe el resultado por mensaje directo.' },
            reason: { label: 'Exigir razon para moderar', desc: 'Pide justificar aprobaciones o rechazos.' },
            anonymous: { label: 'Modo anonimo', desc: 'Oculta al autor en la publicacion inicial si el backend lo soporta.' }
          },
          notConfigured: 'No configurado'
        },
        modlogs: {
          onboarding: { eyebrow: 'Onboarding', title: 'Instala el bot para configurar modlogs', desc: 'Los eventos de moderacion dependen de que el bot pueda escuchar acciones reales dentro del servidor.' },
          main: { eyebrow: 'Modlogs', title: 'Canal de auditoria', desc: 'Deja una bitacora clara de moderacion para que el equipo pueda revisar que paso y cuando paso.', save: 'Guardar modlogs' },
          notices: { emptyTitle: 'Inventario vacio', emptyMessage: 'No llegaron canales del servidor, asi que no podemos validar el destino real de los modlogs.' },
          setup: {
            enableLabel: 'Modlogs activos', enableDesc: 'El bot escribira eventos de moderacion y cambios de miembros.',
            channelLabel: 'Canal', channelHint: 'Canal central donde quedara la auditoria.'
          },
          events: {
            title: 'Eventos registrados', desc: 'Elige exactamente que acciones del servidor deben quedar guardadas en la bitacora.',
            logBans: 'Baneos', logUnbans: 'Desbaneos', logKicks: 'Expulsiones', logMessageDelete: 'Mensajes eliminados',
            logMessageEdit: 'Mensajes editados', logRoleAdd: 'Roles agregados', logRoleRemove: 'Roles retirados',
            logNickname: 'Cambios de nickname', logJoins: 'Entradas', logLeaves: 'Salidas', logVoice: 'Eventos de voz'
          },
          notConfigured: 'No configurado',
          validation: { channel: 'Canal de modlogs' }
        },
        commands: {
          onboarding: { eyebrow: 'Onboarding', title: 'Instala el bot para gestionar comandos', desc: 'La configuracion de comandos depende del inventario real y de los limites en runtime del bot.' },
          main: { eyebrow: 'Comandos', title: 'Disponibilidad y limites', desc: 'Controla que comandos estan activos y como se rate-limitan en este servidor.', save: 'Guardar politicas de comandos' },
          notices: { emptyTitle: 'Inventario de comandos vacio', emptyMessage: 'Todavia no llegaron slash commands del bot. Puedes revisar la configuracion cargada, pero conviene re-sincronizar antes de cambiar listas u overrides.' },
          policy: {
            title: 'Politica general', desc: 'Define si el servidor usa ayuda simplificada y que capas de limitacion estan activas por defecto.',
            rateLimitEnabled: { label: 'Rate limit global', desc: 'Aplica una cuota comun a todos los comandos.' },
            rateLimitBypassAdmin: { label: 'Admins sin limite', desc: 'Deja a los administradores fuera del rate limit general.' },
            commandRateLimitEnabled: { label: 'Rate limit por comando', desc: 'Permite una cuota base para comandos individuales.' },
            simpleHelpMode: { label: 'Help simple', desc: 'Usa una ayuda mas directa para admins y miembros.' }
          },
          limits: {
            title: 'Limites base', desc: 'Los admins entienden mejor el comportamiento cuando la cuota general y la cuota por comando estan claramente separadas.',
            rateLimitWindowSeconds: 'Ventana global (seg)', rateLimitMaxActions: 'Max acciones global',
            commandRateLimitWindowSeconds: 'Ventana comando (seg)', commandRateLimitMaxActions: 'Max acciones comando'
          },
          disabled: { title: 'Comandos deshabilitados', desc: 'Checklist directo desde el inventario de comandos disponible.', empty: 'El bot todavia no ha publicado inventario de comandos para este guild.' },
          overrides: {
            title: 'Overrides por comando', desc: 'Ajustes finos sobre comandos concretos sin tocar el limite global.', add: 'Agregar override',
            command: 'Comando', max: 'Max', window: 'Ventana', active: 'Activo',
            empty: 'Todavia no hay overrides. Puedes agregar uno y asignarlo a cualquier comando publicado por el bot.'
          },
          validation: { duplicateOverride: 'Ya existe un override para: {{commands}}.', missingDisabled: '/{{command}} aparece deshabilitado, pero ya no existe en el inventario actual.', missingOverride: '/{{command}} tiene override guardado, pero el comando no existe en el inventario actual.' }
        },
        system: {
          onboarding: { eyebrow: 'Onboarding', title: 'Instala el bot para administrar el sistema', desc: 'El modo mantenimiento y los backups dependen del bridge real del bot sobre Mongo y Supabase.' },
          main: { eyebrow: 'Sistema', title: 'Mantenimiento y compatibilidad', desc: 'Ajustes globales del bot y lectura del estado tecnico para saber si puedes seguir configurando con seguridad.', save: 'Guardar estado del sistema' },
          maintenance: { label: 'Modo mantenimiento', desc: 'Detiene aperturas nuevas y deja visible el motivo configurado.', reasonLabel: 'Motivo', reasonHint: 'Explica el impacto esperado. Este texto es el que entendera el equipo cuando vea el bot en mantenimiento.' },
          sync: { bridge: 'Bridge', heartbeat: 'Ultimo heartbeat', inventory: 'Ultimo inventario', config: 'Ultima config aplicada', pendingMutations: 'Mutaciones pendientes', failedMutations: 'Mutaciones fallidas' },
          backups: {
            title: 'Backups y restore', desc: 'Crea una base segura antes de cambios grandes y restaura una version anterior si algo no queda como esperabas.',
            create: 'Crear backup', requesting: 'Solicitando...',
            item: { exported: 'Exportado {{time}}', created: 'Creado {{time}}', schema: 'Version de esquema {{version}}', id: 'Backup ID: {{id}}', restore: 'Restaurar' },
            empty: 'Aun no existe un backup inicial. Crear uno ahora te deja un punto seguro antes de tocar tickets, verificacion o automatizaciones delicadas.'
          },
          restore: {
            title: 'Restore seguro', desc: 'La restauracion crea una mutacion auditada. Pide confirmacion explicita para evitar restauraciones accidentales.',
            alertTitle: 'Vas a restaurar un snapshot anterior', alertDesc: 'Seleccion actual: {{source}}. Exportado {{time}}.',
            confirmTitle: 'Confirmacion', confirmDesc: 'Escribe {{keyword}} para solicitar la restauracion del backup {{id}}.', confirmLabel: 'Texto de confirmacion', keyword: 'RESTORE',
            cancel: 'Cancelar', submit: 'Solicitar restore',
            empty: 'Elige primero un backup del historial para abrir el flujo seguro de restauracion.'
          }
        },
        activity: {
          degraded: 'La linea de tiempo esta operando con cobertura parcial',
          states: {
            degraded: { eyebrow: 'Actividad degradada', title: 'La auditoria reciente no esta disponible por ahora' },
            empty: { title: 'La bitacora esta limpia', descInstalled: 'Cuando solicites cambios, se procesen tickets o el bot publique eventos, aqui aparecera la linea de tiempo operativa.', descPending: 'Invita el bot a este servidor y realiza la primera configuracion para empezar a construir la auditoria.' }
          },
          timeline: {
            eyebrow: 'Timeline', title: 'Actividad reciente del panel y del bot', desc: 'La linea de tiempo combina mutaciones de configuracion con eventos del sistema para que puedas seguir el estado del servidor de una sola pasada.', clearFilters: 'Limpiar filtros',
            empty: 'No hay elementos para la combinacion actual de filtros. Prueba con todas las fuentes o todas las severidades.',
            payload: 'Payload'
          },
          summary: {
            eyebrow: 'Resumen', title: 'Estado de la cola', desc: 'Lectura rapida para saber si la operacion esta tranquila o si hay que entrar a revisar.',
            pending: 'Mutaciones pendientes', failed: 'Mutaciones fallidas', events: 'Eventos recientes', visible: 'Timeline visible'
          },
          reading: {
            eyebrow: 'Lectura', title: 'Como interpretar esta actividad', desc: 'Pequenas guias para leer la timeline con menos friccion.',
            guide1: 'La timeline mezcla solicitudes de la dashboard con eventos confirmados por el sistema y los ordena por la fecha mas relevante.',
            guide2: 'Usa severidad critica o de atencion para encontrar rapido errores, atascos o cambios que aun esperan aplicacion.',
            guide3: 'Si quieres ver solo lo que salio del admin panel, filtra por mutaciones. Si buscas confirmaciones del bridge, filtra por eventos.'
          },
          filters: {
            source: { events: 'Solo eventos', mutations: 'Solo mutaciones', all: 'Todo' },
            severity: { success: 'Ok', warning: 'Atencion', danger: 'Critico', info: 'Info', neutral: 'Neutral', all: 'Todas' }
          }
        },
        analytics: {
          noComparison: 'No comparison',
          onboarding: { eyebrow: 'Installation', title: 'Analytics will activate when the bot is inside the server', desc: 'The bot needs to be installed and publish daily snapshots to guild_metrics_daily to show real usage, tickets, and stability.' },
          states: {
            degraded: { eyebrow: 'Degraded analytics', title: 'Daily telemetry is unavailable right now' },
            empty: { title: 'No daily telemetry yet', desc: 'The dashboard is ready to read trends. The bridge just needs to publish daily snapshots for this guild.' }
          },
          degraded: 'Analytics is operating with partial coverage',
          trends: {
            eyebrow: 'Analytics', title: 'Trends for the last 14 days', desc: 'A short read to detect growth, support load, and stability without leaving the dashboard.',
            emptySeries: 'Not enough data'
          },
          activity: {
            eyebrow: 'Activity', title: 'Commands and tickets per day', desc: 'Compare usage intensity and operational load across the visible window.',
            ariaChart: 'Daily comparison of commands and tickets over the last 14 days',
            tooltipCommands: '{{formattedCount}} commands',
            tooltipTickets: '{{opened}} opened / {{closed}} closed / {{open}} active open',
            legendCommands: 'Commands executed',
            legendTickets: 'Tickets and support load',
            mobileHint: 'On mobile, you can scroll horizontally to review the full 14 days.'
          },
          summary: {
            eyebrow: 'Quick read', title: 'Visible window summary', desc: 'Totals and averages to understand the general picture without checking every day.',
            labels: { commands: 'Total commands', ticketsOpened: 'Tickets opened', ticketsClosed: 'Tickets closed', maxMembers: 'Max active members', uptime: 'Average uptime', frt: 'Average FRT', slaBreaches: 'SLA breaches', modules: 'Detected modules' }
          },
          daily: {
            eyebrow: 'Snapshots', title: 'Daily detail', desc: 'Readable fallback to inspect each day when the general comparison is not enough.',
            modulesActive_one: '{{count}} active module', modulesActive_other: '{{count}} active modules', noModules: 'No modules reported that day',
            uptimeLabel: 'uptime', commands: 'Commands', tickets: 'Tickets', frt: 'FRT', sla: 'SLA', slaBreaches: '{{count}} breaches',
            empty: 'Not enough daily snapshots yet to show historical detail.'
          }
        },
        shell: {
          brandDescription: 'Task navigation to configure, review, and operate the server.',
          activeServer: 'Active server',
          selectServer: 'Select a server',
          serverReady: 'Inventory synced and ready to finish configuration.',
          serverPending: 'You can select it now and complete the installation later.',
          serverEmpty: 'Choose a manageable server to open configuration, activity, and tickets.',
          readyBadge: 'Ready',
          pendingBadge: 'Pending',
          guildSelector: 'Guild selector',
          guildsCount: '{{count}} guilds',
          taskNavigation: 'Task Navigation',
          session: 'Session',
          syncingInventory: 'Syncing inventory...',
          panelReady: 'Panel ready to operate',
          lastHeartbeat: 'Last heartbeat {{time}}.',
          logout: 'Log out',
          skipToContent: 'Skip to dashboard content',
          openMenuAria: 'Open dashboard navigation',
          closeMenuAria: 'Close dashboard navigation',
          navAria: 'Dashboard navigation',
          headerDescription: 'Guided control center to finish configuration, detect blocks, and know exactly what is next without guessing which module to enter.',
          membersCount: '{{count}} members',
          planBadge: 'Plan {{tier}}',
          heartbeatBadge: 'Last heartbeat {{time}}',
          focusServer: 'Server in focus',
          focusReadyInfo: 'This server already has the bot and can load a full snapshot.',
          focusPendingInfo: 'This server still needs installation or a full synchronization.',
          defaultUser: 'Administrator',
          lastSync: 'Last sync {{time}}',
          bridgeHealth: 'Bridge health',
          bridgeNoDetails: 'No additional details reported by the bridge.',
          syncActivity: 'Sync activity',
          configSync: 'Config {{time}}',
          inventorySync: 'Inventory {{time}}. Queue {{pending}} pending and {{failed}} failed.',
          syncFailed: 'Re-sync could not be completed',
          reviewNeeded: 'There are changes that require review. Go back to Home to see which task needs attention before applying more changes.',
          statusBotActive: 'Bot active in server',
          statusBotMissing: 'Bot not installed',
          statusInQueue: '{{count}} in queue',
          statusFailed: '{{count}} failed',
          inviteSuffix: ' - invite',
          readySuffix: ' - ready',
          errorBoundary: {
            eyebrow: 'Module error',
            title: 'This module failed to render'
          },
          configSaveError: 'Could not register the change request.',
          sectionStatus: {
            active: 'Active',
            basic: 'Basic',
            needsAttention: 'Needs review',
            notConfigured: 'Not configured'
          },
          defaultServerAlt: 'Server',
          defaultUserAlt: 'User'
        },
        actions: {
          retryValidation: 'Retry validation',
          restartDiscord: 'Start Discord login again',
          retryLoad: 'Retry load',
          resyncAccess: 'Re-sync access',
          goToAvailableGuild: 'Go to available server',
          retrySnapshot: 'Retry snapshot',
          resyncServer: 'Re-sync server',
          resyncNow: 'Re-sync now',
          syncingNow: 'Syncing...',
          switchAccount: 'Switch account',
        },
        inviteBot: {
          helper: 'This server does not have the bot installed yet.',
          cta: 'Invite bot to this server',
        },
        errors: {
          authValidation: 'The dashboard session could not be validated.',
          guildsLoad: 'Try syncing again or review the Supabase configuration.',
          snapshotLoad: 'Review tables, RLS policies and the bot bridge.',
        },
        states: {
          authLoading: {
            eyebrow: 'Secure access',
            title: 'Validating dashboard session',
            description: 'We are checking your Supabase session before loading servers, permissions and operational state.',
            pill: 'Checking access',
          },
          authError: {
            eyebrow: 'Access unavailable',
            title: 'We could not validate your session',
          },
          guildsLoading: {
            eyebrow: 'Initial sync',
            title: 'Loading your manageable servers',
            description: 'We are reading synced access to prepare guild selection, health state and the dashboard snapshot.',
            pill: 'Preparing shell',
          },
          guildsError: {
            eyebrow: 'Data error',
            title: 'We could not load your servers',
          },
          emptyGuilds: {
            eyebrow: 'No servers',
            title: 'We did not find manageable guilds for this account',
            description: 'Make sure you have Administrator or Manage Server permissions in Discord, then sync access again.',
          },
          invalidGuild: {
            eyebrow: 'Invalid server',
            title: 'That guild is no longer available for this session',
            description:
              'The requested server ({{guildId}}) does not appear in your current manageable guilds. Access, sync status or the shared URL may have changed.',
          },
          noSelectedGuild: {
            eyebrow: 'Selection required',
            title: 'Choose a server to continue',
            description:
              'As soon as you choose a guild, we will load applied configuration, inventory, audit trail and related analytics.',
          },
          snapshotError: {
            eyebrow: 'Module unavailable',
            title: 'We could not load this server',
          },
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
        docs: 'Docs',
        status: 'Status',
        support: 'Soporte',
        primaryCta: 'Invitar bot',
        secondaryCta: 'Abrir dashboard',
        mobilePrimaryCta: 'Invitar a Discord',
        mobileSecondaryCta: 'Abrir dashboard',
        openMenu: 'Abrir menú de navegación',
        closeMenu: 'Cerrar menú de navegación',
        homeAria: 'Ir al inicio',
        primaryAria: 'Navegación principal',
      },
      languageSelector: {
        triggerLabel: 'Cambiar idioma',
        menuLabel: 'Selector de idioma',
      },
      app: {
        loadingTitle: 'Cargando experiencia',
        loadingDescription: 'Preparando el dashboard y la navegación.',
      },
      landing: {
        skipToContent: 'Saltar al contenido',
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
        highlightsAria: 'Aspectos destacados del producto',
      },
      docsSection: {
        eyebrow: 'Recursos operativos',
        title: 'Todo Lo Necesario',
        titleAccent: 'Para Evaluar Y Lanzar',
        description:
          'TON618 no se queda en una landing cuidada: muestra valor, abre el dashboard y deja visibles los recursos que un equipo serio espera antes de adoptar el producto.',
        cards: {
          docs: {
            title: 'Documentación operativa',
            description:
              'Guía de setup, módulos y notas operativas para pasar de la instalación al uso real sin depender de conocimiento tribal.',
            ctaExternal: 'Abrir docs',
            ctaFallback: 'Revisar ruta de lanzamiento',
          },
          dashboard: {
            title: 'Dashboard listo para staff',
            description:
              'Abre configuración, tickets y seguimiento operativo desde un panel que ya degrada con gracia cuando una fuente secundaria falla.',
            cta: 'Abrir dashboard',
          },
          support: {
            title: 'Ruta de soporte y confianza',
            description:
              'Soporte, contacto y guía de lanzamiento siguen visibles para reducir fricción durante evaluación, onboarding y resolución de incidencias.',
            ctaExternal: 'Abrir soporte',
            ctaFallback: 'Ir al CTA de lanzamiento',
          },
        },
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
          configFallback: 'La telemetría en vivo no está configurada en este entorno.',
          networkFallback: 'La telemetría en vivo no pudo alcanzarse desde este entorno.',
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
      dashboardAuth: {
        pageTitle: 'Auth',
        oauthLabel: 'Discord OAuth',
        pageHeading: 'Acceso a {{name}}',
        pageDescription:
          'Estamos validando la sesión segura y sincronizando el acceso a servidores sin alterar tu configuración actual.',
        errorEyebrow: 'No se completó el acceso',
        errorTitle: 'Necesitamos una acción para continuar.',
        retrySync: 'Reintentar sincronización',
        restartLogin: 'Reiniciar login con Discord',
        successEyebrowRedirecting: 'Finalizando acceso',
        successEyebrowLoading: 'Acceso en progreso',
        syncingDescription:
          'Estamos dejando lista la cuenta autenticada para entrar al dashboard con tus guilds administrables ya resueltos.',
        holdingContextDescription:
          'El callback mantiene el contexto del login para que no pierdas el servidor que querías abrir.',
        authCard: {
          missingConfigEyebrow: 'Configuración requerida',
          missingConfigTitle: 'Falta conectar Supabase',
          missingConfigDescription:
            'Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para activar el login con Discord, sincronizar servidores y guardar configuraciones del bot.',
          protectedAccess: 'Acceso protegido',
          cardTitle: 'Inicia sesión para entrar al panel de control',
          cardDescription:
            'Accede con Discord para validar tu sesión, sincronizar guilds administrables y operar el dashboard con permisos reales.',
          loadingCta: 'Conectando...',
          cta: 'Continuar con Discord',
          trustLine: 'Cifrado seguro - Sincronización de servidores - Acceso con Supabase',
          trustFooter: 'TON618 mantiene el branding y el flujo oficial de Discord OAuth',
        },
        state: {
          preparing: 'Preparando autenticación con Discord...',
          exchanging: 'Intercambiando código por sesión segura...',
          syncing: 'Sincronizando servidores administrables con Supabase...',
          redirectingWithGuilds: 'Listo. Redirigiendo al panel con tus servidores sincronizados...',
          redirectingWithoutGuilds: 'Listo. Redirigiendo al dashboard para continuar con la cuenta autenticada...',
          retryingSync: 'Reintentando sincronización de servidores...',
          secureAccessFailed: 'El acceso seguro no pudo completarse.',
        },
        errors: {
          sessionValidationFailed: 'No se pudo validar la sesión actual del dashboard.',
          userLoadFailed: 'No se pudo cargar el usuario autenticado del dashboard.',
          startLoginFailed: 'No se pudo iniciar el acceso con Discord para el dashboard.',
          signOutFailed: 'No se pudo cerrar la sesión del dashboard.',
          restartLoginFailed: 'No se pudo reiniciar el login.',
          restartLoginAction: 'No se pudo reiniciar el login con Discord.',
          missingSessionAfterCallback:
            'No hay una sesión válida del dashboard después del callback. Vuelve a iniciar sesión desde el dashboard.',
          missingProviderToken:
            'Discord no devolvió provider_token. Repite el login para sincronizar servidores.',
          invalidSession:
            'La sesión del dashboard es inválida o expiró. Reinicia el login para continuar.',
          callbackFailed: 'No se pudo completar el callback del dashboard.',
          missingOauthCode: 'No llegó un código OAuth válido al callback.',
          syncMissingToken: 'No llegó un provider token válido para sincronizar los servidores.',
          syncEmptyResponse: 'La función sync-discord-guilds respondió vacío.',
          syncFailed: 'No se pudieron sincronizar los servidores administrables con Supabase.',
          exchangeFailed: 'No se pudo intercambiar el código OAuth con Supabase.',
          exchangeTimeout:
            'El intercambio OAuth tardó demasiado ({{seconds}}s). Revisa la red, Supabase Auth y la configuración de redirect URLs.',
          syncTimeout:
            'La sincronización inicial de servidores tardó demasiado ({{seconds}}s). Revisa la función sync-discord-guilds, la red y el estado de Supabase.',
        },
      },
      dashboard: {
        pageTitle: 'Dashboard',
        metaDescription: 'Dashboard profesional para administrar configuraciones, actividad y analíticas de tu bot de Discord.',
        inbox: {
          workflow: {
            new: 'Nuevo',
            triage: 'Triage',
            waitingStaff: 'Esperando staff',
            waitingUser: 'Esperando usuario',
            escalated: 'Escalado',
            resolved: 'Resuelto',
            closed: 'Cerrado'
          },
          filters: {
            all: 'Todos',
            open: 'Abiertos',
            closed: 'Cerrados',
            urgent: 'Urgente',
            high: 'Alta',
            normal: 'Normal',
            low: 'Baja',
            breached: 'Incumplido',
            warning: 'Por vencer',
            healthy: 'Saludable',
            paused: 'Pausado',
            resolved: 'Resuelto',
            allQueue: 'Toda la cola',
            unclaimed: 'Sin reclamar',
            claimed: 'Reclamados',
            unassigned: 'Sin asignar',
            assigned: 'Asignados',
            allCategories: 'Todas las categorias'
          },
          visibility: {
            internal: 'Interno',
            public: 'Cliente',
            system: 'Sistema'
          },
          actions: {
            claim: 'reclamar el ticket',
            unclaim: 'liberar el ticket',
            assignSelf: 'asignarte el ticket',
            unassign: 'desasignar el ticket',
            setStatus: 'actualizar el estado',
            close: 'cerrar el ticket',
            reopen: 'reabrir el ticket',
            addNote: 'guardar la nota interna',
            addTag: 'agregar el tag',
            removeTag: 'remover el tag',
            replyCustomer: 'enviar la respuesta',
            postMacro: 'publicar la macro',
            setPriority: 'actualizar la prioridad',
            fallback: 'ejecutar la accion'
          }
        },
        overview: {
          status: { active: 'Listo', basic: 'En progreso', needsAttention: 'Revisar', pending: 'Pendiente' },
          degraded: 'La portada sigue disponible con datos parciales',
          center: { eyebrow: 'Overview', title: 'Centro operativo del servidor', desc: 'La portada resume salud tecnica, soporte en curso y que tarea tiene mas impacto para el admin en este momento.' },
          nextStep: { label: 'Prioridad actual', ready: 'La ruta base ya esta cubierta', emptyDesc: 'La portada no detecta pasos criticos pendientes en el checklist principal.', emptySummary: 'Desde aqui puedes pasar a soporte, analitica o refinamiento de modulos.', count: '{{completed}}/{{total}} pasos listos', allDone: 'Todo al dia', cta: 'Abrir tarea recomendada', toSupport: 'Ir a soporte activo', toActivity: 'Revisar actividad reciente' },
          quickList: { bridge: { label: 'Bridge', ok: 'Bridge operativo.' }, support: { label: 'Soporte', open: '{{count}} abiertos', breached: '{{breached}} SLA vencido(s). {{warning}} en alerta.', warning: '{{warning}} en alerta.', clean: 'Sin vencimientos.' }, backups: { label: 'Backups', pending: 'Pendiente', recent: 'Backup reciente.', empty: 'Crea el primer backup.' } },
          summary: { label: 'Lectura de admin', fallbackTitle: 'El servidor esta estable y con una siguiente accion clara.', fallbackDesc: 'Usa la portada para entrar rapido a soporte, sistema o al modulo que aun no este cerrado.' },
          checklist: { eyebrow: 'Checklist y acciones', title: 'Que hacer despues', desc: 'El checklist mantiene la ruta base y los quick actions recortan la distancia hacia el problema mas urgente.', ctaReady: 'Listo' },
          actions: { label: 'Quick actions', title: 'Entradas directas para operar', now: 'Ahora' },
          alerts: { label: 'Alertas operativas', title: 'Lo que conviene no dejar para despues', emptyTitle: 'No hay alertas criticas visibles.', emptyDesc: 'Puedes pasar a optimizar modulos o revisar tendencias de uso.' },
          coverage: { eyebrow: 'Cobertura', title: 'Estado por modulo', desc: 'Cada bloque resume que tan operativa esta cada area y te deja entrar directamente donde falta cierre.', groups: { attention: { title: 'Revisar ahora', desc: 'Impacta soporte, salud o consistencia del servidor.', empty: 'No hay modulos exigiendo revision inmediata.' }, progress: { title: 'En progreso', desc: 'Ya tienen base, pero todavia no conviene darlos por cerrados.', empty: 'No hay modulos a medio camino.' }, ready: { title: 'Operativos', desc: 'La configuracion actual ya permite usarlos con tranquilidad.', empty: 'Todavia no hay modulos cerrados por completo.' } } },
          pulse: { bridgeTitle: 'Sincronizacion y bridge', connected: 'Sistema conectado al servidor', pending: 'Instalacion pendiente', bridgeDesc: 'El bridge traducira aqui su estado tecnico a senales faciles de seguir.', syncFacts: { bridge: 'Bridge', heartbeat: 'Heartbeat', inventory: 'Inventario', config: 'Config aplicada' }, details: { changes: { label: 'Cambios pendientes', empty: 'No hay cola pendiente.' }, support: { label: 'Tickets abiertos', empty: 'Sin carga de soporte actual.' }, backup: { label: 'Ultimo backup', none: 'No existe aun', ready: 'Ya puedes volver atras si hace falta.', create: 'Crea uno antes de cambios delicados.' }, base: { label: 'Checklist base', none: 'No quedan tareas base pendientes.' } } },
          pulseStats: { title: 'Pulso del servidor', desc: 'Lectura rapida del tamano, la telemetria visible y la cobertura del panel.', facts: { members: 'Miembros', noData: 'Sin dato', snapshot: 'Ultimo snapshot', pending: 'Pendiente', events: 'Eventos recientes', tickets: 'Tickets abiertos' }, info: 'La ultima ventana visible muestra {{commands}} comandos y {{members}} miembros activos en el snapshot mas reciente.' },
          activity: { title: 'Actividad reciente', desc: 'Sirve para validar si los cambios y procesos del bot estan dejando huella operativa.', empty: 'Cuando el bot publique eventos de cambios, backups o tickets, apareceran aqui como senales recientes.' },
          notes: { title: 'Notas de operacion', desc: 'Contexto rapido para saber si la salud visible coincide con el estado esperado.', empty: 'No hay notas adicionales. El dashboard no detecta tensiones entre bridge, tickets y backups.' }
        },
        tickets: {
          onboarding: { eyebrow: 'Onboarding', title: 'Instala el bot para activar configuracion de tickets', desc: 'En cuanto el bot este dentro podremos aplicar limites, SLA, autoasignacion y modo incidente al flujo real de tickets.' },
          main: { eyebrow: 'Tickets y SLA', title: 'Operacion del sistema de tickets', desc: 'Aqui decides cuanta carga soporta el sistema, cuanto tarda en pedir ayuda y cuando debe escalar o reportar automaticamente.', save: 'Guardar operacion de tickets' },
          inventoryNotice: { title: 'Inventario operativo incompleto', message: 'Faltan canales, roles o categorias sincronizadas. Puedes revisar la configuracion, pero conviene re-sincronizar antes de cerrar escalados o incidentes.' },
          capacity: { title: 'Capacidad y tiempos', desc: 'Estos valores marcan cuanto trabajo soporta la cola, cuanto debe esperar el usuario y cuando el sistema considera que un ticket necesita ayuda.', maxTickets: 'Max tickets por usuario', globalLimit: 'Limite global', cooldown: 'Cooldown (min)', minDays: 'Minimo dias en servidor', autoClose: 'Auto close (min)', slaMinutes: 'SLA alerta (min)', smartPing: 'Smart ping (min)', slaEscalation: 'Escalado SLA (min)' },
          automation: { title: 'Automatizaciones y experiencia', desc: 'Auto-assign, incident mode, reportes y mensajes directos se gestionan por separado para que el admin entienda que esta activando.', autoAssign: { label: 'Autoasignacion', desc: 'Asigna tickets nuevos automaticamente.' }, requireOnline: { label: 'Solo online', desc: 'Evita asignar staff desconectado.' }, respectAway: { label: 'Respeta ausentes', desc: 'No asigna a miembros marcados como away.' }, dailyReport: { label: 'Reporte diario SLA', desc: 'Envia un resumen diario de tickets incumplidos o en riesgo.' }, incidentMode: { label: 'Modo incidente', desc: 'Pausa categorias concretas y muestra un mensaje especial.' }, dmOpen: { label: 'DM al abrir', desc: 'Confirma al usuario que el ticket fue creado.' }, dmClose: { label: 'DM al cerrar', desc: 'Avisa cuando el ticket se cierra.' }, dmTranscripts: { label: 'Enviar transcripts', desc: 'Comparte transcripciones por DM cuando aplique.' }, dmAlerts: { label: 'DM alertas', desc: 'Permite mensajes directos relacionados con SLA o eventos.' }, slaEscalation: { label: 'Escalado automatico', desc: 'Escala tickets vencidos a un rol o canal adicional.' } },
          escalation: { title: 'Escalado y reportes', desc: 'Roles y canales usados cuando un ticket necesita visibilidad extra o seguimiento diario.', roleLabel: 'Rol escalado', channelLabel: 'Canal escalado', reportLabel: 'Canal reporte diario', incidentLabel: 'Mensaje modo incidente', notConfigured: 'No configurado', useFallback: 'Usar fallback del bot' },
          advanced: { title: 'Reglas avanzadas', desc: 'Ajustes finos para cambiar SLA o escalado segun prioridad y categoria sin tocar la base general.', slaOverrides: 'Overrides SLA por prioridad', pausedCategories: 'Categorias pausadas en incidente', noCategories: 'El inventario todavia no ha publicado categorias de tickets configurables.', missingCategory: 'La categoria pausada {{id}} ya no existe en el inventario.' },
          priority: { low: 'Baja', normal: 'Normal', high: 'Alta', urgent: 'Urgente' }
        },
        general: {
          onboarding: { eyebrow: 'Instalacion requerida', title: 'Invita el bot antes de editar configuraciones', desc: 'Cuando el bot este instalado en este servidor podremos mantener idioma, invocacion y preferencias persistentes del panel.' },
          main: { eyebrow: 'General', title: 'Configuracion esencial del servidor', desc: 'Define idioma, comandos y reglas base para que el panel y el bot se entiendan desde el primer minuto.', save: 'Guardar base operativa' },
          locale: { title: 'Idioma y operacion', desc: 'Estos ajustes definen el tono base del bot, la zona horaria que usaran los reportes y como invocan comandos los miembros.', language: { label: 'Idioma base', hint: 'Este idioma se usa en mensajes, paneles y respuestas principales del bot.', es: 'Espanol', en: 'English' }, timezone: { label: 'Zona horaria', hint: 'Afecta horarios visibles, reportes y automatizaciones programadas.' }, commandMode: { label: 'Modo de comandos', hint: 'Elige si el usuario invoca al bot por mencion o con un prefijo corto.', mention: 'Mencion del bot', prefix: 'Prefijo' }, prefix: { label: 'Prefijo', hint: 'Solo se usa si activas el modo por prefijo.' } },
          moderation: { title: 'Preset general de moderacion', desc: 'Sirve como intencion operativa para el backend y deja claro que nivel de intervencion espera el staff.', relaxed: { label: 'Relajado', desc: 'Mas flexible y menos intervencion automatica.' }, balanced: { label: 'Balanceado', desc: 'Equilibrio entre proteccion y comodidad.' }, strict: { label: 'Estricto', desc: 'Mas disciplina y menos tolerancia al ruido.' } },
          prefs: { eyebrow: 'Panel', title: 'Preferencias del equipo', desc: 'Ajustes de presentacion para que el equipo vuelva directo a la tarea que mas usa.', defaultSection: 'Pantalla inicial', compactMode: { label: 'Modo compacto', desc: 'Reduce densidad visual para sesiones largas de moderacion.' }, advancedCards: { label: 'Tarjetas avanzadas', desc: 'Muestra contexto extra, recomendaciones y salud operativa ampliada.' }, notice: 'Los cambios se envian a una cola auditada. El bot los aplica y confirma despues en la vista Resumen.' },
          sections: { overview: 'Inicio', inbox: 'Bandeja de soporte', general: 'Configuracion inicial', server_roles: 'Roles y canales', tickets: 'Tickets', verification: 'Verificacion de acceso', welcome: 'Bienvenida', suggestions: 'Sugerencias de la comunidad', modlogs: 'Registro de moderacion', commands: 'Comandos', system: 'Sistema del bot', activity: 'Actividad reciente', analytics: 'Analitica' }
        },
        analytics: {
          noComparison: 'Sin comparacion',
          onboarding: { eyebrow: 'Instalacion', title: 'La analitica se activara cuando el bot este dentro del servidor', desc: 'El bot necesita instalarse y publicar snapshots diarios en guild_metrics_daily para mostrar uso real, tickets y estabilidad.' },
          states: {
            degraded: { eyebrow: 'Analitica degradada', title: 'La telemetria diaria no esta disponible por ahora' },
            empty: { title: 'Aun no hay telemetria diaria', desc: 'La dashboard ya esta preparada para leer tendencias. Solo falta que el bridge publique snapshots diarios para este guild.' }
          },
          degraded: 'La analitica se esta mostrando con cobertura parcial',
          trends: {
            eyebrow: 'Analitica', title: 'Tendencias de los ultimos 14 dias', desc: 'Una lectura corta para detectar crecimiento, carga de soporte y estabilidad sin salir del dashboard.',
            emptySeries: 'Sin serie suficiente'
          },
          activity: {
            eyebrow: 'Actividad', title: 'Comandos y tickets por dia', desc: 'Compara intensidad de uso y carga operativa a lo largo de la ventana visible.',
            ariaChart: 'Comparativa diaria de comandos y tickets de los ultimos 14 dias',
            tooltipCommands: '{{formattedCount}} comandos',
            tooltipTickets: '{{opened}} abiertos / {{closed}} cerrados / {{open}} abiertos activos',
            legendCommands: 'Comandos ejecutados',
            legendTickets: 'Tickets y carga de soporte',
            mobileHint: 'En movil puedes desplazarte horizontalmente para revisar los 14 dias completos.'
          },
          summary: {
            eyebrow: 'Lectura rapida', title: 'Resumen de la ventana visible', desc: 'Totales y promedios para entender la foto general sin revisar cada dia.',
            labels: { commands: 'Comandos acumulados', ticketsOpened: 'Tickets abiertos', ticketsClosed: 'Tickets cerrados', maxMembers: 'Miembros activos max', uptime: 'Uptime promedio', frt: 'FRT promedio', slaBreaches: 'Brechas SLA', modules: 'Modulos detectados' }
          },
          daily: {
            eyebrow: 'Snapshots', title: 'Detalle diario', desc: 'Fallback legible para inspeccionar cada dia cuando la comparativa general no basta.',
            modulesActive_one: '{{count}} modulo activo', modulesActive_other: '{{count}} modulos activos', noModules: 'Sin modulos reportados ese dia',
            uptimeLabel: 'uptime', commands: 'Comandos', tickets: 'Tickets', frt: 'FRT', sla: 'SLA', slaBreaches: '{{count}} brechas',
            empty: 'Todavia no hay snapshots diarios suficientes para mostrar detalle historico.'
          }
        },
        shell: {
          brandDescription: 'Navegacion por tareas para configurar, revisar y operar el servidor.',
          activeServer: 'Servidor activo',
          selectServer: 'Selecciona un servidor',
          serverReady: 'Inventario sincronizado y listo para terminar la configuracion.',
          serverPending: 'Puedes elegirlo ahora y completar la instalacion despues.',
          serverEmpty: 'Elige un servidor administrable para abrir configuracion, actividad y tickets.',
          readyBadge: 'Listo',
          pendingBadge: 'Pendiente',
          guildSelector: 'Selector de guild',
          guildsCount: '{{count}} guilds',
          taskNavigation: 'Navegacion por tareas',
          session: 'Sesion',
          syncingInventory: 'Actualizando inventario...',
          panelReady: 'Panel listo para operar',
          lastHeartbeat: 'Ultimo heartbeat {{time}}.',
          logout: 'Cerrar sesion',
          skipToContent: 'Saltar al contenido del dashboard',
          openMenuAria: 'Abrir navegacion del dashboard',
          closeMenuAria: 'Cerrar navegacion del dashboard',
          navAria: 'Navegacion del dashboard',
          headerDescription: 'Centro de control guiado para terminar configuracion, detectar bloqueos y saber exactamente que sigue sin tener que adivinar a que modulo entrar.',
          membersCount: '{{count}} miembros',
          planBadge: 'Plan {{tier}}',
          heartbeatBadge: 'Ultimo heartbeat {{time}}',
          focusServer: 'Servidor en foco',
          focusReadyInfo: 'Este servidor ya tiene el bot y puede cargar snapshot completo.',
          focusPendingInfo: 'Este servidor aun necesita instalacion o una sincronizacion completa.',
          defaultUser: 'Administrador',
          lastSync: 'Ultima sincronizacion {{time}}',
          bridgeHealth: 'Salud del bridge',
          bridgeNoDetails: 'Sin detalles adicionales reportados por el bridge.',
          syncActivity: 'Actividad de sincronizacion',
          configSync: 'Config {{time}}',
          inventorySync: 'Inventario {{time}}. Cola {{pending}} pendientes y {{failed}} fallidas.',
          syncFailed: 'La re-sincronizacion no pudo completarse',
          reviewNeeded: 'Hay cambios que requieren revision. Vuelve a Inicio para ver que tarea necesita atencion antes de seguir aplicando cambios.',
          statusBotActive: 'Bot activo en el servidor',
          statusBotMissing: 'Bot sin instalar',
          statusInQueue: '{{count}} en cola',
          statusFailed: '{{count}} fallidas',
          inviteSuffix: ' - invitar',
          readySuffix: ' - listo',
          errorBoundary: {
            eyebrow: 'Error del modulo',
            title: 'Este modulo fallo al renderizar'
          },
          configSaveError: 'No se pudo registrar la solicitud de cambio.',
          sectionStatus: {
            active: 'Activo',
            basic: 'Basico',
            needsAttention: 'Requiere revision',
            notConfigured: 'No configurado'
          },
          defaultServerAlt: 'Servidor',
          defaultUserAlt: 'Usuario'
        },
        actions: {
          retryValidation: 'Reintentar validación',
          restartDiscord: 'Volver a iniciar con Discord',
          retryLoad: 'Reintentar carga',
          resyncAccess: 'Re-sincronizar acceso',
          goToAvailableGuild: 'Ir al servidor disponible',
          retrySnapshot: 'Reintentar snapshot',
          resyncServer: 'Re-sincronizar servidor',
          resyncNow: 'Re-sincronizar ahora',
          syncingNow: 'Sincronizando...',
          switchAccount: 'Cambiar de cuenta',
        },
        inviteBot: {
          helper: 'Este servidor aún no tiene el bot instalado.',
          cta: 'Invitar bot a este servidor',
        },
        errors: {
          authValidation: 'No se pudo validar la sesión del dashboard.',
          guildsLoad: 'Intenta sincronizar otra vez o revisa la configuración de Supabase.',
          snapshotLoad: 'Revisa tablas, políticas RLS y el bridge del bot.',
        },
        states: {
          authLoading: {
            eyebrow: 'Acceso seguro',
            title: 'Validando sesión del dashboard',
            description: 'Estamos comprobando tu sesión con Supabase antes de cargar servidores, permisos y estado operativo.',
            pill: 'Verificando acceso',
          },
          authError: {
            eyebrow: 'Acceso no disponible',
            title: 'No pudimos validar tu sesión',
          },
          guildsLoading: {
            eyebrow: 'Sincronización inicial',
            title: 'Cargando tus servidores administrables',
            description: 'Estamos consultando el acceso ya sincronizado para preparar el selector de guild, el estado de salud y el snapshot del panel.',
            pill: 'Preparando shell',
          },
          guildsError: {
            eyebrow: 'Error de datos',
            title: 'No pudimos cargar tus servidores',
          },
          emptyGuilds: {
            eyebrow: 'Sin servidores',
            title: 'No encontramos guilds administrables para esta cuenta',
            description: 'Asegúrate de tener permisos de administración o Manage Server en Discord y vuelve a sincronizar el acceso.',
          },
          invalidGuild: {
            eyebrow: 'Servidor inválido',
            title: 'Ese guild ya no está disponible para esta sesión',
            description:
              'El servidor solicitado ({{guildId}}) no aparece entre tus guilds administrables actuales. Puede haber cambiado el acceso, la sincronización o la URL compartida.',
          },
          noSelectedGuild: {
            eyebrow: 'Selección requerida',
            title: 'Escoge un servidor para continuar',
            description:
              'En cuanto elijas un guild, cargaremos configuración aplicada, inventario, auditoría y analíticas asociadas.',
          },
          snapshotError: {
            eyebrow: 'Módulo no disponible',
            title: 'No pudimos cargar este servidor',
          },
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
  supportedLngs: ['en', 'es'],
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  cleanCode: true,
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
