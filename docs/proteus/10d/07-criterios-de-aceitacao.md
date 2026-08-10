<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 07 — Critérios de aceitação

Espelham a `ACCEPTANCE_MATRIX.md` do pacote. Cada linha é `PASS`, `FAIL` ou `BLOCKED`; nenhuma
linha bloqueada pode ser convertida em sucesso por interpretação.

| ID | Critério | Como é evidenciado |
|---|---|---|
| 10D-01 | Base exata, identidade e árvore limpa | recibo PROJECT GATE |
| 10D-02 | Campo legado classificado sem correção inferida | `06-decisoes-abertas.md` D-10D-02 + validador |
| 10D-03 | Contratos JSON válidos e usados | `validate:10d` + testes |
| 10D-04 | Gerador determinista e offline | duas execuções byte-idênticas; validador regenera e compara |
| 10D-05 | Só `published` + API `allow` é elegível | testes positivos |
| 10D-06 | Unknown/deny/ausente é excluído | testes negativos |
| 10D-07 | Outputs iniciais com 0 itens reais | os seis JSON + testes |
| 10D-08 | Exclusões não revelam identidade/contagem | teste de não-revelação + varredura |
| 10D-09 | Biblioteca humana preservada | contagens `3/2/1` no validador |
| 10D-10 | Knowledge snapshot `0/0/0` | validador + `public-git-content` |
| 10D-11 | 16 afirmações `in_review` | validador |
| 10D-12 | Rota `/conhecimento/api` funciona | teste de router + E2E |
| 10D-13 | Loading, vazio e erro distintos | teste de vista + E2E |
| 10D-14 | Sem backend, escrita, ingestão, chat ou MCP | validador + inspeção de diff |
| 10D-15 | Sem migrations, papéis, permissões ou dependências | validador + diff de `package.json` |
| 10D-16 | Sem dados pessoais, privados ou texto integral | varredura nos exports |
| 10D-17 | `baseline` e `public-git-content` passam | logs dos *gates* |
| 10D-18 | Toda a suíte, build e smoke passam | logs |
| 10D-19 | Diff contido nos caminhos exatos | POSTFLIGHT |
| 10D-20 | PR funcional mantém `0.38.1 / 10C.1` | diff de metadados |
| 10D-21 | PR aberto sem merge | URL/estado do PR |

© 2026 Fernando Rodrigues de Jácomo.
