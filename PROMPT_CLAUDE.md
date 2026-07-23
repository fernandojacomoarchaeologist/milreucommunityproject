---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07C"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 07C

Integra o Pacote 07C cumulativamente sobre o 07B.

## Objetivo

Aprofundar o Museu digital e preservar integralmente o Portal e o modo de ecrã inteiro.

## Antes de agir

1. Lê `README.md`.
2. Lê:
   - `docs/museum/MUSEUM_INFORMATION_ARCHITECTURE.md`;
   - `docs/museum/IMMERSIVE_MODE_SPEC.md`;
   - `docs/museum/COLLECTIONS_AND_DERIVED_RELATIONS.md`;
   - `docs/museum/EDITORIAL_BOUNDARIES.md`.
3. Compara o repositório atual com os ficheiros do pacote.
4. Não substituas dados mais recentes.
5. Não corrijas relações automaticamente.
6. Não publiques `MM202617`.
7. Não ligues ao Supabase remoto.

## Integração

1. Mescla os ficheiros.
2. Preserva as 31 imagens e 124 derivados.
3. Executa:
   - `npm install`;
   - `npm run museum:index`;
   - `npm run museum:audit`;
   - `npm run validate`;
   - `npm test`;
   - `npm run build`;
   - `npm run smoke`.
4. Testa o Museu em 1280, 768 e 375 px.
5. Testa:
   - pesquisa;
   - todos os filtros;
   - ordenação;
   - grelha e lista;
   - cinco coleções;
   - cronologia;
   - detalhe;
   - intervenções digitais;
   - relações;
   - sugestões derivadas;
   - modo imersivo.
6. No modo imersivo, testa:
   - anterior e seguinte;
   - setas;
   - Escape;
   - I;
   - F;
   - botão de browser fullscreen;
   - filmstrip;
   - informação aberta e fechada.
7. Gera release de integração.

## Bloqueios

Interrompe se:

- o Portal regredir;
- o modo imersivo for removido;
- a imagem deixar de usar `object-fit: contain`;
- o índice incluir MM202617;
- coleções forem apresentadas como factos históricos;
- sugestões derivadas forem confundidas com relações confirmadas;
- intervenções digitais forem ocultadas;
- aparecer contacto fictício;
- dados privados entrarem no build.

## Resultado

Museu digital executável e mais completo, preparado para a camada multicanal do 07D e para a revisão editorial do Pacote 08.
