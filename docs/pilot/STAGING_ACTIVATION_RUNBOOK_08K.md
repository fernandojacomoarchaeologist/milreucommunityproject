---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08K"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Runbook de ativação de staging

## Princípio

Os comandos do pacote podem verificar e preparar. A execução real ocorre num terminal protegido, sob controlo do responsável pelo ambiente. Nunca pedir secrets no chat.

## Etapa 1 — Preparação

Confirmar fora do repositório:

- projeto Supabase de staging;
- projeto Supabase de produção separado;
- URL da aplicação de staging;
- callbacks autorizados;
- Google OAuth;
- e-mail do master;
- acesso ao Supabase CLI e Docker quando necessário;
- responsável pela operação;
- notice do piloto;
- coorte e janela temporal.

## Etapa 2 — Preflight

Executar os contratos existentes do 08G e 08J antes do 08K:

```bash
npm ci
npm run validate:08j
npm test
npm run e2e:08j
npm run build
npm run smoke
npm run rc:evaluate
npm run deploy:preflight
```

A RC técnica deve estar `ready`. Staging pode continuar `blocked` até os passos seguintes.

## Etapa 3 — Base de dados

Em staging:

1. comparar histórico de migrations;
2. executar dry-run;
3. aplicar migrations cumulativas;
4. aplicar migrations 08K;
5. executar testes SQL;
6. validar grants, RLS e funções;
7. guardar evidência sem secrets.

Não reescrever migrations aplicadas.

## Etapa 4 — OAuth e master

- validar provider Google;
- validar callback Supabase;
- validar callback da aplicação;
- executar bootstrap do master com variável segura;
- testar proteção do último master;
- remover contas ou permissões temporárias de setup quando aplicável.

## Etapa 5 — Storage

- confirmar buckets privados existentes;
- criar/configurar bucket privado do piloto se necessário;
- testar upload autorizado;
- testar leitura negada por outro utilizador;
- testar URL assinada e expiração;
- testar remoção protegida;
- guardar evidência redigida.

## Etapa 6 — Internal smoke

Cobertura mínima:

- anónimo;
- pendente;
- participante;
- revisor;
- tradutor;
- coordenador;
- master.

O smoke deve validar acesso permitido e negado, não apenas caminhos felizes.

## Etapa 7 — Backup e rollback

Antes da coorte real:

- registar backup inicial;
- validar restauração em ambiente seguro ou procedimento aprovado;
- confirmar rollback de aplicação;
- confirmar resposta a publicação acidental;
- confirmar contacto operacional fora do código.

## Etapa 8 — Abrir o piloto

Somente após gates de entrada aprovados. A abertura deve ser uma transição explícita e auditada.

## Comandos novos esperados

```bash
npm run pilot:validate
npm run pilot:readiness
npm run pilot:scenario-matrix
npm run pilot:evidence-bundle
npm run pilot:gates
npm run validate:08k
```

Esses comandos não podem aplicar migrations remotas, configurar OAuth ou aprovar staging automaticamente.
