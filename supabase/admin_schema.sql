-- ============================================================
-- Quiz AGCO — schema ADMIN (domande dinamiche + reset + auth)
-- Esegui in Supabase: SQL Editor > New query > incolla tutto > Run
-- ============================================================

-- 1) leaderboard: permetti DELETE solo agli utenti autenticati (admin)
drop policy if exists "auth delete" on public.leaderboard;
create policy "auth delete" on public.leaderboard
  for delete to authenticated using (true);

-- 1b) leaderboard: lettura/inserimento anche per autenticati.
-- Le policy "anon read"/"anon insert" (schema.sql) valgono SOLO per il ruolo anon.
-- Quando un browser è loggato in /admin, supabase-js invia il JWT utente → ruolo
-- "authenticated": senza queste policy il SELECT torna 0 righe (RLS deny) e la
-- classifica appare VUOTA in quel browser. Idempotenti.
drop policy if exists "auth read" on public.leaderboard;
create policy "auth read" on public.leaderboard
  for select to authenticated using (true);
drop policy if exists "auth insert" on public.leaderboard;
create policy "auth insert" on public.leaderboard
  for insert to authenticated with check (true);

-- 2) tabella DOMANDE (editabili dal pannello admin)
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  ordine integer not null default 0,
  categoria text,
  it_domanda text not null,
  it_opzioni jsonb not null,
  en_domanda text not null,
  en_opzioni jsonb not null,
  risposta_corretta smallint not null,
  cer text,
  note_it text,
  note_en text,
  attiva boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists questions_ordine_idx on public.questions (ordine);

alter table public.questions enable row level security;
drop policy if exists "q read anon" on public.questions;
create policy "q read anon" on public.questions for select to anon using (true);
drop policy if exists "q read auth" on public.questions;
create policy "q read auth" on public.questions for select to authenticated using (true);
drop policy if exists "q write auth" on public.questions;
create policy "q write auth" on public.questions for all to authenticated using (true) with check (true);

-- 3) SEED: le 10 domande attuali (esegui solo la prima volta)
insert into public.questions
  (ordine, categoria, it_domanda, it_opzioni, en_domanda, en_opzioni, risposta_corretta, cer, note_it, note_en)
values
  (1, 'imballaggi', 'Gli imballaggi di carta e cartone possono essere messi nel bidone apposito anche se sporchi di grasso?', '["Sì, sempre","No, devono essere puliti da grasso e liquidi","Sì, ma solo se il grasso è in piccola quantità","Vanno nel bidone degli imballaggi misti"]'::jsonb, 'Can paper and cardboard packaging be put in the dedicated bin even if dirty with grease?', '["Yes, always","No, they must be clean from grease and liquids","Yes, but only if there''s a small amount of grease","They go in the mixed packaging bin"]'::jsonb, 1, '15.01.01', 'Vale anche per cellophane/nylon (15.01.02)', 'Also applies to cellophane/nylon (15.01.02)'),
  (2, 'assorbenti', 'Filtri esausti, guanti e stracci sporchi: in quale contenitore vanno?', '["Ferro e acciaio","Rifiuto umido","Materiali assorbenti contaminati da sostanze pericolose [PERICOLOSO]","Imballaggi di materiale misto"]'::jsonb, 'Used filters, dirty gloves and rags: which container do they go in?', '["Iron and steel","Wet waste","Absorbent materials contaminated with hazardous substances [HAZARDOUS]","Mixed material packaging"]'::jsonb, 2, '15.02.02*', 'HP14 — stesso contenitore per la segatura sporca d''olio', 'HP14 — same bin for oil-soaked sawdust'),
  (3, 'bombolette', 'Le bombolette spray vuote sono un rifiuto pericoloso?', '["No, si buttano nel bidone ferro e acciaio","No, vanno negli imballaggi di materiale misto","Sì, sono rifiuto pericoloso — bidone imballaggi metallici pericolosi [PERICOLOSO]","Dipende dal contenuto originale"]'::jsonb, 'Are empty spray cans hazardous waste?', '["No, throw them in the iron and steel bin","No, they go in mixed material packaging","Yes, they are hazardous waste — hazardous metal packaging bin [HAZARDOUS]","It depends on the original content"]'::jsonb, 2, '15.01.11*', 'HP3 — codice UN 1950', 'HP3 — UN code 1950'),
  (4, 'fusti', 'Un fusto da 200L vuoto ma con residui di vernice/grasso: dove va?', '["Ferro e acciaio, è comunque un contenitore metallico","Imballaggi contenenti residui di sostanze pericolose [PERICOLOSO]","Rifiuti non specificati altrimenti","Imballaggi di materiale misto"]'::jsonb, 'An empty 200L drum with paint/grease residue: where does it go?', '["Iron and steel, it''s still a metal container","Packaging containing residues of hazardous substances [HAZARDOUS]","Waste not otherwise specified","Mixed material packaging"]'::jsonb, 1, '15.01.10*', 'HP3/HP4/HP13/HP14 — vale anche per cisternette e tanichette contaminate', 'HP3/HP4/HP13/HP14 — also IBCs and contaminated cans'),
  (5, 'neon', 'I neon (tubi fluorescenti) esauriti sono classificati come:', '["RAEE — vanno con PC e stampanti","Ferro e acciaio","Rifiuto pericoloso — tubi fluorescenti contenenti mercurio [PERICOLOSO]","Imballaggi di materiale misto"]'::jsonb, 'Spent neon tubes (fluorescent) are classified as:', '["WEEE — they go with PCs and printers","Iron and steel","Hazardous waste — fluorescent tubes containing mercury [HAZARDOUS]","Mixed material packaging"]'::jsonb, 2, '20.01.21*', 'HP5/HP6 — bidone separato, non con i RAEE', 'HP5/HP6 — separate bin, not with WEEE'),
  (6, 'batterie', 'Batterie al piombo e batterie al litio: possono andare nello stesso contenitore?', '["Sì, sono entrambe batterie","No — piombo (16.06.01*) è pericoloso, litio (16.06.05) no — bidoni separati","No, ma solo perché sono di dimensioni diverse","Sì, se entrambe scariche"]'::jsonb, 'Lead batteries and lithium batteries: can they go in the same container?', '["Yes, they are both batteries","No — lead (16.06.01*) is hazardous, lithium (16.06.05) is not — separate bins","No, but only because they are different sizes","Yes, if both discharged"]'::jsonb, 1, '16.06.01* vs 16.06.05', '16.06.01* = piombo pericoloso HP5/HP6/HP10 — 16.06.05 = litio non pericoloso', '16.06.01* = lead hazardous HP5/HP6/HP10 — 16.06.05 = lithium non-hazardous'),
  (7, 'oleodinamici', 'I tubi oleodinamici dismessi vanno classificati come:', '["Ferro e acciaio — sono tubi metallici","Rifiuti non specificati altrimenti","Componenti pericolosi — bidone specifico [PERICOLOSO]","Emulsioni oleose"]'::jsonb, 'Disposed hydraulic pipes are classified as:', '["Iron and steel — they are metal pipes","Waste not otherwise specified","Hazardous components — specific bin [HAZARDOUS]","Oil emulsions"]'::jsonb, 2, '16.01.21*', 'HP7/HP14 — l''olio residuo li rende pericolosi', 'HP7/HP14 — residual oil makes them hazardous'),
  (8, 'polverilaser', 'Le polveri prodotte dal taglio laser: pericolose o no?', '["No — vanno con la limatura di metalli ferrosi","No — vanno con ferro e acciaio","Sì — polveri laser = rifiuto pericoloso da trattamento fumi [PERICOLOSO]","Dipende dal materiale tagliato"]'::jsonb, 'Dust produced from laser cutting: hazardous or not?', '["No — they go with ferrous metal filings","No — they go with iron and steel","Yes — laser dust = hazardous waste from fume treatment [HAZARDOUS]","It depends on the cut material"]'::jsonb, 2, '10.02.07* vs 12.01.02', '10.02.07* HP14 polveri fumi — 12.01.02 frammenti ferrosi (non pericoloso) — DUE BIDONI DIVERSI', '10.02.07* HP14 fume dust — 12.01.02 ferrous fragments (non-hazardous) — TWO DIFFERENT BINS'),
  (9, 'plastica', 'Tappi, polistirolo, regge e bottiglie di plastica: dove vanno?', '["Imballaggi di plastica","Rifiuto umido","Imballaggi di materiale misto","Rifiuti non specificati altrimenti"]'::jsonb, 'Caps, polystyrene, straps and plastic bottles: where do they go?', '["Plastic packaging","Wet waste","Mixed material packaging","Waste not otherwise specified"]'::jsonb, 2, '15.01.06', 'Materiale misto, non plastica pura', 'Mixed material, not pure plastic'),
  (10, 'olio', 'L''olio minerale per motori e lubrificazione è un rifiuto pericoloso?', '["Sì — deve essere smaltito nel contenitore specifico per oli minerali [PERICOLOSO]","No — può andare negli imballaggi contaminati","No — basta assorbirlo con segatura e buttare quella","Dipende dalla quantità"]'::jsonb, 'Mineral oil for engines and lubrication is hazardous waste?', '["Yes — must be disposed of in the specific container for mineral oils [HAZARDOUS]","No — it can go in contaminated packaging","No — just absorb it with sawdust and throw that away","It depends on the quantity"]'::jsonb, 0, '13.02.05*', 'HP4/HP5/HP14 — la segatura assorbente diventa anch''essa 15.02.02*', 'HP4/HP5/HP14 — absorbent sawdust also becomes 15.02.02*');
