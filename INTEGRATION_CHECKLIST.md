---
title: "Checklist de integração — Pacote 05A"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório e SOURCE_RIGHTS_NOTICE.md neste pacote"
---
# Checklist de integração — Pacote 05A

## Antes

- [ ] Confirmar Pacotes 01 e 02.
- [ ] Ler `SOURCE_RIGHTS_NOTICE.md`.
- [ ] Confirmar que a pasta privada não entra no build público.
- [ ] Verificar se já existe auditoria visual do livro.
- [ ] Comparar sem sobrescrever materiais equivalentes.

## Durante

- [ ] Registar o PDF em `source-manifest.json`.
- [ ] Integrar `docs/design-source/`.
- [ ] Integrar o quadro visual interno.
- [ ] Fundir manualmente os ficheiros de `integration/`.
- [ ] Não transformar amostras de cor em tokens finais.
- [ ] Não declarar a fonte tipográfica do livro sem evidência.
- [ ] Preservar a decisão do vermelho como assinatura e abertura.
- [ ] Preservar o preto como preenchimento de destaque, não como superfície dominante universal.

## Depois

- [ ] Executar `node scripts/validate-package-05a.mjs`.
- [ ] Executar `node tests/source-audit.test.mjs`.
- [ ] Abrir o quadro visual num servidor local.
- [ ] Confirmar 36 páginas e 36 miniaturas.
- [ ] Confirmar que o PDF não está numa rota pública.
- [ ] Registar o release.
