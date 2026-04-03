/*
  # Billing control plane for paid beta

  1. Security
    - Require fresh guild access (`<= 24h`) for dashboard-controlled reads/writes
    - Add billing-specific tables with service-role-only writes

  2. Billing
    - `billing_customers`
    - `guild_billing_subscriptions`
    - `guild_entitlement_overrides`
    - `billing_webhook_events`
    - `billing_beta_allowlist`
    - `guild_effective_entitlements` read model

  3. Landing stats
    - Mark seeded bot stats as `source = 'seed'`
    - Leave future writes defaulting to `source = 'live'`
*/

alter table public.bot_stats
  add column if not exists source text not null default 'live';

update public.bot_stats
set source = 'seed'
where source = 'live'
  and servers = 52847
  and users = 12456789
  and commands_executed = 45678912
  and uptime_percentage = 99.98;

create index if not exists bot_stats_source_updated_at_idx
  on public.bot_stats (source, updated_at desc);

create index if not exists user_guild_access_user_guild_sync_idx
  on public.user_guild_access (user_id, guild_id, can_manage, last_synced_at desc);

create or replace function public.is_manageable_guild_fresh(
  target_guild_id text,
  max_age_hours integer default 24
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_guild_access access
    where access.user_id = auth.uid()
      and access.guild_id = target_guild_id
      and access.can_manage = true
      and access.last_synced_at >= (
        now() - make_interval(hours => greatest(coalesce(max_age_hours, 24), 1))
      )
  );
$$;

create or replace function public.is_manageable_guild(target_guild_id text)
returns boolean
language sql
stable
as $$
  select public.is_manageable_guild_fresh(target_guild_id, 24);
$$;

create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guild_billing_subscriptions (
  guild_id text primary key references public.bot_guilds(guild_id) on delete cascade,
  owner_user_id uuid references auth.users(id) on delete set null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  price_id text,
  plan text not null default 'pro',
  status text not null,
  billing_interval text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  last_event_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guild_billing_subscriptions_plan_check
    check (plan in ('free', 'pro', 'enterprise')),
  constraint guild_billing_subscriptions_interval_check
    check (billing_interval in ('month', 'year'))
);

create table if not exists public.guild_entitlement_overrides (
  guild_id text primary key references public.bot_guilds(guild_id) on delete cascade,
  plan_override text,
  plan_override_expires_at timestamptz,
  supporter_enabled boolean not null default false,
  supporter_expires_at timestamptz,
  note text,
  source text not null default 'manual',
  updated_by_actor text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guild_entitlement_overrides_plan_check
    check (plan_override is null or plan_override in ('free', 'pro', 'enterprise'))
);

create table if not exists public.billing_webhook_events (
  stripe_event_id text primary key,
  event_type text not null,
  payload_hash text not null,
  status text not null default 'processing',
  error_message text,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.billing_beta_allowlist (
  user_id uuid primary key references auth.users(id) on delete cascade,
  expires_at timestamptz,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guild_billing_subscriptions_owner_idx
  on public.guild_billing_subscriptions (owner_user_id, updated_at desc);

create index if not exists guild_billing_subscriptions_status_idx
  on public.guild_billing_subscriptions (status, current_period_end desc);

create index if not exists billing_webhook_events_status_idx
  on public.billing_webhook_events (status, created_at desc);

drop trigger if exists set_billing_customers_updated_at on public.billing_customers;
create trigger set_billing_customers_updated_at
before update on public.billing_customers
for each row execute function public.set_updated_at_timestamp();

drop trigger if exists set_guild_billing_subscriptions_updated_at on public.guild_billing_subscriptions;
create trigger set_guild_billing_subscriptions_updated_at
before update on public.guild_billing_subscriptions
for each row execute function public.set_updated_at_timestamp();

drop trigger if exists set_guild_entitlement_overrides_updated_at on public.guild_entitlement_overrides;
create trigger set_guild_entitlement_overrides_updated_at
before update on public.guild_entitlement_overrides
for each row execute function public.set_updated_at_timestamp();

drop trigger if exists set_billing_beta_allowlist_updated_at on public.billing_beta_allowlist;
create trigger set_billing_beta_allowlist_updated_at
before update on public.billing_beta_allowlist
for each row execute function public.set_updated_at_timestamp();

alter table public.billing_customers enable row level security;
alter table public.guild_billing_subscriptions enable row level security;
alter table public.guild_entitlement_overrides enable row level security;
alter table public.billing_webhook_events enable row level security;
alter table public.billing_beta_allowlist enable row level security;

drop policy if exists "Users can read own billing customer" on public.billing_customers;
create policy "Users can read own billing customer"
  on public.billing_customers
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can read fresh guild billing subscriptions" on public.guild_billing_subscriptions;
create policy "Users can read fresh guild billing subscriptions"
  on public.guild_billing_subscriptions
  for select
  to authenticated
  using (public.is_manageable_guild_fresh(guild_id));

drop policy if exists "Users can read fresh guild entitlement overrides" on public.guild_entitlement_overrides;
create policy "Users can read fresh guild entitlement overrides"
  on public.guild_entitlement_overrides
  for select
  to authenticated
  using (public.is_manageable_guild_fresh(guild_id));

create or replace view public.guild_effective_entitlements
with (security_invoker = true)
as
with override_state as (
  select
    o.guild_id,
    o.plan_override,
    o.plan_override_expires_at,
    o.supporter_enabled,
    o.supporter_expires_at,
    o.updated_at
  from public.guild_entitlement_overrides o
),
subscription_state as (
  select
    s.guild_id,
    s.status,
    s.billing_interval,
    s.current_period_end,
    s.cancel_at_period_end,
    s.updated_at
  from public.guild_billing_subscriptions s
),
guild_scope as (
  select guild_id from public.bot_guilds
  union
  select guild_id from public.guild_billing_subscriptions
  union
  select guild_id from public.guild_entitlement_overrides
)
select
  scope.guild_id,
  case
    when overrides.plan_override is not null
      and (
        overrides.plan_override_expires_at is null
        or overrides.plan_override_expires_at > now()
      ) then overrides.plan_override
    when subscriptions.status in ('trialing', 'active', 'past_due')
      and (
        subscriptions.current_period_end is null
        or subscriptions.current_period_end > now()
      ) then 'pro'
    else 'free'
  end as effective_plan,
  case
    when overrides.plan_override is not null
      and (
        overrides.plan_override_expires_at is null
        or overrides.plan_override_expires_at > now()
      ) then 'override'
    when subscriptions.status in ('trialing', 'active', 'past_due')
      and (
        subscriptions.current_period_end is null
        or subscriptions.current_period_end > now()
      ) then 'stripe'
    else 'free'
  end as plan_source,
  subscriptions.status as subscription_status,
  subscriptions.billing_interval,
  case
    when overrides.plan_override is not null
      and (
        overrides.plan_override_expires_at is null
        or overrides.plan_override_expires_at > now()
      ) then overrides.plan_override_expires_at
    when subscriptions.status in ('trialing', 'active', 'past_due')
      and (
        subscriptions.current_period_end is null
        or subscriptions.current_period_end > now()
      ) then subscriptions.current_period_end
    else null
  end as plan_expires_at,
  subscriptions.current_period_end,
  subscriptions.cancel_at_period_end,
  case
    when overrides.supporter_enabled = true
      and (
        overrides.supporter_expires_at is null
        or overrides.supporter_expires_at > now()
      ) then true
    else false
  end as supporter_enabled,
  case
    when overrides.supporter_enabled = true
      and (
        overrides.supporter_expires_at is null
        or overrides.supporter_expires_at > now()
      ) then overrides.supporter_expires_at
    else null
  end as supporter_expires_at,
  greatest(
    coalesce(overrides.updated_at, '-infinity'::timestamptz),
    coalesce(subscriptions.updated_at, '-infinity'::timestamptz)
  ) as updated_at
from guild_scope scope
left join override_state overrides on overrides.guild_id = scope.guild_id
left join subscription_state subscriptions on subscriptions.guild_id = scope.guild_id;

grant select on public.guild_effective_entitlements to authenticated;
