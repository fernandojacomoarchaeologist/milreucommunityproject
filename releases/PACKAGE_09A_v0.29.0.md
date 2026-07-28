# Release — Pacote 09A v0.29.0 (Fundação de qualidade do Portal: Playwright + regressão visual)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

**Primeiro pacote da Série 09 — Consolidação e evolução do Portal público.** Base: último pacote mergeado (08Q, `main` @ `5de5f4a`, v0.28.0). Instala a rede de proteção **antes** de mexer em fontes, media, i18n e SEO. **Sem novos módulos, permissões ou migrations; sem alterar fontes, i18n, SEO, conteúdo editorial ou dataset.**

## Playwright como harness E2E principal (migração incremental)

- `playwright.config.mjs` (E2E geométrico/funcional/no-JS) e `playwright.visual.config.mjs` (regressão visual), com `webServer` a servir `dist` (teardown garantido), chromium, retries só no CI, trace/screenshot/vídeo em falha.
- **Não entra no `package-lock.json`** — instalado **ad-hoc no CI** (`npm install --no-save @playwright/test@1.49.1 && npx playwright install --with-deps chromium`), para **não partir o `npm ci`** dos jobs existentes (é ferramenta de teste, não runtime).
- **Migração incremental** com paridade registada (`reports/e2e-parity-09a.json`, 12 cenários). O **harness legado `scripts/e2e/run-browser-e2e-08j.mjs` é preservado**; a sua remoção está bloqueada até paridade + estabilidade + aprovação posterior.

## Asserções geométricas (apanham a classe 08O→08Q)

`tests/e2e/**` (numéricas, estáveis entre macOS e o CI Linux):
- **Banner** (`portal/home-carousel.spec.mjs`): caixa idêntica entre os 3 slides (**≤1 px**) + `title`/`subtitle`/`actions` **dentro da caixa** + sem scroll horizontal, a **375/768/1280/1440**. É exatamente a regressão que ocorreu entre 08O e 08Q.
- Portal, Museu (museu/galeria/detalhe), imersivo (saída + estado), Proteus (empty-state), Área Colaborativa (login/pendente/voluntário/master + biblioteca com fonte + admin negado), reduced-motion.

## Cenário sem JavaScript + progressive enhancement

Descobriu-se que o **Portal é 100% client-rendered** (sem JS a Home ficava em branco). Adicionado:
- **Fallback `<noscript>`** no `index.html` com o conteúdo essencial dos 3 destaques (título, subtítulo, ações — incluindo o **link externo real** do Inquérito 2026), sem cards sobrepostos.
- **Progressive enhancement CSS** (`:not(:has(.home-carousel__slide--active))`) — o 1.º slide fica visível se o JS não marcar um slide ativo.
- Teste `tests/e2e/portal/no-js.spec.mjs` (`javaScriptEnabled:false`): título/subtítulo/botões visíveis, sem overflow, em mobile e desktop.

## Regressão visual por screenshots

`tests/visual/` (config separada, `reducedMotion` para determinismo): baselines para **Portal, Museu, imersivo, Proteus, Área Colaborativa × 4 viewports**.
- **Baselines estabelecidos por passo explícito e revisável**: workflow `09a-visual-baseline.yml` (`workflow_dispatch`) gera-os **no Linux** (para coincidir com o CI) e sobe-os como **artefacto para revisão e commit humano**.
- **Nunca há auto-update de snapshots no CI** (`automaticSnapshotUpdateInCI:false`); mudanças de baseline são visíveis no diff do PR.

## Estabilidade de processos (flakes)

O `webServer` + isolamento do Playwright resolvem nativamente os flakes do harness legado (ENOTEMPTY, portas ocupadas, perfis Chromium órfãos, timeout DevTools). O job `e2e-playwright` **repete os cenários críticos** (`--repeat-each=5`) para detetar instabilidade.

## CI

- `09a-playwright.yml`: `quality` (node: `validate:09a` + `validate` + `npm test` + build + smoke) e `e2e-playwright` (bloqueante: geométrico/funcional/no-JS + repetição crítica; artefactos em falha).
- `09a-visual-baseline.yml`: manual (`workflow_dispatch`), gera + sobe baselines.

## Nota de execução (transparência)

O ambiente local **não tem `npm`, `docker` nem browser Playwright**. Foi verificado localmente **todo o lado node**: `validate:09a`, a cadeia `validate` completa, **480 testes** (`node --test`) e o `build`. **Os testes Playwright correm apenas no CI Linux** — o código foi escrito reaproveitando a lógica geométrica já provada no harness legado. Os **baselines visuais** dependem de um passo humano posterior (workflow manual + commit).

## Módulos, permissões, migrations (antes → depois)

- Módulos **25 → 25** · Permissões **149 → 149** · Migrations **sem novas** · Dataset canónico 0.11.3 inalterado.

> Não ativa produção. Não altera fontes, i18n, SEO nem conteúdo. A acessibilidade humana permanece `pending-human-review`.
