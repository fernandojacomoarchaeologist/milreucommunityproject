# Item 9 — Auditoria de impacto (AAMLF + matriz de direitos) · 2026-10-06

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **RELATÓRIO + PROPOSTA — NENHUM FICHEIRO FINAL ALTERADO.** Auditoria do impacto das decisões recentes sobre o Kit Digital + Press. Aguarda HUMAN GATE para aplicar.

## Decisões a refletir
1. **AAMLF** = parceiro institucional relevante (desenvolvimento + acompanhamento). É a «Associação dos Amigos do Museu do Lyceu de Faro» (já na lista de parceiros).
2. **Meira Pinto** = interlocutor da AAMLF.
3. **E-mail AAMLF:** `museu.lyceu@aejdfaro.pt`
4. **Morada AAMLF (publicável):** Av. 5 de Outubro, Liceu de Faro, 8004-069 Faro.
5. **Separar entidades** com clareza (abaixo).
6. **Matriz de direitos** já aplicada (PR #105): 4 imagens `press=YES`, 1 `PENDING`, 3 `NO`, `generic=NO`, `host_partner_republication=PENDING`.

## Impacto por ficheiro

| Ficheiro | Impacto | Ação proposta |
|---|---|---|
| `01_README/README_KIT.md` | "Redistribuição… PENDENTE" (todas) **desatualizado**; estrutura cita `04_IMAGENS/WEB/` e `PRESS/` que **não existem** (imagens foram p/ `distribuiveis-imprensa/`) | Atualizar estado de direitos (4 `YES`); corrigir referência de pastas; FASE 1→ imprensa parcialmente desbloqueada |
| `01_README/QUICK_START.md` | "usar só imagens com redistribuição confirmada" (genérico) | Apontar para `distribuiveis-imprensa/` (4 imagens `YES` com crédito) |
| `03_PRESS/NOTA_DE_IMPRENSA_BASE.md` | «CRÉDITOS»: "redistribuição… pendente de confirmação" **desatualizado**; sem contacto/interlocutor AAMLF | Atualizar direitos (4 `YES`); acrescentar **AAMLF · Meira Pinto · email · morada**; manter separação parceiros/anfitrião |
| `02_TEXTOS/CONTACTOS.txt` | Só contactos do Projecto; **sem AAMLF** | Acrescentar bloco **institucional AAMLF** separado dos contactos do Projecto |
| `04_IMAGENS/USO_E_DIREITOS.md` + `LEGENDAS_E_CREDITOS.csv` | **Já atualizados** (PR #105) ✓ | — |
| `04_IMAGENS/distribuiveis-imprensa/` | **Já populada** com 4 `YES` + créditos ✓ | — |
| `06_SOCIAL/` + `07_WEB/` (previews) | Previews usam **`MM202601` (press=PENDING)** e `MM202608` | Versões **distribuíveis** só podem usar imagens `YES` (ex.: MM202608/MM202603/MM202613); **trocar** MM202601 |
| `10_MANIFEST/manifest.json`, `inventory.csv`, `QA_REPORT.md` | Estado de direitos/pastas desatualizado | Atualizar estados + registar `distribuiveis-imprensa/` + AAMLF |
| `05_LOGOS/` | AAMLF já presente como logótipo de parceiro | Sem alteração (uso institucional dos logos continua condicionado — `PROVENIENCIA`) |

## Imagens — o que entra no press kit vs restrito
- **Entram (press editorial, com crédito):** `MM202603`, `MM202613`, `MM202608`; `MM202602` **com restrição** (uso editorial do projeto, sem reutilização genérica).
- **Não entram — `PENDING`:** `MM202601` (Torre do Tombo; autorização/domínio público por confirmar).
- **Não entram — `NO`:** `MM202604`, `MM202627`, `MM202631` (esta 2024/Património Cultural I.P.).
- **Republicação por anfitrião (`host_partner_republication`) = PENDENTE em todas** → o pacote para **anfitriões republicarem** continua restrito; só o subconjunto **editorial de imprensa** (4 `YES`) está pronto.
- **`generic_third_party_redistribution = NO`** em todas → **ZIP público genérico** continua bloqueado.

## Separação de entidades (decisão 5) — taxonomia proposta
1. **Projecto Comunitário de Milreu** — identidade principal e permanente (não substituível).
2. **AAMLF — Associação dos Amigos do Museu do Lyceu de Faro** — **parceiro institucional** (desenvolvimento + **acompanhamento**); interlocutor **Meira Pinto** · `museu.lyceu@aejdfaro.pt` · Av. 5 de Outubro, Liceu de Faro, 8004-069 Faro.
3. **Financiador / apoio à candidatura 2026** — **CCDR Algarve**.
4. **Apoio institucional** — República Portuguesa (Cultura, Juventude e Desporto) · Património Cultural, I.P. · Universidade do Algarve.
5. **Anfitriões locais** — variáveis por acolhimento (distintos dos parceiros estruturais; logótipo próprio).
6. **Futuros patrocinadores/apoios** — estrutura **modular** (sem placeholders visuais agora; permite crescer sem redesenho).
> **`MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026`** = identificador editorial/administrativo — **não** é parceiro, logótipo nem nome; fica **fora** da fila de parceiros.

## Gates que se mantêm
- `host_partner_republication` e `generic_third_party_redistribution` **PENDENTE/NO** → ZIP público genérico e pacote de republicação por anfitrião **continuam bloqueados**.
- Logótipos de parceiros: uso institucional pelo projeto (não redistribuição autónoma).
- `MM202601` só entra após confirmação (Torre do Tombo / domínio público).
- Logo SVG/PDF vetorial e CMYK do kit: `PENDING`.

## Proposta de execução (após HUMAN GATE)
Atualizar (sem reabrir design): README_KIT, QUICK_START, NOTA_DE_IMPRENSA, CONTACTOS (bloco AAMLF), manifest/inventory/QA; trocar a imagem `PENDING` nas peças social/web distribuíveis por uma `YES`; registar a taxonomia de entidades. **Não** desbloquear ZIP público genérico nem republicação por anfitrião. **Item 10/11 não iniciados.**
