# Item 2 — Website · Preparação de lançamento (2026-10-05)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Estado: **LIVE / LAUNCH PREPARATION.** `noindex` **mantido**. Lançamento/indexação pública = decisão humana posterior.

## 1. HTTPS — ✅ FEITO E VALIDADO
- **Enforce HTTPS ativado** (GitHub Pages `https_enforced: true`, 2026-10-05).
- Validação:
  - `http://projectomilreu.pt/` → **301 → `https://projectomilreu.pt/`** ✅
  - `https://projectomilreu.pt/` → **200 (HTTP/2)** ✅
  - **Sem mixed content**: HTML servido e `src/styles/app.css` sem referências `http://` ✅
  - QR existentes já apontam para `https://projectomilreu.pt` (não afetados) ✅

## 2. Página de direitos — ✅ IMPLEMENTADA
- Rota pública **`#/direitos`** («Direitos, créditos e reutilização»), conteúdo canónico (decisão 2026-10-05).
- Integração: **rodapé** (todas as páginas), **Media/Press** (`#/imprensa`) e **Identidade** (`#/identidade`); Media/Press cobre o contexto de **downloads**.
- Gates por asset mantidos; CC BY 4.0 só para conteúdo original *quando indicado*; terceiros mantêm direitos próprios.
- Classificada no inventário SEO como rota pública (`index`), mas **não indexada** (indexação global desativada).

## 3. Formulário «Quero expor» — ⛔ HUMAN GATE (deploy preparado)
- Função + workflow de deploy prontos; **deploy não executado** por faltarem credenciais externas.
- Ver `docs/website/ITEM02_FORM_DEPLOY_PREP.md` (secrets necessários, passos, QA, o que falta).

## 4. `noindex` — MANTIDO
- `public/config/seo.runtime.json`: `indexingAllowed:false`, `publicOrigin:null` → `robots.txt` = `Disallow: /` (confirmado live). **Não alterado.**
- A remoção de `noindex` depende de: **HTTPS PASS** (✅), **formulário PASS em produção** (⛔), **página de direitos publicada** (✅ implementada; publicação editorial pendente), **QA do site**.
- EN/ES/FR **não** bloqueiam o lançamento PT (fallback explícito mantido).

## 5. SEO — NÃO FECHADO (apenas checklist)
Quando se retirar `noindex` (decisão humana), rever:
- `publicOrigin` por ambiente (= `https://projectomilreu.pt`); `indexingAllowed:true`;
- `robots.txt` Allow + `sitemap.xml` (`scripts/09f/build-robots-sitemap.mjs`);
- `canonical` + `hreflang`; **x-default** (pendente);
- **imagem social** (OG) padrão + créditos;
- **structured data**: **não inventar `Organization`** para o Projecto sem decisão humana sobre a entidade representada;
- **indexabilidade por memória** (publicação/consentimento/direitos); MM202617 permanece `noindex`.

## Validação de regressão (código)
- `npm run build` ✅ · `npm run validate` ✅ · `npm test` **641/641** ✅ (inventário SEO: 97 rotas, 21 index, robots disallow-all mantido).
