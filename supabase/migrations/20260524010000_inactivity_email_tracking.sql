alter table public.mongi_profiles
  add column if not exists last_inactivity_email_sent date;
