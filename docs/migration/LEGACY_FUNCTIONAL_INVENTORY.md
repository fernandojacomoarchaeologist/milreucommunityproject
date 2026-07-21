---
title: "Inventário funcional do protótipo"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Inventário funcional

O protótipo é uma aplicação estática de página única. O inventário estruturado está em `data/migration/reports/functional-inventory.json`.

## Capacidades preservadas como referência

- galeria, pesquisa e filtros;
- modal e modo imersivo;
- linha temporal;
- favoritos e avaliações locais;
- impressão e partilha;
- glossário contextual;
- formulário guiado por `mailto:`;
- calendário itinerante;
- integração opcional com Google Drive;
- deep links para memórias.

## Limitações arquitetónicas

- `main.js` concentra múltiplas responsabilidades;
- `style.css` é monolítico;
- dados e apresentação estão acoplados;
- contribuições não têm persistência real;
- classificações locais não são dados científicos partilhados;
- o mapa de narrativas é apenas placeholder;
- o calendário possui dados de demonstração misturados com ficheiros de produção.
