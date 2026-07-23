---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Estratégia de ambientes

## Local

- dados fictícios marcados como demonstração;
- migrations e testes;
- acesso total;
- descartável.

## Staging

- estrutura próxima da produção;
- sem dados pessoais reais, salvo decisão específica;
- testes integrados;
- escrita por workflow ou CLI autorizada.

## Produção

- dados reais;
- RLS obrigatória;
- escrita bloqueada por defeito;
- migrations por workflow manual protegido;
- backups e rollback antes de alterações de risco.

## Variável obrigatória

`MILREU_ENV=local|staging|production`
