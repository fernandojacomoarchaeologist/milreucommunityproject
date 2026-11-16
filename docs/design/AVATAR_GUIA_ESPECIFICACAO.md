# Guia dos Detetives da Memória — especificação de arte (avatar futuro)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

**Estado:** `proposed` · Pacote C da revisão visual (2026-11-03) · **só especificação**: nenhuma personagem, sprite ou ilustração foi criada. A criação exige decisão do responsável e um ilustrador/a.

## 1. Papel

Companheiro de investigação que comenta sem interromper. Não é mascote de marca, não representa uma pessoa real nem uma figura histórica de Milreu, e não entra no logótipo nem em materiais institucionais.

## 2. Restrições

- 2D plano e mate, linhas controladas, sem gradientes, brilhos, texturas ou aspecto fotorrealista.
- Cores só da paleta de tokens v0.2 (tinta `ink.950`, papel, pátina, ocre); vermelho de assinatura apenas em pormenores (≤ 10 % da figura).
- Não reproduzir personagens, estilos reconhecíveis de jogos/livros existentes nem páginas do livro de Hauschild e Teichner.
- Idade e género não marcados; sem traços que caricaturem grupos ou profissões.
- Legível a 48 px (medalhão actual) e a 160 px (diálogos).

## 3. Model sheet pedido

| Vista/expressão | Quando aparece (`data-mood`) | Notas |
|---|---|---|
| Neutra (frente e ¾) | `neutral` — instruções da lupa | postura calma, lupa na mão |
| Curiosidade | `curious` — início, inactividade, pistas | inclinação leve da cabeça, lupa levantada |
| Descoberta | `discovery` — «Boa descoberta! Queres saber mais?» | olhos abertos, aceno curto |
| Celebração | `celebrate` — conclusão | sorriso, carimbo/caderno na mão; sem saltos exagerados |

Incluir: silhueta a preto, proporções (cabeça : corpo), 3 tamanhos de leitura, versão em medalhão circular, guia de cores com nomes de tokens.

## 4. Animação (quando existir)

Entrada/saída ≤ 320 ms (`duration.standard`/`editorial`, easing `emphasized`); uma única animação por mensagem; desligada no modo calmo e com `prefers-reduced-motion`. A interface já suporta: `guide(mood, texto, acções)` em `src/lab/games/detetives/game.js` e o espaço `.dm-guide__avatar`.

## 5. Entregáveis futuros

SVG por expressão (camadas nomeadas, `currentColor` onde possível), PNG @1x/@2x para pré-visualização, ficha de direitos do autor/a e registo em `COMPONENT_REGISTRY.md` (DS-L008).
