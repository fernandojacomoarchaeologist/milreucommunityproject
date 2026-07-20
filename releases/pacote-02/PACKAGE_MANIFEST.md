---
title: "Manifesto de ficheiros — Pacote 02"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Manifesto de ficheiros

## Identificação

- **Pacote:** 02 — Sistema de Design e Guia Vivo
- **Versão:** 0.1.0
- **Tipo de release:** fundação visual e técnica
- **Dependência:** Pacote 01
- **Ação esperada:** criar, comparar ou fundir conforme caminho
- **Altera o protótipo:** não
- **Ativa migração visual:** não
- **Inclui conteúdo real do acervo:** não

## Ficheiros a registar

### Raiz do pacote

| Caminho | Ação | Finalidade |
|---|---|---|
| `README.md` | Registar | Escopo e instalação |
| `PACKAGE_MANIFEST.md` | Registar | Inventário do pacote |
| `PROMPT_CLAUDE.md` | Registar | Prompt de integração |
| `INTEGRATION_CHECKLIST.md` | Registar | Checklist operacional |
| `releases/PACKAGE_02_v0.1.0.md` | Criar | Release do pacote |

### Documentação de design

| Caminho | Ação | Finalidade |
|---|---|---|
| `docs/design/DESIGN_SYSTEM_SCOPE.md` | Criar | Limites do sistema |
| `docs/design/DESIGN_PRINCIPLES.md` | Criar | Princípios transversais |
| `docs/design/TWO_VOICES.md` | Criar | Comunidade e instituição |
| `docs/design/HAUSCHILD_TEICHNER_VISUAL_REFERENCE.md` | Criar | Referência e limites de interpretação |
| `docs/design/COLOR_SYSTEM.md` | Criar | Paleta e usos |
| `docs/design/TYPOGRAPHY.md` | Criar | Famílias e escala |
| `docs/design/SPACING_GRID_LAYOUT.md` | Criar | Defaults técnicos de layout |
| `docs/design/IMAGERY_TEXTURE_PHOTOGRAPHY.md` | Criar | Tratamento de imagem |
| `docs/design/LOGO_AND_MARKS.md` | Criar | Estado e regras temporárias da marca |
| `docs/design/MOTION_INTERACTION.md` | Criar | Movimento e interação |
| `docs/design/ACCESSIBILITY.md` | Criar | Requisitos de acessibilidade |
| `docs/design/PORTAL_AND_MUSEUM_MODES.md` | Criar | Dois modos de experiência |
| `docs/design/PRINT_DIGITAL_PARITY.md` | Criar | Continuidade físico-digital |
| `docs/design/DESIGN_GOVERNANCE.md` | Criar | Estados e versionamento |
| `docs/design/COMPONENT_REGISTRY.md` | Criar | Registo de componentes |
| `docs/design/PENDING_DECISIONS.md` | Criar | Decisões futuras |

### Specs

| Caminho | Ação | Finalidade |
|---|---|---|
| `docs/specifications/SPEC-DS-001-DESIGN-GUIDE.md` | Criar | Guia vivo |
| `docs/specifications/SPEC-DS-002-PORTAL-SHELL.md` | Criar | Scaffold do Portal |
| `docs/specifications/SPEC-DS-003-MUSEUM-SHELL.md` | Criar | Scaffold do Museu |

### Tokens e componentes

| Caminho | Ação | Finalidade |
|---|---|---|
| `packages/design-tokens/README.md` | Criar | Uso dos tokens |
| `packages/design-tokens/tokens.css` | Criar | Tokens Web |
| `packages/design-tokens/tokens.json` | Criar | Fonte estruturada |
| `packages/design-tokens/platforms/javascript/tokens.js` | Criar | Projeção JavaScript |
| `packages/design-tokens/platforms/flutter/milreu_tokens.dart` | Criar | Projeção Flutter inicial |
| `packages/ui-core/README.md` | Criar | Uso dos componentes |
| `packages/ui-core/components.css` | Criar | Componentes CSS |
| `packages/ui-core/components.vanilla.js` | Criar | Componentes Vanilla |
| `packages/ui-core/components.react.jsx` | Criar | Adaptador React opcional |
| `packages/ui-portal/portal-shell.css` | Criar | Shell do Portal |
| `packages/ui-museum/museum-shell.css` | Criar | Shell do Museu |
| `packages/ui-print/print-tokens.css` | Criar | Fundamentos de impressão |

### Guia vivo

| Caminho | Ação | Finalidade |
|---|---|---|
| `apps/design-guide/README.md` | Criar | Execução local |
| `apps/design-guide/index.html` | Criar | Guia navegável |
| `apps/design-guide/guide.css` | Criar | Composição do guia |
| `apps/design-guide/guide.js` | Criar | Idiomas, demos e fonte |

### Migração

| Caminho | Ação | Finalidade |
|---|---|---|
| `skin-migration/README.md` | Criar | Regras de ativação |
| `skin-migration/TOKEN_MAP.md` | Criar | Mapa de aliases |
| `skin-migration/LEGACY_USAGE_AUDIT.md` | Criar | Auditoria inicial |
| `skin-migration/MIGRATION_PLAN.md` | Criar | Sequência segura |
| `skin-migration/tokens-migration.css` | Criar, não ativar | Compatibilidade opt-in |

### Claude e validação

| Caminho | Ação | Finalidade |
|---|---|---|
| `.claude/rules/design-system.md` | Criar | Regra visual |
| `.claude/skills/design-system-change/SKILL.md` | Criar | Alterações controladas |
| `.claude/skills/component-intake/SKILL.md` | Criar | Entrada de componentes |
| `.claude/skills/design-guide-release/SKILL.md` | Criar | Release do guia |
| `scripts/validate-design-system.mjs` | Criar | Validação local |

### Conteúdos a fundir

| Caminho do pacote | Destino | Ação |
|---|---|---|
| `integration/CLAUDE_APPEND.md` | `CLAUDE.md` | Fundir semanticamente |
| `integration/VISUALIZATION_REGISTRY_APPEND.md` | `docs/specifications/VISUALIZATION_REGISTRY.md` | Acrescentar entradas sem substituir |

## Regras de integração

- não apagar ou sobrescrever materiais do agente anterior;
- não alterar o protótipo;
- não ativar a skin de migração;
- não criar logótipo ou assets;
- não publicar o guia sem definir rota e revisão;
- não transformar scaffolds em produtos finais;
- executar o validador;
- registar conflitos e pendências no relatório final.
