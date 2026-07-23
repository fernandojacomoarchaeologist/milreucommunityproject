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
| VR-002 | cosmético | responsivo | Toggle do drawer mobile/tablet **confirmado a funcionar** na revisão Gate A (2026-07-23): abre com overlay+backdrop, item ativo destacado. | telemóvel/tablet | assistente | resolvido | — |
| VR-003 | menor | marca | Logótipo claro/escuro **aceite para arquitetura** no Gate A. Continua `draft`; SVG mestre e `approved` pendentes para o MVP. | desktop | Pacote 05F | resolvido (arquitetura) | Gate B |
| VR-004 | menor | tokens | Tokens v0.2 **promovidos a base canónica** (decisão de 2026-07-23, ver DECISIONS.md). | — | Pacote 05F | resolvido | — |

## Convenções

- **Severidade:** bloqueante · maior · menor · cosmético.
- **Release alvo:** `v0.4.1` técnicas · `v0.4.2` cor/tipografia · `v0.4.3` componentes · `v0.4.4` responsivo · `v0.5.0` aprovação MVP.
- **Estado:** aberto · em curso · resolvido · adiado.
