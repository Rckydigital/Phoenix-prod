-- ============================================================
-- Espace client RCKY DIGITAL / Automation Lab
-- À coller une seule fois dans Supabase > SQL Editor > New query > Run.
-- ============================================================

-- 1. Profils clients (un par compte)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  company text,
  lang text default 'fr',
  plan text default 'essai',                      -- essai | starter | business | premium
  trial_ends_at timestamptz default (now() + interval '14 days'),
  subscription_status text default 'trialing',    -- trialing | active | past_due | canceled
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- 2. Automatisations installées chez le client (créées par RCKY DIGITAL depuis le tableau Supabase)
create table if not exists public.automations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,                              -- ex. « LeadFlow »
  kind text,                                       -- leadflow | adminflow | supportflow | autre
  status text not null default 'en_preparation',   -- en_preparation | active | en_pause
  description text,
  created_at timestamptz default now()
);

-- 3. Journal d'activité (demandes traitées, réponses, relances, rendez-vous)
create table if not exists public.automation_events (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid not null references public.automations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null default 'autre',              -- demande | reponse | relance | rdv | autre
  label text,
  created_at timestamptz default now()
);
create index if not exists automation_events_user_date on public.automation_events (user_id, created_at desc);

-- 4. Sécurité : chaque client ne voit que ses propres lignes
alter table public.profiles enable row level security;
alter table public.automations enable row level security;
alter table public.automation_events enable row level security;

drop policy if exists "profil : lecture" on public.profiles;
create policy "profil : lecture" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profil : modification" on public.profiles;
create policy "profil : modification" on public.profiles for update using (auth.uid() = id);
drop policy if exists "automatisations : lecture" on public.automations;
create policy "automatisations : lecture" on public.automations for select using (auth.uid() = user_id);
drop policy if exists "activité : lecture" on public.automation_events;
create policy "activité : lecture" on public.automation_events for select using (auth.uid() = user_id);

-- Accès de l'API : lecture pour les clients connectés uniquement (rien pour les visiteurs anonymes).
-- Nécessaire si l'option « Automatically expose new tables » est décochée à la création du projet.
grant usage on schema public to authenticated, service_role;
grant select on public.profiles, public.automations, public.automation_events to authenticated;
grant all on public.profiles, public.automations, public.automation_events to service_role;
revoke all on public.profiles, public.automations, public.automation_events from anon;

-- Le client ne peut modifier que son nom, son entreprise et sa langue (jamais son abonnement)
revoke update on public.profiles from authenticated;
grant update (full_name, company, lang) on public.profiles to authenticated;

-- 5. Création automatique du profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, company, lang)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'company',
    coalesce(new.raw_user_meta_data ->> 'lang', 'fr')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();
