<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 03 — Direitos e exposição (fail-closed)

Três gates independentes: **editorial → direitos → publicação**.

## Direitos multidimensionais (`contracts/10e/rights-assessment.schema.json`)

Dimensões independentes: `copyright`, `consent`, `license`, `thirdPartyMaterial`, `apiExposure`.
Cada uma é `allow`, `deny` ou `unknown`, com fundamento, evidência, responsável e data.
**`unknown` comporta-se como `deny`** (`validateRightsAssessment`). Só há compatibilidade de
direitos quando **todas** são `allow` comprovado.

## Publicação e API

- a **publicação** está fora deste pacote; só poderia ocorrer após os dois gates anteriores e o
  respetivo contrato público;
- **`apiExposure: allow` está proibido** neste PR (`apiExposureBlockedByPackage: true`); o motor
  representa o estado, valida fail-closed e mantém a decisão real ausente/`unknown`;
- nenhum registo recebe `apiExposure: allow`; a API pública permanece `5×0`.

Atribuir exposição por API é uma **decisão de direitos/publicação** humana futura, não deste pacote.
