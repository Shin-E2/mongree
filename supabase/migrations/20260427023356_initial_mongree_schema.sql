-- ============================================================
-- Mongree 초기 스키마 (통합본)
-- Supabase SQL Editor에 전체 복사 후 실행
-- ============================================================

-- ─── Extensions ────────────────────────────────────────────
create extension if not exists pgcrypto;


-- ─── Utility: updated_at 자동 갱신 트리거 함수 ────────────
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
revoke all on function public.set_updated_at() from anon, authenticated, public;


-- ─── Tables ────────────────────────────────────────────────

-- 사용자 프로필 (auth.users와 1:1 연결)
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  -- user_id는 id와 동일한 값을 가지는 generated column (기존 코드 호환용)
  user_id             uuid generated always as (id) stored unique,
  username            text unique,
  nickname            text not null unique,
  full_name           text,
  profile_image       text,
  is_active           boolean not null default true,
  is_profile_complete boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 감정 마스터 데이터 (앱 고정 목록)
create table if not exists public.emotions (
  id         text primary key,
  label      text not null,
  image      text,
  category   text,
  sort_order integer,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- 일기
create table if not exists public.diaries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  content    text not null,
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- soft delete: null이면 정상, 값이 있으면 삭제된 일기
  deleted_at timestamptz
);

-- 태그 (일기에 자유롭게 추가하는 텍스트 태그)
create table if not exists public.tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

-- 일기-감정 연결 (일기당 최대 3개 감정, 앱 레이어에서 제한)
create table if not exists public.diary_emotions (
  diary_id   uuid not null references public.diaries(id) on delete cascade,
  emotion_id text not null references public.emotions(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (diary_id, emotion_id)
);

-- 일기-태그 연결
create table if not exists public.diary_tags (
  diary_id   uuid not null references public.diaries(id) on delete cascade,
  tag_id     uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (diary_id, tag_id)
);

-- 일기 이미지 (S3 URL 저장, 최대 3장)
create table if not exists public.diary_images (
  id         uuid primary key default gen_random_uuid(),
  diary_id   uuid not null references public.diaries(id) on delete cascade,
  image_url  text not null,
  sort_order integer not null default 1,
  file_name  text,
  mime_type  text,
  file_size  bigint,
  alt_text   text,
  created_at timestamptz not null default now()
);

-- 일기 공감(좋아요)
create table if not exists public.diary_likes (
  id         uuid primary key default gen_random_uuid(),
  diary_id   uuid not null references public.diaries(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (diary_id, user_id)
);

-- 댓글 (parent_id가 있으면 대댓글, 1단계만 허용)
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  diary_id   uuid not null references public.diaries(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  parent_id  uuid references public.comments(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- 댓글 좋아요
create table if not exists public.comment_likes (
  id         uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id)
);


-- ─── Indexes ───────────────────────────────────────────────
create index if not exists idx_diaries_user_id_created_at
  on public.diaries(user_id, created_at desc);

-- 커뮤니티 피드: 공개 일기만 빠르게 조회
create index if not exists idx_diaries_public_created_at
  on public.diaries(created_at desc)
  where is_private = false and deleted_at is null;

create index if not exists idx_diary_emotions_emotion_id on public.diary_emotions(emotion_id);
create index if not exists idx_diary_tags_tag_id         on public.diary_tags(tag_id);
create index if not exists idx_diary_images_diary_sort   on public.diary_images(diary_id, sort_order);
create index if not exists idx_diary_likes_diary_id      on public.diary_likes(diary_id);
create index if not exists idx_diary_likes_user_id       on public.diary_likes(user_id);
create index if not exists idx_comments_diary_created    on public.comments(diary_id, created_at);
create index if not exists idx_comments_parent_id        on public.comments(parent_id);
create index if not exists idx_comment_likes_comment_id  on public.comment_likes(comment_id);


-- ─── Triggers ──────────────────────────────────────────────
create or replace trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace trigger diaries_set_updated_at
  before update on public.diaries
  for each row execute function public.set_updated_at();

create or replace trigger comments_set_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();


-- ─── 신규 유저 가입 시 profiles 자동 생성 ──────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_nickname text;
  final_nickname text;
  suffix        int := 0;
begin
  base_nickname := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'nickname'), ''),
    split_part(coalesce(new.email, ''), '@', 1),
    'user_' || substr(new.id::text, 1, 8)
  );

  final_nickname := base_nickname;

  -- 닉네임 중복 시 숫자 suffix 붙여서 유일성 확보
  while exists (select 1 from public.profiles where nickname = final_nickname) loop
    suffix := suffix + 1;
    final_nickname := base_nickname || suffix::text;
  end loop;

  insert into public.profiles (
    id, username, nickname, full_name, profile_image,
    is_profile_complete
  ) values (
    new.id,
    split_part(coalesce(new.email, ''), '@', 1),
    final_nickname,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    false
  )
  on conflict (id) do update set
    nickname            = excluded.nickname,
    full_name           = excluded.full_name,
    profile_image       = excluded.profile_image,
    updated_at          = now();

  return new;
end;
$$;
revoke all on function public.handle_new_user() from anon, authenticated, public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─── 태그 upsert 함수 ──────────────────────────────────────
-- 이름으로 태그 조회, 없으면 생성 후 id 반환 (Server Action에서 사용)
create or replace function public.get_or_create_tag_id(tag_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  tag_id uuid;
begin
  select id into tag_id from public.tags where name = trim(tag_name);

  if tag_id is null then
    insert into public.tags (name)
    values (trim(tag_name))
    returning id into tag_id;
  end if;

  return tag_id;
end;
$$;
revoke all on function public.get_or_create_tag_id(text) from anon;
grant execute on function public.get_or_create_tag_id(text) to authenticated;


-- ─── Row Level Security ────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.emotions       enable row level security;
alter table public.diaries        enable row level security;
alter table public.tags           enable row level security;
alter table public.diary_emotions enable row level security;
alter table public.diary_tags     enable row level security;
alter table public.diary_images   enable row level security;
alter table public.diary_likes    enable row level security;
alter table public.comments       enable row level security;
alter table public.comment_likes  enable row level security;

-- profiles
create policy "profiles_select_public"  on public.profiles for select using (true);
create policy "profiles_insert_own"     on public.profiles for insert with check ((select auth.uid()) = id);
create policy "profiles_update_own"     on public.profiles for update
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- emotions (읽기 전용 마스터 데이터)
create policy "emotions_select_active" on public.emotions for select using (is_active = true);

-- tags
create policy "tags_select_all" on public.tags for select using (true);
create policy "tags_insert_authenticated" on public.tags
  for insert to authenticated
  with check (name is not null and length(trim(name)) > 0 and length(trim(name)) <= 50);

-- diaries: 삭제 안 된 것 중 공개 or 내 일기
create policy "diaries_select_visible" on public.diaries
  for select using (
    deleted_at is null and
    (is_private = false or (select auth.uid()) = user_id)
  );
create policy "diaries_insert_own"  on public.diaries for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "diaries_update_own"  on public.diaries for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "diaries_delete_own"  on public.diaries for delete to authenticated
  using ((select auth.uid()) = user_id);

-- diary_emotions (diary 접근 권한과 동일하게)
create policy "diary_emotions_select" on public.diary_emotions for select
  using (exists (
    select 1 from public.diaries d
    where d.id = diary_id and d.deleted_at is null
      and (d.is_private = false or d.user_id = (select auth.uid()))
  ));
create policy "diary_emotions_insert" on public.diary_emotions for insert to authenticated
  with check (exists (
    select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())
  ));
create policy "diary_emotions_delete" on public.diary_emotions for delete to authenticated
  using (exists (
    select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())
  ));

-- diary_tags
create policy "diary_tags_select" on public.diary_tags for select
  using (exists (
    select 1 from public.diaries d
    where d.id = diary_id and d.deleted_at is null
      and (d.is_private = false or d.user_id = (select auth.uid()))
  ));
create policy "diary_tags_insert" on public.diary_tags for insert to authenticated
  with check (exists (
    select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())
  ));
create policy "diary_tags_delete" on public.diary_tags for delete to authenticated
  using (exists (
    select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())
  ));

-- diary_images
create policy "diary_images_select" on public.diary_images for select
  using (exists (
    select 1 from public.diaries d
    where d.id = diary_id and d.deleted_at is null
      and (d.is_private = false or d.user_id = (select auth.uid()))
  ));
create policy "diary_images_insert" on public.diary_images for insert to authenticated
  with check (exists (
    select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())
  ));
create policy "diary_images_delete" on public.diary_images for delete to authenticated
  using (exists (
    select 1 from public.diaries d where d.id = diary_id and d.user_id = (select auth.uid())
  ));

-- diary_likes
-- 조회: 공개 일기 or 내 일기의 좋아요 (버그 수정: 기존엔 공개만 가능했음)
create policy "diary_likes_select" on public.diary_likes for select
  using (exists (
    select 1 from public.diaries d
    where d.id = diary_id and d.deleted_at is null
      and (d.is_private = false or d.user_id = (select auth.uid()))
  ));
-- 좋아요는 공개 일기에만 가능
create policy "diary_likes_insert" on public.diary_likes for insert to authenticated
  with check (
    (select auth.uid()) = user_id and
    exists (
      select 1 from public.diaries d
      where d.id = diary_id and d.deleted_at is null and d.is_private = false
    )
  );
create policy "diary_likes_delete" on public.diary_likes for delete to authenticated
  using ((select auth.uid()) = user_id);

-- comments
create policy "comments_select" on public.comments for select
  using (
    deleted_at is null and
    exists (
      select 1 from public.diaries d
      where d.id = diary_id and d.deleted_at is null
        and (d.is_private = false or d.user_id = (select auth.uid()))
    )
  );
create policy "comments_insert" on public.comments for insert to authenticated
  with check (
    (select auth.uid()) = user_id and
    exists (
      select 1 from public.diaries d
      where d.id = diary_id and d.deleted_at is null
        and (d.is_private = false or d.user_id = (select auth.uid()))
    )
  );
create policy "comments_update_own" on public.comments for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "comments_delete_own" on public.comments for delete to authenticated
  using ((select auth.uid()) = user_id);

-- comment_likes
create policy "comment_likes_select" on public.comment_likes for select
  using (exists (
    select 1 from public.comments c
    join public.diaries d on d.id = c.diary_id
    where c.id = comment_id and c.deleted_at is null and d.deleted_at is null
      and (d.is_private = false or d.user_id = (select auth.uid()))
  ));
create policy "comment_likes_insert" on public.comment_likes for insert to authenticated
  with check (
    (select auth.uid()) = user_id and
    exists (
      select 1 from public.comments c
      join public.diaries d on d.id = c.diary_id
      where c.id = comment_id and c.deleted_at is null and d.deleted_at is null
        and (d.is_private = false or d.user_id = (select auth.uid()))
    )
  );
create policy "comment_likes_delete" on public.comment_likes for delete to authenticated
  using ((select auth.uid()) = user_id);


-- ─── Seed: 감정 마스터 데이터 ──────────────────────────────
insert into public.emotions (id, label, image, sort_order) values
  ('happy',       '행복',   '/image/emotions/happy.svg',       1),
  ('sad',         '슬픔',   '/image/emotions/sad.svg',         2),
  ('angry',       '분노',   '/image/emotions/angry.svg',       3),
  ('scared',      '두려움', '/image/emotions/scared.svg',      4),
  ('anxious',     '불안',   '/image/emotions/anxious.svg',     5),
  ('joyful',      '기쁨',   '/image/emotions/joyful.svg',      6),
  ('disappointed','실망',   '/image/emotions/disappointed.svg',7),
  ('calm',        '평온',   '/image/emotions/calm.svg',        8),
  ('excited',     '흥분',   '/image/emotions/excited.svg',     9),
  ('confused',    '외로움', '/image/emotions/confused.svg',    10)
on conflict (id) do update set
  label      = excluded.label,
  image      = excluded.image,
  sort_order = excluded.sort_order,
  is_active  = true;
