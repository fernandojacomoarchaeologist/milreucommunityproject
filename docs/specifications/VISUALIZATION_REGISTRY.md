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
