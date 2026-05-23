alter table public.mongi_items
  add column if not exists price_points integer not null default 0,
  add column if not exists requires_pro boolean not null default false;

alter table public.mongi_profiles
  add column if not exists cloud_points integer not null default 0;

insert into public.mongi_items (id, name, description, slot, asset_url, is_default, sort_order, price_points, requires_pro)
values
  ('mongi_ribbon_pin', '리본 머리핀', '사랑스러운 분홍 리본 머리핀이에요.', 'head', '/items/mongi/ribbon-pin.svg', false, 40, 50, false),
  ('mongi_flower_hat', '꽃 모자', '봄날의 작은 꽃 모자예요.', 'head', '/items/mongi/flower-hat.svg', false, 50, 80, false),
  ('mongi_crown', '작은 왕관', '몽이를 위한 작은 황금 왕관이에요.', 'head', '/items/mongi/crown.svg', false, 60, 150, false),
  ('mongi_bow_tie', '나비 넥타이', '작고 귀여운 나비 넥타이예요.', 'neck', '/items/mongi/bow-tie.svg', false, 70, 80, false),
  ('mongi_bell_collar', '방울 목걸이', '흔들리면 작은 소리가 나는 방울 목걸이예요.', 'neck', '/items/mongi/bell-collar.svg', false, 80, 100, false),
  ('mongi_heart_badge', '하트 배지', '몽이의 감정을 표현하는 하트 배지예요.', 'body', '/items/mongi/heart-badge.svg', false, 90, 60, false),
  ('mongi_rainbow_cape', '무지개 망토', '색색의 무지개 망토예요. Pro 전용.', 'body', '/items/mongi/rainbow-cape.svg', false, 100, 120, true)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  slot = excluded.slot,
  asset_url = excluded.asset_url,
  is_default = excluded.is_default,
  sort_order = excluded.sort_order,
  price_points = excluded.price_points,
  requires_pro = excluded.requires_pro;

create or replace function public.purchase_mongi_item(
  p_user_id uuid,
  p_item_id text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item record;
  v_owned boolean;
  v_points integer;
  v_is_pro boolean;
begin
  select price_points, requires_pro
  into v_item
  from public.mongi_items
  where id = p_item_id;

  if not found then
    return jsonb_build_object('success', false, 'error', 'ITEM_NOT_FOUND');
  end if;

  if v_item.price_points = 0 then
    return jsonb_build_object('success', false, 'error', 'ITEM_NOT_FOR_SALE');
  end if;

  select exists(
    select 1 from public.user_mongi_items
    where user_id = p_user_id and item_id = p_item_id
  ) into v_owned;

  if v_owned then
    return jsonb_build_object('success', false, 'error', 'ALREADY_OWNED');
  end if;

  if v_item.requires_pro then
    select exists(
      select 1 from public.subscriptions
      where user_id = p_user_id
        and status in ('active', 'trialing')
    ) into v_is_pro;

    if not v_is_pro then
      return jsonb_build_object('success', false, 'error', 'REQUIRES_PRO');
    end if;
  end if;

  select coalesce(cloud_points, 0)
  into v_points
  from public.mongi_profiles
  where user_id = p_user_id;

  if v_points < v_item.price_points then
    return jsonb_build_object('success', false, 'error', 'INSUFFICIENT_POINTS');
  end if;

  update public.mongi_profiles
  set cloud_points = cloud_points - v_item.price_points,
      updated_at = now()
  where user_id = p_user_id;

  insert into public.user_mongi_items (user_id, item_id, source)
  values (p_user_id, p_item_id, 'purchase');

  return jsonb_build_object(
    'success', true,
    'itemId', p_item_id,
    'pointsSpent', v_item.price_points,
    'remainingPoints', v_points - v_item.price_points
  );
end;
$$;

revoke all on function public.purchase_mongi_item from public;
grant execute on function public.purchase_mongi_item to authenticated;
