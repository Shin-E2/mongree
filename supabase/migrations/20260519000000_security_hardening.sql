create table if not exists public.profile_private (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  zone_code text,
  address text,
  detail_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.profile_private (user_id, zone_code, address, detail_address)
select id, zone_code, address, detail_address
from public.profiles
where zone_code is not null
   or address is not null
   or detail_address is not null
on conflict (user_id) do update
set zone_code = excluded.zone_code,
    address = excluded.address,
    detail_address = excluded.detail_address,
    updated_at = now();

alter table public.profile_private enable row level security;

drop policy if exists "profile_private_select_own" on public.profile_private;
create policy "profile_private_select_own" on public.profile_private
for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "profile_private_insert_own" on public.profile_private;
create policy "profile_private_insert_own" on public.profile_private
for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profile_private_update_own" on public.profile_private;
create policy "profile_private_update_own" on public.profile_private
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profiles_select_public" on public.profiles;
drop policy if exists "profiles_select_visible" on public.profiles;
create policy "profiles_select_visible" on public.profiles
for select
using (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_nickname text;
  final_nickname text;
  suffix int := 0;
begin
  base_nickname := coalesce(
    nullif(new.raw_user_meta_data ->> 'nickname', ''),
    nullif(split_part(new.email, '@', 1), ''),
    'user'
  );
  final_nickname := base_nickname;

  while exists (select 1 from public.profiles where nickname = final_nickname) loop
    suffix := suffix + 1;
    final_nickname := base_nickname || suffix::text;
  end loop;

  insert into public.profiles (
    id,
    nickname,
    profile_image,
    is_profile_complete
  )
  values (
    new.id,
    final_nickname,
    coalesce(new.raw_user_meta_data ->> 'profileImage', new.raw_user_meta_data ->> 'profile_image'),
    coalesce((new.raw_user_meta_data ->> 'isProfileComplete')::boolean, false)
  )
  on conflict (id) do update
  set nickname = excluded.nickname,
      profile_image = excluded.profile_image,
      is_profile_complete = excluded.is_profile_complete,
      updated_at = now();

  insert into public.profile_private (
    user_id,
    zone_code,
    address,
    detail_address
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'zoneCode', new.raw_user_meta_data ->> 'zone_code'),
    new.raw_user_meta_data ->> 'address',
    coalesce(new.raw_user_meta_data ->> 'detailAddress', new.raw_user_meta_data ->> 'detail_address')
  )
  on conflict (user_id) do update
  set zone_code = excluded.zone_code,
      address = excluded.address,
      detail_address = excluded.detail_address,
      updated_at = now();

  return new;
end;
$$;

alter table public.profiles
  drop column if exists zone_code,
  drop column if exists address,
  drop column if exists detail_address;

drop policy if exists "diary_images_update_owner" on public.diary_images;
create policy "diary_images_update_owner" on public.diary_images
for update to authenticated
using (
  exists (
    select 1
    from public.diaries d
    where d.id = diary_id
      and d.user_id = auth.uid()
      and d.deleted_at is null
  )
)
with check (
  exists (
    select 1
    from public.diaries d
    where d.id = diary_id
      and d.user_id = auth.uid()
      and d.deleted_at is null
  )
);
