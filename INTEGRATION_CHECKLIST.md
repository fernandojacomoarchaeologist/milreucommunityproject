---
title: "Checklist de integração — Pacote 04"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Checklist

## Antes

- [ ] Pacotes 01, 02 e 03 confirmados.
- [ ] ZIP ou diretório legado localizado.
- [ ] Fingerprint de `museum-items.js` comparado.
- [ ] Conflitos de caminhos analisados.

## Durante

- [ ] Snapshot preservado.
- [ ] 31 JSON integrados em caminho não público.
- [ ] Regras e skills fundidas sem sobrescrever versões superiores.
- [ ] Nenhuma ligação da UI aos novos dados.
- [ ] Nenhum estado promovido.

## Depois

- [ ] `node scripts/validate-package-04.mjs` executado.
- [ ] `node tests/migration.test.mjs` executado.
- [ ] Registos validados com o schema do Pacote 03.
- [ ] Release registado.
- [ ] Protótipo confirmado sem alterações.
