<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Experiência pública inicial

## Rotas desejadas

Adaptar à convenção real após inventário:

- `/proteus` — apresentação e acesso à biblioteca;
- `/proteus/biblioteca` — lista, pesquisa e filtros;
- `/proteus/biblioteca/:slug` — ficha da obra;
- `/proteus/autores/:slug` — perfil factual e obras relacionadas.

Não duplicar rota existente nem quebrar o placeholder do 10A.

## Lista e pesquisa

Pesquisa por título, autor, ano, identificador e publicação. Filtros iniciais: tipo, ano/período, idioma e acesso. Ordenação previsível e URL partilhável quando a arquitetura permitir. Estados de loading, vazio, erro e zero resultados devem ser distintos.

## Ficha pública

Exibir citação sugerida, autoria, dados editoriais, identificadores, acesso/direitos, origem, última revisão e ligação legal. Exibir resumo somente se publicável e com origem. Não mostrar texto integral, notas internas, URLs privadas ou controlos editoriais.

## Autores

Mostrar apenas perfil publicado, fontes e obras publicadas. Se houver apenas autoria bibliográfica sem biografia revista, usar página mínima honesta.

Design, acessibilidade, navegação e i18n seguem o sistema existente. Não usar contagens falsas ou cartões demonstrativos confundíveis com acervo real.
