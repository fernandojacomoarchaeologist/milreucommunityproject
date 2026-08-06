<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Matriz de conformidade — Despacho RT.82/2025

Matriz **viva**. Estados: `compliant` · `partial` · `missing` · `not-applicable`. A numeração remete para o anexo do Despacho. Não substitui o Despacho; regista requisito, evidência no repositório, estado, responsável e próxima ação. Nada aqui escolhe licença, PID, classificação ou depósito por inferência.

| Secção | Requisito | Estado | Evidência no repo | Responsável | Próxima ação |
|---|---|---|---|---|---|
| §3 | Âmbito: publicações, dados, software, REA, outros; regras de financiadores/parceiros prevalecem | `partial` | `RESEARCH_OUTPUTS_REGISTER.json` (inventário) | autor/UAlg | HD-06: inventariar acordos/financiamento |
| §4.1.f / §4.2.e / §8.d | Identificadores permanentes (DOI, ORCID) | `missing` | campos `pid: null` no registo | autor | HD-04: ORCID do autor; DOI no depósito |
| §4.2.c / §6.e | Plano de Gestão de Dados (Argos/FCT) | `partial` | `DATA_MANAGEMENT_PLAN_DRAFT.md` (esqueleto) | autor + datasteward | HD-05: preencher PGD com decisões reais |
| §5.2.a | Publicações preferencialmente CC BY | `compliant` (metadados de terceiros) | catálogo 10B regista licença por obra | — | manter distinção acesso≠reutilização |
| §5.2.b | Metadados sob CC-BY mesmo sem acesso ao conteúdo | `compliant` (camada original) | HD-01 (2026-08-06): metadados/afirmações/entidades/mapeamentos próprios sob **CC BY 4.0**; terceiros excluídos | autor | aplicar ficheiro de licença de metadados no depósito (não por inferência) |
| §6.a/§6.b/§8.b | Depósito em OSF/Zenodo/Figshare/POLEN/Sapientia + readme + DOI + CC | `missing` | nenhum depósito; Git ≠ preservação | autor/UAlg | HD-05: mapa de depósito |
| §6.c | Distinguir dados brutos vs tratados | `partial` | originais vs derivados no acervo | autor | documentar raw/processed |
| §6.d | Dados pessoais sensíveis → acesso restrito/controlado (RGPD) | `partial` | colaborativo privado (RLS, demo-only); classificação por formalizar | autor/DPO | HD-02: classificar público/restrito/controlado |
| §6.f | Consórcio: titularidade e uso dos dados | `missing` | sem inventário (Despacho cita ICArEHB/CCMAR) | autor/UAlg | HD-06 |
| §6.g | Conservação ≥10 anos + RGPD | `missing` | sem plano de preservação | autor/UAlg | HD-05: `DEPOSIT_AND_PRESERVATION_PLAN_DRAFT.md` |
| §7.1 | REA com licenças abertas | `missing` | guia/docs sem licença aberta | autor | HD-03 |
| §7.2 | Software documentado, versões, licença (MIT/GPL), reprodutível | `partial` | versões/docs sim; sem licença SPDX; sem `codemeta.json` | autor | HD-03: licença de software |
| §7 | Ciência cidadã: depósito de dados participativos | `partial` | inquérito 2026/contributos | autor | HD-05 |
| §9 | Avaliação CoARA | `not-applicable` (repo técnico) | — | — | — |
| §11 | Monitorização (ODC, inquéritos, entrevistas) | `partial` | instrumentos do projeto são dados de investigação | autor | articular com ODC |
| Considerando FCT / §5.1.c | Acesso aberto sem prejuízo da retenção de direitos; embargos ≤12m/≤24m | `partial` | RIGHTS.md e 10B.1 não confundem acesso com cessão | autor | modelar embargos quando aplicável |

**Força a preservar:** o projeto **não confunde acesso aberto com autorização de reutilização** (RIGHTS.md; 10B.1 marca CC BY com URI pendente e ResearchGate como licença desconhecida).

**Risco transversal:** expor conteúdo em **Git público** é *disponibilização* para efeitos da política — exige licença de metadados (§5.2.b, HD-01) e classificação (§6.d, HD-02) **antes** de o conteúdo entrar no repositório (afeta o 10C.1).
