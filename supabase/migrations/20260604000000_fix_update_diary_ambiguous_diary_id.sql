-- update_diary_transaction 의 "column reference diary_id is ambiguous" 수정.
-- 원인: RETURNS TABLE(diary_id uuid, ...) 의 OUT 컬럼 diary_id 가 함수 스코프 변수가 되어
--       본문의 테이블 컬럼 diary_id(한정자 없음)와 충돌 (plpgsql variable_conflict = error).
-- 해결: 본문 WHERE/AND 절의 diary_id 를 테이블 한정자(diary_images.diary_id 등)로 명시.
--       반환 구조/시그니처는 그대로 유지 (클라이언트 계약 불변).

create or replace function public.update_diary_transaction(
  p_diary_id uuid,
  p_title text,
  p_content text,
  p_is_private boolean,
  p_emotion_ids text[] default '{}',
  p_tag_names text[] default '{}',
  p_kept_image_ids uuid[] default '{}',
  p_new_images jsonb default '[]'::jsonb
)
returns table (
  diary_id uuid,
  removed_image_urls text[],
  was_private boolean,
  is_private boolean
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  existing_diary public.diaries%rowtype;
  emotion_id text;
  tag_name text;
  tag_id uuid;
  image_item jsonb;
  image_index integer := 0;
  kept_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'authenticated user required';
  end if;

  select *
  into existing_diary
  from public.diaries
  where id = p_diary_id
    and deleted_at is null
  for update;

  if not found then
    raise exception 'diary not found';
  end if;

  if existing_diary.user_id <> (select auth.uid()) then
    raise exception 'not diary owner';
  end if;

  select coalesce(array_agg(image_url), '{}')
  into removed_image_urls
  from public.diary_images
  where diary_images.diary_id = p_diary_id
    and not (id = any(coalesce(p_kept_image_ids, '{}')));

  update public.diaries
  set title = p_title,
      content = p_content,
      is_private = coalesce(p_is_private, true),
      updated_at = now()
  where id = p_diary_id;

  delete from public.diary_emotions where diary_emotions.diary_id = p_diary_id;
  foreach emotion_id in array coalesce(p_emotion_ids, '{}') loop
    if nullif(trim(emotion_id), '') is not null then
      insert into public.diary_emotions (diary_id, emotion_id)
      values (p_diary_id, emotion_id)
      on conflict do nothing;
    end if;
  end loop;

  delete from public.diary_tags where diary_tags.diary_id = p_diary_id;
  foreach tag_name in array coalesce(p_tag_names, '{}') loop
    if nullif(trim(tag_name), '') is not null then
      tag_id := public.get_or_create_tag_id(tag_name);
      insert into public.diary_tags (diary_id, tag_id)
      values (p_diary_id, tag_id)
      on conflict do nothing;
    end if;
  end loop;

  delete from public.diary_images
  where diary_images.diary_id = p_diary_id
    and not (id = any(coalesce(p_kept_image_ids, '{}')));

  foreach kept_id in array coalesce(p_kept_image_ids, '{}') loop
    image_index := image_index + 1;
    update public.diary_images
    set sort_order = image_index
    where id = kept_id
      and diary_images.diary_id = p_diary_id;
  end loop;

  for image_item in select value from jsonb_array_elements(coalesce(p_new_images, '[]'::jsonb)) loop
    image_index := image_index + 1;
    insert into public.diary_images (
      diary_id,
      image_url,
      sort_order,
      file_name,
      mime_type,
      file_size
    )
    values (
      p_diary_id,
      image_item ->> 'image_url',
      image_index,
      image_item ->> 'file_name',
      image_item ->> 'mime_type',
      nullif(image_item ->> 'file_size', '')::bigint
    );
  end loop;

  diary_id := p_diary_id;
  was_private := existing_diary.is_private;
  is_private := coalesce(p_is_private, true);
  return next;
end;
$$;
