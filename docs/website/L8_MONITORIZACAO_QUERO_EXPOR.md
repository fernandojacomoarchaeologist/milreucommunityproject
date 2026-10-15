# L8 — Monitorização do formulário «Quero expor»

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.

Componente permanente do Item 2. Nasceu do incidente de 2026-10-15 (`docs/website/INCIDENTE_2026-10-15_QUERO_EXPOR.md`): o endpoint da função deixou de resolver no DNS e ninguém deu por isso.

## Arquitectura
- **Workflow:** `.github/workflows/l8-expor-monitor.yml`.
  - Corre a **cada 30 min** (minutos 07 e 37, UTC) e manualmente (`workflow_dispatch`).
  - O GitHub pode atrasar execuções agendadas em horas de pico.
- **Script:** `scripts/monitor/expor-health.mjs` (Node 22, sem dependências).
- **Endpoint verificado:** o que **o site publicado usa** (`/public/config/collaborative-area.runtime.json`).
  - Recurso: a variável `MILREU_EXPOR_ENDPOINT`.
  - Diferença entre as duas = aviso de desvio de configuração.
- **Sequência por execução:**
  1. **DNS** do domínio da função (resolvedores 1.1.1.1 e 8.8.8.8, 5 s × 2);
  2. **TLS** (certificado validado, SNI, 10 s);
  3. **OPTIONS** com `Origin: https://projectomilreu.pt`: esperado 2xx e `Access-Control-Allow-Origin` = site (o pré-pedido CORS que o browser faz);
  4. **GET**: esperado **405 `method_not_allowed`**. É uma resposta *não-2xx esperada* e prova que o código da função corre.
- **Nunca** faz POST de propostas nem envia e-mails.
  - Cada execução são 2 invocações leves da função: ~2 900/mês, muito abaixo da quota do plano.
  - **Sem secrets**: só o `GITHUB_TOKEN` da execução, para as issues de alerta.

## Estados

| Estado | Quando |
|---|---|
| `HEALTHY` | DNS, TLS, CORS e função a responder |
| `DEGRADED` | 1 verificação com falha (transitória) ou comportamento inesperado isolado |
| `DOWN` | **2 verificações consecutivas com falha** |
| `RECOVERED` | 1.ª verificação boa depois de `DOWN` (passa a `HEALTHY` na seguinte) |
| `UNKNOWN` | sem dados (primeira execução, cache expirada ou monitor sem endpoint válido). Não altera o estado de disponibilidade |

Tipos de falha: `dns` · `timeout` · `tls` · `connection` · `server_error` (5xx, ex. 540 projecto pausado) · `not_found` (404, função inexistente) · `cors_mismatch` (origem do site não autorizada) · `unexpected_status`.

**Limite:** `HEALTHY` prova que a função está **acessível**. **Não prova que o Resend entrega os e-mails.** A confirmação da entrega exige uma proposta de teste autorizada (plano de teste do incidente, §4).

## Alertas (o que é automático)
- **Ao entrar em `DOWN`:** o workflow abre **uma** issue com a etiqueta `l8-monitor`, com:
  - data/hora UTC, componente, tipo de falha, detalhe técnico;
  - endpoint abreviado;
  - ligação para a execução (evidência).
- **Sem repetição:**
  - enquanto continua `DOWN`, não há novos alertas;
  - se o estado se perder e voltar a `DOWN`, é acrescentado um comentário à issue já aberta, não uma nova.
- **Recuperação:** comentário «Recuperado em … (UTC)», com o aviso sobre o Resend, e **fecho automático** da issue.
- **Monitor cego** (4 execuções seguidas sem dados = 2 h): uma issue própria.
- Se a API do GitHub falhar, o alerta fica pendente e é repetido na execução seguinte.
- O job **não falha** por o serviço estar em baixo. Assim evita-se um e-mail «run failed» a cada 30 min; só falha se o próprio script partir.

**O que depende das definições da conta:** a notificação de uma issue nova chega por e-mail ou pela app do GitHub conforme as definições de *Notifications* e de *Watch* do repositório.
- Por omissão, o dono de um repositório recebe notificações de todas as issues («Watching»).
- **Confirmar** que o repositório está em *Watching → All activity* (ou *Custom → Issues*) e que o e-mail de notificações está activo.

## Histórico e retenção
- **Estado entre execuções:** cache do Actions (`l8-state-<run_id>`).
  - Guarda o estado actual, o número de falhas, a issue aberta e as **últimas 96 verificações (48 h)**: data, resultado, componente e tipo, **sem dados de visitantes**.
  - O GitHub remove entradas não usadas ao fim de 7 dias e aplica um limite total por repositório.
- **Evidência de cada execução:** resumo no *job summary* e registo do workflow, retidos pelo período de retenção do repositório (90 dias por omissão).
- **Sem artifacts**, sem tabelas, sem migrations.

## Limitações conhecidas
- Execuções agendadas podem atrasar; em repositórios públicos, o GitHub **desactiva workflows agendados após 60 dias sem actividade no repositório**.
- Monitoriza a partir dos runners do GitHub (EUA/UE), não da rede de cada visitante.
- Não verifica o envio de e-mail nem a caixa de entrada.

## Rollback
Desactivar sem apagar: *Actions → L8 Quero expor monitor → Disable workflow*. Ou PR de *revert* do merge do L8.

Não há dados a limpar além de, opcionalmente, issues `l8-monitor` e entradas de cache `l8-state-*`, que expiram sozinhas.

## Testes
`tests/l8-expor-monitor.test.mjs`, determinísticos e sem rede:
- DNS NXDOMAIN;
- timeout (DNS/TLS/HTTP);
- TLS inválido ou expirado;
- endpoint disponível (com o 405 esperado);
- respostas inesperadas (503, 540, 404, CORS errado, 301, GET 200);
- 2 falhas → `DOWN`; recuperação → `RECOVERED`;
- supressão de duplicados;
- monitor cego;
- configuração ilegível ou desviada;
- erro da API do GitHub, com alerta repetido;
- workflow com permissões mínimas e Actions por SHA.
