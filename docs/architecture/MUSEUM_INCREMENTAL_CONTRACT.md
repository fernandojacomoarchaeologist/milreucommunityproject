---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07B"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Contrato de evolução incremental do Museu

O Museu deve evoluir sem perder capacidades já entregues.

## Capacidades permanentes

- rota da galeria;
- rota de detalhe;
- rota de ecrã inteiro;
- imagem `immersive`;
- anterior e seguinte;
- saída por Escape;
- retorno ao detalhe;
- retorno ao Projeto;
- fallback de idioma;
- bloqueio de registos não publicáveis.

## Regra de não regressão

Nenhum pacote do Portal pode remover ou degradar estas capacidades.

## Ecrã inteiro

O modo imersivo deve:

- ocupar o viewport;
- usar a maior variante disponível;
- preservar proporção;
- evitar corte obrigatório;
- possuir legenda e crédito;
- permitir teclado;
- permitir anterior e seguinte;
- sair de forma previsível.

O validador `npm run validate:museum-regression` é obrigatório.
