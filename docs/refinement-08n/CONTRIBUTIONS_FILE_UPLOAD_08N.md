---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08N"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Contributos e envio de ficheiros

## Objetivo

Permitir que o voluntário anexe ficheiros no fluxo de contributos, com limite de 10 MB por ficheiro.

## Regras funcionais

1. O utilizador deve ver claramente que pode anexar ficheiro.
2. O limite de tamanho deve estar visível na UI: **até 10 MB**.
3. O utilizador deve receber mensagem clara de erro quando exceder o limite.
4. O contributo pode existir sem ficheiro quando o fluxo do sistema já o permitir.
5. O envio deve respeitar consentimento, privacidade e direitos já definidos no 08E.
6. O contributo não deve ser publicado automaticamente.

## Como os ficheiros devem ser enviados

O Claude deve inspecionar o repositório real e adotar o mecanismo já existente. O relatório final deve explicitar qual foi o padrão usado, preferindo:

- upload para storage privado via backend controlado; ou
- upload via URL assinada gerada no backend.

Em todos os casos:

- `service_role` não entra no browser;
- o ficheiro não vai para o Git;
- o ficheiro não fica público por omissão;
- o contributo guarda apenas a referência necessária.

## Validação

### Cliente
- limite de 10 MB;
- feedback de erro;
- estado de upload;
- remoção/cancelamento quando suportado.

### Servidor
- reforçar limite quando o backend real o permitir;
- validar tipo ou whitelist real do projeto;
- rejeitar tamanhos acima do limite.

## UI mínima

A secção deve incluir uma nota curta como:

- “Pode anexar ficheiros até 10 MB.”
- “Os ficheiros são enviados de forma privada e ficam sujeitos a revisão.”

## Tipos de ficheiro

Não inventar tipos sem verificar o código real. Se for necessário criar uma whitelist, ela deve ser mínima, explícita e relatada pelo Claude.
