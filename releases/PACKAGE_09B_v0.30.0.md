# Release — Pacote 09B v0.30.0 (Auditoria semântica, linguagem pública e estados dos idiomas)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Segundo pacote da **Série 09** (reordenada: o antigo "09B fontes" passou a 09E). Prepara o texto-fonte pt-PT correto e impede que instruções internas cheguem ao público, antes do 09C (oportunidades) e da internacionalização (09D). **Sem novos módulos, permissões ou migrations; sem tradução completa, SEO ou fontes; dataset canónico inalterado; produção bloqueada.**

## Descoberta

As **strings de interface** (menus, botões, rótulos) estão traduzidas nas 4 línguas no `i18n.js`. Mas o **conteúdo** (prosa do Portal, memórias do Museu, carrossel) só existe revisto em **pt-PT** — ao escolher EN/ES/FR, a UI mudava mas o conteúdo caía em pt-PT **em silêncio**, com o seletor a aparentar funcionar.

## Correções aplicadas (Tipo A — objetivas)

1. **Seletor de idiomas** (`src/lib/i18n.js`, `src/components/layout.js`, `src/main.js`):
   - `languageAvailability`: **pt-PT** `published`/selecionável; **EN/ES/FR** `preparation`/não-selecionáveis.
   - O seletor mostra EN/ES/FR como **"em preparação"** — desativados, `aria-disabled`, o leitor de ecrã ouve "Inglês — em preparação"; pt-PT com `aria-current`.
   - `setLanguage` **recusa** idiomas não selecionáveis; o valor inicial do `localStorage` é coagido para pt-PT.
   - Sem fallback silencioso, sem navegação para conteúdo `null`, sem `hreflang` para idiomas não publicados.
2. **Footer** (`src/components/layout.js`): removido o código de pacote interno `Versão 08A` → `Pré-visualização editorial · não indexável`.

## Propostas editoriais (Tipo C — decisão humana; **não aplicadas**)

Em `reports/editorial-decisions-09b.md`, para a tua revisão:
1. Home — reorganizar a sequência de conteúdo ("o que é Milreu → porquê importa → como participo") em vez de descrever a arquitetura interna.
2. Home/Proteus — evitar prometer "totens e futuras aplicações".
3. /conhecimento — rótulo explícito "em desenvolvimento".
4. /participar — explicitar benefício, compromisso, público e próximos passos (prepara o 09C).
5. /sobre — rever papel institucional, parceiros e enquadramento do doutoramento.

## Relatórios (`reports/`)

`semantic-audit-09b.json` + `.md`, `public-instruction-leaks-09b.json`, `editorial-decisions-09b.md`, `language-source-inventory-09b.json`. **14 elementos auditados: 2 corrigidos, 6 propostas, 6 mantidos.**

## Documento interno de hipóteses/personas

`docs/research/PARTICIPATION_HYPOTHESES_PERSONAS.md` — **uso interno, não publicar**. Hipóteses do doutoramento restritas a **Estoi, Faro e envolvente** (não generalização nacional); personas provisórias Luiz/Maria/Inês/Afonso; **atributos sensíveis excluídos de personalização/segmentação/elegibilidade**; política de menores por decidir (09C). Contrato: `public/data/research-hypotheses-model.json`.

## Contratos, scripts e testes

- Contratos `public/data/`: `language-availability-model`, `semantic-audit-model`, `package-09b-readiness`, `research-hypotheses-model`.
- Scripts `scripts/09b/`: `validate-language-availability`, `validate-no-internal-instructions`, `build-semantic-report` (na cadeia `validate`).
- Testes: `tests/language-selector-09b.test.mjs` (node) + `tests/e2e/portal/language-selector.spec.mjs` (Playwright). CI: `09b-ci.yml` (node); o E2E corre no `09a-playwright.yml`.

## Design system

Registado que o design system está adequado no ambiente de desenvolvimento. O 09B **não** reabre o Gate B nem introduz alterações visuais estruturais.

## Módulos, permissões, migrations (antes → depois)

- Módulos **25 → 25** · Permissões **149 → 149** · Migrations **sem novas** · Dataset canónico 0.11.3 inalterado.

> Não ativa produção. As mudanças editoriais substantivas ficam para a tua revisão. Nenhuma tradução automática publicada.
