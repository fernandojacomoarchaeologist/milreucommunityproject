---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 08G — Implantação, Google OAuth e Homologação

**Versão:** 0.18.0  
**Base cumulativa:** Pacote 08F.

O 08G não cria uma nova experiência pública. Ele prepara a Área Colaborativa para funcionar fora da demonstração, com ambientes separados, Google OAuth, master configurável, testes de RLS, storage privado e homologação por perfil.

## Ambientes

```text
local
→ staging
→ produção
```

Regras:

- staging e produção usam projetos Supabase distintos;
- demonstração só existe em local;
- staging e produção exigem HTTPS;
- produção não aceita reset;
- migrations passam por dry-run;
- produção exige homologação aprovada em staging para a mesma versão;
- nenhuma escrita de produção é ativada pelo preflight.

## Configuração local

```bash
cp .env.example .env
npm install
npm run deploy:profile
npm run deploy:preflight
npm run deploy:oauth-check
npm run collab:config
npm run dev
```

## Google OAuth local

O ficheiro `supabase/config.toml` contém a secção:

```toml
[auth.external.google]
enabled = false
client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET)"
redirect_uri = "http://127.0.0.1:54321/auth/v1/callback"
skip_nonce_check = false
```

Para testar localmente, configure as variáveis e ative o provider. O callback registado no Google é o callback do Supabase. A aplicação regressa depois a:

```text
http://localhost:4173/auth/callback/
```

## Master

O e-mail master não está incluído no pacote.

Consulta segura:

```bash
MILREU_SUPABASE_URL="..." SUPABASE_SERVICE_ROLE_KEY="..." npm run deploy:master-status
```

Bootstrap explícito:

```bash
MILREU_SUPABASE_URL="..." SUPABASE_SERVICE_ROLE_KEY="..." MILREU_MASTER_EMAIL="..." MILREU_BOOTSTRAP_MASTER_CONFIRM="BOOTSTRAP_MILREU_MASTER" npm run collab:bootstrap-master
```

A chave administrativa permanece apenas no terminal seguro ou secret store.

## Homologação

Nova rota:

```text
#/area-colaborativa/gestao/homologacao
```

Permite:

- configurar metadados dos ambientes;
- rever política lógica de Google OAuth;
- iniciar execução;
- preencher 24 checks;
- anexar evidências;
- concluir;
- homologar staging;
- bloquear produção sem staging aprovado.

## Staging

O workflow `08g-staging-homologation.yml` é manual.

Por padrão:

- executa preflight;
- valida OAuth;
- liga o projeto de staging;
- executa `supabase db push --dry-run`;
- não aplica migrations;
- não publica functions.

As escritas exigem inputs manuais e ambiente GitHub protegido.

## Validação

```bash
npm run deploy:profile
npm run deploy:preflight
npm run deploy:oauth-check
npm run museum:review-export
npm run museum:review-apply
npm run contributions:demo-export
npm run exhibitions:export
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run smoke
```

As migrations devem ser executadas em Supabase local e staging antes de homologar o ambiente.
