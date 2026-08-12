-- Letterdrop Cloud 1.0
-- Run once in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.newsletters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  title text not null default 'Untitled newsletter',
  project jsonb not null,
  revision bigint not null default 1,
  device_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (owner_id, client_id)
);

create index if not exists newsletters_owner_updated_idx
  on public.newsletters (owner_id, updated_at desc)
  where deleted_at is null;

alter table public.newsletters enable row level security;

create policy "owners select newsletters"
  on public.newsletters for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "owners insert newsletters"
  on public.newsletters for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "owners update newsletters"
  on public.newsletters for update to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "owners delete newsletters"
  on public.newsletters for delete to authenticated
  using ((select auth.uid()) = owner_id);

create or replace function public.touch_newsletter_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists newsletters_touch_updated_at on public.newsletters;
create trigger newsletters_touch_updated_at
before update on public.newsletters
for each row execute function public.touch_newsletter_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'newsletter-images',
  'newsletter-images',
  false,
  12582912,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Object paths must be: user-id/newsletter-id/image-id.ext
create policy "owners read newsletter images"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'newsletter-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "owners upload newsletter images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'newsletter-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "owners update newsletter images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'newsletter-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'newsletter-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "owners delete newsletter images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'newsletter-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

