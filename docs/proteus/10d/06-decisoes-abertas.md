<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 06 — Decisões abertas

## D-10D-01 — `proteus-overview.json` mantido inalterado (adiado)

O pacote autorizava atualizar afirmações de disponibilidade desatualizadas em
`public/data/proteus-overview.json` (que ainda descreve a Biblioteca como «em preparação»).

**Constatação bloqueadora:** `scripts/10a/validate-10a.mjs` (fora do `allowed_paths` deste pacote)
impõe que **todas** as `futureExperiences` tenham `status: "em-preparacao"` e que
`availabilityNotice` declare que nada está disponível. Qualquer edição de disponibilidade no
*overview* quebraria esse validador — que não posso alterar aqui — ou criaria uma contradição
interna no mesmo ficheiro.

**Decisão:** **não** alterar `proteus-overview.json` neste PR funcional. A reconciliação do
*overview* com o validador 10A deve entrar num pacote cujo `allowed_paths` inclua ambos (candidato:
o pacote de **fecho 10D**). A honestidade é preservada: a nova página `/conhecimento/api` documenta
o estado real da API, e o *overview* descreve a **visão madura** ainda em preparação.

## D-10D-02 — Campo legado `package.json.currentPackage`

`package.json.currentPackage` = `"10B"`; a fonte canónica de pacote é
`public/data/package-impact-registry.json` = `"10C.1"`. O único leitor ativo do campo
(`scripts/09d/validate-09d.mjs`) **espera** `"10B"` e não o trata como estado atual. Classificado
como **legado** e **não corrigido** neste PR; a reconciliação, se desejada, pertence ao pacote de
fecho com inventário exato (ver `KNOWN_BASE_DISCREPANCY.md` do pacote).

## D-10D-03 — Exposição por API de registos reais

Nenhum registo tem hoje `apiExposure: allow`. A atribuição dessa permissão é uma decisão
editorial/de direitos futura (10E + decisões humanas), não deste pacote.

## Pendências humanas

**HD-03 a HD-07** permanecem `PENDING-HUMAN`. Bloqueiam release/depósito/partilha externa, **não**
esta entrega funcional. `baseline` e `public-git-content` continuam verdes; `release-or-deposit`
pode continuar bloqueado.

© 2026 Fernando Rodrigues de Jácomo.
