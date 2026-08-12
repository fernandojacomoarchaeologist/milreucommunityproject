<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 03 — Direitos e exposição (fail-closed)

Três gates independentes: **editorial → direitos → publicação**.

## Direitos multidimensionais (`contracts/10e/rights-assessment.schema.json`)

Dimensões independentes: `copyright`, `consent`, `license`, `thirdPartyMaterial`, `apiExposure`.
Cada uma é `allow`, `deny` ou `unknown`, com fundamento, evidência, responsável e data.
**`unknown` comporta-se como `deny`** (`validateRightsAssessment`). A avaliação é estritamente
fail-closed: exige `assertionId`; rejeita propriedades desconhecidas no topo e nas dimensões; a
data, quando presente ou exigida, tem de ser ISO 8601; `allow` exige fundamento, evidência,
responsável e data. Só há compatibilidade quando **todas** são `allow` comprovado.

## Publicação e API

- a **publicação** está fora deste pacote; só poderia ocorrer após os dois gates anteriores e o
  respetivo contrato público;
- **`apiExposure: allow` está proibido** neste PR: `apiExposure.decision === "allow"` torna a
  avaliação **inválida** (`valid:false`), não apenas devolve uma flag; a decisão real permanece
  ausente/`deny`;
- nenhum registo recebe `apiExposure: allow`; a API pública permanece `5×0`.

Atribuir exposição por API é uma **decisão de direitos/publicação** humana futura, não deste pacote.
