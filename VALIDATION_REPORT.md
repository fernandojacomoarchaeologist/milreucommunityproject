---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação

- Resultado: sucesso
- Versão: 0.11.0
- Perfis multicanal: 31
- Registos públicos: 30
- Totens ativados: 0
- Painéis ativados: 0
- Destinos QR pendentes: 30
- Páginas estáticas geradas: 30
- JSONs individuais gerados: 30
- Build manifest: sim
- Lançamento público aprovado: não
- Supabase remoto: não utilizado
- Build removido do ZIP para evitar duplicação de imagens

```text
$ npm run channels:export

> milreu-portal-museum-07d@0.11.0 channels:export
> node scripts/channels/export-channels.mjs

31 perfis multicanal exportados.


$ npm run museum:index

> milreu-portal-museum-07d@0.11.0 museum:index
> node scripts/museum/build-index.mjs

30 registos indexados.


$ npm run museum:audit

> milreu-portal-museum-07d@0.11.0 museum:audit
> node scripts/museum/audit-content.mjs

Auditoria do Museu atualizada.


$ npm run validate

> milreu-portal-museum-07d@0.11.0 validate
> node scripts/validate.mjs && node scripts/validate-portal.mjs && node scripts/validate-museum-regression.mjs && node scripts/validate-museum-07c.mjs && node scripts/validate-immersive-07c.mjs && node scripts/channels/validate-channels.mjs && node scripts/structured/validate-structured-data.mjs && node scripts/quality/validate-performance.mjs && node scripts/quality/validate-accessibility.mjs && node scripts/validate-07d.mjs

Validação base 07B concluída: 31 imagens, 30 visíveis e 1 bloqueada.
Portal 07B validado.
Contrato incremental do Museu validado, incluindo ecrã inteiro.
Museu 07C validado.
Modo imersivo 07C validado.
Perfis multicanal validados.
Dados estruturados validados.
Budgets validados — JS 79292, CSS 46083, HTML 1097.
Baseline de acessibilidade validada.
Pacote 07D validado.


$ npm test

> milreu-portal-museum-07d@0.11.0 test
> node --test tests/*.test.mjs

TAP version 13
# Subtest: hash routes
ok 1 - hash routes
  ---
  duration_ms: 0.608425
  type: 'test'
  ...
# Subtest: MM202617 não hardcoded como visível
ok 2 - MM202617 não hardcoded como visível
  ---
  duration_ms: 0.123083
  type: 'test'
  ...
# Subtest: noindex
ok 3 - noindex
  ---
  duration_ms: 0.102993
  type: 'test'
  ...
# Subtest: skip link
ok 4 - skip link
  ---
  duration_ms: 0.137925
  type: 'test'
  ...
# Subtest: 31 perfis e 30 públicos
ok 5 - 31 perfis e 30 públicos
  ---
  duration_ms: 0.610919
  type: 'test'
  ...
# Subtest: canais físicos inativos
ok 6 - canais físicos inativos
  ---
  duration_ms: 0.166478
  type: 'test'
  ...
# Subtest: domínio e QR pendentes
ok 7 - domínio e QR pendentes
  ---
  duration_ms: 0.10123
  type: 'test'
  ...
# Subtest: MM202617 bloqueado
ok 8 - MM202617 bloqueado
  ---
  duration_ms: 0.106779
  type: 'test'
  ...
# Subtest: 31 registos
ok 9 - 31 registos
  ---
  duration_ms: 0.646171
  type: 'test'
  ...
# Subtest: 30 visíveis
ok 10 - 30 visíveis
  ---
  duration_ms: 0.122282
  type: 'test'
  ...
# Subtest: MM202617 bloqueado
ok 11 - MM202617 bloqueado
  ---
  duration_ms: 0.107991
  type: 'test'
  ...
# Subtest: estrutura multicanal
ok 12 - estrutura multicanal
  ---
  duration_ms: 0.184534
  type: 'test'
  ...
# Subtest: direitos registados
ok 13 - direitos registados
  ---
  duration_ms: 0.234509
  type: 'test'
  ...
# Subtest: teclado imersivo completo
ok 14 - teclado imersivo completo
  ---
  duration_ms: 0.72628
  type: 'test'
  ...
# Subtest: informação e filmstrip
ok 15 - informação e filmstrip
  ---
  duration_ms: 0.187519
  type: 'test'
  ...
# Subtest: imagem não é cortada obrigatoriamente
ok 16 - imagem não é cortada obrigatoriamente
  ---
  duration_ms: 0.097004
  type: 'test'
  ...
# Subtest: 31 imagens únicas
ok 17 - 31 imagens únicas
  ---
  duration_ms: 0.650818
  type: 'test'
  ...
# Subtest: quatro variantes
ok 18 - quatro variantes
  ---
  duration_ms: 0.686551
  type: 'test'
  ...
# Subtest: assets existem
ok 19 - assets existem
  ---
  duration_ms: 1.12281
  type: 'test'
  ...
# Subtest: sem GPS EXIF
ok 20 - sem GPS EXIF
  ---
  duration_ms: 0.123914
  type: 'test'
  ...
# Subtest: duplicado resolvido
ok 21 - duplicado resolvido
  ---
  duration_ms: 0.118796
  type: 'test'
  ...
# Subtest: índice cobre os 30 registos públicos
ok 22 - índice cobre os 30 registos públicos
  ---
  duration_ms: 1.191482
  type: 'test'
  ...
# Subtest: MM202617 permanece bloqueado
ok 23 - MM202617 permanece bloqueado
  ---
  duration_ms: 0.16817
  type: 'test'
  ...
# Subtest: coleções são derivadas e transparentes
ok 24 - coleções são derivadas e transparentes
  ---
  duration_ms: 0.152627
  type: 'test'
  ...
# Subtest: auditoria preserva pendências
ok 25 - auditoria preserva pendências
  ---
  duration_ms: 0.095722
  type: 'test'
  ...
# Subtest: modo de ecrã inteiro permanece
ok 26 - modo de ecrã inteiro permanece
  ---
  duration_ms: 0.682285
  type: 'test'
  ...
# Subtest: Escape regressa ao detalhe
ok 27 - Escape regressa ao detalhe
  ---
  duration_ms: 0.995671
  type: 'test'
  ...
# Subtest: navegação anterior e seguinte permanece
ok 28 - navegação anterior e seguinte permanece
  ---
  duration_ms: 0.123153
  type: 'test'
  ...
# Subtest: marca de água
ok 29 - marca de água
  ---
  duration_ms: 1.543426
  type: 'test'
  ...
# Subtest: QR pendente explícito
ok 30 - QR pendente explícito
  ---
  duration_ms: 0.176933
  type: 'test'
  ...
# Subtest: rotas físicas
ok 31 - rotas físicas
  ---
  duration_ms: 0.103684
  type: 'test'
  ...
# Subtest: Portal tem conteúdo estruturado
ok 32 - Portal tem conteúdo estruturado
  ---
  duration_ms: 0.701684
  type: 'test'
  ...
# Subtest: rotas institucionais
ok 33 - rotas institucionais
  ---
  duration_ms: 0.939658
  type: 'test'
  ...
# Subtest: sem contacto inventado
ok 34 - sem contacto inventado
  ---
  duration_ms: 0.121381
  type: 'test'
  ...
# Subtest: lançamento bloqueado
ok 35 - lançamento bloqueado
  ---
  duration_ms: 0.657578
  type: 'test'
  ...
# Subtest: workflow manual
ok 36 - workflow manual
  ---
  duration_ms: 0.218625
  type: 'test'
  ...
# Subtest: URL pública obrigatória
ok 37 - URL pública obrigatória
  ---
  duration_ms: 0.102202
  type: 'test'
  ...
# Subtest: sem endereço fictício no Museu
ok 38 - sem endereço fictício no Museu
  ---
  duration_ms: 0.70569
  type: 'test'
  ...
# Subtest: correção conduz à área Participar
ok 39 - correção conduz à área Participar
  ---
  duration_ms: 0.998486
  type: 'test'
  ...
# Subtest: intervenções digitais são exibidas
ok 40 - intervenções digitais são exibidas
  ---
  duration_ms: 0.122983
  type: 'test'
  ...
# Subtest: dataset JSON-LD
ok 41 - dataset JSON-LD
  ---
  duration_ms: 0.585271
  type: 'test'
  ...
# Subtest: sem licença inventada
ok 42 - sem licença inventada
  ---
  duration_ms: 0.234829
  type: 'test'
  ...
1..42
# tests 42
# suites 0
# pass 42
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 175.749149


$ npm run build

> milreu-portal-museum-07d@0.11.0 build
> node scripts/build.mjs

30 páginas estáticas de registo geradas.
Build concluído em dist/.
```
