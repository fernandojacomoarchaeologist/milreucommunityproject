---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07D.2"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 07D.2

Integra este hotfix sobre o 07D.1.

## Preservar

- Portal;
- Museu;
- 31 fotografias;
- modo slide x1/x2/x3;
- Fullscreen API;
- filmstrip;
- MM202617 bloqueado;
- Experiência Proteus no menu.

## Aplicar

1. Carregar `home-carousel.json`.
2. Manter os três destaques na ordem:
   - Museu;
   - Proteus;
   - Inquérito 2026.
3. Manter o link externo do inquérito.
4. Não substituir o empty state Proteus por imagem inventada.
5. Remover o sumário estatístico da entrada do Museu.
6. Manter Voltar ao Museu e X fixos.
7. Garantir que a fotografia imersiva utiliza dimensões automáticas, máximos de 100% e `contain`.
8. Manter título e descrição das iniciativas em blocos separados.

## Validar

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

Testar:

- Home nos três destaques;
- transição automática;
- setas, indicadores e pausa;
- link externo;
- Museu sem sumário;
- imersivo horizontal e vertical;
- Voltar ao Museu;
- X;
- browser fullscreen;
- 1280, 768 e 375 px.

Não publicar automaticamente.
