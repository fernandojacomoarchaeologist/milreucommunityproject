# Handoff — Item 2 · Website `projectomilreu.pt`

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Segurança do site = ficheiro separado [`HANDOFF_ITEM_02B_seguranca.md`](HANDOFF_ITEM_02B_seguranca.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Itens 2 e «Item 2 escopo adicional»).

**O que é.** Portal público do projecto — **SPA estática** (vanilla JS, routing por hash `#/...`), servida por **GitHub Pages** no domínio `projectomilreu.pt`. **Static-first:** carrega e funciona **sem Supabase e sem internet** (exceto o formulário «Quero expor», ver abaixo).

## 1. Local dos arquivos
- **Código-fonte:** raiz do repo → `src/` (`main.js`, `views/`, `lib/i18n.js`, `lib/router.js`), `public/` (assets, `public/data/*.json`).
- **Dados das páginas (data-driven):** `public/data/media-assets.json`, `public/data/brand-assets.json`, `public/data/channel-records.json`.
- **Edge Functions:** `supabase/functions/` (inclui `exhibition-proposal-intake`).
- **Build:** `scripts/build.mjs`. **Deploy:** workflow manual `.github/workflows/07d-pages.yml` (confirmação literal `PUBLISH_TECHNICAL_MVP`) + `CNAME`.
- **Relatórios/auditorias:** `docs/website/ITEM02_MEDIA_PRESS_DS_AUDIT_FASEA.md`, `…_QA_FASED.md`; spec do formulário: `docs/website/SPEC_FORM_EXPOR_BACKEND.md`.

## 2. Pontos mais importantes
- **LIVE** em `https://projectomilreu.pt` (HTTP 200 verificado), com **`noindex`** — o **lançamento editorial continua com gate humano** (`publicLaunch.approved` por decidir). Deployment técnico **≠** aprovação editorial.
- **Enforce HTTPS ativado** (http→301→https, sem mixed content).
- **Idiomas EN/ES/FR ativos** (interface), mas **tradução real dos conteúdos ainda é trabalho humano futuro** — há **aviso de fallback** quando falta tradução (não se inventam traduções; `null` + estado `missing`; automática = `machine-draft`, nunca `approved`).
- **Páginas públicas integradas:** Media/Press (`#/imprensa`) + Identidade visual (`#/identidade`) + `#/direitos` + bloco de enquadramento 2026 em `/sobre`. Consomem o **Item 9 aprovado** + Design System v0.2.
- **Formulário «Quero expor» OPERACIONAL** — exceção estrita (decisão humana 2026-10-05): submete por `fetch` direto ao **URL público** da Edge Function `exhibition-proposal-intake` (campo `exhibitionProposalEndpoint`; `null` ⇒ demo). **Não** liga backend colaborativo: sem auth, sem base de dados, sem cliente Supabase e **sem credenciais Supabase** no bundle.

## 3. Como se estruturou a arte
- Design System v0.2 (Fraunces/Spectral/Archivo; paleta MARF/INK/RED/terracota). **Portal** mantém navegação institucional; **Museu** reduz a navegação e mantém retorno ao Projecto.
- Home com Museu, Proteus («Experiência Proteus») e Inquérito 2026; pilares = Comunicação, Mutualidade, Pertinência Social e Política. Modo imersivo permanente do Museu (rota, teclado, filmstrip, `object-fit: contain`).

## 4. Como se trabalhou ponto a ponto
1. Correção do workflow de Pages + CNAME (PR #58).
2. Idiomas + nova home + fix do carrossel (PR #59).
3. Agenda de exposições (exemplo de demonstração declarado) (PR #60).
4. i18n do Museu + formulário «Quero expor» (PR #62).
5. Media/Press + Identidade (PR #71/#73).
6. HTTPS enforce + `#/direitos` + preparação do deploy do formulário (PR #102).
- Páginas data-driven (JSON), QA mobile 375×812, a11y (headings, alt real, estados não só por cor), **641/641 testes** + `npm run validate` exit 0.

## 5. O que NÃO fazer
- **NÃO** remover `noindex` nem declarar lançamento público sem decisão humana (`public-release-gated`).
- **NÃO** inventar traduções nem marcar automáticas como aprovadas.
- **NÃO** adicionar dependência runtime (cliente Supabase, etc.) ao site — exceto o `fetch` do formulário já autorizado (`static-first-runtime`, `mvp-scope-control`).
- **NÃO** pôr service role/segredos no frontend; **NÃO** versionar `.env`.
- **NÃO** criar rotas fora do route manifest; uma rota canónica por entidade (`route-governance`, `architecture-before-implementation`).

## 6. Resultado esperado
Portal estável, acessível, multilingue (com traduções reais quando houver), indexável **quando o responsável aprovar**, com o formulário «Quero expor» a entregar e-mail real.

## 7. Documentos necessários
`docs/website/SPEC_FORM_EXPOR_BACKEND.md`, relatórios FASE A/D, route manifest/matrizes do site, regras `.claude/rules/static-first-runtime.md`, `mvp-scope-control.md`, `portal-museum-boundary.md`, `museum-localisation.md`, `public-release-gated.md`.

## 8. Pendências observadas
- 🟠 **Indexação pública** (remover `noindex` + decisões SEO) — decisão humana.
- 🟠 **Tradução real EN/ES/FR** dos conteúdos (hoje fallback visível).
- ✅ ~~**E-mail do formulário:** requer secrets + deploy~~ — **resolvido** (operacional desde 2026-10-05; deploy @ `43f20ad` = HEAD). Endurecimento pendente → Item 2B (SEC-P0-002, lotes L3/L4).
- ✅ ~~**Falha pré-existente de CI `09C.1`** em `main`~~ — **não reproduzida**: 44/44 check-runs `success` no HEAD `1339188` (2026-10-12). Falhas históricas pontuais só em 09D (1/3) e 09F (1/4).
- 🟠 **Segurança do site** — ver [`HANDOFF_ITEM_02B_seguranca.md`](HANDOFF_ITEM_02B_seguranca.md): P0 completa; **L1 (governança GitHub) planeado, não aplicado**; L2 (workflows) a seguir.
- 🟠 **Build de produção marca `environment:"local"`** (`07d-pages` sem `MILREU_ENVIRONMENT`; SEC-P0-010, informativo) e publica `deployment-profile.runtime.json` estático desactualizado (`allowDemo:true`, só apresentação) — corrigir no L2.

## 9. Dossiê do modo de trabalhar (Item 2)
Site tratado como **produto estático canónico multicanal**: a mesma entidade canónica serve Portal/Museu/totem/painel (não duplicar factualidade por canal). Mudanças sempre por PR pequeno e mergeado; páginas novas orientadas a dados (JSON) e não hardcoded; QA automatizado (testes + validate) antes de fechar. Gate editorial **sempre** humano.

## 10. Onde está cada informação
- **Código/rotas:** `src/`, `public/`. **Dados:** `public/data/*.json`.
- **Deploy:** `.github/workflows/07d-pages.yml` + `CNAME`.
- **Formulário:** `supabase/functions/exhibition-proposal-intake` + `docs/website/SPEC_FORM_EXPOR_BACKEND.md`.
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 2) + memória «Site publicado».

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
- 2026-10-12 · RESOLVIDO · Pendência «E-mail do formulário» já estava resolvida (operacional 2026-10-05; função implantada = HEAD). · API GitHub (runs) + `ITEM02_LAUNCH_PREP_2026-10-05.md`
- 2026-10-12 · RESOLVIDO · Falha CI `09C.1` não reproduzida no HEAD `1339188` (44/44 checks `success`). · API GitHub (check-runs)
- 2026-10-12 · NOVO · Site live verificado (GET passivo): build `0.39.0` de 2026-10-05 @ `aecc76c` = HEAD no código; `mode:"demo"`, `allowDemo:false`, `exhibitionProposalEndpoint` configurado; sem CSP/HSTS (limitação do Pages); `www`/http → 301 → `https://projectomilreu.pt/`. · GET público
- 2026-10-12 · NOVO · Build de produção sai com `environment:"local"` (SEC-P0-010, informativo; nenhum bypass) + perfil de deployment estático desactualizado publicado. Correcção prevista no L2. · Item 2B
- 2026-10-12 · PENDENTE · Remediação de segurança em curso no Item 2B (L1 planeado, não aplicado).
- 2026-10-12 · NOVO · Dependência externa: o Dossiê (Item 7, P4) imprime o URL e um QR para `projectomilreu.pt/#/participar/expor`. Qualquer mudança desta rota exige redirect (`route-governance`). · handoff 7 §11
