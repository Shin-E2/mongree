create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id uuid generated always as (id) stored unique,
  username text unique,
  nickname text not null unique,
  full_name text,
  profile_image text,
  zone_code text,
  address text,
  detail_address text,
  is_active boolean not null default true,
  is_profile_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  provider_account_id text not null,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_account_id)
);

create table if not exists public.emotions (
  id text primary key,
  label text not null,
  image text,
  category text,
  sort_order integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.diaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.diary_emotions (
  diary_id uuid not null references public.diaries(id) on delete cascade,
  emotion_id text not null references public.emotions(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (diary_id, emotion_id)
);

create table if not exists public.diary_tags (
  diary_id uuid not null references public.diaries(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (diary_id, tag_id)
);

create table if not exists public.diary_images (
  id uuid primary key default gen_random_uuid(),
  diary_id uuid not null references public.diaries(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 1,
  file_name text,
  mime_type text,
  file_size bigint,
  alt_text text,
  created_at timestamptz not null default now()
);

create table if not exists public.diary_likes (
  id uuid primary key default gen_random_uuid(),
  diary_id uuid not null references public.diaries(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (diary_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  diary_id uuid not null references public.diaries(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id)
);

create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_accounts_user_id on public.accounts(user_id);
create index if not exists idx_diaries_user_id_created_at on public.diaries(user_id, created_at desc);
create index if not exists idx_diaries_public_created_at on public.diaries(created_at desc) where is_private = false and deleted_at is null;
create index if not exists idx_diary_emotions_emotion_id on public.diary_emotions(emotion_id);
create index if not exists idx_diary_tags_tag_id on public.diary_tags(tag_id);
create index if not exists idx_diary_images_diary_id_sort_order on public.diary_images(diary_id, sort_order);
create index if not exists idx_diary_likes_diary_id on public.diary_likes(diary_id);
create index if not exists idx_diary_likes_user_id on public.diary_likes(user_id);
create index if not exists idx_comments_diary_id_created_at on public.comments(diary_id, created_at);
create index if not exists idx_comments_parent_id on public.comments(parent_id);
create index if not exists idx_comments_user_id on public.comments(user_id);
create index if not exists idx_comment_likes_comment_id on public.comment_likes(comment_id);
create index if not exists idx_comment_likes_user_id on public.comment_likes(user_id);

create or replace trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create or replace trigger accounts_set_updated_at before update on public.accounts
for each row execute function public.set_updated_at();
create or replace trigger diaries_set_updated_at before update on public.diaries
for each row execute function public.set_updated_at();
create or replace trigger comments_set_updated_at before update on public.comments
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  fallback_nickname text;
begin
  fallback_nickname := coalesce(
    nullif(new.raw_user_meta_data ->> 'nickname', ''),
    split_part(coalesce(new.email, ''), '@', 1),
    'user_' || substr(new.id::text, 1, 8)
  );

  insert into public.profiles (
    id, username, nickname, full_name, profile_image,
    zone_code, address, detail_address, is_profile_complete
  ) values (
    new.id,
    split_part(coalesce(new.email, ''), '@', 1),
    fallback_nickname,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'profile_image',
    coalesce(new.raw_user_meta_data ->> 'zoneCode', new.raw_user_meta_data ->> 'zone_code'),
    new.raw_user_meta_data ->> 'address',
    coalesce(new.raw_user_meta_data ->> 'detailAddress', new.raw_user_meta_data ->> 'detail_address'),
    true
  )
  on conflict (id) do update set
    nickname = excluded.nickname,
    full_name = excluded.full_name,
    profile_image = excluded.profile_image,
    zone_code = excluded.zone_code,
    address = excluded.address,
    detail_address = excluded.detail_address,
    is_profile_complete = excluded.is_profile_complete,
    updated_at = now();

  return new;
end;
$$;

revoke all on function public.handle_new_user() from anon, authenticated, public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.emotions (id, label, image, sort_order) values
  ('happy', '행복', '/image/emotions/happy.svg', 1),
  ('sad', '슬픔', '/image/emotions/sad.svg', 2),
  ('angry', '분노', '/image/emotions/angry.svg', 3),
  ('scared', '두려움', '/image/emotions/scared.svg', 4),
  ('anxious', '불안', '/image/emotions/anxious.svg', 5),
  ('joyful', '기쁨', '/image/emotions/joyful.svg', 6),
  ('disappointed', '실망', '/image/emotions/disappointed.svg', 7),
  ('calm', '평온', '/image/emotions/calm.svg', 8),
  ('excited', '흥분', '/image/emotions/excited.svg', 9),
  ('confused', '외로움', '/image/emotions/confused.svg', 10)
on conflict (id) do update set
  label = excluded.label,
  image = excluded.image,
  sort_order = excluded.sort_order,
  is_active = true;

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.emotions enable row level security;
alter table public.diaries enable row level security;
alter table public.tags enable row level security;
alter table public.diary_emotions enable row level security;
alter table public.diary_tags enable row level security;
alter table public.diary_images enable row level security;
alter table public.diary_likes enable row level security;
alter table public.comments enable row level security;
alter table public.comment_likes enable row level security;

create policy "profiles_select_public" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "emotions_select_active" on public.emotions for select using (is_active = true);
create policy "tags_select_all" on public.tags for select using (true);
create policy "tags_insert_authenticated_named" on public.tags
for insert to authenticated with check (name is not null and length(trim(name)) > 0 and length(trim(name)) <= 50);

create policy "diaries_select_visible" on public.diaries
for select using (deleted_at is null and (is_private = false or (select auth.uid()) = user_id));
create policy "diaries_insert_own" on public.diaries
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "diaries_update_own" on public.diaries
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "diaries_delete_own" on public.diaries
for delete to authenticated using ((select auth.uid()) = user_id);

create policy "diary_emotions_select_visible" on public.diary_emotions
for select using (exists (select 1 from public.diaries d where d.id = diary_id and d.deleted_at is null and (d.is_private = false or d.user_id = (select auth.uid()))));
create policy "diary_emotions_insert_owner" on public.diary_emotions
for insert to authenticated with check (exists (select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())));
create policy "diary_emotions_delete_owner" on public.diary_emotions
for delete to authenticated using (exists (select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())));

create policy "diary_tags_select_visible" on public.diary_tags
for select using (exists (select 1 from public.diaries d where d.id = diary_id and d.deleted_at is null and (d.is_private = false or d.user_id = (select auth.uid()))));
create policy "diary_tags_insert_owner" on public.diary_tags
for insert to authenticated with check (exists (select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())));
create policy "diary_tags_delete_owner" on public.diary_tags
for delete to authenticated using (exists (select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())));

create policy "diary_images_select_visible" on public.diary_images
for select using (exists (select 1 from public.diaries d where d.id = diary_id and d.deleted_at is null and (d.is_private = false or d.user_id = (select auth.uid()))));
create policy "diary_images_insert_owner" on public.diary_images
for insert to authenticated with check (exists (select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())));
create policy "diary_images_delete_owner" on public.diary_images
for delete to authenticated using (exists (select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())));

create policy "diary_likes_select_public" on public.diary_likes
for select using (exists (select 1 from public.diaries d where d.id = diary_id and d.deleted_at is null and d.is_private = false));
create policy "diary_likes_insert_own_public" on public.diary_likes
for insert to authenticated with check ((select auth.uid()) = user_id and exists (select 1 from public.diaries d where d.id = diary_id and d.deleted_at is null and d.is_private = false));
create policy "diary_likes_delete_own" on public.diary_likes
for delete to authenticated using ((select auth.uid()) = user_id);

create policy "comments_select_visible" on public.comments
for select using (deleted_at is null and exists (select 1 from public.diaries d where d.id = diary_id and d.deleted_at is null and (d.is_private = false or d.user_id = (select auth.uid()))));
create policy "comments_insert_authenticated_visible" on public.comments
for insert to authenticated with check ((select auth.uid()) = user_id and exists (select 1 from public.diaries d where d.id = diary_id and d.deleted_at is null and (d.is_private = false or d.user_id = (select auth.uid()))));
create policy "comments_update_own" on public.comments
for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "comments_delete_own" on public.comments
for delete to authenticated using ((select auth.uid()) = user_id);

create policy "comment_likes_select_visible" on public.comment_likes
for select using (exists (select 1 from public.comments c join public.diaries d on d.id = c.diary_id where c.id = comment_id and c.deleted_at is null and d.deleted_at is null and (d.is_private = false or d.user_id = (select auth.uid()))));
create policy "comment_likes_insert_own_visible" on public.comment_likes
for insert to authenticated with check ((select auth.uid()) = user_id and exists (select 1 from public.comments c join public.diaries d on d.id = c.diary_id where c.id = comment_id and c.deleted_at is null and d.deleted_at is null and (d.is_private = false or d.user_id = (select auth.uid()))));
create policy "comment_likes_delete_own" on public.comment_likes
for delete to authenticated using ((select auth.uid()) = user_id);
