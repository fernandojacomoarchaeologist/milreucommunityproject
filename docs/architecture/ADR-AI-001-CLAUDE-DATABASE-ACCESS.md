---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# ADR-AI-001 — Acesso de Claude ao banco

## Estado

Aprovada.

## Princípio

Claude pode manipular o Milreu Proteus, mas a autoridade varia por ambiente.

## Matriz resumida

| Operação | Local | Staging | Produção |
|---|---:|---:|---:|
| Ler | sim | sim | restrito |
| Criar migration | sim | sim | no Git |
| Aplicar migration | sim | workflow | workflow protegido |
| Inserir dados de teste | sim | sim | não |
| Alterar dados reais | não aplicável | somente dados de teste | não diretamente |
| Apagar dados | ambiente descartável | aprovação | proibido por sessão |
| Exportar público | teste | sim | workflow aprovado |
| Ver segredos | não | não | não |

## Produção

Claude não executa comandos produtivos diretamente. Claude prepara:

1. migration;
2. análise de impacto;
3. testes;
4. plano de rollback;
5. ticket;
6. release.

A aplicação ocorre num workflow aprovado pelo utilizador.

## Emergência

Uma emergência não elimina os gates. Deve usar o procedimento documentado de incidente e preservar auditoria.
