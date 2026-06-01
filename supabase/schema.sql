-- Quiz AGCO — schema classifica
-- Esegui in Supabase: Dashboard > SQL Editor > New query > incolla > Run

create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cognome text not null,
  punteggio integer not null default 0,
  tempo_totale_secondi integer not null default 0,
  risposte_corrette integer not null default 0,
  created_at timestamptz not null default now()
);

-- indice per ordinamento classifica
create index if not exists leaderboard_rank_idx
  on public.leaderboard (punteggio desc, tempo_totale_secondi asc);

-- RLS: chiunque (anon) può inserire il proprio punteggio e leggere la classifica.
-- Nessun update/delete da client.
alter table public.leaderboard enable row level security;

drop policy if exists "anon insert" on public.leaderboard;
create policy "anon insert" on public.leaderboard
  for insert to anon with check (true);

drop policy if exists "anon read" on public.leaderboard;
create policy "anon read" on public.leaderboard
  for select to anon using (true);
