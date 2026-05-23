-- stripe_event_id 컬럼 추가 + partial unique index
-- webhook 재시도 시 중복 처리 방지용

alter table public.usage_events
  add column if not exists stripe_event_id text;

create unique index if not exists idx_usage_events_stripe_event_id
  on public.usage_events (stripe_event_id)
  where stripe_event_id is not null;
