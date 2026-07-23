---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# ADR-DB-001 — Persistência híbrida

## Estado

Aprovada.

## Decisão

Adotar:

- GitHub público para código, migrations, schemas, documentação e snapshots;
- GitHub Pages para conteúdo estático público;
- Supabase para dados operacionais do Milreu Proteus;
- armazenamento privado externo para fontes protegidas;
- exportações públicas versionadas como ponte entre o banco e o site.

## Fontes de verdade

| Tipo | Fonte operacional | Fonte pública |
|---|---|---|
| Rascunhos | Supabase | não aplicável |
| Revisões | Supabase | não aplicável |
| Conteúdo aprovado | Supabase | snapshot Git |
| Página pública | snapshot Git | HTML/JSON/JSON-LD |
| Fonte protegida | armazenamento privado | manifesto sem binário |
| Migration | Git | histórico Supabase |

## Consequência

O site público continua funcional se o Supabase estiver temporariamente indisponível. Funcionalidades de contribuição podem depender do serviço remoto.
