---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08K"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Definição do sistema do piloto

## Objetivo funcional

O sistema deve permitir planear, executar, acompanhar e encerrar um piloto controlado da Área Colaborativa em staging, mantendo rastreabilidade entre:

```text
release técnica
→ ativação de staging
→ ciclo de piloto
→ participantes
→ cenários
→ sessões
→ observações
→ evidências
→ correções
→ gates
→ homologação de staging
```

## Componentes

### 1. Ciclo de piloto

Representa uma execução delimitada, ligada a:

- uma versão/release;
- um ambiente de staging;
- uma execução de homologação;
- objetivos e escopo;
- datas configuráveis;
- responsável;
- estado;
- gates de entrada e saída.

### 2. Coorte

Lista restrita de membros ativos inscritos no ciclo. Deve distinguir:

- participante;
- facilitador;
- observador autorizado.

A coorte não é inferida por função, perfil ou login.

### 3. Cenários

Unidades controladas de validação. Cada cenário contém:

- código estável;
- módulo e rota;
- perfil-alvo;
- pré-condições;
- instruções;
- resultado esperado;
- evidência requerida;
- criticidade;
- carácter obrigatório ou opcional.

### 4. Sessões

Registam a execução concreta de um ou mais cenários por participante, com:

- agendamento;
- facilitador;
- ambiente;
- presença;
- nível de apoio;
- resultado;
- bloqueios;
- observações.

### 5. Feedback e observações

Permitem registar:

- falha funcional;
- dificuldade de usabilidade;
- problema de acessibilidade;
- risco de conteúdo, direitos ou privacidade;
- problema de desempenho;
- necessidade de suporte;
- sugestão.

Observações podem ser ligadas a tarefas ou incidentes existentes, sem duplicar os módulos 08C e 08I.

### 6. Evidências

Podem incluir:

- captura de ecrã;
- log;
- documento;
- export técnico;
- registo de aprovação;
- métrica;
- outro ficheiro autorizado.

Devem ter classificação, checksum, estado de redação, retenção e referência privada.

### 7. Métricas

O sistema produz snapshots internos, sem ranking público de pessoas. As métricas servem para decisões de produto e operação.

### 8. Gates

Os gates distinguem:

- entrada no piloto;
- continuidade do piloto;
- encerramento do ciclo;
- homologação de staging;
- produção, que permanece bloqueada.

## Fases operacionais

1. `preparation` — recursos, coorte, notice e cenários.
2. `staging-activation` — Supabase, OAuth, master, migrations, RLS, storage e backup.
3. `internal-smoke` — master e coordenação validam segurança e operação.
4. `role-based-pilot` — fluxos por perfil.
5. `assisted-community-pilot` — participantes restritos e acompanhados.
6. `evaluation` — triagem, métricas, correções e repetição de cenários.
7. `closure` — decisão de homologação ou novo ciclo.

## Resultado permitido

O ciclo pode terminar como:

- `completed-homologated`;
- `completed-with-follow-up`;
- `blocked`;
- `cancelled`.

Somente `completed-homologated`, com todos os gates bloqueadores aprovados, pode sustentar a homologação de staging.
