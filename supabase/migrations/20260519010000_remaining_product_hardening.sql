create or replace function public.create_diary_transaction(
  p_title text,
  p_content text,
  p_is_private boolean,
  p_emotion_ids text[] default '{}',
  p_tag_names text[] default '{}',
  p_images jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  new_diary_id uuid;
  emotion_id text;
  tag_name text;
  tag_id uuid;
  image_item jsonb;
  image_index integer := 0;
begin
  if (select auth.uid()) is null then
    raise exception 'authenticated user required';
  end if;

  insert into public.diaries (user_id, title, content, is_private)
  values ((select auth.uid()), p_title, p_content, coalesce(p_is_private, true))
  returning id into new_diary_id;

  foreach emotion_id in array coalesce(p_emotion_ids, '{}') loop
    if nullif(trim(emotion_id), '') is not null then
      insert into public.diary_emotions (diary_id, emotion_id)
      values (new_diary_id, emotion_id)
      on conflict do nothing;
    end if;
  end loop;

  foreach tag_name in array coalesce(p_tag_names, '{}') loop
    if nullif(trim(tag_name), '') is not null then
      tag_id := public.get_or_create_tag_id(tag_name);
      insert into public.diary_tags (diary_id, tag_id)
      values (new_diary_id, tag_id)
      on conflict do nothing;
    end if;
  end loop;

  for image_item in select value from jsonb_array_elements(coalesce(p_images, '[]'::jsonb)) loop
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
      new_diary_id,
      image_item ->> 'image_url',
      coalesce((image_item ->> 'sort_order')::integer, image_index),
      image_item ->> 'file_name',
      image_item ->> 'mime_type',
      nullif(image_item ->> 'file_size', '')::bigint
    );
  end loop;

  return new_diary_id;
end;
$$;

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
  where diary_id = p_diary_id
    and not (id = any(coalesce(p_kept_image_ids, '{}')));

  update public.diaries
  set title = p_title,
      content = p_content,
      is_private = coalesce(p_is_private, true),
      updated_at = now()
  where id = p_diary_id;

  delete from public.diary_emotions where diary_id = p_diary_id;
  foreach emotion_id in array coalesce(p_emotion_ids, '{}') loop
    if nullif(trim(emotion_id), '') is not null then
      insert into public.diary_emotions (diary_id, emotion_id)
      values (p_diary_id, emotion_id)
      on conflict do nothing;
    end if;
  end loop;

  delete from public.diary_tags where diary_id = p_diary_id;
  foreach tag_name in array coalesce(p_tag_names, '{}') loop
    if nullif(trim(tag_name), '') is not null then
      tag_id := public.get_or_create_tag_id(tag_name);
      insert into public.diary_tags (diary_id, tag_id)
      values (p_diary_id, tag_id)
      on conflict do nothing;
    end if;
  end loop;

  delete from public.diary_images
  where diary_id = p_diary_id
    and not (id = any(coalesce(p_kept_image_ids, '{}')));

  foreach kept_id in array coalesce(p_kept_image_ids, '{}') loop
    image_index := image_index + 1;
    update public.diary_images
    set sort_order = image_index
    where id = kept_id
      and diary_id = p_diary_id;
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

create or replace view public.public_diary_feed
with (security_invoker = true) as
select
  d.id,
  d.title,
  d.content,
  d.created_at,
  d.updated_at,
  d.is_private,
  d.user_id,
  p.nickname,
  p.profile_image,
  count(distinct dl.id)::integer as like_count,
  count(distinct c.id) filter (where c.deleted_at is null)::integer as comment_count
from public.diaries d
join public.profiles p on p.id = d.user_id
left join public.diary_likes dl on dl.diary_id = d.id
left join public.comments c on c.diary_id = d.id
where d.is_private = false
  and d.deleted_at is null
group by d.id, p.nickname, p.profile_image;

create or replace function public.get_public_diary_feed(
  p_limit integer default 12,
  p_offset integer default 0,
  p_search text default null,
  p_emotion_ids text[] default '{}',
  p_sort_by text default 'latest'
)
returns table (
  id uuid,
  title text,
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  is_private boolean,
  user_id uuid,
  profile jsonb,
  emotions jsonb,
  images jsonb,
  tags jsonb,
  like_count integer,
  comment_count integer,
  total_count bigint
)
language sql
security invoker
set search_path = public
as $$
  with filtered as (
    select f.*
    from public.public_diary_feed f
    where (
        nullif(trim(coalesce(p_search, '')), '') is null
        or f.title ilike '%' || p_search || '%' escape '\'
        or f.content ilike '%' || p_search || '%' escape '\'
      )
      and (
        cardinality(coalesce(p_emotion_ids, '{}')) = 0
        or exists (
          select 1
          from public.diary_emotions de
          where de.diary_id = f.id
            and de.emotion_id = any(coalesce(p_emotion_ids, '{}'))
        )
      )
  ),
  counted as (
    select f.*, count(*) over() as total_count
    from filtered f
  )
  select
    c.id,
    c.title,
    c.content,
    c.created_at,
    c.updated_at,
    c.is_private,
    c.user_id,
    jsonb_build_object(
      'id', c.user_id,
      'nickname', c.nickname,
      'profile_image', c.profile_image
    ) as profile,
    coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'diaryId', de.diary_id,
          'emotionId', de.emotion_id,
          'emotion', jsonb_build_object(
            'id', e.id,
            'label', e.label,
            'image', e.image
          )
        )
        order by e.sort_order nulls last, e.id
      )
      from public.diary_emotions de
      join public.emotions e on e.id = de.emotion_id
      where de.diary_id = c.id
    ), '[]'::jsonb) as emotions,
    coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', di.id,
          'diary_id', di.diary_id,
          'image_url', di.image_url,
          'sort_order', di.sort_order
        )
        order by di.sort_order
      )
      from public.diary_images di
      where di.diary_id = c.id
    ), '[]'::jsonb) as images,
    coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'diaryId', dt.diary_id,
          'tagId', dt.tag_id,
          'tag', jsonb_build_object('id', t.id, 'name', t.name)
        )
        order by t.name
      )
      from public.diary_tags dt
      join public.tags t on t.id = dt.tag_id
      where dt.diary_id = c.id
    ), '[]'::jsonb) as tags,
    c.like_count,
    c.comment_count,
    c.total_count
  from counted c
  order by
    case when p_sort_by = 'popular' then c.like_count end desc nulls last,
    case when p_sort_by = 'popular' then c.comment_count end desc nulls last,
    c.created_at desc
  limit greatest(1, least(coalesce(p_limit, 12), 50))
  offset greatest(0, coalesce(p_offset, 0));
$$;

create index if not exists idx_usage_events_ai_report_month
on public.usage_events (user_id, event_type, created_at desc)
where event_type = 'ai_report.generated';

revoke all on function public.create_diary_transaction(text, text, boolean, text[], text[], jsonb) from anon, public;
grant execute on function public.create_diary_transaction(text, text, boolean, text[], text[], jsonb) to authenticated;

revoke all on function public.update_diary_transaction(uuid, text, text, boolean, text[], text[], uuid[], jsonb) from anon, public;
grant execute on function public.update_diary_transaction(uuid, text, text, boolean, text[], text[], uuid[], jsonb) to authenticated;

revoke all on function public.get_public_diary_feed(integer, integer, text, text[], text) from anon, public;
grant execute on function public.get_public_diary_feed(integer, integer, text, text[], text) to anon, authenticated;
