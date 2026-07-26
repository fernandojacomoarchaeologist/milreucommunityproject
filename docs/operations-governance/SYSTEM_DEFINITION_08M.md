---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08M"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Definição do sistema

## Fluxo

```text
entrada em operação
→ ciclo operacional
→ monitorização
→ suporte/moderação
→ decisão
→ mudança
→ revisão periódica
→ relatório
→ renovação, transição ou encerramento
```

## Subsistemas

1. **Ciclos operacionais:** períodos configuráveis de operação.
2. **Responsabilidades:** domínio, papel, pessoa, substituto, validade e autoridade.
3. **Suporte:** dificuldades de acesso, utilização e operação.
4. **Moderação:** conteúdo, comportamento, direitos, privacidade, segurança e retirada.
5. **Revisão de conteúdo:** páginas, memórias, efeitos, percursos, traduções, links e acessibilidade.
6. **Decisões:** contexto, opções, consulta, autoridade, racional e revisão.
7. **Indicadores:** definição, fonte, metodologia, periodicidade e estado público.
8. **Snapshots:** valores agregados e contexto.
9. **Continuidade:** pessoas, acessos, documentação, backups, fornecedores e handover.

## Estados

- ciclo: `draft`, `preparing`, `ready`, `active`, `paused`, `reviewing`, `completed`, `blocked`, `cancelled`;
- suporte: `new`, `triaged`, `in-progress`, `waiting-user`, `waiting-external`, `resolved`, `closed`, `cancelled`;
- moderação: `reported`, `triaged`, `under-review`, `action-required`, `resolved`, `appealed`, `closed`;
- revisão: `planned`, `in-progress`, `changes-required`, `approved`, `expired`, `cancelled`;
- decisão: `draft`, `consultation`, `ready-for-decision`, `decided`, `deferred`, `rejected`, `superseded`;
- continuidade: `not-started`, `in-review`, `at-risk`, `adequate`, `blocked`, `completed`.
