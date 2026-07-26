---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08K"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Workflow e transições

## Ciclo

```text
draft
→ preparing
→ ready
→ running
→ evaluating
→ completed
```

Transições laterais:

- `running → paused → running`;
- qualquer estado operacional pode ir para `blocked`;
- `draft|preparing|ready|paused|blocked → cancelled`;
- `blocked → preparing|running` apenas após resolução documentada.

## Gate para `ready`

Exige:

- ambiente staging configurado;
- migrations aplicadas e testadas;
- Google OAuth funcional;
- master ativo;
- coorte definida;
- notice operacional aprovado;
- cenários obrigatórios configurados;
- storage privado validado;
- backup inicial e plano de restauração;
- zero bloqueadores de segurança/RLS.

## Gate para `running`

Exige:

- internal smoke aprovado;
- participantes confirmados;
- sessões configuradas;
- canal de suporte definido;
- pessoa responsável por incidentes definida fora do código;
- produção e efeitos públicos desativados.

## Participação

```text
invited
→ confirmed
→ active
→ completed
```

Saídas:

- `invited|confirmed|active → withdrawn`;
- `invited|confirmed|active → removed`, somente por gestão e com motivo.

## Sessão

```text
scheduled
→ in-progress
→ completed
```

Alternativas:

- `scheduled|in-progress → blocked`;
- `scheduled → cancelled`;
- sessão bloqueada pode ser reagendada como nova sessão, preservando histórico.

## Observação

```text
new
→ triaged
→ accepted
→ planned
→ resolved
```

Alternativas:

- `triaged → rejected`;
- `triaged → duplicate`;
- observação crítica de segurança, privacidade, perda de dados ou RLS deve:
  - bloquear o cenário;
  - bloquear o ciclo quando aplicável;
  - gerar ou ligar um incidente;
  - impedir homologação.

## Retirada

A retirada do piloto:

- não elimina automaticamente auditoria;
- remove futuras sessões;
- bloqueia novos contactos do piloto;
- preserva o mínimo necessário segundo decisão de retenção;
- não afeta automaticamente o vínculo geral da Área Colaborativa;
- deve ser distinta de pedido de retirada de um contributo comunitário.
