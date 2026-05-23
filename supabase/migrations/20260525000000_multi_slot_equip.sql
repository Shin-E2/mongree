-- 1. face 슬롯 check constraint 추가
alter table public.mongi_items
  drop constraint if exists mongi_items_slot_check;

alter table public.mongi_items
  add constraint mongi_items_slot_check
  check (slot in ('head', 'neck', 'body', 'face'));

-- 2. mongi_profiles 에 슬롯별 장착 컬럼 추가
alter table public.mongi_profiles
  add column if not exists equipped_head_id text references public.mongi_items(id) on delete set null,
  add column if not exists equipped_neck_id text references public.mongi_items(id) on delete set null,
  add column if not exists equipped_body_id text references public.mongi_items(id) on delete set null,
  add column if not exists equipped_face_id text references public.mongi_items(id) on delete set null;

-- 3. 기존 단일 equipped_item_id 를 해당 슬롯 컬럼으로 마이그레이션
update public.mongi_profiles mp
set
  equipped_head_id = case when mi.slot = 'head' then mp.equipped_item_id else equipped_head_id end,
  equipped_neck_id = case when mi.slot = 'neck' then mp.equipped_item_id else equipped_neck_id end,
  equipped_body_id = case when mi.slot = 'body' then mp.equipped_item_id else equipped_body_id end,
  equipped_face_id = case when mi.slot = 'face' then mp.equipped_item_id else equipped_face_id end
from public.mongi_items mi
where mp.equipped_item_id = mi.id;
