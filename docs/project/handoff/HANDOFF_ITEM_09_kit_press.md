# Handoff — Item 9 · Kit Digital + Press Kit «Entre Ruínas e Memórias»

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: ver [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 9).

**O que é.** **Pacote organizado** (não um documento) para **espaços anfitriões, imprensa e parceiros** divulgarem a exposição sem reinventar identidade/copy/créditos/logótipos/fotografias. Estrutura de 10 pastas.

## 1. Local dos arquivos
- **`docs/dissemination/kit-digital-press/v1/`**:
  - `01_README/` (`README_KIT.md`, `QUICK_START.md`)
  - `02_TEXTOS/` (`DESCRICAO_50/100/250_PALAVRAS.txt`, `BIO_PROJECTO_CURTA.txt`, `CONTACTOS.txt`, `ENQUADRAMENTO_2026.txt`)
  - `03_PRESS/NOTA_DE_IMPRENSA_BASE.md`
  - `04_IMAGENS/` (`LEGENDAS_E_CREDITOS.csv`, `USO_E_DIREITOS.md`, **`PRESS_EDITORIAL_USE/`** = 5 JPEG + créditos + texto obrigatório)
  - `05_LOGOS/` (`PROJECTO/` logo oficial PNG; `REGRAS_DE_USO.md`)
  - `06_SOCIAL/SPECS_SOCIAL.md` · `07_WEB/SPECS_WEB.md` · `08_CARTAZ/REF_ITEM8.md` · `09_QR/` (`QR_SITE.png/.svg`)
  - `10_MANIFEST/` (`manifest.json`, `inventory.csv`, `QA_REPORT.md`, `IMPACT_AUDIT_AAMLF_2026-10-06.md`)
  - `_previews/` (fact sheet, nota imprensa, social, web hero, `_PRANCHA_KIT.png`) — marcados `NOT FOR DISTRIBUTION`.

## 2. Pontos mais importantes
- **Estado: PRESS EDITORIAL PACKAGE READY / GENERIC & HOST REDISTRIBUTION GATED** (PRs #105/#107/#108/#109).
- **Matriz de direitos por imagem (4 estados):** `project_official_publication` (**YES**, 2026-07-23), `press_editorial_use`, `host_partner_republication`, `generic_third_party_redistribution`.
  - `press_editorial_use=YES` (c/ crédito): **MM202601** (Festa da Pinha/Torre do Tombo, com termos da fonte), **MM202603**, **MM202608**, **MM202613**.
  - **YES c/ restrição:** MM202602. **NO:** MM202604/MM202627/MM202631.
  - `host_partner_republication` = **PENDENTE** e `generic_third_party_redistribution` = **NO** em todas.
- **ZIP público genérico + republicação por anfitrião = BLOQUEADOS.** Nenhuma foto entra em pastas distribuíveis sem `YES` no estado respectivo.
- **NIF fora do kit.** Logótipo: PNG oficial; **SVG/PDF pendentes**.
- **Integração pública no site concluída** (Item 2: `#/imprensa` + `#/identidade`) — resolveu `PUBLIC_DS_PAGE_PENDING_ITEM2`.

## 3. Como se estruturou a arte
Pacote (não peça): textos canónicos 50/100/250 + bio + enquadramento 2026; nota de imprensa editável (campos `[ ]`); Fact Sheet 1 p.; social institucional/local (slot do anfitrião); web hero; `LEGENDAS_E_CREDITOS.csv`; `USO_E_DIREITOS.md`; `REGRAS_DE_USO.md`; QR; manifest/inventory/QA. Taxonomia de entidades (sem duplicar AAMLF).

## 4. Como se trabalhou ponto a ponto
1. FASE 1 estrutura + drafts + PROJECT GATE PASS.
2. Patch MSF 2026 (bloco «Enquadramento 2026») (PR #76/#81).
3. Matriz de direitos **por imagem** (#105) + auditoria de impacto AAMLF (#107).
4. Reconciliação **MM202601→YES** + taxonomia (#108).
5. Pacote **`PRESS_EDITORIAL_USE/`** com texto obrigatório de crédito (#109). Previews regenerados sem taxonomia superseded.

## 5. O que NÃO fazer
- **NÃO** distribuir ZIP público genérico nem permitir republicação por anfitrião (bloqueados).
- **NÃO** mover fotos `pending`/`no` para pastas distribuíveis (WEB/PRESS/social).
- **NÃO** copiar previews `NOT FOR DISTRIBUTION` para `public/`.
- **NÃO** incluir NIF; **NÃO** inventar claims.
- **NÃO** afirmar que uma foto ganhou direitos (project=YES não implica press/host/generic).

## 6. Resultado esperado
Kit reutilizável por anfitriões/imprensa, com direitos resolvidos por imagem/estado; ZIP público só quando `generic`/`host` forem resolvidos e o logo vetorial existir.

## 7. Documentos necessários
`04_IMAGENS/USO_E_DIREITOS.md`, `LEGENDAS_E_CREDITOS.csv`, `10_MANIFEST/manifest.json`, `docs/dissemination/RIGHTS_DECISIONS_2026-10-05.md`; regras `public-museum-images`, `08e-rights-not-assumed`, `single-source-multichannel`.

## 8. Pendências observadas
- 🟠 **`host_partner_republication`** e **`generic_third_party_redistribution`** por imagem/fonte → **ZIP público bloqueado**.
- 🟠 **SVG/PDF vectorial do logótipo** pendente.
- 🟠 **CMYK canónico** não publicado.

## 9. Dossiê do modo de trabalhar (Item 9)
Direitos tratados como **matriz multi-estado por imagem** (nunca booleano único); distribuição **gated**. Single-source multicanal: reutilizar identificador/foto/crédito/direitos; regenerar exports. Nenhum claim inventado; previews sempre marcados.

## 10. Onde está cada informação
- **Kit:** `docs/dissemination/kit-digital-press/v1/` (10 pastas).
- **Direitos:** `04_IMAGENS/USO_E_DIREITOS.md` + `RIGHTS_DECISIONS_2026-10-05.md`.
- **Estado/histórico:** `docs/project/ESTADO_ITENS_1-5_2026-10-01.md` (Item 9).

## 11. Registo incremental (append-only — acrescentar no fim; nunca reescrever entradas)
> Formato: `AAAA-MM-DD · TIPO · descrição · fonte`. TIPO ∈ **NOVO** · **DECISÃO** · **ALTERADO** · **REMOVIDO** · **PENDENTE** · **RESOLVIDO**. Método em `00_INDEX_E_METODO.md`.

- 2026-10-12 · NOVO · Registo incremental iniciado. Estado de referência = §2 deste ficheiro (2026-10-12).
