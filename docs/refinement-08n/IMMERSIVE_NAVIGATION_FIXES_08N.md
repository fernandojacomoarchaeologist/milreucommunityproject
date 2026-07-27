---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08N"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Correções de navegação na experiência imersiva

## Problema reportado

As rotas para voltar ao portal ainda não estão funcionais na experiência imersiva.

## Resultado esperado

As ações de saída e retorno devem funcionar de forma previsível. O utilizador deve conseguir:

- fechar o modo imersivo;
- regressar ao Museu ou ao Portal conforme o controlo usado;
- não ficar preso numa rota quebrada;
- usar botões claros de retorno;
- preservar contexto quando apropriado.

## Regras

1. Não redesenhar o imersivo inteiro.
2. Corrigir o destino das rotas e os handlers necessários.
3. Testar comportamento em navegação direta e por histórico.
4. Garantir que o botão de voltar visual e o fecho funcionam.
5. Garantir que a navegação não quebra ao abrir uma memória diretamente.

## Casos mínimos de teste

- entrar no imersivo a partir do Portal;
- sair do imersivo pelo botão próprio;
- usar retorno ao Museu;
- usar retorno ao Portal;
- abrir por link direto e sair;
- testar em mobile e desktop.
