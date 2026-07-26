---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08J"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Mapa de dependências

```text
01 → 02 → 03 → 04
          ↓
05A → 05B → 05C → 05D → 05E → 05F
                              ↓
                              06
                              ↓
07A → 07B → 07C → 07D → 07D.1 → 07D.2 → 07D.3
                                      ↓
08A → 08B → 08C → 08D → 08E → 08F → 08G → 08H → 08I → 08J
```

## Dependências críticas do 08F

- 03: modelo de dados;
- 04: migração preliminar;
- 05F: Supabase e segurança;
- 07A: imagens e registos;
- 07C: experiência do Museu;
- 07D.3: tratamento de MM202617;
- 08A–08B: autenticação, membros e permissões;
- 08C: tarefas;
- 08E: contributos aceites.

## Saídas do 08F usadas no futuro

- `museum-editorial-approved.json`;
- `public-content-effects.json`;
- formação concluída;
- biblioteca interna;
- propostas aceites;
- decisões e snapshots;
- ledger e registo de impactos.

Pacotes futuros devem alterar páginas públicas através dos contratos e slots registados, sem substituir silenciosamente as integrações anteriores.

## Dependências críticas do 08G

- 05F: Supabase, GitHub e proteção de produção;
- 08A: Google Auth e master;
- 08B: perfis e proteção do último master;
- 08E: storage privado e Edge Function;
- 08F: módulos completos e ledger.

## Saídas do 08G

- perfil de ambiente;
- readiness;
- política de autenticação;
- execuções de homologação;
- checks e evidências;
- gates de staging e produção.

## Dependências críticas do 08H

- 08A/08B: utilizadores, memberships, perfis e convites;
- 08C: tarefas;
- 08D: agenda e exposições;
- 08E: contributos e retirada;
- 08F: formação e revisão do Museu;
- 08G: ambientes, homologação e secrets.

## Saídas do 08H

- centro interno;
- preferências;
- eventos;
- templates;
- outbox;
- deliveries;
- worker webhook;
- runbook;
- fronteiras para o 08I.

## Dependências críticas do 08I

- 08A/08B: identidade, master, perfis e permissões;
- 08C–08F: objetos auditados e dados sob retenção;
- 08G: ambientes, staging, produção e gates;
- 08H: notificações, outbox e worker.

## Saídas do 08I

- três módulos de governação;
- cadeia de auditoria;
- pesquisa e exportação redigidas;
- sete políticas de retenção;
- legal holds;
- incidentes;
- backups declarativos;
- exercícios;
- 20 checks operacionais.


## Dependências críticas do 08J

- 07B–07D.3: Portal, Museu, imersivo e regressão pública;
- 08A–08F: módulos, perfis, jornadas e gates editoriais;
- 08G: ambientes e homologação;
- 08H: notificações;
- 08I: administração, auditoria, retenção e continuidade.

## Saídas do 08J

- modelo da release candidate;
- matriz E2E;
- baseline e checklist de acessibilidade;
- runner Chromium/CDP;
- relatório técnico reproduzível;
- gates externos e humanos preservados.

## 08K → depende de 08J (v0.21.0)

O 08K assenta na release candidate técnica do 08J e integra-se com a homologação (08G), operações/auditoria/incidentes (08I), tarefas (08C) e notificações internas (08H). Não cria migrations sobre as anteriores; adiciona `20260726080000/080100/080200`. Não ativa infraestrutura remota nem aprova staging por teste local.

## 08L → depende de 08K (v0.22.0)

O 08L assenta no piloto (08K) e integra-se com homologação (08G), operações/auditoria (08I), tarefas/formação (08C) e notificações internas (08H). Adiciona migrations `20260726090000/090100/090200`. Não ativa efeitos públicos nem produção.
