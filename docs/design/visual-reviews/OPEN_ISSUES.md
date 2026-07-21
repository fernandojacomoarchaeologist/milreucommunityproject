---
title: "Problemas visuais em aberto"
version: "0.4.0"
status: "internal-preview"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---

# Problemas visuais em aberto

Lista de problemas identificados na revisão visual, a resolver em releases incrementais do Pacote 05D. Não inventar problemas: registar apenas o que for observado.

| ID | Severidade | Âmbito | Descrição | Viewport | Detetado por | Estado | Release alvo |
|---|---|---|---|---|---|---|---|
| VR-001 | menor | maturidade | 44 itens estão `validated` sem revisão pessoal do responsável. Decidir se `validated` é adequado antes da revisão, ou se devem recuar para `in-review`. Nenhum está `approved` (regra respeitada). | — | assistente | aberto | v0.4.3 |
| VR-002 | cosmético | responsivo | Confirmar interativamente o toggle do drawer mobile e o comportamento em tablet (768). Layout empilha corretamente; interação por confirmar. | telemóvel/tablet | assistente | aberto | v0.4.4 |

## Convenções

- **Severidade:** bloqueante · maior · menor · cosmético.
- **Release alvo:** `v0.4.1` técnicas · `v0.4.2` cor/tipografia · `v0.4.3` componentes · `v0.4.4` responsivo · `v0.5.0` aprovação MVP.
- **Estado:** aberto · em curso · resolvido · adiado.
