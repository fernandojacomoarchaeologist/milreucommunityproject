# Registo de apply-packs

Cada entrega é um script bash idempotente, aplicado no seu próprio branch
`pack/<ID>`. Fluxo: colar → correr → `git diff main..pack/<ID>` → merge ou
descartar.

| Pack | Data | Branch | Descrição |
|---|---|---|---|
| P001-bootstrap | — | main | Estrutura do repositório |
