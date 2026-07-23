---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D.1"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação

- Resultado: sucesso
- Versão: 0.11.1
- Correções A–L: implementadas
- Pilares: Comunicação, Mutualidade, Pertinência Social e Política
- Header do Portal: compacto
- Retorno ao Projeto: botão flutuante
- Blocos técnicos da Home: removidos
- Relação multicanal nas iniciativas: removida
- CTA Museu: presente
- Botão X: handler explícito
- Slide x1: 15 segundos
- Slide x2: 7 segundos
- Slide x3: 4 segundos
- Labels year/range: removidos
- JSON de documentação nas coleções: removido
- Menu: Experiência Proteus
- Páginas estáticas geradas: 30
- JSONs individuais gerados: 30
- Build manifest: sim
- Lançamento público aprovado: não
- Build removido do ZIP para evitar duplicação de imagens

```text
$ npm run channels:export

> milreu-portal-museum-07d1@0.11.1 channels:export
> node scripts/channels/export-channels.mjs

31 perfis multicanal exportados.


$ npm run museum:index

> milreu-portal-museum-07d1@0.11.1 museum:index
> node scripts/museum/build-index.mjs

30 registos indexados.


$ npm run museum:audit

> milreu-portal-museum-07d1@0.11.1 museum:audit
> node scripts/museum/audit-content.mjs

Auditoria do Museu atualizada.


$ npm run validate

> milreu-portal-museum-07d1@0.11.1 validate
> node scripts/validate.mjs && node scripts/validate-portal.mjs && node scripts/validate-museum-regression.mjs && node scripts/validate-museum-07c.mjs && node scripts/validate-immersive-07c.mjs && node scripts/channels/validate-channels.mjs && node scripts/structured/validate-structured-data.mjs && node scripts/quality/validate-performance.mjs && node scripts/quality/validate-accessibility.mjs && node scripts/validate-07d.mjs && node scripts/validate-07d1-fixes.mjs

Validação base 07B concluída: 31 imagens, 30 visíveis e 1 bloqueada.
Portal 07B validado.
Contrato incremental do Museu validado, incluindo ecrã inteiro.
Museu 07C validado.
Modo imersivo 07C validado.
Perfis multicanal validados.
Dados estruturados validados.
Budgets validados — JS 80945, CSS 49970, HTML 1097.
Baseline de acessibilidade validada.
Pacote 07D validado.
Hotfix 07D.1 validado.


$ npm test

> milreu-portal-museum-07d1@0.11.1 test
> node --test tests/*.test.mjs

TAP version 13
# Subtest: hash routes
ok 1 - hash routes
  ---
  duration_ms: 1.390459
  type: 'test'
  ...
# Subtest: MM202617 não hardcoded como visível
ok 2 - MM202617 não hardcoded como visível
  ---
  duration_ms: 0.117535
  type: 'test'
  ...
# Subtest: noindex
ok 3 - noindex
  ---
  duration_ms: 0.085908
  type: 'test'
  ...
# Subtest: skip link
ok 4 - skip link
  ---
  duration_ms: 0.140169
  type: 'test'
  ...
# Subtest: 31 perfis e 30 públicos
ok 5 - 31 perfis e 30 públicos
  ---
  duration_ms: 0.601875
  type: 'test'
  ...
# Subtest: canais físicos inativos
ok 6 - canais físicos inativos
  ---
  duration_ms: 0.191575
  type: 'test'
  ...
# Subtest: domínio e QR pendentes
ok 7 - domínio e QR pendentes
  ---
  duration_ms: 0.106399
  type: 'test'
  ...
# Subtest: MM202617 bloqueado
ok 8 - MM202617 bloqueado
  ---
  duration_ms: 0.10798
  type: 'test'
  ...
# Subtest: 31 registos
ok 9 - 31 registos
  ---
  duration_ms: 0.562166
  type: 'test'
  ...
# Subtest: 30 visíveis
ok 10 - 30 visíveis
  ---
  duration_ms: 0.111015
  type: 'test'
  ...
# Subtest: MM202617 bloqueado
ok 11 - MM202617 bloqueado
  ---
  duration_ms: 0.097635
  type: 'test'
  ...
# Subtest: estrutura multicanal
ok 12 - estrutura multicanal
  ---
  duration_ms: 0.249542
  type: 'test'
  ...
# Subtest: direitos registados
ok 13 - direitos registados
  ---
  duration_ms: 0.247298
  type: 'test'
  ...
# Subtest: pilares do projeto
ok 14 - pilares do projeto
  ---
  duration_ms: 1.209079
  type: 'test'
  ...
# Subtest: home sem explicações internas
ok 15 - home sem explicações internas
  ---
  duration_ms: 0.165746
  type: 'test'
  ...
# Subtest: iniciativas sem relação multicanal e Museu com CTA
ok 16 - iniciativas sem relação multicanal e Museu com CTA
  ---
  duration_ms: 0.14814
  type: 'test'
  ...
# Subtest: header e retorno do Museu
ok 17 - header e retorno do Museu
  ---
  duration_ms: 0.113399
  type: 'test'
  ...
# Subtest: X e slideshow
ok 18 - X e slideshow
  ---
  duration_ms: 0.231564
  type: 'test'
  ...
# Subtest: timeline e coleções limpas
ok 19 - timeline e coleções limpas
  ---
  duration_ms: 0.179868
  type: 'test'
  ...
# Subtest: Experiência Proteus
ok 20 - Experiência Proteus
  ---
  duration_ms: 0.083314
  type: 'test'
  ...
# Subtest: teclado imersivo completo
ok 21 - teclado imersivo completo
  ---
  duration_ms: 0.694042
  type: 'test'
  ...
# Subtest: informação e filmstrip
ok 22 - informação e filmstrip
  ---
  duration_ms: 0.217393
  type: 'test'
  ...
# Subtest: imagem não é cortada obrigatoriamente
ok 23 - imagem não é cortada obrigatoriamente
  ---
  duration_ms: 0.103153
  type: 'test'
  ...
# Subtest: 31 imagens únicas
ok 24 - 31 imagens únicas
  ---
  duration_ms: 0.568065
  type: 'test'
  ...
# Subtest: quatro variantes
ok 25 - quatro variantes
  ---
  duration_ms: 0.734743
  type: 'test'
  ...
# Subtest: assets existem
ok 26 - assets existem
  ---
  duration_ms: 0.569147
  type: 'test'
  ...
# Subtest: sem GPS EXIF
ok 27 - sem GPS EXIF
  ---
  duration_ms: 0.109874
  type: 'test'
  ...
# Subtest: duplicado resolvido
ok 28 - duplicado resolvido
  ---
  duration_ms: 0.142843
  type: 'test'
  ...
# Subtest: índice cobre os 30 registos públicos
ok 29 - índice cobre os 30 registos públicos
  ---
  duration_ms: 1.146916
  type: 'test'
  ...
# Subtest: MM202617 permanece bloqueado
ok 30 - MM202617 permanece bloqueado
  ---
  duration_ms: 0.160939
  type: 'test'
  ...
# Subtest: coleções são derivadas e transparentes
ok 31 - coleções são derivadas e transparentes
  ---
  duration_ms: 0.151125
  type: 'test'
  ...
# Subtest: auditoria preserva pendências
ok 32 - auditoria preserva pendências
  ---
  duration_ms: 0.098286
  type: 'test'
  ...
# Subtest: modo de ecrã inteiro permanece
ok 33 - modo de ecrã inteiro permanece
  ---
  duration_ms: 0.653913
  type: 'test'
  ...
# Subtest: Escape regressa ao detalhe
ok 34 - Escape regressa ao detalhe
  ---
  duration_ms: 0.185005
  type: 'test'
  ...
# Subtest: navegação anterior e seguinte permanece
ok 35 - navegação anterior e seguinte permanece
  ---
  duration_ms: 0.119358
  type: 'test'
  ...
# Subtest: marca de água
ok 36 - marca de água
  ---
  duration_ms: 1.454264
  type: 'test'
  ...
# Subtest: QR pendente explícito
ok 37 - QR pendente explícito
  ---
  duration_ms: 0.167479
  type: 'test'
  ...
# Subtest: rotas físicas
ok 38 - rotas físicas
  ---
  duration_ms: 0.102623
  type: 'test'
  ...
# Subtest: Portal tem conteúdo estruturado
ok 39 - Portal tem conteúdo estruturado
  ---
  duration_ms: 0.63856
  type: 'test'
  ...
# Subtest: rotas institucionais
ok 40 - rotas institucionais
  ---
  duration_ms: 1.04835
  type: 'test'
  ...
# Subtest: sem contacto inventado
ok 41 - sem contacto inventado
  ---
  duration_ms: 0.122633
  type: 'test'
  ...
# Subtest: lançamento bloqueado
ok 42 - lançamento bloqueado
  ---
  duration_ms: 0.575767
  type: 'test'
  ...
# Subtest: workflow manual
ok 43 - workflow manual
  ---
  duration_ms: 0.256021
  type: 'test'
  ...
# Subtest: URL pública obrigatória
ok 44 - URL pública obrigatória
  ---
  duration_ms: 0.108702
  type: 'test'
  ...
# Subtest: sem endereço fictício no Museu
ok 45 - sem endereço fictício no Museu
  ---
  duration_ms: 0.644219
  type: 'test'
  ...
# Subtest: correção conduz à área Participar
ok 46 - correção conduz à área Participar
  ---
  duration_ms: 0.971856
  type: 'test'
  ...
# Subtest: intervenções digitais são exibidas
ok 47 - intervenções digitais são exibidas
  ---
  duration_ms: 0.124375
  type: 'test'
  ...
# Subtest: dataset JSON-LD
ok 48 - dataset JSON-LD
  ---
  duration_ms: 0.64592
  type: 'test'
  ...
# Subtest: sem licença inventada
ok 49 - sem licença inventada
  ---
  duration_ms: 0.219276
  type: 'test'
  ...
1..49
# tests 49
# suites 0
# pass 49
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 209.063969


$ npm run build

> milreu-portal-museum-07d1@0.11.1 build
> node scripts/build.mjs

30 páginas estáticas de registo geradas.
Build concluído em dist/.


$ npm run smoke

> milreu-portal-museum-07d1@0.11.1 smoke
> node scripts/smoke.mjs

Smoke HTTP concluído.
```
