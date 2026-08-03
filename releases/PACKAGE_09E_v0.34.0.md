# Release — Pacote 09E v0.34.0 (Tipografia, media responsiva e desempenho visual)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Otimização **visual auditável** sobre `main@5c6ebda` (v0.33.0 / 09C.1). Sem redesign nem expansão funcional. Originais imutáveis; 09D e as seis rotas colaborativas preservados; produção bloqueada; SEO/hreflang reservados ao 09F.

## Media responsiva (comprovável)

- Hero do Museu e banner do carrossel servem variantes por `srcset`/`sizes`; candidato LCP com `fetchpriority="high"` e **não-lazy**.
- Miniaturas fora da dobra (galeria, filmstrip, revisão) com `loading="lazy"` + `decoding="async"`.
- **LCP mobile:** serve `detail` (127 KB) em vez de `immersive` (278 KB) = **−54% bytes**.

## Inventários auditáveis

- `reports/media-inventory-09e.json` — 176 ativos (31 originais + 124 derivados + 21 interface); classificação, direitos, crédito, proveniência, intervenção.
- `reports/font-inventory-09e.json` — Fraunces/Spectral/Archivo **declaradas mas ausentes** (0 `@font-face`, 0 ficheiros; fonte computada = fallback de sistema).
- `reports/visual-performance-baseline-09e.json` — bytes + guardrails estáticos; LCP/CLS de campo pendentes.

## Integridade

`scripts/09e/validate-source-integrity.mjs`: 31 originais confirmados byte a byte (sha256 == manifesto); derivados não são fonte canónica.

## Contratos / validador / testes / CI

`contracts/09e/*` (readiness, font/media schemas, visual-performance-budget); `scripts/09e/validate-09e.mjs` (+ `validate:09e`); `tests/visual-media-09e.test.mjs` (7) + E2E `visual-performance-09e.spec.mjs`; `09e-ci.yml`.

## Invariantes

- **0** novos módulos/permissões/migrations (26/152/0).
- Sem ficheiros de fonte no Git; sem `@font-face` para ficheiros inexistentes (0 x 404).
- Sem SEO/hreflang/OG/JSON-LD; MM202617 preserva a nota de IA; dataset intocado.

## Pendências humanas (não resolvidas silenciosamente)

- Famílias tipográficas finais + licenças + self-hosting.
- LCP/CLS de campo e homologação UI↔backend real (staging + Google OAuth).
- Cartaz do Inquérito ("linha azul"): distinguir arte de artefacto **antes** de alterar — ficheiro não tocado.

## Base

Empilhado sobre `main` com 09C→09D→decisões→09C.1. Bump 0.33.0 → 0.34.0.
