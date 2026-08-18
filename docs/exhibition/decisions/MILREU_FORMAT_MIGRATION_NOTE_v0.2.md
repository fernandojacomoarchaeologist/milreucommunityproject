# Nota de migração de formato do painel — v0.2 (APLICADA)

> © 2026 Fernando Rodrigues de Jácomo. Consultar `RIGHTS.md`.
> **Migração aplicada nesta branch; ainda não integrada em main.** Consultar o histórico Git para os commits. Perfil de impressão **NÃO** está pronto.

## Baselines
- **`SUPERSEDED`:** 1000 × 800 mm (horizontal), sangria 5 mm, corpo ~34 pt.
- **`CURRENT-HUMAN-BASELINE`:** **841 × 2000 mm** (vertical) — «novo formato 841 × 2000 mm; não ampliar o A0» (2026‑08‑17).
- Grelha/sangria/segurança/tipografia = `PROPOSED / PENDING` (prova física + PDF/X‑4 + ICC).

## Preflight — consumidores dos tokens
Pesquisados: `--ds-print-panel-width/-height/-bleed/-safe-area/-body-size/-caption-size/-metadata-size/-institutional-rule`, `ui-print`, `print-tokens`, `ds-print-frame`.
- **Consumidor real:** apenas o próprio `packages/ui-print/print-tokens.css` (usa as vars em `.ds-print-frame`). **Nenhum consumidor externo** (JS, build, exportador, teste, site `--ml-*`).
- Referências **documentais** (não consumidoras, não alteradas): `releases/pacote-02/PACKAGE_MANIFEST.md:78` (manifesto histórico) e `docs/design/COMPONENT_REGISTRY.md:22` (entrada «DS-PR001 Print Frame … Painéis e totens», sem dimensões).

## Ficheiros alterados nesta ronda
| Ficheiro | Alteração |
|---|---|
| `packages/ui-print/print-tokens.css` | `panel-width: 841mm`; `panel-height: 2000mm`; restantes tokens mantidos e marcados **`PROPOSED — NOT FOR PRODUCTION`**; cabeçalho com nota de migração e «perfil não pronto». |
| `docs/design/PRINT_DIGITAL_PARITY.md` | secção «Painéis» → baseline **841 × 2000** `CURRENT-HUMAN-BASELINE`; sangria/segurança/tipografia como `PROPOSED/PENDING`; **34 pt não aprovado**; fonte única e QR como propostas; 1000 × 800 movido para nota **`SUPERSEDED`**. |

## Valores
- **Definitivos (aplicados):** largura **841 mm**, altura **2000 mm**.
- **Ainda provisórios (`PROPOSED — NOT FOR PRODUCTION`):** sangria 5 mm, área segura 25 mm, corpo 34 pt, legenda 22 pt, metadados 18 pt, filete institucional 4 mm. **Não** são valores finais; conservados só porque um consumidor CSS exige valores concretos.

## Resultado dos testes/verificações
- Não existe teste/build que consuma estes tokens → **nenhum consumidor externo identificado no preflight; risco técnico observado baixo**; verificação **estrutural** em vez de unitária.
- CSS: chaves equilibradas (3/3); todos os `var(--ds-print-*)` usados estão definidos; `width/height = 841mm/2000mm`.
- Sem resíduos não‑marcados de «1000×800/800mm/1000mm»; sem consumidores externos.

## Diff resumido
`docs/design/PRINT_DIGITAL_PARITY.md` (+15/−8) · `packages/ui-print/print-tokens.css` (+22/−9). Total: 2 ficheiros, +37/−17. Alterações nesta branch; ainda não integradas em main (consultar o histórico Git).

## Pendências
Reconfirmar sangria/segurança/tipografia em prova física; definir perfil de impressão (PDF/X‑4 + ICC); rever se, no futuro, `COMPONENT_REGISTRY` («Print Frame») precisa de nota de formato.
