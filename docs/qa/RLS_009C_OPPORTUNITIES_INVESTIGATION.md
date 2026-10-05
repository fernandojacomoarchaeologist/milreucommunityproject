# Investigação — falha RLS/CI `009c_opportunities`

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
> Âmbito: **apenas** a falha pré-existente `applications must not be selectable by anon`. Não toca em disseminação, CMYK nem Ciência Aberta. **Nenhuma alteração funcional aplicada** (só esta investigação).

## Asserção que falha
`supabase/collab-tests/009c_opportunities.test.sql` (L36–38):
```sql
select count(*) into app_anon_grant from information_schema.role_table_grants
where table_schema='public' and table_name='collab_opportunity_applications'
  and grantee='anon' and privilege_type='SELECT';
if app_anon_grant <> 0 then raise exception 'applications must not be selectable by anon'; end if;
```
O teste exige que o role **`anon` não tenha grant `SELECT`** na tabela `collab_opportunity_applications`. Falha ⇒ o grant existe (`app_anon_grant <> 0`). (Também verificado por `009c1_opportunities_journey.test.sql` L24–26.)

## Causa raiz
1. A migration `20260730100000_opportunities_foundation.sql` (L71–73) concede `SELECT` **apenas a `authenticated`** e comenta explicitamente «Candidaturas NUNCA são legíveis por anon». **Não concede** anon e **não o revoga**.
2. **Nenhuma** migration concede `anon` em `collab_opportunity_applications` (grep exaustivo); não há grants *blanket* (`ALL TABLES` / `ALTER DEFAULT PRIVILEGES`) a anon no repositório; `seed.sql` está vazio.
3. O CI (`09c-database-tests.yml`) corre `supabase start` + `supabase db reset`. O **Supabase base** aplica, antes das migrations do projecto, as *default privileges* padrão: `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role`. **Toda a tabela nova** em `public` nasce, por isso, com `SELECT` (e mais) concedido a `anon`.
4. A foundation **não revoga** esse grant default (ao contrário do padrão usado noutras tabelas — ex.: `revoke select on public.collab_audit_log from authenticated`). ⇒ `anon` fica com `SELECT` em `collab_opportunity_applications` por herança das *default privileges*, contrariando o comentário/intenção da própria migration.

## O que o grant NÃO implica (segurança efectiva)
A RLS **protege os dados**:
- `alter table ... enable row level security` (L69).
- Única policy de SELECT: `collab_opportunity_applications_select ... for select **to authenticated**` com `using (applicant_user_id = auth.uid() or collab_has_permission('opportunities.manage', project_id))` (L90–92).
- **Não existe** policy `to anon`, `to public` nem sem restrição de role.

Com RLS activa e **nenhuma policy para `anon`**, um `SELECT` de `anon` devolve **0 linhas** (negação por omissão). **`anon` não consegue ler qualquer candidatura.** Não há exposição de dados.

## Risco
- **Exposição activa: NENHUMA** (RLS bloqueia a leitura por anon).
- **Gap de defense-in-depth: SIM** — `anon` detém um grant `SELECT` (e, por ALL, provavelmente INSERT/UPDATE/DELETE) que **não devia ter** segundo a intenção documentada. Risco latente: se alguma vez for adicionada uma policy permissiva a `anon`/`public`, os dados ficariam expostos sem outra barreira.

## Classificação
**NÃO é A** (não há leitura por anon — RLS bloqueia). **NÃO é B** (o teste está **correcto**: reflecte a intenção documentada «NUNCA legíveis por anon»; não é desactualizado nem mal configurado). O teste **não deve ser enfraquecido**.

→ **Gap de hardening (defense-in-depth) no lado da migration**, a resolver com fix mínimo **de produção** (não de teste), sob **HUMAN GATE** (é mudança de migration, ainda que sem alteração de comportamento efectivo). *(Único ponto de ambiguidade — se o modelo de segurança do projecto for assumido como «RLS é a única fronteira, grants a anon são irrelevantes» — fica para decisão humana; mas o comentário da migration é fonte canónica a favor do no-grant.)*

## Ficheiros afectados
- Causa: `supabase/migrations/20260730100000_opportunities_foundation.sql` (falta `revoke`).
- Teste (correcto, **não alterar**): `supabase/collab-tests/009c_opportunities.test.sql`, `009c1_opportunities_journey.test.sql`.
- CI: `.github/workflows/09c-database-tests.yml`.

## Recomendação (fix mínimo — requer HUMAN GATE; não aplicado)

### `anon` precisa legitimamente de algum privilégio nesta tabela?
Verificado: **NÃO.** Os 7 RPCs de candidatura (`collab_opportunity_apply`, `…_withdraw`, `…_decide`, etc.) são concedidos **só a `authenticated`**; `anon` **não** tem `EXECUTE` em nenhum deles, nem há caminho anon-facing (a entrada pública de dados, quando existe no projecto, passa por Edge Function + RPC `service_role`, nunca por INSERT directo de anon — regra 08E). Logo `anon` **não precisa** de `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `REFERENCES` nem `TRIGGER` em `collab_opportunity_applications`. **Todos** os grants que `anon` herdou do default `GRANT ALL` são indevidos (não só a leitura).

### Fix recomendado
Como o privilégio indevido **não** é apenas leitura (anon não precisa de nada), aplica-se **`REVOKE ALL`**:
```sql
revoke all on public.collab_opportunity_applications from anon;
```
→ remove o `SELECT` indevido (faz o teste passar), remove também INSERT/UPDATE/DELETE/… indevidos (hardening completo), mantém a **RLS como segunda barreira** e **não altera comportamento legítimo** (anon nunca usou nenhum; as escritas vão por RPCs de `authenticated`).

*Alternativa estritamente mínima* (só para passar o teste, se se preferir a mudança mais estreita): `revoke select on public.collab_opportunity_applications from anon;` — mas deixaria os outros grants default indevidos por limpar.

Opcional (robustez): auditar outras tabelas sensíveis (memberships, member_roles, audit_log, tasks…) para o mesmo padrão de grant default a anon e decidir se o hardening deve ser transversal — **fora do âmbito desta investigação**, a decidir pelo responsável.

## Nomenclatura dos testes (esclarecimento)
- **`641/641`** = suite **JS/Node** (`npm test` → `node --test tests/*.test.mjs`): lógica de `src/`, validadores, contratos. **Não** executa SQL.
- **`009c_opportunities`** = teste **de base de dados (SQL)** em `supabase/collab-tests/`, corrido pelo workflow de CI **`09c-database-tests.yml`** (`supabase db reset` + `psql`), referido também em `09c1-ci.yml`. É o check **`database`** do CI.
- **`009c_opportunities` NÃO está incluído nos 641** — são suites distintas (JS vs SQL/BD). Os 641 estão verdes; a falha está apenas no check `database`.
- **Estado esperado após a migration proposta:** `009c_opportunities` passa (`app_anon_grant=0`), o check `database`/`09c` fica verde, e `npm test` mantém-se **641/641** (inalterado — suite diferente).

## Resultado dos testes
- `009c_opportunities` **FALHA** em CI (observado nos checks `database` das PR recentes) pela asserção acima.
- Reprodução local do teste de BD **não possível neste ambiente** (sem `docker`/`supabase`/`psql`). A análise é estática sobre migrations + comportamento documentado do Supabase; a confirmação ao vivo faz-se com `supabase db reset` + consulta a `information_schema.role_table_grants` (grant anon presente) e a verificação de que um `SELECT` por `anon` devolve 0 linhas.
- `npm test` (suite JS) permanece **641/641** (não afectada por esta falha de BD).

---

## Resolução (PR `fix/rls-opportunity-applications-anon-grants`)
**ROOT CAUSE** → grants herdados das default privileges do Supabase a `anon` em `collab_opportunity_applications` (ver acima).
**FIX** → nova migration `20261004120000_revoke_anon_opportunity_applications.sql`: `revoke all … from anon` (data real 2026-10-04). Sem tocar em policies/RPCs/default privileges/outras tabelas.
**MECANISMO** → a baseline histórica (42) é preservada; a migration é registada numa **allowlist pós-freeze governada por identidade** (`supabase/migrations-baseline.json` + `scripts/lib/migration-guard.mjs` + `docs/governance/POST_FREEZE_MIGRATIONS.md`). Guardrails 09F/10A/10C/10D/10E e o teste `proteus-boundary-10e` passam a validar `baseline + allowlist`; uma migration não declarada continua a falhar.
**VERIFICATION** → `npm test` 641/641; `npm run validate` exit 0; guardrail testado (migration fictícia não-allowlisted ⇒ FAIL). O teste SQL `009c_opportunities` e o check `database` passam a estar alinhados (anon sem grants), mas só confirmáveis em CI (sem docker/supabase local). **HUMAN GATE antes do merge.**
