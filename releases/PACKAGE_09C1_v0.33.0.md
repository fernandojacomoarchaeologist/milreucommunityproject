# Release — Pacote 09C.1 v0.33.0 (Fecho funcional e homologação das oportunidades)

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.

Corretivo de **fecho funcional** do 09C, compatível com a fundação multilíngue do 09D. Fecha a diferença entre a base técnica do 09C e a **jornada utilizável pela interface**, comprovada em modo de demonstração, com prova de backend por SQL/RLS. Produção bloqueada; dataset 0.11.3, MM202617 e módulos/permissões inalterados; nenhuma tradução publicada.

## Jornada (verificada na interface, modo demonstração)

`master cria rascunho → pré-visualiza → publica → visitante encontra na página pública → candidato autentica → completa perfil mínimo → candidata-se ("Submetida") → master aceita/não seleciona → candidato vê o resultado ("Aceite")`

## Correção-chave de fecho funcional

A rota `collab-opportunities` existia no router e na vista do 09C mas **não constava do switch principal de render** (`src/main.js`) — a página colaborativa de oportunidades era uma **rota morta** ("Página não encontrada"). Corrigida.

## Implementação

- **Lógica pura** `src/collab/opportunities-demo.js`: transições `submitted→accepted|not-selected|withdrawn`, `accepted→removed`; candidatura única; capacidade honesta; menores `minors_policy_pending`; privacidade entre candidatos; notas internas nunca públicas; duplicar não copia candidaturas; exportação minimizada. **16 testes unitários.**
- **Controlador**: store demo isolado + ramo demo (módulo puro) / ramo real (RPCs `collab_opportunity_*` do 09C); `loadRemoteOpportunities` por permissão.
- **UI master**: criar/editar, pré-visualizar, publicar, encerrar, cancelar (justificação interna), decidir, remover participante (razão obrigatória), capacidade, duplicar, exportar.
- **UI candidato**: perfil mínimo inline (só campos em falta, consentimento não pré-marcado), candidatar-se, resultado, retirada.
- **Descoberta pública**: em demo, publicadas juntam-se ao snapshot estático (que permanece vazio e honesto).
- **Formação**: removido progresso/nota fictícios do demo; só "Fundamentos" visível (08N).

## Testes e evidências

- `tests/opportunities-demo-09c1.test.mjs` (16) + E2E `tests/e2e/portal/opportunities-journey.spec.mjs` (CI).
- Backend: `supabase/collab-tests/009c1_opportunities_journey.test.sql` (CI Postgres): privacidade anon, menores, unicidade, decisão/remoção sob `opportunities.manage`.
- Matriz de evidências: `reports/opportunities-closure-09c1.md` (rótulos honestos: local-demo / unit / backend-sql / e2e-demo / bloqueado-config).

## Contratos / validador / CI

`contracts/09c1/*`; `scripts/09c1/validate-09c1.mjs` (+ `validate:09c1`); `09c1-ci.yml` (quality + e2e-opportunities + database).

## Invariantes

- **Sem novos módulos/permissões/migrations** (26 / 152 / 0).
- 09D preservado (seletor/i18n/registo); EN/ES/FR `missing`; sem `hreflang`.
- Dataset 0.11.3, MM202617 e **produção bloqueada** — inalterados.

## Limitação honesta

O E2E UI↔**backend real** depende de staging + Google OAuth (bloqueador humano desde o 08G). Não é homologação de produção. Observação (fora de escopo): participation/pilot/public-integration/operations-governance também não constam do switch principal de render — registado para pacote futuro.

## Base

Empilhado sobre `main` com 09C+09D. Bump 0.32.0 → 0.33.0.
