---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08J"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Ledger de contexto do Projeto Comunitário de Milreu

Este ficheiro é cumulativo. Não deve ser substituído por um resumo apenas do pacote mais recente.

## Identidade e objetivo

O **Projeto Comunitário de Milreu** é o programa principal de Arqueologia Pública e Comunitária em Estoi e Faro.

Objetivo:

> Resgatar a memória e o valor histórico de Milreu para a população de Estoi e também de Faro.

Princípios públicos:

1. Comunicação;
2. Mutualidade;
3. Pertinência Social e Política.

Regra interpretativa interna:

> A comunidade fala primeiro; a instituição funciona como contexto e moldura.

## Camadas

### Portal público

Navegação, contexto, metodologia, iniciativas, participação, agenda, conhecimento e acesso ao Museu.

### Museu de Memórias

Exploração visual e imersiva das memórias. Possui 31 registos visíveis no ambiente de revisão.

### Milreu Proteus

Base de conhecimento, proveniência, relações, dados e exports. Não é a marca principal.

### Área Colaborativa

Espaço autenticado para coordenação, voluntários, investigadores, revisores, tradutores, parceiros e colaboradores comunitários.

### Canais físicos

Totens e painéis permanecem dependentes do Pacote 14 e de especificações finais de impressão.

## Invariantes editoriais

- `pt-PT` é a língua-fonte.
- `en`, `es` e `fr` dependem de revisão.
- Conteúdo preliminar não é aprovado por inferência.
- Direitos, créditos, fontes, intervenções digitais e pedidos de retirada devem permanecer rastreáveis.
- Regra operacional: não publicar automaticamente.
- Não inventar contactos, domínios, datas, traduções, autorizações ou direitos.
- GitHub guarda código, documentação e snapshots públicos aprovados.
- Supabase guarda operação, rascunhos, membros, tarefas, contributos e decisões.
- `service_role` nunca entra no browser.

## MM202617

MM202617 pode permanecer visível para revisão. Deve declarar claramente que houve **retoque substantivo com inteligência artificial**.

O registo:

- não deve ser apresentado como imagem original não alterada;
- permanece inelegível para lançamento público enquanto os gates editoriais não forem concluídos;
- pode ser aprovado posteriormente apenas com direitos, crédito e divulgação adequados.

## Histórico dos pacotes

### 01 — Fundação, governança e escopo

Definiu identidade, objetivos, princípios, estados e fronteiras.

### 02 — Sistema de design e guia vivo

Definiu tokens, tipografia, grids, acessibilidade e linguagem visual.

### 03 — Modelo de dados do Museu

Definiu memória, fonte, direitos, media, relações, canais e localização.

### 04 — Auditoria e migração preliminar

Mapeou o legado e os estados de revisão.

### 05A — Auditoria visual da fonte primária

Analisou o livro privado de Hauschild e Teichner sem o publicar.

### 05B — Fundações visuais de produção

Consolidou tokens visuais.

### 05C — Catálogo visual interativo

Criou a referência de componentes e padrões.

### 05D — Componentes e padrões museológicos

Definiu comportamento do Portal e Museu.

### 05E — Identidade, logo e iconografia

Criou derivados técnicos do logótipo, sujeitos a revisão humana.

### 05F — Infraestrutura, persistência e skills

Aprovou Supabase, GitHub Pages, migrations protegidas, skills e agentes.

### 06 — Arquitetura do Portal e Museu

Definiu rotas, páginas, fluxos e matrizes.

### 07A — Base executável e imagens

Criou a aplicação estática e pipeline das 31 imagens.

### 07B — Portal público

Ativou páginas institucionais e iniciativas.

### 07C — Museu digital

Ativou pesquisa, filtros, coleções, timeline, detalhe e imersivo.

### 07D — Multicanal e MVP

Criou exports, JSON-LD, laboratório e gates de release.

### 07D.1 — Conteúdo, navegação e slideshow

Corrigiu pilares, menus, CTA e imersivo.

### 07D.2 — Imersivo e carrossel da Home

Corrigiu saída, encaixe de imagem e carrossel Museu/Proteus/Inquérito.

### 07D.3 — MM202617

Desbloqueou o registo para revisão com divulgação explícita de retoque substantivo por IA, mantendo o bloqueio de lançamento.

### 08A — Fundação da Área Colaborativa

Google Auth, perfis, permissões, master e módulos.

### 08B — Membros e perfis

Gestão de membros, funções, interesses, competências e pré-autorizações.

### 08C — Voluntariado e tarefas

Disponibilidade, tarefas, candidaturas, progresso e tempo.

### 08D — Agenda e exposição itinerante

Locais, períodos, eventos, RSVP, logística e página pública.

### 08E — Contributos comunitários

Submissão, ficheiros privados, consentimento, moderação, direitos e retirada.

### 08F — Revisão editorial e curatorial

Revisão das 31 memórias, formação, biblioteca, gates, snapshots e efeitos orgânicos nas páginas principais.

### 08G — Implantação e homologação

Ambientes local, staging e produção; Google OAuth; master configurável; preflight; RLS; storage; 24 checks e gates de produção.

### 08H — Notificações e operação

Centro interno, preferências, eventos, templates transacionais, outbox, worker webhook, retries, dead-letter e convites explícitos.

### 08I — Administração e continuidade

Saúde operacional, auditoria redigida e íntegra, retenção protegida, legal holds, incidentes, backups declarativos e exercícios de continuidade.

## Estado funcional após 08I

Todos os 22 módulos do registo colaborativo possuem implementação ativa:

- dashboard;
- perfil;
- disponibilidade;
- tarefas;
- contributos;
- agenda;
- biblioteca;
- formação;
- revisão do Museu;
- gestão de tarefas;
- membros;
- convites;
- moderação;
- locais;
- exposições;
- gestão da revisão;
- implantação e homologação;
- notificações;
- gestão de notificações;
- administração do sistema;
- auditoria e retenção;
- incidentes e continuidade.

## Próximas fronteiras

- Pacote 08J: fecho funcional, acessibilidade, testes E2E e release candidate da Área Colaborativa;
- execução real das migrations em local e staging;
- configuração do Google OAuth;
- bootstrap do master;
- homologação por perfil;
- aplicação humana das revisões;
- traduções;
- lançamento público;
- domínio;
- contacto público;
- acessibilidade final;
- impressão física;
- notificações apenas quando justificadas.

## Invariantes de comunicação

- o centro interno é o canal canónico;
- e-mail desativado por padrão;
- fornecedor não é escolhido por inferência;
- convites não são enviados automaticamente;
- templates aprovados são imutáveis;
- service role e worker secret ficam no servidor;
- pedidos de retirada são prioritários;
- chat interno não faz parte do escopo.

## Invariantes operacionais do 08I

- auditoria sem update/delete;
- consulta e exportação redigidas;
- retenção sem execução automática;
- legal hold antes de qualquer aplicação;
- browser sem mutação de produção;
- backup só é considerado verificado com evidência;
- incidentes usam o mínimo de dados pessoais;
- contributos, auditoria e direitos permanecem fora de eliminação automática.

### 08J — Fecho funcional, acessibilidade, E2E e release candidate

Fechou transversalmente a Área Colaborativa sem criar um novo domínio funcional.

Preserva:

- 22 módulos ativos;
- 117 permissões;
- 25 eventos e templates;
- 20 checks operacionais;
- 7 políticas de retenção;
- todos os gates editoriais e de produção.

Introduz:

- baseline WCAG 2.2 AA;
- checklist humano obrigatório;
- matriz de cenários por perfil;
- E2E em Chromium por CDP;
- subrota de release candidate;
- evidência em JSON e Markdown;
- separação entre RC técnica, staging e produção.

## Estado funcional após 08J

A Área Colaborativa encontra-se fechada como **release candidate técnica**, desde que validações, testes, E2E, build e smoke sejam executados com sucesso.

Continuam fora dessa aprovação:

- Supabase real;
- Google OAuth;
- bootstrap do master;
- migrations e Edge Functions em staging;
- RLS por perfil em ambiente real;
- backup e restauração;
- revisão visual, teclado e leitor de ecrã por humanos;
- revisão editorial das 31 memórias;
- direitos, créditos e traduções;
- domínio, contacto e produção.

## Invariantes de release do 08J

- RC técnica não equivale a staging homologado;
- staging homologado não equivale a produção aprovada;
- automação não substitui acessibilidade humana;
- E2E local não prova infraestrutura remota;
- secrets nunca entram no browser, ZIP ou chat;
- gates sem evidência permanecem bloqueados ou pendentes.

## Pacote 08K — Piloto controlado e homologação operacional (v0.22.0)

Implementa o sistema de piloto controlado da Área Colaborativa, restrito a **staging**. Novo módulo `pilot` (rotas `/area-colaborativa/piloto` e `/area-colaborativa/gestao/piloto`), 10 permissões novas (total 127), 9 tabelas sob RLS, RPCs auditadas, cenários (modelos sem resultados), sessões, observações/feedback, evidências privadas (referência, nunca binário), métricas internas e gates.

**Invariantes preservados:** produção bloqueada; escrita pública automática proibida; efeitos públicos (`portal.home.after-featured`, `museum.home.after-opening`) permanecem vazios; e-mail e chat desativados; `service_role` fora do browser; MM202617 continua bloqueada; participante vê apenas o próprio contexto (isolamento por RLS); evidências privadas nunca expostas a participantes; homologação de staging exige gates aprovados **e** a confirmação literal `APPROVE_MILREU_STAGING_HOMOLOGATION`, que nunca substitui a evidência. Estados honestos: `technicalCandidate: ready`, `pilotReadiness: blocked`, `stagingHomologation: blocked`, `productionApproval: blocked`. O 08L não é antecipado.

## Pacote 08L — Integração pública, participação contínua e evolução (v0.23.0)

Implementa efeitos públicos por slot (proposta → revisão de 6 dimensões → snapshot → ativação gated), participação contínua (módulo `continuous-participation`) e evolução orientada pelo piloto. 13 permissões novas (total 140), 9 tabelas sob RLS com **leitura pública (anon) restrita a snapshots ativos**. **Invariantes:** 0 efeitos públicos ativos por omissão; slots vazios; produção bloqueada; publicação automática proibida; snapshots sem PII; ativação exige literal `ACTIVATE_MILREU_PUBLIC_EFFECT`; sem ranking/gamificação; `activate`/`rollback`/`evolution.decide` master-only; Portal/Museu sem regressão; MM202617 inelegível. Estados: technicalCandidate ready; pilotEvidence/publicIntegrationCandidate/stagingPreview/productionApproval blocked.

## Pacote 08M — Operação pública, governação, monitorização e sustentabilidade (v0.24.0)

Implementa operação real (ciclos), responsabilidades, suporte, moderação, revisão periódica de conteúdo, decisões de governação, indicadores (operacional/participação/impacto), transparência pública por snapshot e continuidade/handover/desativação segura. Novo módulo `operations-governance`; 9 permissões genuinamente novas (`operations.view/manage` e `continuity.manage` já existiam do 08I) → total **149**. 9 tabelas sob RLS com **leitura pública `anon` restrita a snapshots de indicadores `published`**. **Invariantes:** 0 ciclos operacionais ativos; transparência pública off; `publishesIndividualData=false`; sem inferência automática de impacto; indicadores exigem definição/fonte/metodologia; suporte próprio privado; moderação restrita (sujeito sem acesso admin); `governance.decide` reservado ao master; publicação de transparência exige literal `APPROVE_MILREU_PUBLIC_TRANSPARENCY` + privacidade/qualidade aprovadas; produção bloqueada; contactos não públicos; Portal/Museu sem regressão. Estados: technicalCandidate ready; operationsCandidate not-evaluated; publicTransparency/continuity/productionApproval blocked.

## Pacote 08N — Refino da área voluntária, correções de site e imersivo (v0.25.0)

Pacote de refinamento (sem novos módulos, permissões ou tabelas de schema; 1 migration para apertar limite). Enriquece as secções do voluntário com estrutura orientadora (Objetivo/Ações esperadas/Pequeno guia/Detalhes) na home; limita a Formação a mostrar apenas o percurso Fundamentos (`project-foundations`) na UI, preservando os restantes no backend; anexos em Contributos passam a **10 MB** (cliente + config + constraint CHECK nova, reforço no backend; método real = URL assinada para bucket privado via Edge Function 08E); home com bloco de **ações pendentes** derivado de dados reais (sem inventar); correções do carrossel (autoplay já configurado, crop do Inquérito 2026 via object-fit:cover para remover a linha azul e uniformizar tamanho); **retorno ao Portal no imersivo** (novo controlo `data-immersive-portal` → `#/`, preservando "Voltar ao Museu", fecho e não-regressão). Invariantes preservados: 0 efeitos públicos, produção bloqueada, MM202617 inelegível, dataset canónico 0.11.3, service_role fora do browser. Estados 08N: volunteerRefinement/publicCarouselFixes/immersiveNavigationFixes ready-to-implement→implementado; productionApproval blocked.

## Pacote 08O — Fixes pós-merge: carrossel, auditoria da Área Colaborativa (v0.26.0)

Pacote de correção pós-merge (sem novos módulos, permissões, workflows ou tabelas; sem migrations). **Carrossel:** substitui o asset do Inquérito 2026 por PNG fornecido (`public/media/home/inquerito-2026-carousel.png`, 1030×1426, SHA-256 `ea58885f…`), removendo a referência antiga; iguala os três slides à **caixa canónica do Museu de Memórias** (altura fixa `72vh`/`80vh` no viewport e slide, `object-fit:cover`, sem layout shift ≤1 CSS px); **auto-play definitivo** — timer único, loop, reinício após navegação manual (via `render`→`scheduleHomeCarousel`), pausa em hover/focus/**`document.hidden`** (novo guard + listener `visibilitychange`), reduced motion, limpeza de listeners por recriação do DOM; intervalo do config (fallback 7000 ms); E2E Chromium com relógio real. **Área Colaborativa:** auditoria pós-merge dos 10 itens (participação contínua, revisão do Museu com route guard+RLS, suporte, menu, formação com 1 percurso visível, contributos 10 MB, proposta de atividade com dono do projeto a decidir, home com dados reais, estados transversais, fontes reais vs fixtures) — resultado registado em `docs/fixes-08o/`. Contratos: `carousel-post-merge-model.json`, `collaborative-post-merge-audit.json`, `package-08o-readiness.json`. Invariantes preservados: 0 efeitos públicos, produção bloqueada, MM202617 inelegível, dataset canónico 0.11.3, service_role fora do browser, sem fixtures como dados reais em staging/produção.

## Pacote 08P — Fecho funcional transversal da Área Colaborativa (v0.27.0)

Pacote de fecho funcional/auditoria transversal (sem novos módulos, permissões, workflows ou migrations; 25 módulos/149 permissões inalterados). Audita as **10 áreas** (primeiro acesso, perfil/membership, notificações/deep links, disponibilidade, tarefas, agenda, biblioteca, matriz por perfil, acessibilidade humana, fronteira técnica/operação) e corrige só o que falha — resultado em `reports/functional-closure-08p.json` (**2 `fixed`, 7 `passed`, 1 `blocked` humano**). **Fixes reais:** (1) **primeiro acesso** — `collaborativeOnboardingView` passou a distinguir `suspended`/`archived`/`rejected` (bloqueio com suporte neutro, sem notas internas nem motivo) em vez de mostrar o formulário de pedido a um suspenso; (2) **biblioteca** — cartões passam a mostrar finalidade (resumo), fonte rotulada e audiência/estado (sem inventar autoria; recursos são documentos próprios). **Matriz por perfil** (`reports/role-access-matrix-08p.json`) construída a partir das permissões **reais** (13 perfis→papéis; visibilidade de menu derivada; não-ativos veem 0 módulos). **Acessibilidade humana** permanece `blocked`/`pending-human-review` — a automação **não** promove (`human-accessibility-gate.json`). Contratos em `public/data/`: `collaborative-functional-closure.json`, `role-access-matrix.json`, `human-accessibility-gate.json`, `package-08p-readiness.json`. 5 scripts `scripts/08p/`, E2E por perfil no runner Chromium. Bloqueadores externos listados (Supabase staging, OAuth, master, migrations, storage, backup, domínio, observabilidade, responsáveis, coorte do piloto). Invariantes: 0 efeitos públicos, produção bloqueada, MM202617 inelegível, dataset canónico 0.11.3, service_role fora do browser.

## Pacote 08Q — Hotfix do banner da Home e auditoria responsiva (v0.28.0)

Hotfix a uma **regressão introduzida pelo 08O** (a caixa `height:72vh` fixa + `overflow:hidden` no slide cortava título/subtítulo/botões em viewports curtos/mobile/landscape) + auditoria responsiva transversal. Sem novos módulos/permissões/migrations (25/149 inalterados). **Correção do banner:** os três slides passam a partilhar a caixa externa por **empilhamento na mesma célula de grid** (`grid-area:1/1`) + **equalização por JS** (`equalizeHomeCarousel` mede o `scrollHeight` mais alto e fixa a `min-height` da viewport; reequaliza no resize) → caixa idêntica entre slides (**maxDiff 0** medido a 320/375/768/1280), sem layout shift nem corte. O `overflow:hidden` sai do slide e fica só na **media** (crop da imagem). A **imagem vertical do cartaz** do Inquérito passa a `position:absolute` para **não forçar a altura** do card. Em mobile os slides Proteus/Inquérito seguem o padrão do Museu (media como fundo/overlay + gradiente; diagrama decorativo do Proteus oculto); tipografia do copo do Inquérito reduzida com `clamp()` (descrição longa) sem truncar; botões empilham. Auto-play preservado. **Auditoria responsiva** (`reports/responsive-audit-08q.json`): 4 áreas (Portal `responsive-fixed`, Museu/Proteus/Área Colaborativa `responsive-passed`), 9 verificações × 8 viewports (320–1440), sem overflow horizontal. Gate de acessibilidade humana mantido `pending-human-review` (do 08P). Contratos em `public/data/`: `home-banner-responsive-model.json`, `responsive-audit-report.json`, `package-08q-readiness.json`. 4 scripts `scripts/08q/`; asserções `banner-*` (caixa igual, conteúdo dentro, sem h-scroll) por viewport no runner Chromium. Invariantes: 0 efeitos públicos, produção bloqueada, MM202617 inelegível, dataset canónico 0.11.3, service_role fora do browser.

---

# Série 09 — Consolidação e evolução do Portal público

A base da Série 09 é o último pacote **mergeado** (08Q, `main` @ `5de5f4a`, v0.28.0). Estado registado em `docs/INTEGRATION_STATE.md`. Roadmap: 09A qualidade → 09B fontes em runtime → 09C media/desempenho → 09D i18n → 09E SEO → 09F logo/Gate B → 09G Proteus/escopo → 09H homologação pública.

## Pacote 09A — Fundação de qualidade do Portal (Playwright + regressão visual) (v0.29.0)

Primeiro pacote da Série 09: instala a **rede de proteção** antes de mexer em fontes/media/i18n/SEO, para não corrigir regressões visuais de forma reativa (como entre 08O e 08Q). **Sem novos módulos/permissões/migrations; sem alterar fontes, i18n, SEO, conteúdo editorial ou dataset.** **Playwright** como harness E2E principal (`playwright.config.mjs` + `playwright.visual.config.mjs`, `webServer` a servir `dist` com teardown garantido, chromium, retries só no CI). **Não** entra no `package-lock.json` — instalado **ad-hoc no CI** (`npm install --no-save @playwright/test@1.49.1 && npx playwright install chromium`) para não partir o `npm ci` dos jobs existentes. **Migração incremental** (`reports/e2e-parity-09a.json`, 12 cenários; **harness legado `run-browser-e2e-08j.mjs` preservado**, remoção bloqueada até paridade). **Asserções geométricas** (numéricas, estáveis entre SO) em `tests/e2e/**`: banner (caixa igual ≤1px + conteúdo dentro + sem h-scroll a 375/768/1280/1440 — apanha a classe 08O→08Q), Museu, imersivo, Proteus, colaborativa (login/pendente/voluntário/master), reduced-motion. **Cenário sem JavaScript** (`javaScriptEnabled:false`): novo **fallback `<noscript>`** no `index.html` com o conteúdo essencial dos 3 destaques (título/subtítulo/ações + link externo real do Inquérito) e **progressive enhancement CSS** (`:not(:has(.home-carousel__slide--active))` mostra o 1.º slide) — descobriu-se que o Portal é 100% client-rendered (sem JS ficava em branco). **Regressão visual** por screenshots (`tests/visual/`, config separada, `reducedMotion` para determinismo): baselines para Portal/Museu/imersivo/Proteus/colaborativa × 4 viewports, **estabelecidos por passo explícito e revisável** (workflow `09a-visual-baseline.yml` `workflow_dispatch` gera no Linux e sobe artefacto para commit humano; **nunca auto-update no CI**). **Flakes** (ENOTEMPTY/portas/perfis/DevTools do harness legado) resolvidos nativamente pelo `webServer` + isolamento do Playwright. CI: `09a-playwright.yml` (job `quality` node + `e2e-playwright` bloqueante com repetição de cenários críticos). `validate:09a` (node) na cadeia `validate`. **Nota de execução:** sem `npm`/`docker`/browser no ambiente local — o lado node (validate + 480 testes + build) foi verificado localmente; o Playwright corre apenas no CI Linux.

## Pacote 09B — Auditoria semântica, linguagem pública e estados dos idiomas (v0.30.0)

Segundo pacote da Série 09 (reordenada: o antigo "09B fontes" passou a 09E). **Auditoria + relatórios + correções seguras + seletor de idiomas.** Sem novos módulos/permissões/migrations; sem tradução completa/SEO/fontes; dataset canónico inalterado. **Descoberta importante:** as strings de UI estão traduzidas nas 4 línguas no `i18n.js`, mas o **conteúdo** (portal-content, memórias, carrossel) só existe revisto em **pt-PT** — EN/ES/FR faziam **fallback silencioso** para pt-PT com o seletor a aparentar funcionar. **Correções Tipo A aplicadas:** (1) **seletor de idiomas** — `languageAvailability` em `i18n.js` (pt-PT published/selecionável; EN/ES/FR `preparation`/não-selecionáveis); `languageSwitcher` mostra EN/ES/FR "em preparação" (desativados, `aria-disabled`, leitor de ecrã ouve "Inglês — em preparação"); `setLanguage` recusa não-selecionáveis; valor inicial do `localStorage` coagido para pt-PT; sem fallback silencioso nem navegação para `null`; (2) **footer** — removido o código de pacote "Versão 08A". **Propostas Tipo C** (NÃO aplicadas, para revisão humana em `reports/editorial-decisions-09b.md`): sequência de conteúdo da home, promessa do Proteus (totens/apps), rótulo "em desenvolvimento", clareza de participação (prepara 09C), enquadramento institucional do /sobre. **5 relatórios** em `reports/` (semantic-audit .json/.md, public-instruction-leaks, editorial-decisions, language-source-inventory). **Doc interno** `docs/research/PARTICIPATION_HYPOTHESES_PERSONAS.md` (hipóteses do doutoramento, âmbito Estoi/Faro; personas Luiz/Maria/Inês/Afonso; **atributos sensíveis excluídos de personalização/elegibilidade**; menores por decidir — 09C). Contratos em `public/data/`: `language-availability-model`, `semantic-audit-model`, `package-09b-readiness`, `research-hypotheses-model`. 3 scripts `scripts/09b/` (validate-language-availability, validate-no-internal-instructions, build-semantic-report) na cadeia `validate`. Proteus mantém-se honesto (empty-state + "conteúdo futuro"); "Pacote 08J" numa vista **interna** de gestão (não público) foi registado mas mantido. Bump 0.29.0→0.30.0.

## Pacote 09C — Oportunidades públicas, candidaturas e participação (v0.31.0)

Primeiro pacote **funcional** da Série 09. Novo domínio de participação prática. **1 módulo novo `opportunities`** (25→26), **3 permissões** `opportunities.view/apply/manage` (149→152, cascata de contagens atualizada em todos os validadores/testes), **2 migrations** (foundation com tabelas+RLS+seed do catálogo; rpc com 7 funções `security definer`). **Jornada:** público lê `/oportunidades` (+ `/oportunidades/:slug`) sem autenticação → "Tenho interesse" → login → perfil mínimo → candidatura → decisão do dono do projeto. **Descoberta pública:** snapshot estático `opportunities-public.json` **vazio e honesto** (sem oportunidades inventadas); vistas `src/views/opportunities-public.js` (lista+detalhe com estado vazio, o quê/quando/onde/prazo/estado, partilha). **RLS:** anon lê apenas `visibility='public' and status='published'`; membros veem members-only publicadas; quem gere vê tudo. **Candidatos SEMPRE privados** (applications sem grant anon; o próprio + `opportunities.manage`). **Candidatura** (`collab_opportunity_apply`): uma por pessoa/oportunidade, notas internas não visíveis ao candidato, sem lista de espera automática. **Master** (via RPCs): criar/publicar (exige campos), decidir aceite/não-selecionado, adicionar/remover participante (remoção exige razão interna), tudo auditado. **Menores BLOQUEADOS** até política (`minors_allowed default false`; apply lança `minors_policy_pending`; readiness `minorParticipation: blocked-until-policy`). **Partilha** client-side (Web Share/copiar/Facebook/X/mailto) — **sem OAuth, sem publicação automática, e-mail só share local**. Área Colaborativa: módulo `opportunities` com estado honesto (opera com dados reais em staging; a demo não cria oportunidades) — padrão do 08L. Contratos em `public/data/`: `opportunity-model`, `opportunity-application-model`, `opportunity-sharing-model`, `package-09c-readiness`. Validador `scripts/09c/validate-09c.mjs` + teste JS + E2E público `tests/e2e/portal/opportunities.spec.mjs` + teste SQL `supabase/collab-tests/009c_opportunities.test.sql`. Invariantes: 0 efeitos públicos, produção bloqueada, dataset canónico 0.11.3, service_role fora do browser, sem e-mail transacional. **Nota:** SQL/RLS e Playwright só verificados no CI (sem npm/docker/browser local).

## Pacote 09D — Fundação multilíngue, tradução assistida e revisão humana (v0.32.0)

Segundo bloco de fundação da Série 09 (empilhado sobre o 09C). Cria a **infraestrutura editorial multilíngue** para EN/ES/FR **sem publicar nenhuma tradução** e sem tradução automática publicada. **Sem novos módulos/permissões/migrations** (26 módulos / 152 permissões inalterados); dataset canónico 0.11.3, MM202617 e produção intocados. **Modelo de conteúdo:** `public/data/locale-content-registry.json` cataloga 15 unidades-fonte pt-PT (domínios portal-nav/cta/home/about, opportunities, museum) com **chave estável + versão-fonte + estado**; cada unidade tem entradas EN/ES/FR todas em **`missing`** (texto `null`, nada inventado — 45 traduções por fazer). **Fluxo editorial:** `missing → draft | machine-draft → in-review → changes-requested | approved → published → archived`; `machine-draft` **nunca** publica; publicação exige revisor **e** aprovador humanos + data. **Deteção de stale:** alterar a `sourceVersion` de uma unidade assinala as traduções vinculadas como potencialmente desatualizadas sem as sobrescrever (`reports/stale-translations-09d.json`). **Disponibilidade por rota** (`public/data/locale-availability.json`, **derivada** do registo por `build-locale-availability.mjs`): um idioma-alvo só fica disponível numa rota quando **todas** as unidades dessa rota estão publicadas+alinhadas → nesta fundação **só pt-PT** em todas as rotas. **Seletor/fallback:** `i18n.js` ganha `localeAvailableForRoute` + strings de indisponibilidade (`localeUnavailableTitle/Text`, `continueInPortuguese`, `languageInPreparationNote`) nas 4 línguas; o `languageSwitcher` mantém EN/ES/FR desativados "em preparação" e passa a ser descrito por uma **nota acessível** (`aria-describedby`) — mensagem visível + continuar em português, **sem troca silenciosa, sem URL traduzida falsa, sem `null`**. **Sem hreflang/SEO** (fica para 09F). **Glossário-semente** (`public/data/translation-glossary.json`, `seed-requires-human-review`): nomes próprios `preserve-name`/`official-form-only` sem tradução; termos traduzíveis com EN/ES/FR `null`. **Museu e oportunidades:** a tradução preserva identificador/fonte/autoria/datação/certeza/intervenção digital/direitos/distinção comunidade-vs-instituição e **não** altera dados operacionais das oportunidades (datas, capacidade, custo, remuneração, estado, links, identificadores). Contratos em `contracts/09d/` (`locale-content-model`, `translation-workflow-model`, `language-route-availability-model`, `package-09d-readiness`). 7 scripts `scripts/09d/` (`validate-source-keys`, `validate-translation-state`, `validate-no-machine-draft-publication`, `detect-stale-translations`, `build-locale-availability`, `build-09d-readiness-report`, `validate-09d`) na cadeia `validate` + `validate:09d`. Testes: `tests/locale-content-09d.test.mjs` (10) + E2E `tests/e2e/portal/language-availability.spec.mjs`. Docs/templates em `docs/i18n/09d/`. CI `09d-ci.yml` (quality + e2e-locale). Bloqueadores humanos: variantes EN/ES/FR, revisores/aprovadores, glossário arqueológico, nomes institucionais, prioridade de páginas. **Nota:** Playwright só corre no CI (sem npm/docker/browser local; lado node — validate + 501 testes + build — verificado localmente + smoke no browser interno). Bump 0.31.0→0.32.0.

## Pacote 09C.1 — Fecho funcional e homologação das oportunidades (v0.33.0)

Corretivo de **fecho funcional** do 09C, compatível com a fundação multilíngue do 09D (empilhado sobre `main` com 09C+09D). Fecha a diferença entre a base técnica do 09C (migrations/RLS/RPCs) e a **jornada utilizável pela interface**, comprovada em **modo de demonstração**, mais prova de backend por SQL/RLS. **Sem novos módulos/permissões/migrations** (26 módulos / 152 permissões); dataset 0.11.3, MM202617 e produção intocados; **nenhuma tradução publicada** (09D preservado). **Correção-chave:** a rota `collab-opportunities` estava definida no router e na vista, mas **ausente do switch principal de render** do `src/main.js` → era uma **rota morta** ("Página não encontrada"); adicionada ao grupo que despacha `renderCollaborativeRoute`. **Lógica pura** em `src/collab/opportunities-demo.js` (transições `submitted→accepted|not-selected|withdrawn`, `accepted→removed`; candidatura única; capacidade honesta; menores `minors_policy_pending`; privacidade entre candidatos; notas internas nunca públicas; duplicar não copia candidaturas; exportação minimizada) — **16 testes unitários**. **Controlador** (`src/collab/controller.js`): store demo isolado (`milreu-opportunities-demo-v1`) + métodos com ramo demo (módulo puro) e ramo real (RPCs 09C `collab_opportunity_*`); `opportunitiesWorkspace` derivado por viewer; `loadRemoteOpportunities` por permissão. **UI** (`opportunities-collab.js`): master cria/edita rascunho, pré-visualiza, publica, encerra, cancela (com justificação interna), decide (aceitar/não selecionar), remove participante (razão obrigatória), capacidade, duplica, exporta lista minimizada; candidato com **perfil mínimo inline** (só campos em falta, consentimento não pré-marcado), candidatar-se, resultado e retirada. **Descoberta pública** (`mergedPublicOpportunities()` no `main.js`): em demo junta as publicadas ao snapshot estático (que permanece vazio e honesto); em staging a fonte é o snapshot aprovado. **Formação**: removido o progresso/nota fictícios do demo (`enrolments` `not-started`/0%, `lessonProgress`/`assessments` vazios); a vista já filtrava para "Fundamentos" (08N). **Jornada verificada no browser interno (demo):** master cria→publica → página pública mostra → voluntário completa perfil mínimo → candidata-se ("Submetida") → master aceita → candidato vê "Aceite"; seletor 09D (EN/ES/FR "em preparação") preservado. **Backend por SQL/RLS** (`supabase/collab-tests/009c1_opportunities_journey.test.sql`, CI): candidaturas sem grant/política anon, menores por omissão bloqueados, unicidade, decisão/remoção/adição sob `opportunities.manage`. Contratos em `contracts/09c1/` (application-transition-model, role-access-expectations, package-09c1-readiness). `scripts/09c1/validate-09c1.mjs` + `validate:09c1` na cadeia `validate`. Testes: `tests/opportunities-demo-09c1.test.mjs` (16) + E2E `tests/e2e/portal/opportunities-journey.spec.mjs`. Docs em `docs/opportunities/09c1/`; matriz de evidências em `reports/opportunities-closure-09c1.md` (rótulos honestos local-demo/unit/backend-sql/e2e-demo/bloqueado-config). CI `09c1-ci.yml` (quality + e2e-opportunities + database). **Limitação honesta:** o E2E UI↔**backend real** depende de staging + Google OAuth (bloqueador humano); não é homologação de produção. **Observação (fora de escopo):** participation/pilot/public-integration/operations-governance também não constam do switch principal de render — registado para pacote futuro. Bump 0.32.0→0.33.0.
