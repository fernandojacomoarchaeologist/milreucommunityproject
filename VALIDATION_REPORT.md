---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07C"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação

- Resultado: sucesso
- Versão: 0.10.0
- Registos: 31
- Visíveis: 30
- Bloqueado: MM202617
- Coleções: 5
- Índice público: 30
- Relações não recíprocas preservadas: 37
- Registos visíveis com intervenção digital: 3
- Modo imersivo: contrato 07C validado
- Supabase remoto: não utilizado
- Build: concluído e removido do ZIP para evitar duplicação

```text
$ npm run museum:index

> milreu-portal-museum-07c@0.10.0 museum:index
> node scripts/museum/build-index.mjs

30 registos indexados.


$ npm run museum:audit

> milreu-portal-museum-07c@0.10.0 museum:audit
> node scripts/museum/audit-content.mjs

Auditoria do Museu atualizada.


$ npm run validate

> milreu-portal-museum-07c@0.10.0 validate
> node scripts/validate.mjs && node scripts/validate-portal.mjs && node scripts/validate-museum-regression.mjs && node scripts/validate-museum-07c.mjs && node scripts/validate-immersive-07c.mjs

Validação base 07B concluída: 31 imagens, 30 visíveis e 1 bloqueada.
Portal 07B validado.
Contrato incremental do Museu validado, incluindo ecrã inteiro.
Museu 07C validado.
Modo imersivo 07C validado.


$ npm test

> milreu-portal-museum-07c@0.10.0 test
> node --test tests/*.test.mjs

TAP version 13
# Subtest: hash routes
ok 1 - hash routes
  ---
  duration_ms: 0.619552
  type: 'test'
  ...
# Subtest: MM202617 não hardcoded como visível
ok 2 - MM202617 não hardcoded como visível
  ---
  duration_ms: 0.132998
  type: 'test'
  ...
# Subtest: noindex
ok 3 - noindex
  ---
  duration_ms: 0.089062
  type: 'test'
  ...
# Subtest: skip link
ok 4 - skip link
  ---
  duration_ms: 0.134179
  type: 'test'
  ...
# Subtest: 31 registos
ok 5 - 31 registos
  ---
  duration_ms: 0.639902
  type: 'test'
  ...
# Subtest: 30 visíveis
ok 6 - 30 visíveis
  ---
  duration_ms: 0.123613
  type: 'test'
  ...
# Subtest: MM202617 bloqueado
ok 7 - MM202617 bloqueado
  ---
  duration_ms: 0.096924
  type: 'test'
  ...
# Subtest: estrutura multicanal
ok 8 - estrutura multicanal
  ---
  duration_ms: 0.182551
  type: 'test'
  ...
# Subtest: direitos registados
ok 9 - direitos registados
  ---
  duration_ms: 0.196712
  type: 'test'
  ...
# Subtest: teclado imersivo completo
ok 10 - teclado imersivo completo
  ---
  duration_ms: 0.698629
  type: 'test'
  ...
# Subtest: informação e filmstrip
ok 11 - informação e filmstrip
  ---
  duration_ms: 0.187198
  type: 'test'
  ...
# Subtest: imagem não é cortada obrigatoriamente
ok 12 - imagem não é cortada obrigatoriamente
  ---
  duration_ms: 0.107019
  type: 'test'
  ...
# Subtest: 31 imagens únicas
ok 13 - 31 imagens únicas
  ---
  duration_ms: 0.748944
  type: 'test'
  ...
# Subtest: quatro variantes
ok 14 - quatro variantes
  ---
  duration_ms: 0.843395
  type: 'test'
  ...
# Subtest: assets existem
ok 15 - assets existem
  ---
  duration_ms: 0.687893
  type: 'test'
  ...
# Subtest: sem GPS EXIF
ok 16 - sem GPS EXIF
  ---
  duration_ms: 0.145887
  type: 'test'
  ...
# Subtest: duplicado resolvido
ok 17 - duplicado resolvido
  ---
  duration_ms: 0.133128
  type: 'test'
  ...
# Subtest: índice cobre os 30 registos públicos
ok 18 - índice cobre os 30 registos públicos
  ---
  duration_ms: 1.117793
  type: 'test'
  ...
# Subtest: MM202617 permanece bloqueado
ok 19 - MM202617 permanece bloqueado
  ---
  duration_ms: 0.191515
  type: 'test'
  ...
# Subtest: coleções são derivadas e transparentes
ok 20 - coleções são derivadas e transparentes
  ---
  duration_ms: 0.153128
  type: 'test'
  ...
# Subtest: auditoria preserva pendências
ok 21 - auditoria preserva pendências
  ---
  duration_ms: 0.142132
  type: 'test'
  ...
# Subtest: modo de ecrã inteiro permanece
ok 22 - modo de ecrã inteiro permanece
  ---
  duration_ms: 0.810395
  type: 'test'
  ...
# Subtest: Escape regressa ao detalhe
ok 23 - Escape regressa ao detalhe
  ---
  duration_ms: 1.739147
  type: 'test'
  ...
# Subtest: navegação anterior e seguinte permanece
ok 24 - navegação anterior e seguinte permanece
  ---
  duration_ms: 0.134871
  type: 'test'
  ...
# Subtest: Portal tem conteúdo estruturado
ok 25 - Portal tem conteúdo estruturado
  ---
  duration_ms: 0.622466
  type: 'test'
  ...
# Subtest: rotas institucionais
ok 26 - rotas institucionais
  ---
  duration_ms: 0.964685
  type: 'test'
  ...
# Subtest: sem contacto inventado
ok 27 - sem contacto inventado
  ---
  duration_ms: 0.121802
  type: 'test'
  ...
# Subtest: sem endereço fictício no Museu
ok 28 - sem endereço fictício no Museu
  ---
  duration_ms: 0.61845
  type: 'test'
  ...
# Subtest: correção conduz à área Participar
ok 29 - correção conduz à área Participar
  ---
  duration_ms: 0.779369
  type: 'test'
  ...
# Subtest: intervenções digitais são exibidas
ok 30 - intervenções digitais são exibidas
  ---
  duration_ms: 0.123965
  type: 'test'
  ...
1..30
# tests 30
# suites 0
# pass 30
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 139.411583


$ npm run build

> milreu-portal-museum-07c@0.10.0 build
> node scripts/build.mjs

Build concluído em dist/.
```
