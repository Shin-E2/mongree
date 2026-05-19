drop policy if exists "ai_reports_delete_owner" on public.ai_reports;
create policy "ai_reports_delete_owner"
  on public.ai_reports
  for delete
  to authenticated
  using (auth.uid() = user_id);
