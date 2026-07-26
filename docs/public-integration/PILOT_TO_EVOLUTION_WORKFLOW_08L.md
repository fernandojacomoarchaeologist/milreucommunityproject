---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08L"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Do piloto à evolução

## Regra de evidência

O sistema não gera automaticamente decisões a partir das métricas. Ele ajuda a reunir e tornar explícita a evidência.

## Fluxo

### 1. Seleção de fontes

Uma pessoa autorizada seleciona:

- observações do piloto;
- métricas;
- sessões;
- gates;
- tarefas;
- incidentes;
- resultados de testes;
- revisão humana.

### 2. Formulação do achado

O achado deve responder:

- o que foi observado;
- em qual contexto;
- com quais perfis;
- em quantas ocorrências;
- qual é a severidade;
- qual é a confiança;
- quais limitações existem;
- qual informação ainda falta.

### 3. Revisão de evidência

Estados:

- `draft`;
- `under-review`;
- `accepted`;
- `rejected`;
- `needs-more-evidence`.

### 4. Proposta de evolução

Somente achados aceites podem sustentar proposta. A proposta inclui:

- alteração pretendida;
- benefício esperado;
- riscos;
- alternativa de não alterar;
- esforço qualitativo;
- dependências;
- critérios de aceitação;
- plano de verificação;
- impacto público ou interno.

### 5. Decisão

Decisões:

- `approve`;
- `approve-with-conditions`;
- `defer`;
- `reject`;
- `request-more-evidence`.

A decisão deve ter responsável, data e racional.

### 6. Execução

A proposta aprovada pode criar ou ligar:

- tarefa;
- iniciativa;
- incidente;
- pacote futuro;
- decisão editorial;
- ajuste de formação;
- mudança de suporte.

O 08L não cria um backlog paralelo quando já existe módulo de tarefas.

### 7. Verificação

Após implementação:

- repetir cenário;
- comparar evidência;
- registar resultado;
- confirmar se o problema foi resolvido;
- identificar regressões;
- encerrar ou reabrir.

## Priorização assistida

Pode apresentar critérios, nunca uma prioridade absoluta automática:

- severidade;
- risco;
- número de perfis;
- frequência;
- confiança da evidência;
- esforço qualitativo;
- dependências;
- reversibilidade;
- urgência legal, ética ou de segurança.

Não criar fórmula opaca ou pontuação que substitua decisão humana.
