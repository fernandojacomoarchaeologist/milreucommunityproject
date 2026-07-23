---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Incidente e rollback

## Em caso de falha

1. parar novos deployments;
2. preservar logs;
3. identificar migration e release;
4. avaliar rollback ou forward fix;
5. não executar comandos improvisados;
6. comunicar impacto;
7. testar a correção fora de produção;
8. documentar a decisão.

## Dados

Rollback estrutural não pode apagar alterações legítimas ocorridas após o deployment. Em casos complexos, preferir forward fix.
