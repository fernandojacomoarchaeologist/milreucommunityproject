# Governação da release candidate — Pacote 08J

A release é dividida em três camadas: técnica local, homologada em staging e aprovada para produção.

A camada técnica pode ser aprovada por evidência reproduzível do repositório. As outras duas exigem recursos e decisões externas. O estado deve permanecer `blocked` ou `pending` até que a evidência exista.

Nenhum comando do 08J aplica migrations remotas, configura OAuth, faz bootstrap do master, ativa e-mail, executa retenção ou escreve em produção.

## Estado RC1

- técnica local: `ready`;
- staging: `blocked`;
- produção: `blocked`.

A evidência inclui 307/307 testes, 394/394 verificações E2E, 12/12 checks da baseline de acessibilidade, build e smoke HTTP. Os bloqueios externos e humanos estão enumerados em `reports/RELEASE_CANDIDATE_08J.md`.


---

© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.
