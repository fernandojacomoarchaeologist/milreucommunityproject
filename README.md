---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 08A — Fundação da Área Colaborativa

**Versão:** 0.12.0  
**Base cumulativa:** 07D.3.

Este pacote cria o esqueleto executável de uma área interna para voluntários, colaboradores, revisores, investigadores e coordenação.

## O que funciona

- rota pública para entrada;
- login Google através do Supabase, quando configurado;
- callback PKCE estático;
- sessão e logout;
- modo local de demonstração;
- cadastro com nome, e-mail e perfil principal;
- pedido de acesso pendente;
- perfil próprio;
- dashboard condicionado por permissões;
- fundação da gestão de perfis;
- master configurável por e-mail, sem hardcode;
- migrations, RPCs, auditoria e RLS.

## Módulos preparados

- tarefas;
- contributos;
- agenda e exposições;
- biblioteca;
- formação;
- revisão do Museu;
- gestão de exposições.

Estes módulos são esqueletos e serão desenvolvidos em pacotes posteriores.

## Executar em demonstração

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:4173/#/area-colaborativa
```

A página permite simular:

- um utilizador com pedido pendente;
- o master do sistema.

Os dados de demonstração permanecem apenas no `localStorage`.

## Configurar Supabase e Google

```bash
MILREU_SUPABASE_URL="..." \
MILREU_SUPABASE_PUBLISHABLE_KEY="..." \
MILREU_SITE_URL="http://localhost:4173/" \
npm run collab:config
```

Aplicar as migrations em ambiente local ou staging. Depois configurar Google OAuth no Google Cloud e no Supabase.

## Definir o master

O e-mail real não é incluído no pacote.

```bash
MILREU_SUPABASE_URL="..." \
SUPABASE_SERVICE_ROLE_KEY="..." \
MILREU_MASTER_EMAIL="..." \
npm run collab:bootstrap-master
```

O utilizador precisa ter entrado com Google pelo menos uma vez.

## Validar

```bash
npm run collab:status
npm run validate
npm test
npm run build
npm run smoke
```

## Estado

O 08A avalia a viabilidade da fundação. Não implementa ainda o sistema completo de voluntariado, o calendário visual nem a revisão editorial do Museu.
