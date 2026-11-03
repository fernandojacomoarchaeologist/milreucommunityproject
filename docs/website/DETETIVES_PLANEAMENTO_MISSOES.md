# Detetives da Memória — planeamento das missões com fotografias reais

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.

**Estado:** `TESTE (HML) — POR VALIDAR (editorial e direitos)`. Versão 0.2, 2026-11-03.
**Origem:** «Correcção prioritária — Detetives da Memória» e «Adenda — recompensas, envolvimento e experiência acolhedora» (responsável, 2026-11-03).

## Procedimento seguido (por fotografia)
1. Abrir a variante canónica usada no site (`public/media/museum/generated/<ID>/immersive.webp`, resolvida pelo `media-manifest.json`; masters em `originals/` com a extensão real, JPG ou PNG).
2. Inspeccionar a imagem inteira com grelha de coordenadas e recortes ampliados dos pormenores.
3. Ler a ficha (`public/data/memories.json`): descrição, contexto comunitário, data, crédito, direitos e intervenções digitais.
4. Listar só elementos **efectivamente visíveis**. A ficha nunca substitui a inspecção visual.
5. Escolher os elementos, atribuir o grau de certeza (`confirmed`/`probable`/`hypothesis`) e definir as zonas em coordenadas normalizadas.
6. Escrever pistas e descobertas sem identificar pessoas. As identificações hipotéticas da ficha (ex.: Theodor Hauschild em MM202615, Dona Alzira Parente em MM202621) **não entram no jogo**.
7. Verificar créditos e direitos e jogar a missão no browser (desktop, tablet e telemóvel).

Sobreposições para revisão: `docs/website/capturas/detetives-v0.2/<ID>_pistas.jpg` (vermelho = observação, ocre = investigação). Fotografia integral: `<ID>_integral.jpg`. Regenerar com `npm run lab:overlay`.

## 1. A Hora da Pausa — `MM202615`

- **Título documental:** «Os escavadores ao almoço» · **Data:** ca. anos 1970-1980
- **Crédito:** Coleção de Maria de Lurdes Mendes Martins; fotografia providenciada por Celeste Pimenta e Branca Pimenta.
- **Direitos (ficha):** `authorized-for-project-publication`, crédito obrigatório, condições da fonte aplicáveis. **Uso no jogo:** `approved-for-testing`, só HML (`public/data/lab/detetives-authorisations.json`).
- **Intervenções digitais:** nenhuma declarada
- **Recompensa:** Selo do quotidiano · página do álbum «O quotidiano das equipas» · mensagem: «Descobriste que a história de uma escavação também se constrói à volta da mesa.»
- **Ligações:** MM202622

| # | Descoberta | Camada | Tipo | Elemento visível confirmado / pergunta | Zona | Certeza | Fonte da interpretação |
|---|---|---|---|---|---|---|---|
| 1 | A mesa da refeição | Observação | find | Toalha aos quadrados e toalha branca, pratos, copos, garrafas e latas; estrutura de cavaletes visível por baixo. | polígono (0.315,0.385) (0.66,0.37) (0.725,0.43) (0.72,0.5) (0.33,0.47) | Confirmado | Ficha do Museu de Memórias MM202615 (descrição e contexto comunitário) + observação directa da fotografia. |
| 2 | O grupo | Observação | question/count | Quantas pessoas estão nesta fotografia? Conta com calma, também as que estão de pé. → «Cerca de dez» | legenda / testemunho | Confirmado | Ficha do Museu de Memórias MM202615: «A fotografia apresenta dez indivíduos, não identificados com segurança.» |
| 3 | As flores na mesa | Investigação (extra) | find | Flores cor-de-rosa num copo de vidro, ao centro da mesa, entre garrafas. | círculo cx 0.49 · cy 0.342 · r 0.035 | Hipótese | Observação directa da fotografia MM202615. A interpretação do gesto é nossa. |
| 4 | Quem preparava a comida? | História | question/compare | Outra fotografia do mesmo conjunto mostra o que acontecia antes da refeição. O que vês nela? → «Duas trabalhadoras a cozinhar com panelas grandes» | comparação com MM202622 | Provável | Ficha do Museu de Memórias MM202622 («Trabalhadoras das ruínas a cozinhar») e MM202615; mesma proveniência (Celeste Pimenta e Branca Pimenta). |

**Textos das descobertas:**

- *A mesa da refeição:* Uma mesa coberta com toalhas, pratos, copos e garrafas, montada sobre cavaletes de madeira. As campanhas arqueológicas também eram momentos de convívio e partilha entre trabalhadores locais e equipas de investigação.
- *O grupo:* A ficha regista dez pessoas. Não estão identificadas com segurança: os nomes de quem aparece numa fotografia só entram no Museu quando há confirmação.
- *As flores na mesa:* Um copo com flores cor-de-rosa em cima da mesa. Um pequeno gesto de cuidado que mostra que esta pausa era também um momento de estar juntos.
- *Quem preparava a comida?:* A fotografia MM202622 mostra trabalhadoras das ruínas a cozinhar. As duas imagens foram cedidas pelas mesmas pessoas e mostram o trabalho de apoio às campanhas. Não sabemos se foram tiradas no mesmo dia.

## 2. Lavando os Cacos — `MM202621`

- **Título documental:** «Lavando cacos» · **Data:** Revelação em dezembro de 1984; evento possivelmente anterior
- **Crédito:** Coleção de Maria de Lurdes Mendes Martins; referência da página Partilha Alternativa.
- **Direitos (ficha):** `authorized-for-project-publication`, crédito obrigatório, condições da fonte aplicáveis. **Uso no jogo:** `approved-for-testing`, só HML (`public/data/lab/detetives-authorisations.json`).
- **Intervenções digitais:** nenhuma declarada
- **Recompensa:** Selo do cuidado com os materiais · página do álbum «O tratamento dos materiais» · mensagem: «Cada fragmento tem uma história. E cada pessoa que cuidou dele faz parte dessa história.»
- **Ligações:** MM202615, MM202622

| # | Descoberta | Camada | Tipo | Elemento visível confirmado / pergunta | Zona | Certeza | Fonte da interpretação |
|---|---|---|---|---|---|---|---|
| 1 | Mãos ao trabalho | Observação | find | Duas pessoas inclinadas, de mãos estendidas para o monte de fragmentos; uma de camisola cor-de-rosa e óculos. | polígono (0.13,0.15) (0.3,0.15) (0.31,0.33) (0.21,0.37) (0.13,0.38) + polígono (0.36,0.15) (0.61,0.15) (0.6,0.33) (0.43,0.35) (0.37,0.3) | Confirmado | Ficha do Museu de Memórias MM202621 + observação directa. As pessoas não estão identificadas com segurança. |
| 2 | Os fragmentos | Observação | find | Monte de peças claras, achatadas e irregulares, no chão; outras dentro do carrinho de mão. | polígono (0.18,0.37) (0.47,0.36) (0.48,0.47) (0.39,0.45) (0.27,0.45) (0.2,0.5) | Provável | Ficha do Museu de Memórias MM202621 (título «Lavando cacos», recolhido da página Partilha Alternativa) + observação directa. |
| 3 | O carrinho de mão | Investigação (extra) | find | Carrinho de mão com roda vermelha e caixa metálica carregada de fragmentos. | polígono (0.4,0.4) (0.83,0.42) (0.83,0.57) (0.53,0.65) (0.4,0.58) | Confirmado | Ficha do Museu de Memórias MM202621 («junto a uma carriola e um balde») + observação directa. |
| 4 | O balde | Investigação (extra) | find | Balde escuro com aro claro, pousado entre fragmentos; conteúdo não visível. | polígono (0.27,0.45) (0.36,0.45) (0.36,0.63) (0.27,0.63) | Hipótese | Ficha do Museu de Memórias MM202621 (menciona o balde) + observação directa. O uso é uma hipótese. |
| 5 | O verso da fotografia | História | question/caption | O verso desta fotografia guarda uma pista sobre quando foi revelada. Qual é? → «Um carimbo da Kodak de dezembro de 1984» | legenda / testemunho | Provável | Ficha do Museu de Memórias MM202621: «revelada pela Kodak em dezembro de 1984, segundo carimbo apagado no verso». |

**Textos das descobertas:**

- *Mãos ao trabalho:* Duas pessoas debruçadas sobre os fragmentos, a separá-los com as mãos. A investigação arqueológica envolve muitas tarefas além de escavar.
- *Os fragmentos:* Um monte de fragmentos claros e achatados. A legenda chama-lhes «cacos»: pedaços partidos que, depois de limpos, podem ser estudados um a um.
- *O carrinho de mão:* Um carrinho de mão cheio de fragmentos. A ficha descreve-o como uma «carriola». Transportar e organizar materiais também fazia parte do trabalho diário.
- *O balde:* Um balde escuro entre os fragmentos. Pela legenda «Lavando cacos», pode ter servido para a água da lavagem, mas a fotografia não mostra o seu conteúdo.
- *O verso da fotografia:* Segundo um carimbo apagado no verso, a fotografia foi revelada pela Kodak em dezembro de 1984. O momento fotografado pode ser anterior: revelação e fotografia nem sempre acontecem no mesmo mês.

## 3. A Equipa de Milreu — `MM202614`

- **Título documental:** «Equipa de escavadores em Milreu sobre os mosaicos» · **Data:** Provavelmente 1981, segundo testemunho de Cristina Farias
- **Crédito:** Fotografia providenciada por Celeste Pimenta e Branca Pimenta; associada à coleção de Maria de Lurdes Mendes Martins.
- **Direitos (ficha):** `authorized-for-project-publication`, crédito obrigatório, condições da fonte aplicáveis. **Uso no jogo:** `approved-for-testing`, só HML (`public/data/lab/detetives-authorisations.json`).
- **Intervenções digitais:** nenhuma declarada
- **Recompensa:** Selo da equipa · página do álbum «As pessoas da investigação» · mensagem: «Uma descoberta importante: a história de Milreu também pertence às pessoas que trabalharam aqui.»
- **Ligações:** MM202613

| # | Descoberta | Camada | Tipo | Elemento visível confirmado / pergunta | Zona | Certeza | Fonte da interpretação |
|---|---|---|---|---|---|---|---|
| 1 | O chão de mosaico | Observação | find | Pavimento de tesselas claras e escuras com padrão geométrico, visível entre os pés e à frente do grupo. | polígono (0.46,0.8) (0.62,0.8) (0.66,0.76) (0.92,0.73) (0.92,0.89) (0.46,0.89) | Provável | Ficha do Museu de Memórias MM202614 («aparenta ser a zona dos mosaicos») + observação directa. |
| 2 | A porta ao fundo | Observação | find | Vão de porta rectangular com moldura clara, ao centro e em cima; duas pessoas de pé no interior escuro. | polígono (0.405,0.135) (0.482,0.135) (0.482,0.262) (0.405,0.262) | Confirmado | Observação directa da fotografia MM202614. A ficha associa o local ao lado oeste da Casa Rural. |
| 3 | Quantas pessoas? | Observação | question/count | Quantas pessoas aparecem nesta fotografia? → «Cerca de trinta» | legenda / testemunho | Confirmado | Ficha do Museu de Memórias MM202614: «A imagem mostra 31 indivíduos». |
| 4 | Um pormenor nas mãos | Investigação (extra) | question/zoom | Repara na pessoa agachada ao centro, em baixo. O que tem nas mãos? → «Luvas brancas» | ampliação {'cx': 0.55, 'cy': 0.81, 'scale': 6} | Confirmado | Observação directa da fotografia MM202614 (pormenor ampliado). O motivo não está documentado. |
| 5 | Quem estava nesta equipa? | História | question/caption | Cristina Farias, que aparece nesta fotografia, contou ao projecto quem fazia parte destas equipas. O que indicou? → «Desenhadores do Instituto Arqueológico Alemão, um arquitecto e trabalhadores contratados» | legenda / testemunho | Provável | Ficha do Museu de Memórias MM202614 (testemunho de Cristina Farias; data «provavelmente 1981»). |

**Textos das descobertas:**

- *O chão de mosaico:* Um chão de mosaico com desenhos geométricos, feito de pequenas pedras. A ficha situa a fotografia na zona dos mosaicos, perto do ponto central, do lado oeste da Casa Rural.
- *A porta ao fundo:* Uma porta aberta na parede antiga, com duas pessoas à entrada. As paredes descascadas mostram as várias camadas de um edifício que foi mudando ao longo do tempo.
- *Quantas pessoas?:* A ficha regista 31 pessoas: equipas técnicas e trabalhadores locais. Uma escavação dependia de muitas mãos e muitos saberes.
- *Um pormenor nas mãos:* Luvas brancas, pousadas sobre o mosaico. A ficha não explica porquê. Se souber o motivo, este é o tipo de memória que pode partilhar com o projecto.
- *Quem estava nesta equipa?:* Segundo o testemunho de Cristina Farias, estavam presentes desenhadores do Instituto Arqueológico Alemão, o arquitecto Pedro Fialho de Sousa e trabalhadores contratados. A ficha indica 1981 como data provável.

## Fotografias não usadas e porquê

- **MM202618 — «Trabalhando nas ruínas»: BLOQUEADA.** A ficha declara uma «correcção de imagem assistida por inteligência artificial» com `substantiveChange: true` e revisão humana `not-reviewed`. O original (PNG) pode ser a cópia corrigida. Pelas regras de intervenções digitais, não pode ser apresentada como documento original. O adaptador do jogo exclui-a automaticamente. Para a usar: confirmar qual é o ficheiro sem intervenção e rever a declaração. **Alternativas reais elegíveis e cedidas pela comunidade:** MM202622 («Trabalhadoras das ruínas a cozinhar», já usada como comparação) ou MM202613 (equipa junto à Casa Rural), depois de validação.
- **MM202617 — reconstrução cromática por IA:** excluída por decisão do responsável e pelo adaptador.

## Discrepâncias encontradas entre a ficha e a imagem (não corrigidas; para revisão)

- **MM202613:** a ficha (e o brief) indicam «19 indivíduos». A imagem mostra **muitas mais pessoas (cerca de 45)**. O jogo **não usa** este número.
- **MM202621:** a ficha diz «dois indivíduos no quadrante superior direito». Na variante publicada, as duas pessoas estão **em cima, à esquerda e ao centro**. A pista usa a posição observada.

## Pendente para validação humana
1. Textos e pistas de cada descoberta (editorial).
2. Uso interactivo destas fotografias fora do ambiente de teste (direitos por fonte: coleção de Maria de Lurdes Mendes Martins, Celeste Pimenta e Branca Pimenta).
3. Relações MM202615↔MM202622 e MM202614↔MM202613 como «ligações» de jogo (proveniência e tema comuns; data comum não comprovada).
4. A pergunta das luvas (MM202614) convida a partilhar a memória do motivo, que não está documentado.
