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
revoke all on function public.get_or_create_tag_id(text) from anon, authenticated, public;
grant execute on function public.get_or_create_tag_id(text) to service_role;

drop policy if exists "tags_insert_authenticated" on public.tags;
create policy "tags_insert_authenticated_named" on public.tags
for insert to authenticated with check (name is not null and length(trim(name)) > 0 and length(trim(name)) <= 50);

create index if not exists idx_accounts_user_id on public.accounts(user_id);
create index if not exists idx_diary_tags_tag_id on public.diary_tags(tag_id);
create index if not exists idx_diary_likes_user_id on public.diary_likes(user_id);
create index if not exists idx_comments_user_id on public.comments(user_id);
create index if not exists idx_comment_likes_user_id on public.comment_likes(user_id);;
