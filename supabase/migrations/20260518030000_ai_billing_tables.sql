-- AI reports, usage tracking, and Stripe subscription state.

create table if not exists public.ai_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  month text not null check (month ~ '^\d{4}-\d{2}$'),
  summary text not null,
  dominant_emotions text[] not null default '{}',
  gentle_insight text not null,
  recommendations text[] not null default '{}',
  source text not null default 'local' check (source in ('local', 'openai')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, month)
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  source text not null default 'app',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null default 'incomplete',
  price_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists idx_ai_reports_user_month on public.ai_reports(user_id, month desc);
create index if not exists idx_usage_events_user_created on public.usage_events(user_id, created_at desc);
create index if not exists idx_usage_events_type_created on public.usage_events(event_type, created_at desc);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_customer_id on public.subscriptions(stripe_customer_id);

create or replace trigger ai_reports_set_updated_at
  before update on public.ai_reports
  for each row execute function public.set_updated_at();

create or replace trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.ai_reports enable row level security;
alter table public.usage_events enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "Users can read own ai reports" on public.ai_reports;
create policy "Users can read own ai reports"
  on public.ai_reports for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can write own ai reports" on public.ai_reports;
create policy "Users can write own ai reports"
  on public.ai_reports for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own ai reports" on public.ai_reports;
create policy "Users can update own ai reports"
  on public.ai_reports for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own usage events" on public.usage_events;
create policy "Users can read own usage events"
  on public.usage_events for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can write own usage events" on public.usage_events;
create policy "Users can write own usage events"
  on public.usage_events for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own subscriptions" on public.subscriptions;
create policy "Users can read own subscriptions"
  on public.subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

