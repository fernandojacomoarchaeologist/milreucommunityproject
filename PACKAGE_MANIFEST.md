---
title: "Manifesto do Pacote 05B"
version: "0.2.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Manifesto do Pacote 05B

## Identificação

- pacote: `05B`;
- nome: Fundações Visuais de Produção;
- versão: `0.2.0`;
- base: Pacote 02 + Pacote 05A;
- tipo: documentação, tokens, laboratório interno e validação.

## Grupos de ficheiros

| Grupo | Finalidade |
|---|---|
| `docs/design/foundations/` | fonte de verdade das fundações |
| `docs/adr/` | decisões arquiteturais de design |
| `docs/specifications/` | escopo técnico do laboratório e dos tokens |
| `packages/design-tokens/v0.2/` | tokens multiplataforma |
| `apps/foundations-lab/` | inspeção visual interna |
| `.claude/rules/` | restrições permanentes |
| `.claude/skills/` | procedimentos repetíveis |
| `integration/` | fusões com pacotes anteriores |
| `scripts/` e `tests/` | validação reproduzível |
| `releases/` | histórico do pacote |

## Política de sobrescrita

- não sobrescrever tokens v0.1 sem comparação;
- não substituir decisões locais sem relatório;
- não publicar o laboratório;
- não distribuir fontes;
- não importar imagens da fonte primária para este pacote.

## Estados

As fundações deste pacote estão **aprovadas para implementação e validação visual**, mas continuam versionadas. Alterações posteriores exigem ADR ou release, conforme impacto.
