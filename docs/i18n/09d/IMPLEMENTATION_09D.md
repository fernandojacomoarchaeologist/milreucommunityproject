---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09D"
---

# Implementação

## Reutilizar

- seletor atual;
- conteúdo;
- revisão editorial;
- permissões;
- notificações;
- auditoria;
- oportunidades;
- Museu.

## Contratos

- `locale-content-model.json`
- `translation-workflow-model.json`
- `language-route-availability-model.json`
- `package-09d-readiness.json`

## Scripts sugeridos

- extract-source-content;
- validate-source-keys;
- validate-translation-state;
- detect-stale-translations;
- validate-no-machine-draft-publication;
- build-locale-availability;
- build-09d-readiness-report.

Uma migration aditiva só é aceite se o modelo atual não suportar versão, estado e revisão.
