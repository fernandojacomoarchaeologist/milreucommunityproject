# Item 2 — Integração Media/Press + Identidade · RELATÓRIO DE QA (FASE D)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Escopo adicional do Item 2, consumindo o Item 9 aprovado. **O Item 9 não é reaberto**; os seus rights gates permanecem a fonte de verdade. **HUMAN GATE antes de merge.**

## 1. Rotas e navegação
- `#/imprensa` → `media-press` (título «Media / Press»). PASS.
- `#/identidade` → `visual-identity` (título «Identidade visual»). PASS.
- Fora da navegação principal (preserva a hierarquia atual). Acessos: **footer** (links «Media / Press» · «Identidade visual») e **página do projecto** (secção «Recursos para imprensa e parceiros»). PASS.
- Cross-link Media/Press ↔ Identidade em ambos os sentidos (hero + secções). PASS.

## 2. Downloads vs rights gate (matriz de verificação)
| Download oferecido | Ficheiro público | Estado | Correcto? |
|---|---|---|---|
| Kit de textos (ZIP) | `public/press/kit-textos-milreu.zip` | texto, sem foto | ✔ permitido |
| Nota de imprensa-base (.md) | `public/press/NOTA_DE_IMPRENSA_BASE.md` | texto | ✔ permitido |
| Descrições 50/100/250 + bio (.txt) | `public/press/*.txt` | texto | ✔ permitido |
| Logótipo do projecto (PNG) | `public/brand/logo-projeto-comunitario-milreu.png` | marca própria | ✔ permitido |
| Fact Sheet (PDF) | — | contém fotografia · PENDING | 🔒 **gated** (sem botão) |
| Dossiê de Convite (PDF) | — | contém fotografia · PENDING | 🔒 **gated** (sem botão) |
| Fotografias para imprensa | — | `press_editorial_use` PENDING | ⬚ **estado vazio** (sem botões) |
| Recursos para anfitriões | — | `host_partner_republication` PENDING | ⬚ **estado vazio** |
| Logótipo SVG / PDF vectorial | — | asset PENDING | 🔒 «em preparação» (sem botão) |
| CMYK dos tokens | — | não canónico | nota informativa (não publicado) |
| Logos de parceiros | — | uso institucional a confirmar | não oferecidos |

**Conclusão:** nenhum activo com rights `pending`/`no` gera botão de download. `downloadEnabled = true` apenas quando o uso da página é `yes` (3 downloads de texto + logo PNG). PASS.

## 3. Responsive (mobile 375×812)
- Media/Press: `scrollWidth == innerWidth` (sem overflow horizontal); 6 secções; 3 downloads + 4 estados gated/vazio. PASS.
- Identidade: sem overflow horizontal; 6 secções; logo PNG carrega (3 instâncias, `naturalWidth>0`); SVG/PDF «em preparação»; 8 cores HEX+RGB; 3 famílias tipográficas; sem download de fontes. PASS.
- Nenhuma página depende de `hover`. PASS.

## 4. Acessibilidade
- Headings semânticos (`h1` único + `h2` por secção, `aria-labelledby`). PASS.
- `alt` real em todas as imagens (logo e exemplos). PASS.
- Estados não dependem só de cor: 🔒 + texto para gated, ✔/✘ + legenda nos exemplos de logo. PASS.
- Botões de download com rótulo explícito («Descarregar PDF/SVG…», nunca «Clique aqui»). PASS.
- Foco visível e contraste AA herdados dos tokens v0.2 / `app.css`. PASS.

## 5. SEO / metadata
- `title`/`description` próprios por página (`seo-route-metadata.json`). PASS.
- Rotas classificadas no inventário 09f (PUBLIC_INDEX): 96 rotas, 20 indexáveis incl. as 2 novas. PASS.
- `noindex` global do site mantido (decisão editorial não alterada). PASS.
- Ficheiros de source/editáveis técnicos não indexados. PASS.

## 6. Design System público (curado)
- Consome tokens v0.2 aprovados (HEX/RGB); **CMYK não publicado** (não canónico). PASS.
- Papéis Fraunces/Spectral/Archivo exibidos; **ficheiros de fonte não disponibilizados**. PASS.
- Não expõe o guia interno (`apps/design-guide/`) nem `src/design-system/`. Resolve `PUBLIC_DS_PAGE_PENDING_ITEM2` do Item 9. PASS.

## 7. Regressão
- `npm test` → **641 pass / 0 fail**.
- `npm run validate` → **exit 0** (80+ validadores, incl. copyright, schemas, canais, SEO 09f).
- Correcção incidental: `channel-records.json` — 11 `printSource` `.jpg`→`.png` (bug pré-existente do PR #68, os `.jpg` tinham sido removidos). Dentro de `validate` passou a exit 0.
- Relatórios regenerados apenas os necessários (`seo-route-inventory-09f`, `seo-metadata-inventory-09f`); revertidos os que só mudavam `generatedAt`.

## 8. Definition of Done (SPEC §13)
- [x] páginas públicas existem
- [x] navegação/links funcionam (footer + projecto + cross-links)
- [x] nenhum asset PENDING/NO é descarregável
- [x] documentos aprovados do Item 9 acessíveis (texto + logo PNG)
- [x] logos aprovados acessíveis (PNG; SVG/PDF em preparação)
- [x] regras públicas da marca acessíveis
- [x] links Media ↔ Identidade funcionam
- [x] responsive PASS
- [x] accessibility PASS
- [x] testes existentes PASS (641/641)
- [x] estado canónico do Item 2 actualizado

**Resultado FASE D: PASS.** Aguarda **HUMAN GATE** antes de merge.
