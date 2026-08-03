# Release — Pacote 09F v0.35.0 (SEO, metadados, partilha e hreflang)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Fecha a Série 09 com **descoberta pública auditável** sobre `main@95776ed` (v0.34.0 / 09E). Não inventa domínio, não publica traduções, não ativa produção, não toca em originais/derivados do 09E.

## Origem por ambiente (sem inventar domínio)
`public/config/seo.runtime.json` com `publicOrigin: null` (pendência humana) → indexação **desativada** (preview): `robots.txt` = `Disallow: /`, **sem sitemap** (URLs absolutas exigem origem via `MILREU_PUBLIC_BASE_URL`).

## Inventário de indexabilidade
`reports/seo-route-inventory-09f.json` classifica as **86 rotas** do router exatamente uma vez: **18 index**, **5 noindex**, **63 blocked** (colaborativas, auth, formulários com dados pessoais).

## Metadados e partilha
- `index.html`: OG + Twitter Card + JSON-LD **WebSite** (factual); `robots noindex` mantido.
- **30 páginas estáticas** de memórias públicas (MM202617 excluída): OG/Twitter + JSON-LD **Photograph/ImageObject** com crédito real; `robots` condicionado à origem; `hreflang="pt-PT"` self.
- **hreflang só pt-PT** — EN/ES/FR **nunca anunciados**; **x-default ausente** (decisão humana).
- JSON-LD **factual** — sem Organization/Event/Offer/Review inventados.

## Preservação
31 originais (sha256 == manifesto), 26 módulos / 152 permissões, 0 migrations; 09D/09E/09C.1 intactos.

## Contratos / validador / testes / CI
`contracts/09f/*`; `scripts/09f/*`; `validate:09f`; `tests/seo-09f.test.mjs` (8) + E2E `seo-09f.spec.mjs`; `09f-ci.yml`. Relatórios `reports/seo-*-09f.*`.

## Pendências humanas (OPEN_DECISIONS_09F)
1. Domínio/origem pública canónica. 2. `x-default`. 3. Entidade responsável + relações para JSON-LD. 4. Imagem social padrão definitiva. 5. Memórias individuais indexáveis. Indexação real em motores **não** verificada (exige domínio + verificação externa).

## Base
Empilhado sobre `main` (09C→09D→decisões→09C.1→09E). Bump 0.34.0 → 0.35.0.
