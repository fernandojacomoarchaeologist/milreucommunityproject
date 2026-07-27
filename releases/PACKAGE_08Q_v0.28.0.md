# Release — Pacote 08Q v0.28.0 (Hotfix do banner da Home e auditoria responsiva)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Hotfix cumulativo sobre 08A–08P. **Sem novos módulos, permissões ou migrations** (25 módulos / 149 permissões inalterados); dataset canónico 0.11.3; produção bloqueada.

## Causa raiz

O Pacote 08O uniformizou a caixa dos slides do carrossel com **`height:72vh` fixa + `overflow:hidden` no slide**. Em viewports curtos, mobile, landscape e com zoom, o conteúdo (título, subtítulo, botões) excedia a altura fixa e era **cortado** pelo `overflow:hidden`. Adicionalmente, a imagem vertical do cartaz do Inquérito forçava a altura do card em duas colunas.

## Solução de layout

- **Caixa externa partilhada por empilhamento:** os três slides passam a ocupar a **mesma célula de grid** (`grid-area:1/1`) na viewport; a caixa do carrossel é a do slide mais alto e todos a preenchem → caixa idêntica entre slides em qualquer viewport, sem layout shift.
- **Equalização por JS:** `equalizeHomeCarousel()` (em `src/main.js`) mede o `scrollHeight` real do slide mais alto e fixa a `min-height` da viewport; reequaliza no `resize` (debounced). Garante ≤1 CSS px entre slides sem cortar conteúdo.
- **Crop só na imagem:** o `overflow:hidden` sai do slide e fica apenas na camada de **media**; o conteúdo (texto/botões) nunca é cortado.
- **Imagem vertical não define a altura:** a `img` do cartaz passa a `position:absolute`, deixando de forçar a altura do card; recorta com `object-fit:cover`.
- **Conteúdo adaptável:** em mobile, Proteus e Inquérito seguem o padrão do Museu (media como fundo/overlay com gradiente; diagrama decorativo do Proteus ocultado); a tipografia do copo do Inquérito (descrição longa) é reduzida com `clamp()` sem truncar; os botões empilham (`flex-wrap` / largura total).
- **Auto-play preservado:** timer único, `document.hidden`, reduced motion e controlos intactos (08O).

## Verificação geométrica (browser real)

Medido a **320 / 375 / 768 / 1280**: `offsetHeight` idêntico entre os três slides (**maxDiff 0**), `title`/`subtitle`/`actions` dentro da caixa de cada slide, **sem scroll horizontal**. Asserções `banner-{mobile,tablet,desktop}-*` adicionadas ao runner Chromium (E2E de relógio/geometria real).

## Auditoria responsiva

`reports/responsive-audit-08q.json` — 4 áreas × 9 verificações × 8 viewports (320–1440, incl. landscape 1024×768):

| Área | Estado |
|------|--------|
| Portal (banner) | **responsive-fixed** |
| Museu | responsive-passed |
| Proteus | responsive-passed |
| Área Colaborativa | responsive-passed |

Sem overflow horizontal em nenhuma área. O **gate de acessibilidade humana permanece pendente** (do 08P): zoom 200%, leitor de ecrã e teclado exaustivo continuam a exigir sessão humana — a automação não promove.

## Entregáveis

- Contratos `public/data/`: `home-banner-responsive-model.json`, `responsive-audit-report.json`, `package-08q-readiness.json`.
- Scripts `scripts/08q/`: `validate-banner-content-bounds`, `audit-responsive-layout`, `validate-no-horizontal-overflow`, `build-responsive-report`.
- Testes: `tests/home-banner-responsive-08q.test.mjs`; asserções `banner-*` no runner Chromium. Validador/teste do carrossel 08O atualizados para o novo modelo de caixa.
- CI: `.github/workflows/08q-ci.yml`.

## Ficheiros de aplicação alterados

`src/styles/app.css` (modelo de caixa, overlay mobile, tipografia do Inquérito), `src/main.js` (equalizador + resize), `src/views/portal.js` (inalterado na estrutura; media/content já separados).

## Módulos, permissões e migrations (antes → depois)

- Módulos **25 → 25** · Permissões **149 → 149** · Migrations **sem novas**.

## Validação executada

`npm run validate` (cadeia completa + 08Q + contexto), `npm test` (480 testes), `npm run build`, `npm run smoke` — verdes. E2E de geometria (`e2e:08q`) em CI. Verificação visual em Chromium a 320/375/768/1280.

> Não ativa produção. A aprovação técnica não substitui a revisão humana de acessibilidade.
