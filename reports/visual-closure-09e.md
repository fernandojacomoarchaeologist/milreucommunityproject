<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Matriz de evidências — Pacote 09E (tipografia, media responsiva e desempenho visual)

**Versão:** 0.37.1 · **Base:** `main@5c6ebda` (v0.33.0 / 09C.1), CI 46/46 verde.

## Rótulos de evidência (linguagem honesta)

- **static** — verificado por análise determinística (inventário, hashes, atributos no código).
- **unit** — teste `tests/visual-media-09e.test.mjs` (7 testes).
- **e2e-browser** — Playwright `tests/e2e/portal/visual-performance-09e.spec.mjs` (CI) + verificação no browser interno.
- **pendente-humano** — decisão editorial/licença ou medição de campo dependente de browser controlado/staging.

## Matriz de aceitação (1–10)

| # | Critério | Evidência |
|---|---|---|
| 1 | Base `5c6ebda`, CI verde, pacote anterior preservado | histórico git; **CONFIRMADO** |
| 2 | Fontes: ficheiros/licenças/weights; fonte computada; zero 404 | **static/unit** — 0 @font-face, 0 ficheiros, 0 404; 3 famílias de marca **declaradas mas ausentes** (fonte computada = fallback de sistema). Licença/self-hosting = **pendente-humano** |
| 3 | Media: inventário completo; originais inalterados; derivados rastreáveis | **static/unit** — 176 ativos; 31 originais sha256 == manifesto; 124 derivados com sourceHash |
| 4 | Responsividade: variantes e sizes coerentes; dimensões reservam layout; sem deformação | **static/e2e** — `srcset`/`sizes` no hero e carrossel; grelhas reservam espaço por `aspect-ratio` (CSS); `object-fit` preservado |
| 5 | Desempenho: baseline e resultado comparáveis; LCP/CLS e bytes | **static** — LCP mobile passa a servir `detail` (127KB) vs `immersive` (278KB) = **−54% bytes**; LCP/CLS de **campo = pendente-humano** (browser/staging) |
| 6 | Acessibilidade: alt/legenda/crédito separados; zoom, teclado, reduced motion | **static/e2e** — `alt` funcional; crédito/direitos/proveniência em campos distintos (memories.json); reduced-motion já interrompe autoplay (08O) |
| 7 | Museu/imersivo/carrosséis/cartaz: desktop e mobile, navegação e foco | **e2e-browser** — hero com prioridade/srcset; sem overflow a 360px; Voltar/X preservados |
| 8 | 09D: seletor, estados editoriais, sem publicação automática | **static** — `language-switcher-note` e registo/disponibilidade multilíngues intactos |
| 9 | As seis rotas colaborativas renderizam os cabeçalhos | **e2e** — verificado (09C.1 preservado) |
| 10 | Limites: 0 módulos/permissões/migrations; sem SEO/Proteus/produção | **static** — 26/152/0; `index.html` sem hreflang/OG/JSON-LD |

## O que mudou (seguro e comprovável)

- **Media responsiva:** hero do Museu e banner do carrossel passam a servir variantes por `srcset`/`sizes` (menores em mobile); LCP com `fetchpriority="high"` e **não-lazy**; miniaturas fora da dobra com `loading="lazy"` + `decoding="async"`.
- **Inventários auditáveis:** `reports/media-inventory-09e.json` (classificação, direitos, proveniência, intervenção), `reports/font-inventory-09e.json` (estado honesto das fontes), `reports/visual-performance-baseline-09e.json` (bytes + guardrails estáticos).
- **Integridade:** 31 originais confirmados byte a byte; derivados não são fonte canónica.

## Pendências humanas registadas (não resolvidas silenciosamente)

- **Fontes de marca** (Fraunces/Spectral/Archivo): licença e self-hosting por decidir; enquanto isso, a tipografia usa fallback de sistema legível e **não** se declaram `@font-face` para ficheiros inexistentes.
- **LCP/CLS de campo** e **homologação UI↔backend real**: dependem de browser controlado/staging + OAuth. Não confundir Lighthouse local com utilizador real, nem demonstração com homologação.
- **Cartaz do Inquérito (“linha azul”)**: distinguir arte do original de artefacto de renderização **antes** de alterar o ficheiro — deixado para revisão humana; ficheiro não alterado.

## Ambientes

- **local:** validate (63 passos) + 524 testes JS + build + inventários + integridade — verde.
- **CI:** Playwright (e2e-browser) — `09e-ci.yml`.
- **staging/produção:** bloqueado.
