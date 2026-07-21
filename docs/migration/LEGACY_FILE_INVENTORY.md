---
title: "Inventário de ficheiros legados"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Inventário de ficheiros

O inventário reproduzível está em `data/migration/manifests/legacy-site-inventory.json`. A auditoria do recipiente ZIP está em `data/migration/reports/source-zip-container-audit.json`.

## Resumo

- ficheiros lógicos inventariados: **47**;
- ficheiros `.DS_Store` ignorados dentro do diretório do site: **3**;
- ficheiros de metadados `__MACOSX` identificados no recipiente ZIP: **56**;
- ficheiros de memória esperados e encontrados: **31/31**;
- grupo duplicado: `MM202612.jpg` e `MM202612.jpeg` possuem o mesmo checksum;
- incompatibilidade de extensão: `milreu_mosaic_hero.png` contém dados JPEG.

Nenhum ficheiro foi apagado ou renomeado por este pacote.
