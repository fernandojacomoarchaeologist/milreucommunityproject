---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "06"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Mvp Scope Control

Não incluir mapa vivo, submissão, autenticação, Supabase remoto ou registos preliminares.

## Exceção estrita — formulário «Quero expor» (decisão humana 2026-10-05)

O formulário público de intenção «Quero expor» pode submeter para um **endpoint serverless de notificação por e-mail** (Edge Function `exhibition-proposal-intake`), por `fetch` direto ao seu **URL público** (sem chave).

- **Não** habilita o backend colaborativo: sem autenticação, sem base de dados, sem cliente Supabase e **sem credenciais Supabase** no pacote do site (o gate de `validate-foundation` mantém-se).
- O endpoint vive no campo `exhibitionProposalEndpoint` (URL público, não credencial); `null` ⇒ formulário em demonstração.
- Âmbito limitado a este formulário. Ver `docs/website/SPEC_FORM_EXPOR_BACKEND.md`.
