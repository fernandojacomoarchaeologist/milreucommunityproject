---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07B"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação

- Validação: sucesso
- Versão: 0.9.0
- Registos do Museu: 31
- Visíveis: 30
- Bloqueado: MM202617
- Iniciativas: 5
- Rotas institucionais: 7
- Ecrã inteiro: validado por contrato de não regressão
- Testes automatizados: 20
- Supabase remoto: não utilizado
- Build: concluído e removido do ZIP para evitar duplicação

```text
$ npm run validate

> milreu-portal-museum-07b@0.9.0 validate
> node scripts/validate.mjs && node scripts/validate-portal.mjs && node scripts/validate-museum-regression.mjs

Validação base 07B concluída: 31 imagens, 30 visíveis e 1 bloqueada.
Portal 07B validado.
Contrato incremental do Museu validado, incluindo ecrã inteiro.


$ npm test

> milreu-portal-museum-07b@0.9.0 test
> node --test tests/*.test.mjs

TAP version 13
# Subtest: hash routes
ok 1 - hash routes
  ---
  duration_ms: 0.628615
  type: 'test'
  ...
# Subtest: MM202617 não hardcoded como visível
ok 2 - MM202617 não hardcoded como visível
  ---
  duration_ms: 0.116082
  type: 'test'
  ...
# Subtest: noindex
ok 3 - noindex
  ---
  duration_ms: 0.781732
  type: 'test'
  ...
# Subtest: skip link
ok 4 - skip link
  ---
  duration_ms: 0.14806
  type: 'test'
  ...
# Subtest: 31 registos
ok 5 - 31 registos
  ---
  duration_ms: 0.568495
  type: 'test'
  ...
# Subtest: 30 visíveis
ok 6 - 30 visíveis
  ---
  duration_ms: 0.146638
  type: 'test'
  ...
# Subtest: MM202617 bloqueado
ok 7 - MM202617 bloqueado
  ---
  duration_ms: 0.117755
  type: 'test'
  ...
# Subtest: estrutura multicanal
ok 8 - estrutura multicanal
  ---
  duration_ms: 0.181079
  type: 'test'
  ...
# Subtest: direitos registados
ok 9 - direitos registados
  ---
  duration_ms: 0.200588
  type: 'test'
  ...
# Subtest: 31 imagens únicas
ok 10 - 31 imagens únicas
  ---
  duration_ms: 0.581274
  type: 'test'
  ...
# Subtest: quatro variantes
ok 11 - quatro variantes
  ---
  duration_ms: 0.714893
  type: 'test'
  ...
# Subtest: assets existem
ok 12 - assets existem
  ---
  duration_ms: 0.660902
  type: 'test'
  ...
# Subtest: sem GPS EXIF
ok 13 - sem GPS EXIF
  ---
  duration_ms: 0.112778
  type: 'test'
  ...
# Subtest: duplicado resolvido
ok 14 - duplicado resolvido
  ---
  duration_ms: 0.097575
  type: 'test'
  ...
# Subtest: modo de ecrã inteiro permanece
ok 15 - modo de ecrã inteiro permanece
  ---
  duration_ms: 0.659451
  type: 'test'
  ...
# Subtest: Escape regressa ao detalhe
ok 16 - Escape regressa ao detalhe
  ---
  duration_ms: 0.163122
  type: 'test'
  ...
# Subtest: navegação anterior e seguinte permanece
ok 17 - navegação anterior e seguinte permanece
  ---
  duration_ms: 0.757155
  type: 'test'
  ...
# Subtest: Portal tem conteúdo estruturado
ok 18 - Portal tem conteúdo estruturado
  ---
  duration_ms: 0.582917
  type: 'test'
  ...
# Subtest: rotas institucionais
ok 19 - rotas institucionais
  ---
  duration_ms: 1.359131
  type: 'test'
  ...
# Subtest: sem contacto inventado
ok 20 - sem contacto inventado
  ---
  duration_ms: 0.198515
  type: 'test'
  ...
1..20
# tests 20
# suites 0
# pass 20
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 92.25838


$ npm run build

> milreu-portal-museum-07b@0.9.0 build
> node scripts/build.mjs

Build concluído em dist/.
```
