---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07A"
rights: "Consultar RIGHTS.md; imagens e conteúdos mantêm créditos e condições das respetivas fontes."
---

# Static First Runtime

O 07A deve funcionar sem Supabase e sem internet. Não adicionar dependência runtime sem necessidade.

## Exceção estrita (decisão humana 2026-10-05)

O formulário «Quero expor» pode submeter para um endpoint serverless público de notificação por e-mail (`fetch` direto, sem cliente nem credenciais Supabase no site). O site continua a **carregar e funcionar** sem rede; sem endpoint (`exhibitionProposalEndpoint: null`) o formulário fica em demonstração. Ver `.claude/rules/mvp-scope-control.md` e `docs/website/SPEC_FORM_EXPOR_BACKEND.md`.

## Exceção estrita — estatística de visitas (decisão humana 2026-10-13)

Script de terceiros Umami (sem cookies), carregado **só** quando `public/config/analytics.runtime.json` tem `enabled: true` + `websiteId`, e só no domínio público. Sem configuração, nada é carregado e o site funciona sem rede. Não medir a Área Colaborativa. Ver `docs/website/SPEC_ESTATISTICA_VISITAS.md`.
