---
title: "Checklist de integração — Pacote 05B"
version: "0.2.0"
status: "ready-for-use"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Checklist de integração — Pacote 05B

## Antes

- [ ] Pacotes 01, 02 e 05A estão integrados.
- [ ] `RIGHTS.md` existe na raiz.
- [ ] O PDF do Pacote 05A permanece privado e fora do build público.
- [ ] Alterações locais nos tokens do Pacote 02 foram inventariadas.

## Integração

- [ ] Copiar `docs/design/foundations/`.
- [ ] Copiar ADRs e specs.
- [ ] Copiar `packages/design-tokens/v0.2/`.
- [ ] Copiar `apps/foundations-lab/` como ferramenta interna.
- [ ] Fundir `.claude/rules/` e `.claude/skills/`.
- [ ] Fundir as adendas em `integration/`.
- [ ] Não incluir fontes binárias.
- [ ] Não ligar o laboratório ao site público.

## Validação

```bash
node scripts/validate-package-05b.mjs
node tests/token-schema.test.mjs
node tests/contrast.test.mjs
node tests/platform-parity.test.mjs
```

- [ ] Servir a raiz por HTTP.
- [ ] Abrir `apps/foundations-lab/` em desktop e viewport móvel.
- [ ] Confirmar que o vermelho não é usado como superfície padrão de leitura.
- [ ] Confirmar que preto e vermelho usam texto branco quando exigido.
- [ ] Confirmar que nenhum estado depende apenas de cor.
- [ ] Confirmar o suporte aos quatro idiomas.

## Depois

- [ ] Registar conflitos com tokens v0.1.
- [ ] Produzir relatório de integração.
- [ ] Não avançar para o Pacote 05C sem instrução explícita.
