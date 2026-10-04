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
Nova migration que **revoga** o grant default herdado, alinhando com a intenção e fazendo o teste passar **sem** o enfraquecer e **sem** alterar comportamento (anon já lê 0 linhas):
```sql
revoke all on public.collab_opportunity_applications from anon;
-- (ou, no mínimo: revoke select on public.collab_opportunity_applications from anon;)
```
Opcional (robustez): auditar outras tabelas sensíveis (memberships, member_roles, audit_log, tasks…) para o mesmo padrão de grant default a anon e decidir se o hardening deve ser transversal — **fora do âmbito desta investigação**, a decidir pelo responsável.

## Resultado dos testes
- `009c_opportunities` **FALHA** em CI (observado nos checks `database` das PR recentes) pela asserção acima.
- Reprodução local do teste de BD **não possível neste ambiente** (sem `docker`/`supabase`/`psql`). A análise é estática sobre migrations + comportamento documentado do Supabase; a confirmação ao vivo faz-se com `supabase db reset` + consulta a `information_schema.role_table_grants` (grant anon presente) e a verificação de que um `SELECT` por `anon` devolve 0 linhas.
- `npm test` (suite JS) permanece **641/641** (não afectada por esta falha de BD).
