# Item 2 — Integração Media/Press + Design System · RELATÓRIO DE AUDIT (FASE A)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **FASE A — AUDIT (só leitura; sem código).** Escopo adicional do Item 2, consumindo o Item 9 aprovado. **PROJECT GATE: PASS** (pacote `ITEM02_MEDIA_PRESS_DESIGN_SYSTEM_INTEGRATION_v1`; manifest parent=2/source=9; sem marcadores estrangeiros; isolado).
> **HUMAN GATE:** aprovar este audit + proposta de rotas antes de implementar (FASE B/C/D). Nenhum conflito canónico bloqueante encontrado.

## 1. Routing actual (convenções)
- Rotas definidas em `src/lib/router.js` como função `path → { name }`; **slugs em português** (`/projeto`, `/metodologia`, `/iniciativas`, `/conhecimento`, `/participar`, `/sobre`, `/exposicoes`, `/oportunidades`, `/transparencia`).
- Mapeamento `name → view` em `src/main.js`; vistas em `src/views/*.js`.
- Navegação e `footer()` em `src/components/layout.js` (há `HIDDEN_NAV`; footer com `#/museu · #/participar`).
- **i18n** em `src/lib/i18n.js`: `ui[lang][key]` via `text(lang,key)`; idiomas `pt-PT|en|es|fr`; **só `pt-PT` selecionável** (en/es/fr «em preparação», sem fallback silencioso).

## 2. Design System (fonte de verdade)
- Tokens **v0.2** (`packages/design-tokens/v0.2/tokens.json`, `approved-for-implementation`): cores em **HEX** (ex.: `red.500 #A83227` assinatura; `ink.950 #1E1A17`; `paper.50 #FFFCF7`; patina/sepia/stone…).
- **CMYK não é canónico** («CMYK definitivo não faz parte desta versão»; «exige prova física») → **não publicar CMYK**.
- Tipografia: **Fraunces** (display), **Spectral** (leitura), **Archivo** (interface/metadados/créditos) — papéis `HUMAN-DECIDED`. **Ficheiros de fonte `PENDING`** (OFL; licença/produção = decisão humana) → **nunca** disponibilizar fontes para download.
- Guia vivo `apps/design-guide/` = `internal-preview`; `src/design-system/components.js` = biblioteca **interna**. → A página pública deve ser **curada** (não expor o interno cru).

## 3. Assets do Item 9 + matriz de direitos
Fonte: `docs/dissemination/kit-digital-press/v1/`.
- **Texto (publicável já):** `02_TEXTOS/` (50/100/250 palavras, bio, contactos); `03_PRESS/NOTA_DE_IMPRENSA_BASE.md` (editável).
- **Logótipo do projecto:** `05_LOGOS/PROJECTO/logo-projeto-comunitario-milreu.png` (PNG transparente; **SVG/PDF PENDING**).
- **Logos de parceiros:** conjunto canónico — uso institucional **a confirmar** (`PROVENIENCIA.txt`) → **não** oferecer para download público agora.
- **Fotografias (matriz, 8 imagens):** `project_official_publication = **YES**`; `press_editorial_use` / `host_partner_republication` / `generic_third_party_redistribution` = **PENDING** (todas).
- **Peças com fotografia** (Fact Sheet, nota de imprensa PDF, social, web hero, dossiê, cartaz): previews `NOT FOR DISTRIBUTION` → **não publicáveis**.

## 4. O que pode ser publicado AGORA (matriz de publicação)
| Asset | Uso aplicável | Estado | Publicar? | Motivo |
|---|---|---|---|---|
| Descrições 50/100/250, bio | — (texto) | — | **SIM** | texto canónico, sem foto |
| Contactos | autorizado (Item 9) | — | **SIM** | contactos já autorizados |
| Nota de imprensa — editável (.md, texto) | — | — | **SIM** | sem foto |
| Logótipo do projecto (PNG) | marca própria | — | **SIM** | marca do próprio projecto |
| Logótipo do projecto (SVG/PDF) | marca própria | PENDING | **NÃO** | vetor oficial inexistente |
| Regras de marca · cores (HEX/RGB) · tipografia (famílias/papéis) | DS público | — | **SIM** | curado, sem ficheiros de fonte |
| CMYK dos tokens | DS público | PENDING | **NÃO** | não canónico |
| Fotografias para imprensa | press_editorial_use | PENDING | **NÃO** | estado vazio informativo |
| Materiais para anfitriões (c/ foto) | host_partner_republication | PENDING | **NÃO** | estado vazio informativo |
| Fact Sheet / Nota PDF / social / web / dossiê (c/ foto) | press/generic | PENDING | **NÃO** | contêm fotografia |
| Cartaz local (Item 8) | — | STAND BY | **NÃO** | sem evento real; referência apenas |
| Logos de parceiros | — | a confirmar | **NÃO** | uso institucional por confirmar |

**Conclusão:** as duas páginas podem ser lançadas **com estrutura completa**, mas o conteúdo descarregável inicial é **texto + logótipo do projecto + regras/cores/tipografia**; secções de fotografias e de materiais de anfitrião iniciam em **estado vazio elegante** (sem expor PENDING como download).

## 5. Proposta de rotas / arquitectura (a aprovar)
- **Rotas (slugs PT, coerentes com o router):**
  - `/imprensa` → `name:"media-press"` (título «Media / Press»).
  - `/identidade` → `name:"visual-identity"` (título «Identidade visual»).
- **Vistas:** `src/views/media-press.js`, `src/views/visual-identity.js`; registar em `router.js` + `main.js`.
- **Dados (não hardcoded):** `public/data/media-assets.json` + `public/data/brand-assets.json`, com `rights { projectOfficialPublication, pressEditorialUse, hostPartnerRepublication, genericThirdPartyRedistribution, source, condition, status }` (`yes|no|pending`) e `downloadEnabled` **derivado** (true só quando o uso da página é `yes`).
- **Ficheiros públicos:** copiar os activos publicáveis para `public/press/` e `public/brand/` (texto, logo PNG), referenciados pelo JSON; **nunca** copiar previews `NOT FOR DISTRIBUTION`.
- **i18n:** criar chaves desde o início (pt-PT publicado; en/es/fr «em preparação», como o resto do site).
- **Acessos:** no **footer** (+ «Imprensa» e «Identidade visual») e na **área institucional/página do projecto**; **cross-link** Media/Press ↔ Identidade. **Não** na navegação principal (preservar a hierarquia atual).
- **Componentes reutilizáveis:** `ResourceCard`, `DownloadButton`, `ImageAssetCard`, `BrandAssetCard`, `ContactBlock`, `LogoUsageExample`; linguagem editorial dos Itens 5–9 (sem «homepage antiga»); rótulos «Descarregar PDF/SVG…» (nunca «Clique aqui»).
- **Estados vazios:** fotografias → «As fotografias para redistribuição editorial encontram-se em validação de direitos. Para pedidos específicos, contacte-nos.»; anfitriões → «Os materiais para espaços anfitriões estão a ser preparados.»
- **A11y/SEO:** headings semânticos, alt real, foco visível, contraste AA, labels claros; title/description/OpenGraph/canonical por página; `noindex` em source/editáveis técnicos; manter `noindex` global atual do site até decisão editorial.
- **Analytics:** só eventos compatíveis com o sistema atual (se existir) — `media_kit_download`, `press_document_download`, `press_image_download`, `logo_download`, `brand_guide_download`. **Sem** novo fornecedor.

## 6. Conflitos canónicos / riscos
- **Nenhum conflito bloqueante.** As limitações são de **direitos** (fotos PENDING) e de **assets pendentes** (SVG/PDF do logo; CMYK; fontes) — todos tratados por **gate + estado vazio**, conforme a spec.
- O **Design System público** será **curado** a partir dos tokens/papéis aprovados (não expõe o interno). Fica resolvido o `PUBLIC_DS_PAGE_PENDING_ITEM2` do Item 9.
- **Item 9 não é reaberto**; os seus rights gates permanecem a fonte de verdade.

## 7. Proposta de faseamento (após aprovação)
- **FASE B — Media/Press:** rota + vista + dados + componentes + downloads permitidos + estados vazios.
- **FASE C — Identidade:** página pública curada (logo PNG, regras, cores HEX/RGB, tipografia, exemplos) + download do logo + (opcional) guia rápido de marca em PDF.
- **FASE D — QA:** rotas, responsive, downloads vs rights, a11y, SEO, cross-links, smoke/regressão (641 testes + `npm run validate`), matriz rights/publicação, screenshots desktop/mobile.

**Pergunta de decisão (antes da FASE B):** confirmar slugs `/imprensa` e `/identidade` (ou preferes `/media` e outra variante?) e a colocação dos acessos (footer + institucional, fora da nav principal).
