---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Componentes do Sistema de Design — v0.4

Biblioteca estática de componentes do Projeto Comunitário de Milreu.

## Estado

`internal-preview`. Um componente `validated` possui regras e exemplo estável para testes, mas não equivale a aprovação final da identidade. Nenhum componente deste release está marcado como `approved`.

## Fonte de verdade

- tokens: `packages/design-tokens/v0.2/`;
- registo: `components.json`;
- estilos: `components.css`;
- auxiliares Vanilla JS: `components.js`.

## Limites

Os exemplos usam conteúdos demonstrativos e não pertencem ao acervo. Os componentes não controlam publicação, direitos ou persistência; apenas tornam estados e ações visíveis.

## Alinhamento com o Pacote 03 (modelo de dados)

Os componentes representam os estados definidos pelo modelo de dados, mas não os alteram. Níveis de certeza são apenas `confirmed`, `probable` e `hypothesis`. Direitos, consentimento e publicação continuam sob os schemas e fluxos de domínio.

## Segurança em relação ao Pacote 04 (migração)

Não utilizar os 31 registos migrados como demonstração automática. Todos permanecem preliminares até revisão humana. O Design System usa apenas ativos `demo-*`.
