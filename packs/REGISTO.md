# Registo de apply-packs

Cada entrega é um script bash idempotente, aplicado no seu próprio branch
`pack/<ID>`. Fluxo: colar → correr → `git diff main..pack/<ID>` → merge ou
descartar.

| Pack | Data | Branch | Descrição |
|---|---|---|---|
| P001-bootstrap | — | main | Estrutura do repositório |
| P002 | 2026-07-18 | main | Integra Pacote 01 v0.1.0 - fundação, governação e escopo |
| P003 | 2026-07-20 | main | Integra Pacote 02 v0.1.0 - sistema de design e guia vivo |
| P004 | 2026-07-20 | pack/pacote-03-modelo-dados | Integra Pacote 03 v0.1.0 - modelo de dados do Museu |
| P005 | 2026-07-20 | pack/pacote-04-migracao | Integra Pacote 04 v0.1.0 - auditoria e migração da versão preliminar |
| P006 | 2026-07-21 | pack/pacote-05a-auditoria-visual | Integra Pacote 05A v0.1.0 - auditoria visual e fonte primária (binários privados via .gitignore) |
| P007 | 2026-07-21 | pack/pacote-05b-fundacoes-visuais | Integra Pacote 05B v0.2.0 - fundações visuais de produção (tokens v0.2) |
| P008 | 2026-07-21 | pack/pacote-05c-catalogo-visual | Integra Pacote 05C v0.3.0 - catálogo visual interativo (substitui guia P02) |
| P009 | 2026-07-21 | pack/pacote-05d-componentes | Integra Pacote 05D v0.4.0 - componentes e padrões museológicos (conclui série 05) |
| P010 | 2026-07-21 | pack/pacote-05e-identidade | Integra Pacote 05E v0.5.0 - identidade, logótipo e iconografia (ativos draft) |

---

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.
