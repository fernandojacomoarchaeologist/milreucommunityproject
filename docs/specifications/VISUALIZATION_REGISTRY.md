---
title: "Registo de visualizações"
version: "0.1.0"
status: "initial-registry"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Registo de visualizações

## Regra

Nenhuma página, gráfico, mapa, componente visual complexo, painel físico ou experiência imersiva deve ser implementado sem:

1. entrada neste registo;
2. iniciativa e produto identificados;
3. spec associada;
4. estado `approved` antes da implementação final.

## Estados

- `concept`
- `planned`
- `specified`
- `approved`
- `implemented`
- `deprecated`

## Registo inicial

| ID | Visualização | Produto | Iniciativa | Estado | Spec |
|---|---|---|---|---|---|
| `VIEW-PORTAL-HOME` | Página principal do projeto | portal | transversal | planned | a criar |
| `VIEW-INITIATIVE-LIST` | Lista de iniciativas | portal | transversal | planned | a criar |
| `VIEW-MUSEUM-GALLERY` | Galeria de memórias | museum-web | Museu de Memórias | planned | a criar |
| `VIEW-MEMORY-DETAIL` | Página individual de memória | museum-web | Museu de Memórias | planned | a criar |
| `VIEW-MUSEUM-IMMERSIVE` | Visualização em ecrã cheio | museum-web | Museu de Memórias | planned | a criar |
| `VIEW-MUSEUM-TIMELINE` | Linha temporal | museum-web | Museu de Memórias | concept | a criar |
| `VIEW-NARRATIVE-MAP` | Mapa vivo de narrativas | museum-web | Museu de Memórias | concept | a criar |
| `VIEW-DESIGN-GUIDE` | Mapa navegável do design system | design-guide | transversal | planned | a criar |
| `VIEW-SURVEY-BROWSER` | Consulta de dados públicos | portal | Inquéritos | concept | a criar |
| `VIEW-BIB-LIBRARY` | Biblioteca e referências | portal | transversal | concept | a criar |
| `VIEW-DOCUMENT-VIEWER` | Visualizador de documentos autorizados | portal | transversal | concept | a criar |
| `VIEW-ARCHAEOLOGY-RECORD` | Registo arqueológico | portal | Arqueologia e catalogação | concept | a criar |
| `VIEW-PANEL-TEMPLATE` | Totem ou painel físico | print | Museu de Memórias | planned | a criar |
| `VIEW-FLUTTER-MUSEUM` | Exploração móvel do museu | flutter | Museu de Memórias | concept | a criar |

## Observação sobre o protótipo

Visualizações existentes no site preliminar constituem referências funcionais a auditar. Não recebem automaticamente estado `approved` neste registo.

## Acréscimo do Pacote 02 — sistema de design

| ID | Visualização | Produto | Estado | Spec | Observação |
|---|---|---|---|---|---|
| VIS-DS-001 | Guia vivo do sistema de design | Guia | Foundation approved | `SPEC-DS-001-DESIGN-GUIDE.md` | Pode ser integrado e testado |
| VIS-DS-002 | Shell do Portal | Portal | Draft scaffold | `SPEC-DS-002-PORTAL-SHELL.md` | Não representa páginas finais |
| VIS-DS-003 | Shell imersivo do Museu | Museu | Draft scaffold | `SPEC-DS-003-MUSEUM-SHELL.md` | Sem conteúdo real, mapa ou timeline |

A aprovação do scaffold não aprova automaticamente homepage, galeria, mapa, timeline, visualizador documental, dashboard, editor ou app.

**Pendência de reconciliação:** este bloco usa colunas, prefixos de ID e vocabulário de estados diferentes do registo inicial acima. `VIS-DS-001` e `VIEW-DESIGN-GUIDE` poderão designar a mesma visualização. Por decidir num pacote futuro.

## Acréscimo do Pacote 05C — catálogo visual

### DS-VIEW-003 — Catálogo visual interativo

- **Rota:** `/apps/design-guide/`
- **Produto:** Guia do Sistema de Design
- **Estado:** internal-preview
- **Fonte:** Pacotes 05A, 05B e catálogo 0.3
- **Visualizações:** fundações, identidade, experiências e governação
- **Exclusões:** Portal público, Museu público, ativos do livro e componentes 05D não aprovados

## Acréscimo do Pacote 05D — componentes e padrões

As rotas `components/*` e `patterns/*` do catálogo do guia são documentação **interna** (estado `internal-preview`). Não devem ser confundidas com rotas públicas do Portal ou do Museu.
