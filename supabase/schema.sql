-- NeuroDream Database Schema
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'premium')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  journal_start_date timestamptz default now(),
  preferences jsonb default '{
    "interpretationStyle": "balanced",
    "defaultSleepTime": "23:00",
    "defaultWakeTime": "07:00"
  }'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- DREAMS TABLE
-- ============================================
create table if not exists public.dreams (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  title text not null,
  narrative text not null,
  symbols jsonb default '[]'::jsonb,
  themes text[] default '{}',
  emotions text[] default '{}',
  sleep_quality int not null check (sleep_quality between 1 and 5),
  bed_time time,
  wake_time time,
  estimated_sleep_stage text default 'REM' check (estimated_sleep_stage in ('N1', 'N2', 'N3', 'REM')),
  lucidity text default 'none' check (lucidity in ('none', 'partial', 'full')),
  vividness int not null check (vividness between 1 and 5),
  emotional_intensity int not null check (emotional_intensity between 1 and 5),
  valence text not null check (valence in ('positive', 'neutral', 'negative', 'mixed')),
  life_context text default '',
  current_stressors text[] default '{}',
  recent_events text[] default '{}',
  interpretation jsonb,
  wellness_actions jsonb default '[]'::jsonb,
  is_recurring boolean default false,
  recurring_pattern_id uuid,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- DREAM PATTERNS TABLE
-- ============================================
create table if not exists public.dream_patterns (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  common_symbols text[] default '{}',
  common_themes text[] default '{}',
  common_emotions text[] default '{}',
  insight text,
  first_occurrence timestamptz,
  last_occurrence timestamptz,
  frequency int default 0,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
alter table public.profiles enable row level security;
alter table public.dreams enable row level security;
alter table public.dream_patterns enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Dreams: users can CRUD their own dreams
create policy "Users can view own dreams"
  on public.dreams for select
  using (auth.uid() = user_id);

create policy "Users can insert own dreams"
  on public.dreams for insert
  with check (auth.uid() = user_id);

create policy "Users can update own dreams"
  on public.dreams for update
  using (auth.uid() = user_id);

create policy "Users can delete own dreams"
  on public.dreams for delete
  using (auth.uid() = user_id);

-- Dream patterns: users can CRUD their own patterns
create policy "Users can view own patterns"
  on public.dream_patterns for select
  using (auth.uid() = user_id);

create policy "Users can insert own patterns"
  on public.dream_patterns for insert
  with check (auth.uid() = user_id);

create policy "Users can update own patterns"
  on public.dream_patterns for update
  using (auth.uid() = user_id);

create policy "Users can delete own patterns"
  on public.dream_patterns for delete
  using (auth.uid() = user_id);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_dreams_user_id on public.dreams(user_id);
create index if not exists idx_dreams_date on public.dreams(user_id, date desc);
create index if not exists idx_dreams_valence on public.dreams(user_id, valence);
create index if not exists idx_dream_patterns_user_id on public.dream_patterns(user_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger dreams_updated_at
  before update on public.dreams
  for each row execute procedure public.update_updated_at();
