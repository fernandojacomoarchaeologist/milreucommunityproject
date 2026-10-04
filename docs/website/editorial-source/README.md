# Fonte editorial — Item 2 · Website (Media/Press + Identidade)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **CANONICAL.** O portal **é** a sua própria fonte (código em Git). Este manifesto identifica a fonte editorial das áreas integradas no patch MSF 2026 — **sem duplicar o portal**.

## Rotas e vistas
- `#/imprensa` → `src/views/media-press.js`
- `#/identidade` → `src/views/visual-identity.js`
- bloco de enquadramento 2026 em `src/views/portal.js` (secção `/sobre`) + Media/Press
- router/registo: `src/lib/router.js`, `src/main.js`; i18n: `src/lib/i18n.js` (`mediaPress`, `visualIdentity`); layout/footer: `src/components/layout.js`

## Conteúdo (dados, não hardcoded)
- `public/data/media-assets.json` — sobre, contactos, kit, documentos (gated), estados vazios, `enquadramento2026`.
- `public/data/brand-assets.json` — logótipo (PNG; SVG/PDF null=pendente), cores HEX/RGB, CMYK (nota: não canónico), tipografia (sem fontes), regras.
- Ficheiros públicos: `public/press/` (textos+ZIP), `public/brand/` (logo PNG).

## Design System / i18n / rights
- **Tokens:** `packages/design-tokens/v0.2/` (HEX; CMYK não publicado; sem ficheiros de fonte).
- **i18n:** pt-PT publicado; EN/ES/FR com fallback visível.
- **Rights gate:** `downloadEnabled=true` **só** quando o uso da página é `yes` → só textos + logótipo PNG. SVG/PDF/CMYK/fontes/fotografias **protegidos** (gated/empty/pending). Fonte das regras: matriz do Item 9.

## Build / teste / deploy
```bash
npm ci && npm run validate && npm test       # 641/641
node scripts/collab/build-runtime-config.mjs && node scripts/build.mjs   # dist/
# deploy: workflow .github/workflows/07d-pages.yml (GitHub Pages)
```

## Postflight (2026-10-03)
Screenshots desktop+mobile de `/sobre`, `/imprensa`, `/identidade` entregues; enquadramento 2026 presente; rights gate confirmado; build+641/641+validate 0.
