---
title: "Índice de capturas da revisão visual"
version: "0.4.0"
status: "internal-preview"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---

# Índice de capturas

Capturas de ecrã tiradas durante a revisão visual, para rastreabilidade. As imagens são materiais de trabalho interno da revisão; guardar em `docs/design/visual-reviews/screenshots/` quando exportadas.

Servir o guia a partir da raiz do repositório:

```bash
python3 -m http.server 8080
# abrir http://localhost:8080/apps/design-guide/
```

| ID | Rota / página | Viewport | Ficheiro | Observação | Data |
|---|---|---|---|---|---|
| SS-001 | `#/introduction/overview` | desktop 1280 | _por exportar_ | Assinatura vermelha na barra de topo e eyebrow; título Fraunces; corpo Spectral; nav lateral com pontos de maturidade | 2026-07-21 |
| SS-002 | `#/foundations/colors` | desktop 1280 | _por exportar_ | Paleta de produção: amostras vermelho / vermelho profundo / preto aquecido visíveis | 2026-07-21 |
| SS-003 | `#/components/overview` | desktop 1280 | _por exportar_ | Inventário com estados VALIDATED / IN-REVIEW / PROPOSED por componente | 2026-07-21 |
| SS-004 | `#/introduction/overview` | telemóvel 375 | _por exportar_ | Nav colapsa em hambúrguer; metadados empilham; leitura mantém-se legível | 2026-07-21 |

> As capturas foram tiradas numa sessão de verificação técnica do assistente. Exportar os PNG para `screenshots/` quando necessário para o dossiê de revisão.

## Viewports de referência

- **Computador:** 1280×800 (e ≥1440 para ecrãs largos).
- **Tablet:** 768×1024.
- **Telemóvel:** 375×812.
