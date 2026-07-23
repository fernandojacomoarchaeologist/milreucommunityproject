---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D.2"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação

- Resultado: sucesso
- Versão: 0.11.2
- Destaques da Home: 3
- Ordem: Museu, Experiência Proteus, Inquérito 2026
- Intervalo automático: 9 segundos
- Link do inquérito: `https://pt.surveymonkey.com/r/3CFG2MQ`
- Empty state Proteus: incluído
- Sumário estatístico da entrada do Museu: removido
- Retorno imersivo persistente: incluído
- Botão X persistente: incluído
- Encaixe imersivo: largura/altura automáticas, máximos de 100% e `contain`
- Modo slide x1/x2/x3: preservado
- Páginas estáticas geradas: 30
- JSONs individuais gerados: 30
- Testes automatizados: 55
- JSONs validados: 16
- Checksum do carrossel no build manifest: sim
- Lançamento público aprovado: não
- Revisão visual humana final: pendente após integração no repositório
- Build removido do ZIP para evitar duplicação de imagens

```text
$ npm run channels:export

> milreu-portal-museum-07d2@0.11.2 channels:export
> node scripts/channels/export-channels.mjs

31 perfis multicanal exportados.


$ npm run museum:index

> milreu-portal-museum-07d2@0.11.2 museum:index
> node scripts/museum/build-index.mjs

30 registos indexados.


$ npm run museum:audit

> milreu-portal-museum-07d2@0.11.2 museum:audit
> node scripts/museum/audit-content.mjs

Auditoria do Museu atualizada.


$ npm run validate

> milreu-portal-museum-07d2@0.11.2 validate
> node scripts/validate.mjs && node scripts/validate-portal.mjs && node scripts/validate-museum-regression.mjs && node scripts/validate-museum-07c.mjs && node scripts/validate-immersive-07c.mjs && node scripts/channels/validate-channels.mjs && node scripts/structured/validate-structured-data.mjs && node scripts/quality/validate-performance.mjs && node scripts/quality/validate-accessibility.mjs && node scripts/validate-07d.mjs && node scripts/validate-07d1-fixes.mjs && node scripts/validate-07d2-fixes.mjs

Validação base 07B concluída: 31 imagens, 30 visíveis e 1 bloqueada.
Portal 07B validado.
Contrato incremental do Museu validado, incluindo ecrã inteiro.
Museu 07C validado.
Modo imersivo 07C validado.
Perfis multicanal validados.
Dados estruturados validados.
Budgets validados — JS 87823, CSS 58330, HTML 1097.
Baseline de acessibilidade validada.
Pacote 07D validado.
Hotfix 07D.1 validado.
Hotfix 07D.2 validado.


$ npm test

> milreu-portal-museum-07d2@0.11.2 test
> node --test tests/*.test.mjs

TAP version 13
# Subtest: hash routes
ok 1 - hash routes
  ---
  duration_ms: 1.494363
  type: 'test'
  ...
# Subtest: MM202617 não hardcoded como visível
ok 2 - MM202617 não hardcoded como visível
  ---
  duration_ms: 0.119938
  type: 'test'
  ...
# Subtest: noindex
ok 3 - noindex
  ---
  duration_ms: 0.086759
  type: 'test'
  ...
# Subtest: skip link
ok 4 - skip link
  ---
  duration_ms: 0.137835
  type: 'test'
  ...
# Subtest: 31 perfis e 30 públicos
ok 5 - 31 perfis e 30 públicos
  ---
  duration_ms: 0.614895
  type: 'test'
  ...
# Subtest: canais físicos inativos
ok 6 - canais físicos inativos
  ---
  duration_ms: 0.173528
  type: 'test'
  ...
# Subtest: domínio e QR pendentes
ok 7 - domínio e QR pendentes
  ---
  duration_ms: 0.138096
  type: 'test'
  ...
# Subtest: MM202617 bloqueado
ok 8 - MM202617 bloqueado
  ---
  duration_ms: 0.122162
  type: 'test'
  ...
# Subtest: 31 registos
ok 9 - 31 registos
  ---
  duration_ms: 0.555917
  type: 'test'
  ...
# Subtest: 30 visíveis
ok 10 - 30 visíveis
  ---
  duration_ms: 0.111906
  type: 'test'
  ...
# Subtest: MM202617 bloqueado
ok 11 - MM202617 bloqueado
  ---
  duration_ms: 0.133819
  type: 'test'
  ...
# Subtest: estrutura multicanal
ok 12 - estrutura multicanal
  ---
  duration_ms: 0.179577
  type: 'test'
  ...
# Subtest: direitos registados
ok 13 - direitos registados
  ---
  duration_ms: 0.265856
  type: 'test'
  ...
# Subtest: pilares do projeto
ok 14 - pilares do projeto
  ---
  duration_ms: 1.067177
  type: 'test'
  ...
# Subtest: home sem explicações internas
ok 15 - home sem explicações internas
  ---
  duration_ms: 0.170204
  type: 'test'
  ...
# Subtest: iniciativas sem relação multicanal e Museu com CTA
ok 16 - iniciativas sem relação multicanal e Museu com CTA
  ---
  duration_ms: 0.117846
  type: 'test'
  ...
# Subtest: header e retorno do Museu
ok 17 - header e retorno do Museu
  ---
  duration_ms: 0.102042
  type: 'test'
  ...
# Subtest: X e slideshow
ok 18 - X e slideshow
  ---
  duration_ms: 0.179757
  type: 'test'
  ...
# Subtest: timeline e coleções limpas
ok 19 - timeline e coleções limpas
  ---
  duration_ms: 0.179517
  type: 'test'
  ...
# Subtest: Experiência Proteus
ok 20 - Experiência Proteus
  ---
  duration_ms: 0.083574
  type: 'test'
  ...
# Subtest: Home tem Museu, Proteus e Inquérito
ok 21 - Home tem Museu, Proteus e Inquérito
  ---
  duration_ms: 1.118734
  type: 'test'
  ...
# Subtest: carrossel automático e controlável
ok 22 - carrossel automático e controlável
  ---
  duration_ms: 0.176092
  type: 'test'
  ...
# Subtest: Iniciativas usa título e descrição em linhas distintas
ok 23 - Iniciativas usa título e descrição em linhas distintas
  ---
  duration_ms: 0.102682
  type: 'test'
  ...
# Subtest: Museu abre sem sumário estatístico
ok 24 - Museu abre sem sumário estatístico
  ---
  duration_ms: 0.110785
  type: 'test'
  ...
# Subtest: modo imersivo tem retorno persistente
ok 25 - modo imersivo tem retorno persistente
  ---
  duration_ms: 0.152487
  type: 'test'
  ...
# Subtest: imagem imersiva encaixa no viewport
ok 26 - imagem imersiva encaixa no viewport
  ---
  duration_ms: 0.201079
  type: 'test'
  ...
# Subtest: teclado imersivo completo
ok 27 - teclado imersivo completo
  ---
  duration_ms: 0.704207
  type: 'test'
  ...
# Subtest: informação e filmstrip
ok 28 - informação e filmstrip
  ---
  duration_ms: 0.184244
  type: 'test'
  ...
# Subtest: imagem não é cortada obrigatoriamente
ok 29 - imagem não é cortada obrigatoriamente
  ---
  duration_ms: 0.099368
  type: 'test'
  ...
# Subtest: 31 imagens únicas
ok 30 - 31 imagens únicas
  ---
  duration_ms: 0.624198
  type: 'test'
  ...
# Subtest: quatro variantes
ok 31 - quatro variantes
  ---
  duration_ms: 0.773681
  type: 'test'
  ...
# Subtest: assets existem
ok 32 - assets existem
  ---
  duration_ms: 0.728214
  type: 'test'
  ...
# Subtest: sem GPS EXIF
ok 33 - sem GPS EXIF
  ---
  duration_ms: 0.166127
  type: 'test'
  ...
# Subtest: duplicado resolvido
ok 34 - duplicado resolvido
  ---
  duration_ms: 0.103504
  type: 'test'
  ...
# Subtest: índice cobre os 30 registos públicos
ok 35 - índice cobre os 30 registos públicos
  ---
  duration_ms: 1.185814
  type: 'test'
  ...
# Subtest: MM202617 permanece bloqueado
ok 36 - MM202617 permanece bloqueado
  ---
  duration_ms: 0.173549
  type: 'test'
  ...
# Subtest: coleções são derivadas e transparentes
ok 37 - coleções são derivadas e transparentes
  ---
  duration_ms: 0.151686
  type: 'test'
  ...
# Subtest: auditoria preserva pendências
ok 38 - auditoria preserva pendências
  ---
  duration_ms: 0.099808
  type: 'test'
  ...
# Subtest: modo de ecrã inteiro permanece
ok 39 - modo de ecrã inteiro permanece
  ---
  duration_ms: 0.693492
  type: 'test'
  ...
# Subtest: Escape regressa ao detalhe
ok 40 - Escape regressa ao detalhe
  ---
  duration_ms: 0.190573
  type: 'test'
  ...
# Subtest: navegação anterior e seguinte permanece
ok 41 - navegação anterior e seguinte permanece
  ---
  duration_ms: 0.120229
  type: 'test'
  ...
# Subtest: marca de água
ok 42 - marca de água
  ---
  duration_ms: 0.671469
  type: 'test'
  ...
# Subtest: QR pendente explícito
ok 43 - QR pendente explícito
  ---
  duration_ms: 0.163433
  type: 'test'
  ...
# Subtest: rotas físicas
ok 44 - rotas físicas
  ---
  duration_ms: 0.09432
  type: 'test'
  ...
# Subtest: Portal tem conteúdo estruturado
ok 45 - Portal tem conteúdo estruturado
  ---
  duration_ms: 0.594144
  type: 'test'
  ...
# Subtest: rotas institucionais
ok 46 - rotas institucionais
  ---
  duration_ms: 0.260017
  type: 'test'
  ...
# Subtest: sem contacto inventado
ok 47 - sem contacto inventado
  ---
  duration_ms: 0.117345
  type: 'test'
  ...
# Subtest: lançamento bloqueado
ok 48 - lançamento bloqueado
  ---
  duration_ms: 0.711479
  type: 'test'
  ...
# Subtest: workflow manual
ok 49 - workflow manual
  ---
  duration_ms: 0.22247
  type: 'test'
  ...
# Subtest: URL pública obrigatória
ok 50 - URL pública obrigatória
  ---
  duration_ms: 0.199557
  type: 'test'
  ...
# Subtest: sem endereço fictício no Museu
ok 51 - sem endereço fictício no Museu
  ---
  duration_ms: 0.601244
  type: 'test'
  ...
# Subtest: correção conduz à área Participar
ok 52 - correção conduz à área Participar
  ---
  duration_ms: 0.880961
  type: 'test'
  ...
# Subtest: intervenções digitais são exibidas
ok 53 - intervenções digitais são exibidas
  ---
  duration_ms: 0.161721
  type: 'test'
  ...
# Subtest: dataset JSON-LD
ok 54 - dataset JSON-LD
  ---
  duration_ms: 0.561125
  type: 'test'
  ...
# Subtest: sem licença inventada
ok 55 - sem licença inventada
  ---
  duration_ms: 0.227749
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
# duration_ms 217.274003


$ npm run build

> milreu-portal-museum-07d2@0.11.2 build
> node scripts/build.mjs

30 páginas estáticas de registo geradas.
Build concluído em dist/.


$ npm run smoke

> milreu-portal-museum-07d2@0.11.2 smoke
> node scripts/smoke.mjs

Smoke HTTP concluído.
```
