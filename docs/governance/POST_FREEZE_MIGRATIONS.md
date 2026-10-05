<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Migrations pós-freeze — governança

## Baseline congelada
A fotografia histórica dos pacotes **09F / 10C / 10D / 10E** congela a base de dados em **42 migrations**. Esses pacotes **não adicionaram** migrations à baseline; os seus validadores continuam a afirmar isso.

## Porquê o freeze
Os pacotes 10C–10E fecharam o estado canónico (v0.40.0). O número de migrations é um invariante de não-regressão: impede que alterações posteriores introduzam schema não revisto sem decisão explícita.

## Migrations pós-freeze (allowlist governada)
Migrations **posteriores** à baseline são permitidas **apenas** quando registadas, por **identidade de filename** (não por data), em:

- `supabase/migrations-baseline.json` → `{ "baseline": 42, "postFreeze": [ … ] }`

O guardrail partilhado `scripts/lib/migration-guard.mjs` verifica:
- total actual = `baseline + postFreeze.length`;
- toda migration com data pós-freeze (2026-09+) consta da allowlist;
- toda a allowlist existe no disco.

Assim, uma migration pós-freeze **não declarada** (ex.: uma 44.ª) **continua a falhar** testes e validadores — a excepção é governada por identidade, não por um regex permissivo de data.

## Entradas

### 1. `20261004120000_revoke_anon_opportunity_applications.sql`
- **Data real:** 2026-10-04.
- **Origem:** investigação `docs/qa/RLS_009C_OPPORTUNITIES_INVESTIGATION.md` (falha CI `009c_opportunities`).
- **Motivo de segurança:** `anon` herdou das *default privileges* do Supabase grants indevidos em `public.collab_opportunity_applications` (sem fluxo legítimo directo; RPCs são `authenticated`; entrada pública via Edge Function + `service_role`). A migration faz `revoke all … from anon` — alinha os grants com a intenção documentada e mantém a RLS como segunda barreira. **Sem** alteração de policies, RPCs, default privileges globais ou outras tabelas; **sem** mudança de comportamento (a RLS já bloqueava).
- **PR/origem:** `fix/rls-opportunity-applications-anon-grants`.

## Regra para futuras migrations
Acrescentar uma entrada à allowlist (`migrations-baseline.json` + esta nota) exige **HUMAN GATE**. Não editar migrations históricas; não aumentar a baseline (ela representa a fotografia 10C/10D/10E); registar sempre a nova migration por filename exacto e motivo.
