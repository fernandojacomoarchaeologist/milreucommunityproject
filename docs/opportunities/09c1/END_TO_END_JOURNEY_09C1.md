---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09C.1"
---

# Jornada ponta a ponta obrigatória

## Fluxo principal

1. master cria uma oportunidade em rascunho;
2. master pré-visualiza sem a tornar pública;
3. master publica;
4. visitante anónimo encontra e abre a URL pública;
5. visitante seleciona “Tenho interesse”;
6. autentica-se e regressa à mesma oportunidade;
7. completa apenas os campos mínimos em falta;
8. confirma a candidatura e recebe estado `submitted`;
9. master consulta a candidatura sem expor dados a terceiros;
10. master aceita ou marca como não selecionada;
11. candidato consulta o resultado na sua área;
12. página pública continua sem revelar nomes ou estados pessoais.

## Fluxos complementares

- candidato retira candidatura elegível;
- master encerra candidaturas sem apagar a oportunidade;
- master cancela oportunidade com comunicação de estado;
- master remove participante aceite com justificação interna;
- capacidade máxima impede novas candidaturas de modo honesto;
- submissão duplicada não cria duplicados;
- utilizador não regressa a uma URL aberta ou manipulada após autenticação;
- menor continua bloqueado de acordo com a política atual.

O E2E deve atravessar a interface e o backend real do ambiente de teste. Chamadas diretas a RPC podem complementar, mas não substituir, o percurso visual.
