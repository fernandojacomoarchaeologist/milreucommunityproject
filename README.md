---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 05F — Infraestrutura, Persistência, CI e Skills de Desenvolvimento

**Versão:** 0.6.0  
**Estado:** pronto para integração controlada  
**Dependências conceptuais:** Pacotes 01–05E

Este pacote prepara o Projeto Comunitário de Milreu para:

- utilizar o Supabase como infraestrutura operacional do **Milreu Proteus**;
- permitir que Claude Code manipule estruturas e dados nos ambientes autorizados;
- impedir escrita direta e não aprovada em produção;
- versionar migrations, políticas e snapshots públicos no Git;
- gerir fontes privadas fora do repositório público;
- executar validações reproduzíveis em CI;
- preparar o Gate A de revisão visual antes do Pacote 06;
- fornecer uma coleção de skills operacionais para desenvolvimento seguro.

## Decisão estrutural

O modelo adotado é híbrido:

```text
GitHub público
├── código, schemas, migrations e documentação
├── snapshots públicos aprovados
├── JSON e JSON-LD
├── CI e releases
└── GitHub Pages

Supabase — Milreu Proteus
├── rascunhos e dados operacionais
├── submissões e revisões
├── direitos, consentimentos e moderação
├── histórico e autenticação
└── armazenamento privado

Armazenamento documental privado
├── original do livro e outras fontes protegidas
└── backup independente do repositório
```

## Regra central para Claude

Claude pode:

- criar e alterar migrations no Git;
- executar localmente e em ambientes de teste;
- consultar produção em modo estritamente autorizado e preferencialmente por views seguras;
- preparar alterações produtivas para revisão;
- acionar um workflow produtivo apenas quando o utilizador o solicitar expressamente.

Claude não pode:

- executar DDL ou DML produtivo diretamente a partir da sessão local;
- utilizar `service_role` no frontend;
- expor segredos;
- apagar, truncar ou sobrescrever dados produtivos sem migration, rollback, ticket e aprovação;
- editar manualmente snapshots públicos gerados;
- descarregar ou publicar fontes privadas sem autorização.

## O que este pacote ainda não faz

- não cria o modelo final de narrativas e moderação, reservado ao Pacote 09;
- não cria o Portal ou o Museu;
- não cria um projeto Supabase remoto automaticamente;
- não contém credenciais;
- não promove automaticamente o POC a produção;
- não corrige pendências editoriais dos 31 registos;
- não substitui a revisão visual humana.

## Integração

Começar por `PROMPT_CLAUDE.md` e seguir `INTEGRATION_CHECKLIST.md`.
