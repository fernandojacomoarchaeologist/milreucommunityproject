<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Validação — Pacote 09F (SEO, metadados, partilha, hreflang)

**Base:** `main@95776ed` (v0.34.0 / 09E) · **Alvo:** v0.37.1 / 09F

## Resultados determinísticos
- Inventário de indexabilidade: **86 rotas** classificadas exatamente uma vez — **18 index**, **5 noindex**, **63 blocked**.
- `robots.txt` (preview, sem domínio): `User-agent: *` + `Disallow: /`. **Sem sitemap** (URLs absolutas exigem origem aprovada).
- `hreflang`: apenas **pt-PT** (self). EN/ES/FR **não anunciados**. `x-default` **ausente** (decisão humana pendente).
- `index.html`: OG + Twitter Card + JSON-LD **WebSite** (factual) e `robots noindex` mantido. Sem Organization/Event/Offer/Review.
- Páginas estáticas (30 memórias públicas elegíveis; MM202617 excluída): título, descrição, `canonical` (quando houver origem), OG/Twitter, JSON-LD **Photograph/ImageObject** com crédito real, `robots` condicionado à origem.
- Preservação: 31 originais (sha256 == manifesto), 26 módulos / 152 permissões, 0 migrations; 09D (seletor/idiomas), 09E (LCP/srcset) e as 6 rotas do 09C.1 intactos.

## Testes
- `validate:09f` + `validate` (65 passos) verdes · `tests/seo-09f.test.mjs` (8) + suite total **532** verde · E2E `tests/e2e/portal/seo-09f.spec.mjs` (CI).
