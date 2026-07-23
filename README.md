---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07B"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 07B — Portal Público e Evolução Incremental

**Versão:** 0.9.0  
**Natureza:** pacote cumulativo e executável, construído sobre o 07A.

O Pacote 07B expande o Portal público sem interromper a evolução do Museu.

## Executar

```bash
npm install
npm run dev
```

Build:

```bash
npm run validate
npm test
npm run build
npm run preview
```

## Portal implementado

- página inicial expandida;
- Projeto;
- Metodologia;
- Iniciativas;
- detalhe de iniciativa;
- Conhecimento e Milreu Proteus;
- Participar;
- Sobre;
- navegação desktop e mobile;
- conteúdo estruturado em `public/data/portal-content.json`.

## Museu preservado e ampliado

Continuam funcionais:

- entrada no Museu;
- galeria;
- filtros;
- detalhe;
- relações;
- registo bloqueado;
- linha temporal;
- modo de ecrã inteiro;
- anterior e seguinte;
- saída por Escape;
- retorno ao Portal.

## Contrato incremental

O modo de ecrã inteiro é uma capacidade permanente do Museu. O pacote inclui um validador de não regressão que bloqueia a remoção acidental da rota, da view, da imagem imersiva, da saída por Escape e da navegação anterior/seguinte.

## Conteúdo e publicação

O Portal usa conteúdos preliminares em pt-PT. Os outros idiomas utilizam fallback enquanto as traduções não forem revistas.

As 31 fotografias e os derivados do 07A permanecem incluídos. `MM202617` continua bloqueado na experiência pública.

## Próximo pacote

07C — evolução completa do Museu, pesquisa, filtros, relações, linha temporal e revisão contextual das 31 fotografias.
