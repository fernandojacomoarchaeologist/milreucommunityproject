---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Rollback

## Código

- reverter PR;
- reconstruir;
- validar;
- redeploy do artefacto anterior.

## Banco

- preferir migration corretiva;
- não apagar migrations aplicadas;
- backup antes de mudança de risco;
- testar restauração em staging.

## Auth

- desativar temporariamente o provider;
- preservar utilizadores e memberships;
- validar redirects;
- não apagar o último master.

## Homologação

- marcar execução bloqueada ou cancelada;
- preservar checks e evidências;
- abrir nova execução após correção.
