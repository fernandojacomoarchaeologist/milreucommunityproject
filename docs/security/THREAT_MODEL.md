---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Modelo inicial de ameaças

## Riscos

- secret no Git;
- service role no frontend;
- RLS ausente;
- migration destrutiva;
- conteúdo preliminar publicado;
- source privada exposta;
- upload malicioso;
- abuso do formulário;
- enumeração de registos privados;
- export com dados internos;
- prompt que tenta contornar gates.

## Controlo

- secrets por environment;
- CI;
- guards;
- RLS;
- schemas;
- revisão humana;
- logs;
- versionamento;
- backups;
- princípio de menor privilégio.
