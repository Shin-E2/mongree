
-- ─── 1. diary_likes SELECT 정책 수정 ───────────────────────
-- 기존: 공개 일기만 좋아요 조회 가능 (버그: 내 비공개 일기 좋아요가 안 보임)
-- 변경: 공개 일기 OR 내 일기의 좋아요 조회 가능
drop policy if exists "diary_likes_select_public" on public.diary_likes;

create policy "diary_likes_select_visible" on public.diary_likes
  for select using (
    exists (
      select 1 from public.diaries d
      where d.id = diary_id
        and d.deleted_at is null
        and (d.is_private = false or d.user_id = (select auth.uid()))
    )
  );


-- ─── 2. get_or_create_tag_id 함수 추가 ────────────────────
-- 태그 이름으로 조회, 없으면 생성 후 uuid 반환
-- Server Action에서 태그 upsert 시 사용 (타입 파일에 이미 선언되어 있음)
create or replace function public.get_or_create_tag_id(tag_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  tag_id uuid;
begin
  select id into tag_id
  from public.tags
  where name = trim(tag_name);

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


-- ─── 3. handle_new_user 함수 개선 ─────────────────────────
-- 변경점:
--   - Google OAuth는 avatar_url을 사용 (기존 코드는 profile_image 키를 봤음)
--   - 닉네임 중복 시 suffix 붙여서 유일성 자동 확보
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_nickname  text;
  final_nickname text;
  suffix         int := 0;
begin
  base_nickname := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'nickname'), ''),
    split_part(coalesce(new.email, ''), '@', 1),
    'user_' || substr(new.id::text, 1, 8)
  );

  final_nickname := base_nickname;

  -- 닉네임 중복 시 숫자 suffix 붙여서 유일성 확보 (예: john -> john1 -> john2)
  while exists (select 1 from public.profiles where nickname = final_nickname) loop
    suffix := suffix + 1;
    final_nickname := base_nickname || suffix::text;
  end loop;

  insert into public.profiles (
    id, username, nickname, full_name, profile_image,
    zone_code, address, detail_address, is_profile_complete
  ) values (
    new.id,
    split_part(coalesce(new.email, ''), '@', 1),
    final_nickname,
    new.raw_user_meta_data ->> 'full_name',
    -- Google OAuth는 avatar_url, 일반 가입은 profile_image 키 사용
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'profile_image'
    ),
    coalesce(new.raw_user_meta_data ->> 'zoneCode',      new.raw_user_meta_data ->> 'zone_code'),
    new.raw_user_meta_data ->> 'address',
    coalesce(new.raw_user_meta_data ->> 'detailAddress', new.raw_user_meta_data ->> 'detail_address'),
    false
  )
  on conflict (id) do update set
    nickname      = excluded.nickname,
    full_name     = excluded.full_name,
    profile_image = excluded.profile_image,
    zone_code     = excluded.zone_code,
    address       = excluded.address,
    detail_address = excluded.detail_address,
    updated_at    = now();

  return new;
end;
$$;

revoke all on function public.handle_new_user() from anon, authenticated, public;


-- ─── 4. accounts 테이블 제거 ───────────────────────────────
-- Supabase Auth가 OAuth를 auth.identities에서 네이티브 처리하므로 불필요
drop table if exists public.accounts cascade;
;
