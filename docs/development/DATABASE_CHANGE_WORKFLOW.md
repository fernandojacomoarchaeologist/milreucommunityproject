---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Fluxo de alteração de banco

1. descrever o objetivo;
2. classificar risco;
3. criar migration;
4. criar ou atualizar teste;
5. executar `db reset`;
6. executar `test db`;
7. verificar RLS;
8. preparar rollback;
9. atualizar documentação;
10. abrir revisão;
11. aplicar em staging;
12. validar;
13. pedir deployment produtivo.

DDL manual remoto é considerado drift e deve ser capturado por migration antes de continuar.
