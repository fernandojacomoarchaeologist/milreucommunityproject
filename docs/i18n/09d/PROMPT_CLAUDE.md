---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09D"
---

# Prompt de integração — 09D

Integra o 09D apenas após confirmar o 09C no `main`.

## Preflight

1. branch, commit, versão, PRs e working tree;
2. 09C mergeado;
3. ledger, dependency map, change surface e recovery protocol;
4. inventário de conteúdo, seletor, permissões, revisão e oportunidades;
5. leitura completa do pacote;
6. sem sincronização destrutiva.

## Objetivo

```text
pt-PT
→ draft/machine-draft
→ revisão humana
→ aprovação
→ publicação explícita
```

## Restrições

- machine draft nunca publica;
- sem fallback silencioso;
- sem hreflang;
- sem URL traduzida falsa;
- preservar proveniência, direitos e certeza;
- não alterar dados operacionais das oportunidades;
- MM202617 inalterada;
- sem produção.

## Testes

Unitários, contratos, build, Playwright, RLS/Postgres quando aplicável, visual, selector, locale, estados, stale detection, Museu e oportunidades.

## Relatório

- commit base;
- modelo reutilizado;
- ficheiros;
- estados;
- idiomas;
- permissões/migrations;
- revisão;
- fallback;
- stale detection;
- testes;
- bloqueadores humanos;
- PR sem merge automático.
