# Detetives da Memória — especificação do protótipo (laboratório)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.

**Estado:** `PROTÓTIPO EXPERIMENTAL — SÓ EM TESTE (HML) — POR HOMOLOGAR`. Não está aprovado nem publicado.
**Origem:** brief do responsável «Detetives da Memória — roteiro de jogo e especificação para protótipo funcional», v0.1, 2026-11-03.
**Âmbito (scope-check):** `IN_SCOPE_NEEDS_SPEC`, satisfeito por este documento. Iniciativa principal `INIT-LEARNING` (circuitos e recursos educativos); relacionada `INIT-MUSEUM`.

## 1. O que existe
- **Rotas:** `#/laboratorio/jogos` (lista) e `#/laboratorio/jogos/detetives-da-memoria` (jogo; `?missao=<id>` abre uma missão desbloqueada).
- **Menu suspenso «Jogos»:** à direita do cabeçalho do Portal e do Museu. Só aparece quando o laboratório está activo.
- **Missões** (dados estruturados, mesmo motor para todas): 00 «Aprende a Investigar» (treino guiado com 5 acções), 01 «O Olhar do Investigador», 02 «O Arquivo das Memórias». Cada uma tem 3 pistas.
- **Ilustrações:** três desenhos esquemáticos próprios (SVG), com a faixa «Ilustração demonstrativa — não pertence ao acervo histórico de Milreu.». São gerados por `scripts/lab/build_detetives_assets.py`, que também calcula a geometria das pistas.
- **Mecânicas:**
  - pistas circulares ou poligonais em coordenadas normalizadas à imagem original;
  - folga táctil limitada a 2,5 % da largura;
  - toques fora da imagem são ignorados;
  - zoom por botões, roda e dois dedos, e deslocação;
  - teclado: as setas movem a lupa, Enter investiga, + e − ampliam;
  - «Explorar por descrição», com zonas descritas que incluem distractores;
  - ajuda em 2 níveis: dica textual e depois zona destacada;
  - pontos 100/75/50, sem penalização;
  - sugestão de ajuda a cada 3 toques falhados;
  - níveis: «Aprendiz da Memória», «Explorador» (2 missões); «Investigador» e «Guardião da Memória» ficam para o futuro;
  - selo por missão;
  - Caderno de Campo com opção de apagar o progresso;
  - pausa e retoma;
  - recuperação depois de recarregar a página;
  - repetição de missões;
  - erros tratados: imagem, missão inexistente, dados inválidos.
- **Persistência:** `localStorage` com a chave `milreu-lab-detetives`, versão 1, migração e leitura/escrita protegidas. Guarda só o progresso, sem dados pessoais.

## 2. Isolamento da produção
- O código está em `src/lab/` e só é importado de forma dinâmica.
- Só arranca se `public/config/lab.runtime.json` tiver `enabled: true` **e** o domínio não for `projectomilreu.pt`.
- O `npm run build` (produção) remove `src/lab`, `public/data/lab` e `public/media/lab` do `dist` e grava `enabled: false`.
- O CSS do laboratório (`src/lab/lab.css`) só é carregado pelo próprio laboratório e não entra no orçamento de CSS do site.
- O build de teste é `npm run build:hml`.

## 3. Direitos e conteúdo
- Não há fotografias do acervo no jogo.
- O adaptador editorial (`src/lab/games/detetives/editorial-adapter.js`) só admite uma memória se:
  - estiver visível;
  - for elegível para lançamento;
  - tiver direitos autorizados;
  - não estiver contestada nem retirada;
  - não tiver retoque substantivo por IA (MM202617 fica sempre fora);
  - tiver uma **decisão explícita de uso interactivo** em `public/data/lab/detetives-authorisations.json` (hoje vazio).
- Os textos das descobertas são lições gerais de observação. Não fazem afirmações sobre Milreu. Fonte: «Conteúdo de demonstração — sem valor documental»; grau de certeza: «Não aplicável (demonstração)».
- Não há mascote, personagens históricas, marca nova, IA externa, rede externa nem métricas.

## 4. Decisões humanas pendentes
1. Homologação visual e funcional do protótipo (HML).
2. Escolha da primeira fotografia real e autorização de uso interactivo (por memória).
3. Revisão das pistas e textos para essa fotografia (fonte e grau de certeza).
4. Eventual entrada pública (rota `#/jogos/detetives-da-memoria`, menu do Museu), que é um pacote próprio.
5. Revisão do registo de componentes `DS-L001`–`DS-L004` (estado `proposed`).
