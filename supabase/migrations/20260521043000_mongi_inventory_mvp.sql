create table if not exists public.mongi_items (
  id text primary key,
  name text not null,
  description text not null,
  slot text not null check (slot in ('head', 'neck', 'body')),
  asset_url text,
  is_default boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.user_mongi_items (
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null references public.mongi_items(id) on delete cascade,
  acquired_at timestamptz not null default now(),
  source text not null default 'default',
  primary key (user_id, item_id)
);

alter table public.mongi_profiles
  add column if not exists equipped_item_id text references public.mongi_items(id) on delete set null;

alter table public.mongi_items enable row level security;
alter table public.user_mongi_items enable row level security;

drop policy if exists "mongi_items_select_all" on public.mongi_items;
create policy "mongi_items_select_all"
  on public.mongi_items
  for select
  using (true);

drop policy if exists "user_mongi_items_select_own" on public.user_mongi_items;
create policy "user_mongi_items_select_own"
  on public.user_mongi_items
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "user_mongi_items_insert_own" on public.user_mongi_items;
create policy "user_mongi_items_insert_own"
  on public.user_mongi_items
  for insert to authenticated
  with check (auth.uid() = user_id);

insert into public.mongi_items (id, name, description, slot, asset_url, is_default, sort_order)
values
  ('mongi_default_leaf_hat', '새싹 모자', '처음 몽이에게 씌워줄 수 있는 작은 새싹 모자입니다.', 'head', '/items/mongi/leaf-hat.svg', true, 10),
  ('mongi_default_scarf', '따뜻한 목도리', '감정 기록을 시작한 몽이를 위한 기본 목도리입니다.', 'neck', '/items/mongi/scarf.svg', true, 20),
  ('mongi_default_star_badge', '별 배지', '꾸준한 기록을 응원하는 작은 별 배지입니다.', 'body', '/items/mongi/star-badge.svg', true, 30)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  slot = excluded.slot,
  asset_url = excluded.asset_url,
  is_default = excluded.is_default,
  sort_order = excluded.sort_order;
