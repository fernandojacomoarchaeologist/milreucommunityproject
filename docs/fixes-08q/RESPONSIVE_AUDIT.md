# Hotfix do banner e auditoria responsiva — Pacote 08Q

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

## Defeito e correção do banner

O 08O fixou a caixa dos slides em `height:72vh` + `overflow:hidden`, o que **cortava** título/subtítulo/botões em viewports curtos/mobile/landscape/zoom. O 08Q mantém a **mesma caixa externa** (fonte: Museu de Memórias) mas reorganiza o interior:

- slides **empilhados na mesma célula** (`grid-area:1/1`) + **equalização por `scrollHeight`** (`equalizeHomeCarousel` em `src/main.js`, reequaliza no resize) → caixa idêntica entre slides (**maxDiff 0** a 320/375/768/1280);
- `overflow:hidden` **só na media** (crop da imagem), nunca no slide;
- a **imagem vertical** do cartaz passa a `position:absolute` para não forçar a altura;
- em mobile, Proteus/Inquérito seguem o padrão do Museu (media de fundo + gradiente; diagrama do Proteus oculto); tipografia do Inquérito reduzida com `clamp()` sem truncar; botões empilham;
- **auto-play preservado**.

## Matriz responsiva (`reports/responsive-audit-08q.json`)

Viewports: 320×568, 360×800, 375×812, 390×844, 768×1024, 1024×768 (landscape), 1280×800, 1440×900.

| Área | Estado | Evidência |
|------|--------|-----------|
| Portal | `responsive-fixed` | Banner: offsetHeight idêntico (maxDiff 0), conteúdo dentro da caixa, sem h-scroll; restantes secções sem overflow. |
| Museu | `responsive-passed` | Museu/galeria/detalhe/imersivo sem app-error nem overflow; imersivo com saída e teclado. |
| Proteus | `responsive-passed` | Empty-state no carrossel, sem dados inventados; cabe na caixa partilhada. |
| Área Colaborativa | `responsive-passed` | Menu responsivo (scroll horizontal, aria-current, foco); login/perfis sem overflow. |

Verificações por área: no-horizontal-overflow, content-visible, navigation, forms, modals, zoom-200, keyboard, reduced-motion, landscape.

## Acessibilidade humana

Gate independente, **pendente** (mantido do 08P). A automação (reflow, reduced-motion, teclado skip-link) não promove; zoom 200%, leitor de ecrã e teclado exaustivo exigem sessão humana.
