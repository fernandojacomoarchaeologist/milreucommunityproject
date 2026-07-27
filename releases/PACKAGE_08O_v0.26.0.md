# Release — Pacote 08O v0.26.0 (Fixes pós-merge: carrossel e auditoria da Área Colaborativa)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Pacote de correção pós-merge cumulativo sobre 08A–08N. **Sem novos módulos, permissões, workflows, cadeias de aprovação ou migrations.** Sem alteração do dataset canónico, sem ativação de produção e sem efeitos públicos.

## Carrossel da Home

- **Asset do Inquérito 2026:** substituído pelo PNG fornecido `public/media/home/inquerito-2026-carousel.png` (1030×1426, SHA-256 `ea58885f4c16dbcb524544ce80de46e93bb21bb594b68be6a991ec71f6ccebba`). Referência antiga (`inquerito-2026.webp`) removida e desreferenciada.
- **Caixa canónica:** o primeiro card (Museu de Memórias) é a fonte canónica. O viewport e os três slides passam a ter **altura fixa** (`72vh`; `80vh` em ≤50rem) em vez de `min-height`, com `object-fit:cover`. Diferença máxima de 1 CSS pixel no mesmo breakpoint e sem layout shift entre slides.
- **Auto-play definitivo:** timer único (`scheduleHomeCarousel` limpa antes de agendar), loop, reinício após navegação manual (via `render`→`bindPage`→`scheduleHomeCarousel`), pausa em **hover**, **focus** e **`document.hidden`** (novo guard + listener `visibilitychange` registado uma única vez), respeito por `prefers-reduced-motion` e limpeza de listeners/timers por recriação do DOM. Intervalo vem do config (`intervalMs`, fallback **7000 ms**).
- **E2E de browser real:** o runner Chromium 08J passou a incluir asserções `carousel-*` que aguardam o **intervalo real** e confirmam a mudança de slide, além de paridade da caixa, pausa em hover e não-avanço sob movimento reduzido. `npm run e2e:08o` executa esse runner.

## Auditoria pós-merge da Área Colaborativa

Auditoria dos 10 itens obrigatórios por inspeção de código, registada em `reports/collaborative-audit-08o.json` e em `docs/fixes-08o/COLLABORATIVE_POST_MERGE_AUDIT.md`. Resultado: **10/10 `passed`, 0 bloqueados**, sem correções de regressão necessárias (o refino do 08N mantém-se correto). Destaques verificados:

- **Participação contínua / integração pública / operação:** recusam o modo demo (staging real exigido); guardas por permissão nas rotas.
- **Revisão do Museu:** guarda `museum.review.view` na view **e** RLS na base (16 tabelas com RLS, 0 grants `anon`).
- **Formação:** apenas Fundamentos visível na UI (08N); os 4 percursos permanecem no backend e não vazam para home/recomendações/pendências.
- **Contributos:** 10 MB por ficheiro, upload por URL assinada para bucket privado, `service_role` recusado no browser (`config.js`).
- **Proposta de atividade:** decisão reservada ao dono do projeto/master; validadores emitem parecer; sem conversão automática em atividade.
- **Home e pendências / fixtures:** dados reais com fallback positivo; sem fallback silencioso para demonstração; demonstração marcada e assinalada na UI.

## Contratos e artefactos

- `public/data/carousel-post-merge-model.json`, `public/data/collaborative-post-merge-audit.json`, `public/data/package-08o-readiness.json`.
- Scripts: `scripts/08o/validate-carousel.mjs`, `scripts/08o/audit-collaborative-area.mjs`, `scripts/08o/validate-no-production-fixtures.mjs`, `scripts/08o/e2e-carousel-08o.mjs`.
- Testes: `tests/carousel-08o.test.mjs`, `tests/collaborative-audit-08o.test.mjs`; asserções `carousel-*` no E2E 08J.
- CI: `.github/workflows/08o-ci.yml` (validate + testes + build + smoke + E2E carrossel Chromium).

## Módulos, permissões e migrations (antes → depois)

- Módulos: **25 → 25**.
- Permissões: **149 → 149**.
- Migrations: **sem novas**.

## Invariantes preservados

0 efeitos públicos ativos, produção bloqueada (`productionApproval: blocked`), MM202617 inelegível para lançamento e produção física, dataset canónico em 0.11.3 inalterado, `service_role` fora do browser, sem fixtures apresentados como dados reais em staging/produção, Portal/Museu/imersivo sem regressão.

## Validação executada

`npm run validate` (cadeia completa, incl. `validate-carousel`, `audit-collaborative-area`, `validate-no-production-fixtures`, contexto 08O), `npm test` (465 testes), `npm run build`, `npm run smoke`. E2E Chromium (`e2e:08o`) executado em CI (`ubuntu-latest` com `google-chrome`).

> A aprovação técnica deste pacote **não** ativa produção nem efeitos públicos.
