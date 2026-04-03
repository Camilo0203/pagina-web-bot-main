import { useEffect, useMemo } from 'react';
import { CreditCard, ExternalLink, RefreshCcw, ShieldAlert, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { config } from '../../config';
import StateCard from '../components/StateCard';
import {
  useCreateCheckoutSession,
  useCreateCustomerPortalSession,
  useGuildBilling,
} from '../hooks/useDashboardData';
import { formatDateTime } from '../utils';
import type { DashboardGuild, GuildBillingEntitlement } from '../types';

interface BillingModuleProps {
  guild: DashboardGuild;
  isGuildAccessFresh: boolean;
  onSyncGuildAccess: () => void;
  isSyncing: boolean;
}

const defaultEntitlement: GuildBillingEntitlement = {
  guildId: '',
  effectivePlan: 'free',
  planSource: 'free',
  subscriptionStatus: null,
  billingInterval: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  supporterEnabled: false,
  supporterExpiresAt: null,
  updatedAt: null,
};

function resolveStatusTone(status: string | null) {
  if (!status) {
    return 'border-white/10 bg-white/[0.03] text-slate-300';
  }

  if (['active', 'trialing'].includes(status)) {
    return 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200';
  }

  if (status === 'past_due') {
    return 'border-amber-400/25 bg-amber-400/10 text-amber-100';
  }

  return 'border-rose-400/25 bg-rose-400/10 text-rose-100';
}

export default function BillingModule({
  guild,
  isGuildAccessFresh,
  onSyncGuildAccess,
  isSyncing,
}: BillingModuleProps) {
  const [searchParams] = useSearchParams();
  const isSpanish = typeof document !== 'undefined'
    ? document.documentElement.lang.startsWith('es')
    : true;
  const billingQuery = useGuildBilling(guild.guildId, isGuildAccessFresh);
  const checkoutMutation = useCreateCheckoutSession(guild.guildId);
  const portalMutation = useCreateCustomerPortalSession(guild.guildId);
  const checkoutStatus = searchParams.get('checkout');

  const copy = useMemo(() => (
    isSpanish
      ? {
          eyebrow: 'Billing beta',
          title: 'Planes, pagos y activacion por servidor',
          description: 'TON618 Pro se activa por servidor. Compra desde aqui, valida la suscripcion y deja al bot reflejar el entitlement.',
          staleTitle: 'Tu acceso ya vencio y necesita resync',
          staleDescription: 'Para consultar billing o abrir checkout, el dashboard exige una sincronizacion fresca de Discord de las ultimas 24 horas.',
          retryBilling: 'Reintentar billing',
          refreshAccess: 'Re-sincronizar acceso',
          currentPlan: 'Plan efectivo',
          planSource: 'Fuente',
          subscription: 'Suscripcion',
          renewal: 'Renovacion',
          updatedAt: 'Ultima actualizacion',
          free: 'Free',
          pro: 'Pro',
          enterprise: 'Enterprise',
          override: 'Override manual',
          stripe: 'Stripe',
          sourceFree: 'Free',
          noSubscription: 'Sin suscripcion activa',
          month: 'Mensual',
          year: 'Anual',
          upgradeMonthly: 'Subir a Pro mensual',
          upgradeYearly: 'Subir a Pro anual',
          manageBilling: 'Administrar billing',
          contactSales: 'Contactar ventas',
          checkoutSuccess: 'Pago recibido. Estamos esperando la activacion de Pro en este servidor.',
          checkoutCancelled: 'El checkout se cancelo. No se aplicaron cambios de plan.',
          activated: 'Pro ya esta activo para este servidor.',
          supporter: 'Supporter',
          supporterEnabled: 'Reconocimiento supporter activo',
          supporterDisabled: 'Sin reconocimiento supporter',
          subscriptionPending: 'Abriendo checkout...',
          portalPending: 'Abriendo portal...',
          entitlementUnavailable: 'Todavia no hay un registro comercial para este servidor. Puedes arrancar desde Free o crear la suscripcion aqui.',
          renewalCancelled: 'Cancelara al final del periodo actual',
          billingStatus: 'Estado',
          installBot: 'Instala el bot primero',
          installBotDescription: 'El checkout se habilita solo para servidores donde TON618 ya esta instalado.',
        }
      : {
          eyebrow: 'Billing beta',
          title: 'Plans, payments and per-server activation',
          description: 'TON618 Pro activates per guild. Purchase here, verify the subscription and let the bot project the entitlement.',
          staleTitle: 'Your access is stale and needs a re-sync',
          staleDescription: 'Billing and checkout require a fresh Discord access sync from the last 24 hours.',
          retryBilling: 'Retry billing',
          refreshAccess: 'Re-sync access',
          currentPlan: 'Effective plan',
          planSource: 'Source',
          subscription: 'Subscription',
          renewal: 'Renewal',
          updatedAt: 'Last updated',
          free: 'Free',
          pro: 'Pro',
          enterprise: 'Enterprise',
          override: 'Manual override',
          stripe: 'Stripe',
          sourceFree: 'Free',
          noSubscription: 'No active subscription',
          month: 'Monthly',
          year: 'Yearly',
          upgradeMonthly: 'Upgrade to Pro monthly',
          upgradeYearly: 'Upgrade to Pro yearly',
          manageBilling: 'Manage billing',
          contactSales: 'Contact sales',
          checkoutSuccess: 'Payment received. Waiting for Pro activation on this guild.',
          checkoutCancelled: 'Checkout was cancelled. No plan changes were applied.',
          activated: 'Pro is already active for this guild.',
          supporter: 'Supporter',
          supporterEnabled: 'Supporter recognition enabled',
          supporterDisabled: 'No supporter recognition',
          subscriptionPending: 'Opening checkout...',
          portalPending: 'Opening portal...',
          entitlementUnavailable: 'There is no commercial record for this guild yet. You can stay on Free or start the subscription here.',
          renewalCancelled: 'Cancels at the end of the current period',
          billingStatus: 'Status',
          installBot: 'Install the bot first',
          installBotDescription: 'Checkout is only available for guilds where TON618 is already installed.',
        }
  ), [isSpanish]);

  useEffect(() => {
    if (!isGuildAccessFresh || checkoutStatus !== 'success' || billingQuery.data?.effectivePlan === 'pro') {
      return undefined;
    }

    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      if (Date.now() - startedAt > 60_000) {
        window.clearInterval(intervalId);
        return;
      }

      void billingQuery.refetch();
    }, 5_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [billingQuery, checkoutStatus, isGuildAccessFresh]);

  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow={copy.eyebrow}
        title={copy.installBot}
        description={copy.installBotDescription}
        icon={ShieldAlert}
        tone="warning"
      />
    );
  }

  if (!isGuildAccessFresh) {
    return (
      <StateCard
        eyebrow={copy.eyebrow}
        title={copy.staleTitle}
        description={copy.staleDescription}
        icon={ShieldAlert}
        tone="warning"
        actions={(
          <button
            type="button"
            onClick={onSyncGuildAccess}
            disabled={isSyncing}
            className="dashboard-primary-button"
          >
            <RefreshCcw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {copy.refreshAccess}
          </button>
        )}
      />
    );
  }

  if (billingQuery.isError) {
    return (
      <StateCard
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={billingQuery.error instanceof Error ? billingQuery.error.message : copy.entitlementUnavailable}
        icon={CreditCard}
        tone="danger"
        actions={(
          <>
            <button
              type="button"
              onClick={() => void billingQuery.refetch()}
              className="dashboard-primary-button"
            >
              <RefreshCcw className="h-4 w-4" />
              {copy.retryBilling}
            </button>
            <button
              type="button"
              onClick={onSyncGuildAccess}
              disabled={isSyncing}
              className="dashboard-secondary-button"
            >
              <RefreshCcw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {copy.refreshAccess}
            </button>
          </>
        )}
      />
    );
  }

  const entitlement = billingQuery.data ?? {
    ...defaultEntitlement,
    guildId: guild.guildId,
  };
  const planLabel = entitlement.effectivePlan === 'pro'
    ? copy.pro
    : entitlement.effectivePlan === 'enterprise'
      ? copy.enterprise
      : copy.free;
  const sourceLabel = entitlement.planSource === 'override'
    ? copy.override
    : entitlement.planSource === 'stripe'
      ? copy.stripe
      : copy.sourceFree;
  const subscriptionLabel = entitlement.subscriptionStatus ?? copy.noSubscription;
  const renewalLabel = entitlement.currentPeriodEnd
    ? formatDateTime(entitlement.currentPeriodEnd)
    : copy.noSubscription;
  const updatedAtLabel = entitlement.updatedAt
    ? formatDateTime(entitlement.updatedAt)
    : copy.noSubscription;
  const canManageBilling = Boolean(entitlement.subscriptionStatus);

  async function startCheckout(interval: 'month' | 'year') {
    const result = await checkoutMutation.mutateAsync(interval);
    window.location.assign(result.url);
  }

  async function openPortal() {
    const result = await portalMutation.mutateAsync();
    window.location.assign(result.url);
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,20,40,0.95),rgba(10,13,26,0.96))] p-7 text-white shadow-[0_18px_55px_rgba(0,0,0,0.3)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-[1] flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-indigo-300">{copy.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white lg:text-4xl">{copy.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 lg:text-base">{copy.description}</p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] ${resolveStatusTone(entitlement.subscriptionStatus)}`}>
            <Sparkles className="h-4 w-4" />
            {planLabel}
          </div>
        </div>
      </section>

      {checkoutStatus === 'success' ? (
        <div className="rounded-[1.55rem] border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          {entitlement.effectivePlan === 'pro' ? copy.activated : copy.checkoutSuccess}
        </div>
      ) : null}

      {checkoutStatus === 'cancelled' ? (
        <div className="rounded-[1.55rem] border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
          {copy.checkoutCancelled}
        </div>
      ) : null}

      {!billingQuery.data ? (
        <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          {copy.entitlementUnavailable}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className="rounded-[1.85rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.35rem] border border-white/10 bg-black/25 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">{copy.currentPlan}</p>
              <p className="mt-3 text-2xl font-bold text-white">{planLabel}</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-black/25 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">{copy.planSource}</p>
              <p className="mt-3 text-2xl font-bold text-white">{sourceLabel}</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-black/25 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">{copy.billingStatus}</p>
              <p className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${resolveStatusTone(entitlement.subscriptionStatus)}`}>
                {subscriptionLabel}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-black/25 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">{copy.supporter}</p>
              <p className="mt-3 text-sm font-semibold text-white">
                {entitlement.supporterEnabled ? copy.supporterEnabled : copy.supporterDisabled}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.35rem] border border-white/10 bg-black/25 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">{copy.renewal}</p>
              <p className="mt-3 text-sm font-semibold text-white">{renewalLabel}</p>
              {entitlement.cancelAtPeriodEnd ? (
                <p className="mt-2 text-xs text-amber-200">{copy.renewalCancelled}</p>
              ) : null}
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-black/25 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">{copy.updatedAt}</p>
              <p className="mt-3 text-sm font-semibold text-white">{updatedAtLabel}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.85rem] border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-xl font-bold text-white">TON618 Pro</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {isSpanish
              ? 'Checkout self-serve para la beta pagada. Pro mensual cuesta USD 9 y anual USD 84.'
              : 'Self-serve checkout for the paid beta. Pro monthly is USD 9 and yearly is USD 84.'}
          </p>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={() => void startCheckout('month')}
              disabled={checkoutMutation.isPending}
              className="dashboard-primary-button justify-center"
            >
              <CreditCard className="h-4 w-4" />
              {checkoutMutation.isPending ? copy.subscriptionPending : copy.upgradeMonthly}
            </button>
            <button
              type="button"
              onClick={() => void startCheckout('year')}
              disabled={checkoutMutation.isPending}
              className="dashboard-secondary-button justify-center"
            >
              <CreditCard className="h-4 w-4" />
              {checkoutMutation.isPending ? copy.subscriptionPending : copy.upgradeYearly}
            </button>
            <button
              type="button"
              onClick={() => void openPortal()}
              disabled={!canManageBilling || portalMutation.isPending}
              className="dashboard-secondary-button justify-center"
            >
              <ExternalLink className="h-4 w-4" />
              {portalMutation.isPending ? copy.portalPending : copy.manageBilling}
            </button>
            <a
              href={config.supportServerUrl || (config.contactEmail ? `mailto:${config.contactEmail}` : '#')}
              className="dashboard-secondary-button justify-center"
              target={config.supportServerUrl ? '_blank' : undefined}
              rel={config.supportServerUrl ? 'noopener noreferrer' : undefined}
            >
              <ExternalLink className="h-4 w-4" />
              {copy.contactSales}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

