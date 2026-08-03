# Release — Pacote 09D v0.32.0 (Fundação multilíngue, tradução assistida e revisão humana)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Segundo bloco de fundação da Série 09 (empilhado sobre o 09C). Cria a **infraestrutura editorial multilíngue** para inglês, espanhol e francês **sem publicar nenhuma tradução** e sem tradução automática publicada. Produção bloqueada; dataset canónico 0.11.3, MM202617 e módulos/permissões inalterados; `service_role` fora do browser.

## Objetivo

`pt-PT publicado → rascunho manual (draft) ou assistido (machine-draft) → revisão humana → aprovação → publicação explícita por idioma`

## O que inclui

- **Registo de conteúdo** (`public/data/locale-content-registry.json`): 15 unidades-fonte pt-PT com chave estável, versão-fonte e estado; cada uma com entradas EN/ES/FR **todas em `missing`** (texto `null`, nada inventado — 45 traduções por fazer).
- **Fluxo editorial**: `missing → draft | machine-draft → in-review → changes-requested | approved → published → archived`. `machine-draft` **nunca** publica; publicação exige revisor **e** aprovador humanos + data.
- **Deteção de traduções desatualizadas (stale)**: alterar a `sourceVersion` de uma unidade assinala as traduções vinculadas sem as sobrescrever (`reports/stale-translations-09d.json`).
- **Disponibilidade por rota** (`public/data/locale-availability.json`, **derivada** do registo): um idioma-alvo só fica disponível numa rota quando **todas** as unidades dessa rota estão publicadas e alinhadas → nesta fundação **só pt-PT** em todas as rotas.
- **Seletor e fallback visível**: `localeAvailableForRoute` + strings de indisponibilidade nas 4 línguas; o seletor mantém EN/ES/FR "em preparação" (desativados) e ganha uma **nota acessível** (`aria-describedby`) — mensagem visível + continuar em português. **Sem troca silenciosa, sem URL traduzida falsa, sem `null`.**
- **Sem hreflang/SEO** (fica para o 09F).
- **Glossário-semente** (`public/data/translation-glossary.json`, `seed-requires-human-review`): nomes próprios `preserve-name`/`official-form-only`; termos traduzíveis com EN/ES/FR `null`.
- **Museu e oportunidades**: a tradução preserva identificador, fonte, autoria, datação, grau de certeza, intervenção digital, direitos e a distinção comunidade-vs-instituição; **não** altera dados operacionais das oportunidades (datas, capacidade, custo, remuneração, estado, links, identificadores).

## Contratos

`contracts/09d/`: `locale-content-model.json`, `translation-workflow-model.json`, `language-route-availability-model.json`, `package-09d-readiness.json`.

## Scripts (`scripts/09d/`)

`validate-source-keys`, `validate-translation-state`, `validate-no-machine-draft-publication`, `detect-stale-translations`, `build-locale-availability`, `build-09d-readiness-report`, `validate-09d` — ligados a `validate:09d` e à cadeia `validate`.

## Testes

- `tests/locale-content-09d.test.mjs` (10 testes): integridade do registo, alvos `missing`, contrato de estados, disponibilidade só pt-PT, glossário, helper por rota, deteção de stale, MM202617/contagens intocadas.
- E2E `tests/e2e/portal/language-availability.spec.mjs`: nota acessível, `lang=pt-PT`, ausência de hreflang, sem erros de consola.

## Documentação

14 documentos + 2 templates + glossário-semente em `docs/i18n/09d/`. CI `09d-ci.yml` (`quality` + `e2e-locale`).

## Sem regressão / invariantes

- 0 novos módulos (26), 0 novas permissões (152), 0 migrations.
- Dataset canónico 0.11.3, MM202617 inelegível e produção bloqueada — inalterados.
- Sem publicação automática; revisão e publicação humanas obrigatórias; sem fallback silencioso.

## Bloqueadores humanos (decisão do responsável)

Variantes de EN/ES/FR; revisores e aprovadores; glossário arqueológico e nomes institucionais; prioridade editorial das páginas; políticas legais (privacidade/acessibilidade por idioma).

## Nota de execução

Sem `npm`/`docker`/browser no ambiente local: o lado node (validate — 57 passos — + 501 testes + build) foi verificado localmente, com smoke da nota acessível no browser interno; o Playwright corre apenas no CI Linux.

## Base

Empilhado sobre `pack/pacote-09c-oportunidades` (PR #39, v0.31.0). O PR do 09D não deve ser mergeado antes do 09C. Bump 0.31.0 → 0.32.0.
