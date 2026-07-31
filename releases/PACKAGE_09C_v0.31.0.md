# Release — Pacote 09C v0.31.0 (Oportunidades públicas, candidaturas e participação)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Primeiro pacote **funcional** da Série 09. A Área Colaborativa passa a ser também a infraestrutura de participação prática. Produção bloqueada; dataset canónico 0.11.3 inalterado; sem e-mail transacional; `service_role` fora do browser.

## Jornada

`público lê /oportunidades → "Tenho interesse" → login → perfil mínimo → candidatura → decisão do dono do projeto → participação`

## Descoberta pública (sem autenticação)

- Rotas `/oportunidades` e `/oportunidades/:slug` (Portal). Vistas `src/views/opportunities-public.js`: lista (o quê/quando/onde/prazo/estado/ação) e detalhe (objetivo, esforço, requisitos, acessibilidade, custo, remuneração, organização).
- **Snapshot estático `opportunities-public.json` começa vazio e honesto** — nenhuma oportunidade inventada; estado vazio explícito.
- **Partilha iniciada pelo utilizador** (Web Share API / copiar link / Facebook / X / mailto) — **sem OAuth, sem publicação automática nas redes; e-mail apenas como partilha local**.
- **A página pública nunca mostra candidatos nem nomes.**

## Modelo de dados e segurança (2 migrations)

- `collab_opportunities` + `collab_opportunity_applications` sob RLS.
- **Público lê apenas `visibility='public' and status='published'`**; membros veem members-only publicadas; quem tem `opportunities.manage` vê tudo.
- **Candidatos SEMPRE privados**: `collab_opportunity_applications` **não** é concedida a `anon`; o próprio vê a sua candidatura, quem gere vê todas, mais ninguém.
- **7 RPCs `security definer`** (escrita só por aqui): `upsert`, `set_status` (publicar exige campos), `apply` (uma por pessoa; menores bloqueados), `withdraw`, `decide` (aceite/não-selecionado), `add_participant` (manual, exige membro válido), `remove_participant` (exige razão interna). Tudo auditado.

## Menores — bloqueados até política

`minors_allowed` default `false`; a candidatura lança `minors_policy_pending`; `readiness.minorParticipation = blocked-until-policy`. Campos de idade preparados, mas a participação de menores **não é ativada por inferência**.

## Perfil mínimo e decisão

Perfil mínimo: nome, e-mail validado, consentimento, contacto preferido, interesses, disponibilidade básica (reutiliza o perfil existente). Estados da candidatura: `submitted → accepted | not-selected | withdrawn | removed`. **Sem workflow complexo, sem lista de espera automática.** Notas internas nunca são visíveis ao candidato.

## Módulo e permissões (antes → depois)

- Módulos **25 → 26** (`opportunities`). Permissões **149 → 152** (`opportunities.view/apply/manage`). Migrations **+2**. Cascata de contagens atualizada em todos os validadores/testes.
- Área Colaborativa: módulo `opportunities` com estado honesto (opera com dados reais em **staging**; a demonstração não cria oportunidades) — padrão do 08L.

## Contratos, testes e CI

- Contratos `public/data/`: `opportunity-model`, `opportunity-application-model`, `opportunity-sharing-model`, `package-09c-readiness`.
- `scripts/09c/validate-09c.mjs` (na cadeia `validate`); teste JS `tests/opportunities-09c.test.mjs`; E2E público `tests/e2e/portal/opportunities.spec.mjs`; teste SQL/RLS `supabase/collab-tests/009c_opportunities.test.sql`.
- CI: `09c-ci.yml` (node) + `09c-database-tests.yml` (SQL/RLS).

## Verificação

`npm run validate` (cadeia completa + contexto 09C), `npm test` (491 testes), `npm run build`, `npm run smoke` — verdes localmente. **SQL/RLS e Playwright correm apenas no CI** (sem npm/docker/browser local).

> Não ativa produção, Proteus, pagamentos nem e-mail transacional. A política de menores é uma decisão institucional pendente.
