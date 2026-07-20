# Registo de apply-packs

Cada entrega é um script bash idempotente, aplicado no seu próprio branch
`pack/<ID>`. Fluxo: colar → correr → `git diff main..pack/<ID>` → merge ou
descartar.

| Pack | Data | Branch | Descrição |
|---|---|---|---|
| P001-bootstrap | — | main | Estrutura do repositório |
| P002 | 2026-07-18 | main | Integra Pacote 01 v0.1.0 - fundação, governação e escopo |
| P003 | 2026-07-20 | main | Integra Pacote 02 v0.1.0 - sistema de design e guia vivo |
