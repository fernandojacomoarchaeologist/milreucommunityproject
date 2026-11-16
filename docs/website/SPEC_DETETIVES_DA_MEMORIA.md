# Detetives da Memória — especificação do protótipo (laboratório)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.

**Estado:** `PROTÓTIPO EXPERIMENTAL v0.2 — FOTOGRAFIAS REAIS — SÓ EM TESTE (HML) — POR HOMOLOGAR`. Não está aprovado nem publicado.
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

## 5. v0.2 — fotografias reais do acervo e experiência acolhedora (2026-11-03)
**Correcção prioritária do responsável:** as ilustrações demonstrativas foram **removidas**. O jogo usa só fotografias reais do Museu de Memórias: **MM202615**, **MM202621** e **MM202614**.
- **Fonte canónica:** imagem, dimensões, título, data, crédito e direitos vêm sempre de `memories.json` e `media-manifest.json`, através de `resolveMissions`. O catálogo do jogo guarda só a jogabilidade, sem arquivo paralelo.
- **Motor:**
  - 2 a 5 descobertas por missão;
  - tipos: encontrar na fotografia (círculo, polígono ou várias zonas) e perguntas (`count`, `compare`, `zoom`, `caption`/testemunho);
  - camadas: Observação e História concluem a missão; Investigação é extra;
  - colecção: selo e página do álbum.
- **Recompensas:**
  - marca imediata no ponto tocado (~15 ms medidos) com brilho discreto e som opcional;
  - pontos e progresso por segmentos animados;
  - cartão de descoberta que **não bloqueia** a acção seguinte;
  - celebração curta com a página do álbum, a ligação a outra memória e a próxima fotografia;
  - dois botões iguais, «Descobrir a próxima memória» e «Voltar ao meu álbum»; a missão seguinte nunca começa sozinha.
- **Álbum vivo:** uma página por fotografia, para folhear, com selo, descobertas, grau de certeza e ligações à ficha do Museu.
- **Conforto:**
  - modo calmo, ou `prefers-reduced-motion`;
  - sons de papel e sinos, desligados por omissão;
  - sem tempo limite, sem penalização, sem mensagens de fracasso;
  - sem sorte, moedas, sequências diárias nem rankings.
- **Medição local:** missões iniciadas e concluídas, descobertas, ajudas, erros de interacção, tempo até à 1.ª descoberta e tempo de resposta. Só no browser, nunca enviada.
- **Planeamento, verificação visual, fontes e bloqueios:** `docs/website/DETETIVES_PLANEAMENTO_MISSOES.md`.
- **MM202618:** bloqueada por intervenção substantiva de IA declarada. **MM202617:** excluída.

## 6. v0.3 — revisão visual e de jogabilidade «mesa de investigação» (2026-11-03)

Pedido do responsável: tornar o protótipo um jogo de procurar objectos com acabamento 2D mate, acolhedor e profissional, sem aspecto de maqueta. **O motor, a ligação ao acervo, a persistência e os testes mantêm-se.**

- **Fotografia protagonista:** derivado de apresentação **sem as margens brancas do scan** (`scripts/lab/build_detetives_derivados.py`; recorte só do branco neutro do suporte; master e variantes intactos; proveniência + SHA-256 em `public/data/lab/detetives-derivados.json`). Pistas convertidas pelo recorte (`toCrop`) e verificadas por teste. Medido a 1280×800: a fotografia ocupa ≈70 % da área da mesa (77 % da largura, 94 % da altura disponível).
- **Pistas invisíveis** durante a exploração; ao descobrir: contorno da forma real desenhado (SVG, traço sem escala), cartão do objecto marcado, pontos, som opcional e guia com «Boa descoberta! Queres saber mais?». Zonas só aparecem através da Pista (nível 2).
- **Lupa real** (DS-L006): segue o ponteiro, amplia ×2,6 dentro da lente (funciona também com zoom), clique investiga; ligar/desligar repõe o cursor normal. No toque: arrastar mostra a lente acima do dedo e levantar investiga; zoom por pinça e deslocação mantêm-se. Medido: 60 movimentos em ≈980 ms (1 actualização por frame, só transforms).
- **Objectivos** (DS-L007): cartões com o recorte do objecto procurado (MM202615: bolsa azul, flores, recipiente branco, latas vermelhas). Em telemóvel: grelha compacta por baixo da fotografia.
- **Guia** (DS-L008): quatro mensagens fixas (início, inactividade 20 s, descoberta, conclusão), nunca rouba o foco nem bloqueia; aceita `mood` (neutral/curious/discovery/celebrate) para o avatar futuro — especificação em `docs/design/AVATAR_GUIA_ESPECIFICACAO.md` (sem personagem nesta fase).
- **Caderno de Campo** (DS-L009): objecto no canto da mesa; abre com animação curta de capa; fecha de imediato (X, Esc).
- **Conclusão** (DS-L010): celebração breve, selo que voa para o Caderno, história ligada (MM202622) e a próxima fotografia **à escolha** («Investigar a próxima», «Abrir o caderno», «Ficar nesta fotografia»). Nunca arranca outra missão sozinha. Sem confettis, moedas, flashes ou sorte.
- **Removido:** painel lateral com texto de abertura, lista de treino riscada, cartões de formulário, marcas vermelhas visíveis, fundo preto, botões de zoom «de administração».
- **Peças SVG próprias** (`src/lab/games/detetives/art.js`): lupa, ícones de ferramentas, Caderno, selo, fita-cola, medalhão do guia — só `currentColor`/tokens, sem hexadecimais nem gradientes.
- **Verificação:** 17 testes do laboratório e 739 no total; e2e em Chrome a 1280×800, 768×1024 e 375×812 — 0 erros, 0 violações CSP, sem scroll horizontal, alinhamento depois de zoom exacto (centro do contorno = centro esperado ±0,0001), persistência após recarregar, teclado e explorar por descrição funcionais. Capturas em `docs/website/capturas/detetives-v0.3/`.
- **Aprovação visual ≠ funcional:** ambos pendentes do responsável. Componentes DS-L005..L011 em `proposed`.

### 6.1 v0.3.1 — correcções após revisão do responsável (2026-11-03)

- Textos de MM202615 sem suposições (saco de mercado; recipiente branco sem material/uso; sem interpretações).
- **Resultado imediato:** ao descobrir, o cartão com o texto, a certeza e a fonte abre logo (sem «Saber mais»); não bloqueia — tocar de novo na fotografia fecha-o. Guia: «Boa descoberta!».
- **Objectivos mais visíveis:** painel maior (miniaturas quadradas com o objecto inteiro, título «Encontra na fotografia», contador grande); pontinhos de progresso retirados.
- «Explorar por descrição» saiu da barra lateral e passou para o menu Pausa (alternativa acessível mantida).
- **Curiosidades com dados da ficha:** perguntas mostram «O que a ficha regista» (MM202615: verso Kodak, extra; MM202621: carimbo Kodak dez. 1984, papel, formato).
- **Mapa de atenção (equipa):** grelha local 24×16 por fotografia com passagens da lupa/rato (peso 1) e toques (peso 3); nunca enviada. Ver em Pausa → «Mostrar o mapa de atenção» e no Caderno → «Medição local». Cor de dados (`info`), não a cor de marca.

