---
title: "Registo de revisões visuais do Design System"
version: "0.4.0"
status: "internal-preview"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---

# Registo de revisões visuais

Cada revisão visual do guia (`apps/design-guide/`) é registada aqui. Os testes automáticos validam estrutura, contraste e integridade, mas **não substituem** a avaliação humana de Fernando Rodrigues de Jácomo sobre:

- fidelidade ao carácter de Milreu;
- presença correta do vermelho (assinatura e abertura);
- uso do preto nos destaques;
- qualidade da leitura;
- equilíbrio entre livro, projeto comunitário e linguagem contemporânea;
- diferenças entre Portal e Museu;
- funcionamento em computador, tablet e telemóvel;
- adequação dos componentes às fotografias reais.

## Como registar

Uma entrada por sessão de revisão. Referenciar capturas em `SCREENSHOT_INDEX.md`, problemas em `OPEN_ISSUES.md` e decisões em `DECISIONS.md`.

| Data | Revisor | Âmbito | Viewport | Screenshots | Resultado |
|---|---|---|---|---|---|
| 2026-07-21 | Claude (assistente) | Abertura inicial do guia 0.4.0 para verificação técnica | desktop 1280 + telemóvel 375 | SS-001..004 | Observações técnicas registadas; **avaliação estética pendente do responsável** |

### Observações técnicas da sessão de 2026-07-21 (assistente, não são aprovações)

- **Vermelho como assinatura:** presente na barra de topo, no eyebrow das páginas, no logótipo (tijolo) e em cartões de abertura — coerente com a decisão do 05B.
- **Preto nos destaques:** o item de navegação ativo usa preenchimento escuro (preto aquecido); a paleta de Cores mostra a amostra de preto aquecido.
- **Superfícies claras:** fundo documental claro em toda a leitura extensa; vermelho não é usado como fundo de leitura.
- **Tipografia:** títulos em Fraunces, corpo em Spectral, utilitários/nav em Archivo — papéis distintos legíveis.
- **Navegação e estrutura:** barra lateral por categorias, breadcrumbs, índice "nesta página", pesquisa com atalho `/`, seletor de idioma pt/en/es/fr.
- **Responsivo:** em telemóvel a navegação colapsa em hambúrguer e os metadados empilham; leitura mantém-se legível. *Verificar interativamente o toggle do drawer e o comportamento em tablet.*
- **Maturidade:** os componentes mostram `VALIDATED` / `IN-REVIEW` / `PROPOSED`; **nenhum** está `approved` (confirmado nos ficheiros). Ponto para decisão do responsável: 44 itens estão `validated` — avaliar se esse estado é adequado antes da revisão pessoal.

Estes pontos são observações factuais de uma sessão automatizada; **não** constituem avaliação estética nem promoção de maturidade.
| _pendente_ | Fernando R. de Jácomo | _por definir_ | desktop/tablet/telemóvel | _pendente_ | _pendente_ |

## Nota de maturidade

Nenhum componente ou padrão passa a `approved` sem revisão explícita do responsável. O estado atual de todo o sistema é `internal-preview`.
