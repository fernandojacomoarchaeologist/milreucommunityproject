# Relatório — Item 2 (Website): agenda da exposição e estado da segurança · 2026-10-13

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.

**Origem do pedido:** esta intervenção foi **pedida directamente pelo responsável do projecto, Fernando Rodrigues de Jácomo, ao Claude** (assistente de IA, Claude Code), em sessão de trabalho de 2026-10-13. O trabalho de segurança (Item 2B) foi conduzido na mesma sessão, sob autorizações explícitas do responsável a cada fase.
**Estado:** implementação concluída numa branch de trabalho (`feat/item2-exposicoes-agenda`), testada localmente; **merge e publicação sujeitos a decisão do responsável**.

---

## Parte A — Agenda da exposição (`#/exposicoes`)

### A.1 Pedido e resposta, ponto a ponto
| # | Pedido | O que foi feito |
|---|---|---|
| 1 | «Próximos locais» com acesso a fotografias e documentos | Secção **«Próximos locais e atividades»**; cada cartão mostra miniaturas e o botão «Ver fotografias e documentos (n)», que abre a página do evento. |
| 2 | Ordenar dos mais recentes para os mais antigos | **Eventos realizados** do mais recente para o mais antigo (pela data de fim). Os próximos ficam do mais próximo para o mais distante, para a próxima data aparecer primeiro. |
| 3 | Destacar período, freguesia e município, com ligação ao Google Maps | Período em destaque; campos **Local · Freguesia · Município**; «Ver no Google Maps ↗», que abre o local numa nova janela. |
| 4 | Evento de Abril (canónico) | **11-04-2026** — «Milreu: Memória e Comunidade», Roda de Conversas com a Comunidade, Junta de Freguesia de Estoi, 18h30 (fonte: `sessoes.csv` SESSAO-002 + cartaz). |
| 5 | Fotografias dos eventos, incrementáveis | 14 imagens publicadas (derivados web, EXIF/GPS removidos) e um gerador incremental (`scripts/events/build_event_media.py`) que lê os originais de uma pasta privada. |
| 6 | Apresentação prévia de 10-10 no Museu do Traje (São Brás de Alportel) | Paragem **10-10-2026**, 9h30–17h00, integrada no 2.º Encontro do Grupo de Amigos de Museus do Algarve, com 7 imagens. |
| 7 | Eventos realizados pela hora do servidor, clicáveis | A classificação usa a hora do servidor (cabeçalho HTTP `Date` do GitHub Pages; sem rede, a hora do dispositivo). Os cartões realizados abrem a página do evento (`#/exposicoes/:id`). |
| 8 | Partilha no Facebook e WhatsApp nos eventos a acontecer | Botões «Facebook ↗» e «WhatsApp ↗» **só** em eventos não realizados (lista e página de detalhe). |
| 9 | Paragem de Estoi (30-10), preparada por outra frente | Integrada sem alterar os dados aprovados; cartaz online de Estoi acrescentado como documento. |
| 10 | Retirar o «Exemplo de demonstração» | Já tinha sido retirado do site live pela publicação de 2026-10-13 (outra frente). A protecção continua no código: só reaparece se os dados forem marcados como exemplo. |
| 11 | Destaque na Home, com fotografia de 10-10 | 4.º destaque do carrossel, «A exposição saiu à rua», com fotografia de fundo e ligações para a agenda e para as fotografias. Os três destaques anteriores mantêm-se. |
| + | Evento de 07-02-2026 (pedido em resposta) | «Milreu: Passado, Comunidade e Futuro», Ruínas Romanas de Milreu, 14h00, com cartaz e 2 fotografias do Património Cultural, I.P. (reprodução sob autorização). |

### A.2 Direitos das imagens (decisões do responsável)
Registo completo em `docs/website/decisions/2026-10-13_AGENDA_EVENTOS_E_MEDIA.md` e `public/media/events/PROVENIENCIA.txt`.
- Fotografias de 10-10 e de 11-04: autoria do responsável; para 11-04, o responsável confirma o consentimento dos participantes.
- Cartaz do 2.º Encontro (10-10): incluído com crédito ao organizador; autorização confirmada pelo responsável.
- Fevereiro: cartaz do responsável; fotografias do Património Cultural, I.P., reprodução sob autorização.
- **Não publicada:** fotografia da visita guiada de 07-02 (autoria não indicada).

### A.3 Ficheiros
- **Novos:** `src/lib/agenda.js`, `scripts/events/build_event_media.py`, `public/media/events/**` (28 imagens + `PROVENIENCIA.txt`), `tests/public-agenda-item2.test.mjs`, `docs/website/decisions/2026-10-13_AGENDA_EVENTOS_E_MEDIA.md`, este relatório.
- **Alterados:**
  - código: `src/views/exhibitions-public.js` (lista + detalhe), `src/views/portal.js` (tipo de destaque `event-photo`, marcação partilhada com o destaque do Museu), `src/lib/data.js` (`loadServerClock`), `src/lib/router.js` (`/exposicoes/:id`), `src/main.js`, `src/styles/app.css` (só tokens);
  - dados: `public/data/exhibitions-public.json` (0.15.0 → 0.16.0), `public/data/home-carousel.json` (+1 destaque);
  - governação: `data/architecture/route-manifest.json` + 2 matrizes (rotas `/exposicoes` e `/exposicoes/:id`), `.claude/rules/07d2-home-carousel-and-immersive.md` (registo da decisão), validadores e testes do carrossel (3 → 4 destaques), `scripts/09f/build-seo-inventory.mjs` + `reports/seo-route-inventory-09f.json` (rota nova classificada).

### A.4 Verificação
- Testes: **649/649** (641 + 8 novos). `npm run validate`: todos os passos OK.
- Browser (pré-visualização local, 1280 px e 375 px): secções e ordem correctas; 5 páginas de detalhe; Google Maps em nova janela; partilha só nos futuros; página de detalhe com 7 imagens e créditos; id inexistente → «Evento não encontrado»; destaque novo na Home com fotografia e crédito; sem overflow horizontal; botões de partilha com 44 px de altura.
- Imagens: 0 com EXIF; texto alternativo e crédito obrigatórios (testado).

### A.5 Riscos e pendências
- **Orçamento de JavaScript** quase esgotado (779 995 / 780 000 bytes). Qualquer alteração futura em `src/` vai ultrapassá-lo; rever o orçamento por decisão do responsável.
- Na fotografia `exposicao-03` (10-10) aparece uma pessoa pequena ao fundo. Confirmar se fica publicada.
- Destaque novo da Home só em pt-PT: EN/ES/FR mostram o texto em português até haver tradução revista.
- Partilha no Facebook de um endereço com `#` usa a pré-visualização geral do site (sem imagem específica do evento).
- O site continua `noindex`; a publicação desta alteração exige merge + deploy autorizados.

---

## Parte B — Segurança do site (Item 2B) — estado em 2026-10-13
Versão pública: sem detalhes de achados ainda abertos. O relatório integral está em armazenamento privado do responsável.

| Fase | Estado |
|---|---|
| Auditoria P0 (read-only) | **Concluída**; relatório integral privado; versões públicas expurgadas preparadas |
| L1 — Governança GitHub | **Aplicada e verificada:** protecção de `main` (sem eliminação, sem force-push, PR obrigatório), alertas de dependências, canal privado de reporte de vulnerabilidades, deploy de produção só a partir de `main` com revisor obrigatório |
| L1-07 — Required checks | **Aplicado:** 44 verificações automáticas obrigatórias antes de qualquer merge. Validação comportamental no próximo PR legítimo; **este PR é o primeiro**. |
| L2 — Workflows de CI/CD | **Integrado e validado em produção** (deploy de 2026-10-12): build sem permissões de escrita, publicação isolada, ferramentas com versões fixas, credenciais só nos passos que as usam, ambiente de produção declarado |
| Pendentes | Medidas adicionais de gestão de credenciais (gate próprio); actualização de uma biblioteca da ferramenta local de media (alertas de dependências); higiene de um ficheiro de estado publicado; lotes L3–L7 (endurecimento de superfícies públicas, CSP) — **não iniciados** |
