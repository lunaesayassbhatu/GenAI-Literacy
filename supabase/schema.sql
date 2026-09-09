-- ASU GenAI Lab / ASU Sunwave — Supabase schema
--
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- after creating a new project. Safe to re-run: every statement is idempotent.
--
-- These tables and columns match exactly what src/app/utils/userData.ts,
-- migrateToSupabase.ts, and moduleProgress.ts already call — no app code
-- changes are needed once this schema exists and .env.local points at a
-- real project.

-- ---------------------------------------------------------------------------
-- profiles: one row per user, mirrors basic account/profile info
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default '',
  user_type text not null default 'student',
  year text,
  major text,
  language text not null default 'en'
);

alter table public.profiles enable row level security;

drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- user_stats: XP, streaks, and other rollup stats, one row per user
-- ---------------------------------------------------------------------------
create table if not exists public.user_stats (
  id uuid primary key references auth.users(id) on delete cascade,
  learning_days integer not null default 0,
  best_streak integer not null default 0,
  last_check_in date,
  assignments_analyzed integer not null default 0,
  completed_games text[] not null default '{}',
  xp integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_stats enable row level security;

drop policy if exists "Users manage own stats" on public.user_stats;
create policy "Users manage own stats"
  on public.user_stats
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- badges: one row per (user, badge) earned
-- ---------------------------------------------------------------------------
create table if not exists public.badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null,
  name text not null,
  description text not null,
  icon text not null,
  earned_date timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.badges enable row level security;

drop policy if exists "Users manage own badges" on public.badges;
create policy "Users manage own badges"
  on public.badges
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- module_progress: furthest step reached per (user, module)
-- ---------------------------------------------------------------------------
create table if not exists public.module_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  step_index integer not null default 0,
  total_steps integer not null default 0,
  question_variant integer,
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

alter table public.module_progress enable row level security;

drop policy if exists "Users manage own module progress" on public.module_progress;
create policy "Users manage own module progress"
  on public.module_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- module_xp: XP earned (and committed) per (user, module)
-- ---------------------------------------------------------------------------
create table if not exists public.module_xp (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  xp integer not null default 0,
  committed_xp integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

alter table public.module_xp enable row level security;

drop policy if exists "Users manage own module xp" on public.module_xp;
create policy "Users manage own module xp"
  on public.module_xp
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
