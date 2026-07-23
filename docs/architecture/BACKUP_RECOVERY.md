---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Backup e recuperação

## Dados

Antes de migrations de risco:

- confirmar backup gerido pelo serviço;
- produzir dump adicional quando aplicável;
- validar plano de rollback;
- registar janela e responsável.

## Fontes privadas

- manter duas cópias independentes;
- verificar hashes periodicamente;
- não depender apenas do disco local;
- não usar Git público como backup.

## Teste

A recuperação deve ser testada em ambiente não produtivo antes de ser considerada confiável.
