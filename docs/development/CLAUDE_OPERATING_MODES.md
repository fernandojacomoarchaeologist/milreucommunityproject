---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Modos operacionais de Claude

## Inspect

Pode ler estrutura, documentação, logs não sensíveis e metadados.

## Local Build

Pode instalar dependências, alterar código, criar migrations, executar banco local e testes.

## Staging

Pode aplicar migrations quando autorizado e sem dados reais não aprovados.

## Production Read

Pode executar apenas consultas aprovadas, preferencialmente por views, sem exibir dados sensíveis.

## Production Change Plan

Pode preparar migration, impacto, rollback e workflow. Não aplica.

## Production Deployment

Só através do workflow manual protegido e após pedido explícito.

## Incident

Pode investigar sem alterar; qualquer correção segue migration e aprovação.
