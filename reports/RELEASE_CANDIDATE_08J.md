---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08J"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Release candidate técnica — 08J

- Versão: 0.38.0
- Candidata: RC1
- Estado técnico: **ready**
- Staging: **blocked**
- Produção: **blocked**

## Checks técnicos

- [x] version: 0.38.0
- [x] modules: 26 ativos
- [x] permissions: 152 preservadas
- [x] e2e-browser: 394/394
- [x] accessibility-baseline: 12/12
- [x] production-writes: escritas de produção desativadas
- [x] service-role-browser: service role fora do frontend
- [x] external-gates-honest: bloqueios externos preservados
- [x] human-gates-honest: revisões humanas pendentes

## Gates externos preservados

- [ ] supabase-staging: Projeto, URL e project ref não configurados.
- [ ] supabase-production: Projeto, URL e project ref não configurados.
- [ ] google-oauth: Client ID e secret não configurados em ambiente protegido.
- [ ] master-bootstrap: MILREU_MASTER_EMAIL não definido em variável segura.
- [ ] database-execution: Migrations ainda não executadas em Supabase/PostgreSQL real.
- [ ] edge-functions: Edge Functions ainda não executadas em Deno/Supabase.
- [ ] backup-restore: Fornecedor, backup e teste de restauração sem evidência real.

## Gates humanos preservados

- [ ] visual-review: Revisão visual humana nos três viewports.
- [ ] keyboard-review: Percurso integral por teclado.
- [ ] screen-reader-review: Teste com leitor de ecrã por pessoa competente.
- [ ] editorial-review: 31 memórias revistas campo a campo.
- [ ] rights-credits: Direitos e créditos aprovados.
- [ ] translation-review: Traduções revistas por humanos.
- [ ] public-domain-contact: Domínio e contacto oficial definidos.

## Declaração

Esta evidência aprova, no máximo, uma release candidate técnica local. Não prova migrations em PostgreSQL/Supabase, Google OAuth, RLS remoto, Edge Functions, backup, restauração, revisão editorial, direitos, traduções ou acessibilidade humana.
