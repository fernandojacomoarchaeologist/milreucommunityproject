---
title: "Checklist de integração — Pacote 03"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Checklist de integração

## Dependências

- [ ] Pacote 01 integrado ou decisões equivalentes confirmadas.
- [ ] Pacote 02 integrado ou sistema de design preservado sem conflito.
- [ ] `RIGHTS.md` e `COPYRIGHT.md` existentes no repositório principal.

## Pré-integração

- [ ] Comparar caminhos existentes.
- [ ] Verificar se já existe `docs/data-model/`.
- [ ] Verificar se já existe `data/schemas/`.
- [ ] Verificar se o repositório usa outra versão de JSON Schema.
- [ ] Confirmar que nenhum schema existente será substituído silenciosamente.

## Integração

- [ ] Criar ou fundir documentação do modelo de dados.
- [ ] Criar ou fundir schemas.
- [ ] Criar vocabulários controlados.
- [ ] Criar templates sem os tratar como dados reais.
- [ ] Manter o exemplo `MM202601` como preliminar.
- [ ] Integrar rules e skills.
- [ ] Aplicar os apêndices de integração apenas após comparação.

## Validação

- [ ] Executar `node scripts/validate-data-model.mjs`.
- [ ] Executar `node tests/data-model.test.mjs`.
- [ ] Confirmar que os quatro idiomas existem nos objetos localizados.
- [ ] Confirmar ausência do nível de certeza `mixed`.
- [ ] Confirmar presença de direitos, consentimento e estado de publicação.
- [ ] Confirmar que nenhuma coordenada sensível foi introduzida.

## Pós-integração

- [ ] Registar `releases/PACKAGE_03_v0.1.0.md`.
- [ ] Documentar conflitos.
- [ ] Documentar pendências.
- [ ] Confirmar que o protótipo não foi alterado.
- [ ] Confirmar que os 31 registos não foram migrados.
