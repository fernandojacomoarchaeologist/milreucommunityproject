---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D.1"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 07D.1

Integra este hotfix sobre o 07D.

## Regras

1. Preserva Portal, Museu, imagens, exports e modo imersivo.
2. Não recuperes os pilares antigos.
3. Não restaures os blocos técnicos removidos da Home.
4. Não restaures Relação multicanal nas iniciativas.
5. Mantém Experiência Proteus como nome do menu.
6. Mantém o retorno ao Projeto como botão flutuante.
7. Mantém o botão X com handler explícito.
8. Mantém as velocidades:
   - x1 = 15 s;
   - x2 = 7 s;
   - x3 = 4 s.
9. Não exponhas year/range na cronologia.
10. Não exponhas regras JSON nas páginas de coleção.

## Integração

```bash
npm install
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run smoke
```

## Revisão visual

Testar em 1280, 768 e 375 px:

- header do Portal;
- Projeto e pilares;
- Home;
- iniciativa Museu;
- Museu;
- botão flutuante;
- botão de modo imersivo;
- X;
- modo slide;
- linha temporal;
- coleções;
- Experiência Proteus.

Não promover para lançamento público.
