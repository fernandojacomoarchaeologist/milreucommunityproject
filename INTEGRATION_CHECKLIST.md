---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D.3"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Checklist de integração

## MM202617

- [ ] aparece na galeria;
- [ ] aparece na pesquisa;
- [ ] aparece no filtro de intervenções;
- [ ] aparece na coleção de intervenções digitais;
- [ ] abre no detalhe;
- [ ] abre no modo imersivo;
- [ ] mostra aviso no card;
- [ ] mostra aviso no detalhe;
- [ ] mostra aviso no imersivo;
- [ ] crédito menciona IA;
- [ ] intervenção substantiva documentada;
- [ ] `siteStatus = review-visible`;
- [ ] `publicReleaseEligible = false`;
- [ ] `robots = noindex`;
- [ ] não entra no JSON-LD;
- [ ] não gera página estática de lançamento;
- [ ] não gera QR;
- [ ] totem e painel permanecem review-only.

## Validação

- [ ] `npm run channels:export`
- [ ] `npm run museum:index`
- [ ] `npm run museum:audit`
- [ ] `npm run validate`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run smoke`
