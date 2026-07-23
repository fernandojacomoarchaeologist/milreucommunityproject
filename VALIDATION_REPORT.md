---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D.3"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação

- Resultado: sucesso
- Versão: 0.11.3
- Registos no projeto: 31
- Visíveis no ambiente de revisão: 31
- Registos no índice de revisão: 31
- Elegíveis para lançamento público: 30
- Registos no dataset JSON-LD: 30
- Páginas estáticas de lançamento: 30
- JSONs individuais de lançamento: 30
- Destinos QR: 30
- MM202617 siteStatus: review-visible
- MM202617 editorialStatus: in-review
- MM202617 publicReleaseEligible: false
- MM202617 totem: review-only
- MM202617 painel: review-only
- MM202617 no índice de revisão: sim
- MM202617 no dataset de lançamento: não
- Aviso de IA no card, detalhe e imersivo: validado
- Decisão editorial estruturada: presente
- Build manifest: sim
- Lançamento público aprovado: não
- Supabase remoto: não utilizado
- Build removido do ZIP para evitar duplicação de imagens

```text
$ npm run channels:export

> milreu-portal-museum-07d3@0.11.3 channels:export
> node scripts/channels/export-channels.mjs

31 perfis multicanal exportados.


$ npm run museum:index

> milreu-portal-museum-07d3@0.11.3 museum:index
> node scripts/museum/build-index.mjs

31 registos indexados.


$ npm run museum:audit

> milreu-portal-museum-07d3@0.11.3 museum:audit
> node scripts/museum/audit-content.mjs

Auditoria do Museu atualizada.


$ npm run validate

> milreu-portal-museum-07d3@0.11.3 validate
> node scripts/validate.mjs && node scripts/validate-portal.mjs && node scripts/validate-museum-regression.mjs && node scripts/validate-museum-07c.mjs && node scripts/validate-immersive-07c.mjs && node scripts/channels/validate-channels.mjs && node scripts/structured/validate-structured-data.mjs && node scripts/quality/validate-performance.mjs && node scripts/quality/validate-accessibility.mjs && node scripts/validate-07d.mjs && node scripts/validate-07d1-fixes.mjs && node scripts/validate-07d2-fixes.mjs && node scripts/validate-07d3-mm202617.mjs

Validação base concluída: 31 imagens visíveis; MM202617 em revisão e inelegível para lançamento público.
Portal 07B validado.
Contrato incremental do Museu validado, incluindo ecrã inteiro.
Museu 07C validado.
Modo imersivo 07C validado.
Perfis multicanal validados.
Dados estruturados validados.
Budgets validados — JS 90737, CSS 59707, HTML 1097.
Baseline de acessibilidade validada.
Pacote 07D validado.
Hotfix 07D.1 validado.
Hotfix 07D.2 validado.
Hotfix 07D.3 validado: MM202617 visível para revisão, com divulgação de IA e bloqueios de lançamento preservados.


$ npm test

> milreu-portal-museum-07d3@0.11.3 test
> node --test tests/*.test.mjs

TAP version 13
# Subtest: hash routes
ok 1 - hash routes
  ---
  duration_ms: 1.267515
  type: 'test'
  ...
# Subtest: MM202617 não hardcoded como visível
ok 2 - MM202617 não hardcoded como visível
  ---
  duration_ms: 0.123584
  type: 'test'
  ...
# Subtest: noindex
ok 3 - noindex
  ---
  duration_ms: 0.132167
  type: 'test'
  ...
# Subtest: skip link
ok 4 - skip link
  ---
  duration_ms: 0.145216
  type: 'test'
  ...
# Subtest: 31 perfis visíveis e 30 elegíveis para lançamento
ok 5 - 31 perfis visíveis e 30 elegíveis para lançamento
  ---
  duration_ms: 0.899208
  type: 'test'
  ...
# Subtest: canais físicos inativos
ok 6 - canais físicos inativos
  ---
  duration_ms: 0.213157
  type: 'test'
  ...
# Subtest: domínio e 30 QR permanecem pendentes
ok 7 - domínio e 30 QR permanecem pendentes
  ---
  duration_ms: 0.18789
  type: 'test'
  ...
# Subtest: MM202617 é review-only nos canais físicos
ok 8 - MM202617 é review-only nos canais físicos
  ---
  duration_ms: 0.178285
  type: 'test'
  ...
# Subtest: 31 registos visíveis em revisão
ok 9 - 31 registos visíveis em revisão
  ---
  duration_ms: 0.970674
  type: 'test'
  ...
# Subtest: MM202617 visível apenas para revisão
ok 10 - MM202617 visível apenas para revisão
  ---
  duration_ms: 0.19495
  type: 'test'
  ...
# Subtest: MM202617 declara retoque substantivo por IA
ok 11 - MM202617 declara retoque substantivo por IA
  ---
  duration_ms: 0.382699
  type: 'test'
  ...
# Subtest: estrutura multicanal
ok 12 - estrutura multicanal
  ---
  duration_ms: 0.267589
  type: 'test'
  ...
# Subtest: direitos registados
ok 13 - direitos registados
  ---
  duration_ms: 0.274118
  type: 'test'
  ...
# Subtest: pilares do projeto
ok 14 - pilares do projeto
  ---
  duration_ms: 0.999928
  type: 'test'
  ...
# Subtest: home sem explicações internas
ok 15 - home sem explicações internas
  ---
  duration_ms: 0.169983
  type: 'test'
  ...
# Subtest: iniciativas sem relação multicanal e Museu com CTA
ok 16 - iniciativas sem relação multicanal e Museu com CTA
  ---
  duration_ms: 0.114981
  type: 'test'
  ...
# Subtest: header e retorno do Museu
ok 17 - header e retorno do Museu
  ---
  duration_ms: 0.100529
  type: 'test'
  ...
# Subtest: X e slideshow
ok 18 - X e slideshow
  ---
  duration_ms: 0.177223
  type: 'test'
  ...
# Subtest: timeline e coleções limpas
ok 19 - timeline e coleções limpas
  ---
  duration_ms: 0.175351
  type: 'test'
  ...
# Subtest: Experiência Proteus
ok 20 - Experiência Proteus
  ---
  duration_ms: 0.082783
  type: 'test'
  ...
# Subtest: Home tem Museu, Proteus e Inquérito
ok 21 - Home tem Museu, Proteus e Inquérito
  ---
  duration_ms: 1.16299
  type: 'test'
  ...
# Subtest: carrossel automático e controlável
ok 22 - carrossel automático e controlável
  ---
  duration_ms: 0.184044
  type: 'test'
  ...
# Subtest: Iniciativas usa título e descrição em linhas distintas
ok 23 - Iniciativas usa título e descrição em linhas distintas
  ---
  duration_ms: 0.106268
  type: 'test'
  ...
# Subtest: Museu abre sem sumário estatístico
ok 24 - Museu abre sem sumário estatístico
  ---
  duration_ms: 0.113228
  type: 'test'
  ...
# Subtest: modo imersivo tem retorno persistente
ok 25 - modo imersivo tem retorno persistente
  ---
  duration_ms: 0.156703
  type: 'test'
  ...
# Subtest: imagem imersiva encaixa no viewport
ok 26 - imagem imersiva encaixa no viewport
  ---
  duration_ms: 0.190063
  type: 'test'
  ...
# Subtest: teclado imersivo completo
ok 27 - teclado imersivo completo
  ---
  duration_ms: 0.883474
  type: 'test'
  ...
# Subtest: informação e filmstrip
ok 28 - informação e filmstrip
  ---
  duration_ms: 0.188911
  type: 'test'
  ...
# Subtest: imagem não é cortada obrigatoriamente
ok 29 - imagem não é cortada obrigatoriamente
  ---
  duration_ms: 0.097195
  type: 'test'
  ...
# Subtest: 31 imagens únicas
ok 30 - 31 imagens únicas
  ---
  duration_ms: 0.633433
  type: 'test'
  ...
# Subtest: quatro variantes
ok 31 - quatro variantes
  ---
  duration_ms: 0.70558
  type: 'test'
  ...
# Subtest: assets existem
ok 32 - assets existem
  ---
  duration_ms: 0.55851
  type: 'test'
  ...
# Subtest: sem GPS EXIF
ok 33 - sem GPS EXIF
  ---
  duration_ms: 0.111706
  type: 'test'
  ...
# Subtest: duplicado resolvido
ok 34 - duplicado resolvido
  ---
  duration_ms: 0.100399
  type: 'test'
  ...
# Subtest: índice cobre os 31 registos visíveis para revisão
ok 35 - índice cobre os 31 registos visíveis para revisão
  ---
  duration_ms: 1.133306
  type: 'test'
  ...
# Subtest: MM202617 integra a revisão e a coleção de intervenções
ok 36 - MM202617 integra a revisão e a coleção de intervenções
  ---
  duration_ms: 0.172136
  type: 'test'
  ...
# Subtest: coleções são derivadas e transparentes
ok 37 - coleções são derivadas e transparentes
  ---
  duration_ms: 0.152968
  type: 'test'
  ...
# Subtest: auditoria preserva o estado de revisão
ok 38 - auditoria preserva o estado de revisão
  ---
  duration_ms: 0.145437
  type: 'test'
  ...
# Subtest: modo de ecrã inteiro permanece
ok 39 - modo de ecrã inteiro permanece
  ---
  duration_ms: 0.67177
  type: 'test'
  ...
# Subtest: Escape regressa ao detalhe
ok 40 - Escape regressa ao detalhe
  ---
  duration_ms: 0.180218
  type: 'test'
  ...
# Subtest: navegação anterior e seguinte permanece
ok 41 - navegação anterior e seguinte permanece
  ---
  duration_ms: 0.119498
  type: 'test'
  ...
# Subtest: marca de água
ok 42 - marca de água
  ---
  duration_ms: 0.630688
  type: 'test'
  ...
# Subtest: QR pendente explícito
ok 43 - QR pendente explícito
  ---
  duration_ms: 0.164094
  type: 'test'
  ...
# Subtest: rotas físicas
ok 44 - rotas físicas
  ---
  duration_ms: 0.095632
  type: 'test'
  ...
# Subtest: Portal tem conteúdo estruturado
ok 45 - Portal tem conteúdo estruturado
  ---
  duration_ms: 0.885848
  type: 'test'
  ...
# Subtest: rotas institucionais
ok 46 - rotas institucionais
  ---
  duration_ms: 0.361117
  type: 'test'
  ...
# Subtest: sem contacto inventado
ok 47 - sem contacto inventado
  ---
  duration_ms: 0.171625
  type: 'test'
  ...
# Subtest: lançamento bloqueado
ok 48 - lançamento bloqueado
  ---
  duration_ms: 0.593854
  type: 'test'
  ...
# Subtest: workflow manual
ok 49 - workflow manual
  ---
  duration_ms: 0.222982
  type: 'test'
  ...
# Subtest: URL pública obrigatória
ok 50 - URL pública obrigatória
  ---
  duration_ms: 0.106198
  type: 'test'
  ...
# Subtest: sem endereço fictício no Museu
ok 51 - sem endereço fictício no Museu
  ---
  duration_ms: 0.620423
  type: 'test'
  ...
# Subtest: correção conduz à área Participar
ok 52 - correção conduz à área Participar
  ---
  duration_ms: 0.908822
  type: 'test'
  ...
# Subtest: intervenções digitais são exibidas
ok 53 - intervenções digitais são exibidas
  ---
  duration_ms: 0.118216
  type: 'test'
  ...
# Subtest: dataset JSON-LD contém os 30 registos elegíveis para lançamento
ok 54 - dataset JSON-LD contém os 30 registos elegíveis para lançamento
  ---
  duration_ms: 0.613603
  type: 'test'
  ...
# Subtest: sem licença inventada
ok 55 - sem licença inventada
  ---
  duration_ms: 0.202311
  type: 'test'
  ...
1..55
# tests 55
# suites 0
# pass 55
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 233.081679


$ npm run build

> milreu-portal-museum-07d3@0.11.3 build
> node scripts/build.mjs

30 páginas estáticas de registo geradas.
Build concluído em dist/.


$ npm run smoke

> milreu-portal-museum-07d3@0.11.3 smoke
> node scripts/smoke.mjs

Smoke HTTP concluído.
```
