---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Política de conflitos

## Bloqueante

A mesma exposição não pode estar em períodos sobrepostos, independentemente do local.

A regra existe:

- na pré-verificação;
- na função de gravação;
- numa constraint `EXCLUDE` no PostgreSQL.

## Aviso

Exposições diferentes podem coincidir no mesmo local. O sistema apresenta aviso para que a coordenação confirme:

- salas distintas;
- capacidade do espaço;
- montagem;
- circulação;
- autorização do responsável.

O aviso não substitui validação humana.
