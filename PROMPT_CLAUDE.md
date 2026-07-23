---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07B"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 07B

Integra este pacote cumulativo sobre o 07A já existente.

## Objetivo

Expandir o Portal público mantendo intacta a experiência museológica, especialmente o modo de ecrã inteiro.

## Antes de alterar

1. Lê `README.md`.
2. Lê `docs/architecture/MUSEUM_INCREMENTAL_CONTRACT.md`.
3. Compara o Portal atual com `public/data/portal-content.json`.
4. Não substituas conteúdos aprovados por texto demonstrativo.
5. Não publiques contactos fictícios.
6. Não ligues ao Supabase remoto.
7. Não removas rotas ou recursos do Museu.

## Integração

1. Mescla os ficheiros.
2. Preserva as imagens e manifests do 07A.
3. Executa:
   - `npm install`;
   - `npm run validate`;
   - `npm test`;
   - `npm run build`;
   - `npm run smoke`.
4. Abre em 1280, 768 e 375 px.
5. Revê todas as páginas do Portal.
6. Executa manualmente o fluxo:
   - Portal;
   - Museu;
   - galeria;
   - detalhe;
   - ecrã inteiro;
   - anterior;
   - seguinte;
   - Escape;
   - voltar ao Projeto.
7. Gera release de integração.

## Bloqueios obrigatórios

Interrompe se:

- a integração remover `#/museu/imersivo/:id`;
- o modo imersivo deixar de ocupar o viewport;
- Escape não regressar ao detalhe;
- anterior/seguinte deixarem de funcionar;
- as imagens imersivas forem substituídas por thumbnails;
- `MM202617` ficar visível;
- algum contacto ou parceria for inventado;
- forem publicados dados privados.

## Estado editorial

- Portal: `preliminary`;
- Museu: pré-visualização editorial;
- imagens: autorizadas para publicação no projeto;
- textos: sujeitos a revisão;
- traduções: fallback para pt-PT.

## Resultado

Uma aplicação executável com Portal funcional e Museu preservado, pronta para a evolução do 07C.
