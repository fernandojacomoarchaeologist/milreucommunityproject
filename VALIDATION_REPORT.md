---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação

- Validação Node: concluída com sucesso
- Ficheiros JSON validados: 6
- Ficheiros Markdown: 65
- Segredos reais: não incluídos
- Ligação remota: não executada
- Escrita produtiva: não executada

## Saída

```text
Validação estrutural concluída.
3 migrations verificadas.
TAP version 13
# Subtest: ambiente local é aceite
ok 1 - ambiente local é aceite
  ---
  duration_ms: 0.788981
  type: 'test'
  ...
# Subtest: ambiente desconhecido é bloqueado
ok 2 - ambiente desconhecido é bloqueado
  ---
  duration_ms: 0.266285
  type: 'test'
  ...
# Subtest: produção sem gates é bloqueada
ok 3 - produção sem gates é bloqueada
  ---
  duration_ms: 1.067033
  type: 'test'
  ...
# Subtest: produção com todos os gates passa
ok 4 - produção com todos os gates passa
  ---
  duration_ms: 0.163092
  type: 'test'
  ...
# Subtest: snapshot com email é bloqueado
ok 5 - snapshot com email é bloqueado
  ---
  duration_ms: 0.225575
  type: 'test'
  ...
# Subtest: POC é marcado como demonstrativo
ok 6 - POC é marcado como demonstrativo
  ---
  duration_ms: 0.811684
  type: 'test'
  ...
# Subtest: workflow produtivo não usa gatilho push
ok 7 - workflow produtivo não usa gatilho push
  ---
  duration_ms: 0.400735
  type: 'test'
  ...
1..7
# tests 7
# suites 0
# pass 7
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 56.707208
{
  "mode": "public",
  "rootConfigured": false,
  "assets": [
    {
      "item": "hauschild-teichner/original.pdf",
      "exists": false
    },
    {
      "item": "hauschild-teichner/thumbnails",
      "exists": false
    }
  ]
}
Modo público: ausência dos binários privados é esperada.
Pacote 05F validado.
```
