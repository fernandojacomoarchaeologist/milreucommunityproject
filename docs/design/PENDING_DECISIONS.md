---
title: "Decisões pendentes do sistema de design"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Decisões pendentes

## Não bloqueiam a integração do Pacote 02

| ID | Decisão | Impacto atual | Momento de resolução |
|---|---|---|---|
| DS-PEND-001 | Spectral ou Archivo para corpo digital final | guia permite comparar | antes da migração pública |
| DS-PEND-002 | Logótipo e variantes oficiais | usa assinatura textual | antes do release visual final |
| DS-PEND-003 | Páginas exatas do livro usadas como referência | documentação é conceptual | antes da auditoria visual final |
| DS-PEND-004 | Domínio/rota pública do guia | funciona localmente | antes da publicação |
| DS-PEND-005 | Estratégia de distribuição de Web Fonts | usa fallback e ligação opcional | antes de produção offline |
| DS-PEND-006 | Biblioteca de ícones | utiliza símbolos textuais mínimos | quando surgirem fluxos reais |
| DS-PEND-007 | Tokens Flutter finais | projeção inicial incluída | durante o pacote da app |
| DS-PEND-008 | Templates finais dos painéis | apenas fundações incluídas | no pacote de impressão |

## Bloqueiam tarefas específicas

Claude deve perguntar antes de:

- criar ou redesenhar logótipo;
- afirmar fidelidade visual página a página ao livro;
- publicar o guia numa URL definitiva;
- migrar o `style.css` preliminar;
- gerar painéis finais;
- empacotar fontes para uso offline;
- criar componentes de produção em Flutter.
