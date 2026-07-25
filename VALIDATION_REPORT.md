---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08E"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Relatório de validação — Pacote 08E

## Resultado

- Resultado geral: sucesso
- Versão: 0.16.0
- Testes automatizados: 144
- Testes aprovados: 144
- Testes falhados: 0
- Revisão visual humana em navegador: pendente
- Publicação pública automática: desativada

## Fundação colaborativa

- Módulos totais: 15
- Módulos ativos: 12
- Permissões: 52
- Tipos de contributo: 7
- Estados editoriais: 11
- Destinos de incorporação: 6
- Limite de ficheiros por submissão: 5
- Limite por ficheiro: 26214400 bytes

## Fluxo de contributos

- Formulário público: incluído
- Submissão autenticada: incluída
- Acompanhamento por código e e-mail: incluído
- Pedido de retirada: incluído
- Área de contributos do membro: incluída
- Fila de moderação: incluída
- Atribuição de revisores: incluída
- Revisão de direitos: incluída
- Decisões fundamentadas: incluídas
- Propostas de incorporação: incluídas
- Alteração automática do Museu/Portal/Proteus: não
- Consentimento versionado: incluído

## Ficheiros e segurança

- Bucket privado: `community-contributions-private`
- Upload por URL assinada: incluído
- Download por URL assinada: incluído
- Service role no navegador: não
- Service role na Edge Function: sim, como fronteira de servidor
- Rate limit atómico: incluído
- CORS por origens permitidas: incluído
- Honeypot: incluído
- Turnstile: opcional/configurável
- Antivírus integrado: não
- Estado inicial após upload: `scan-pending`
- Acesso público direto aos ficheiros: não
- Insert anónimo direto nas tabelas: não

## Edge Function e banco

- Edge Function: presente
- Migrations novas: 3
- Teste SQL 08E: presente
- Workflow cumulativo 08A–08E: presente
- RLS: presente
- RPC pública de submissão: limitada a `service_role`
- Acompanhamento e retirada: passam pela Edge Function
- Participante pode escolher estado editorial: não
- Execução PostgreSQL/Supabase nesta geração: não

As migrations, as políticas RLS e a Edge Function foram validadas estruturalmente. Este ambiente não possui Supabase CLI, PostgreSQL ou Docker; portanto, a execução real deve ocorrer no workflow, num Supabase local ou em staging.

## Snapshot e build

- Resumo público de contributos: 0 submetidos, 0 em revisão, 0 aceites e 0 incorporados
- Dados pessoais no resumo público: não
- View pública no build: sim
- View colaborativa no build: sim
- Modelo de contributos no build: sim
- Resumo público no build: sim
- Checksum do modelo: sim
- Checksum do resumo: sim
- Callback Google no build: sim
- Páginas estáticas do Museu preservadas: 30
- JSONs individuais do Museu preservados: 30
- Build removido do ZIP para evitar duplicação de imagens

## Comandos

- `npm run collab:config`: sucesso
- `npm run collab:status`: sucesso
- `npm run contributions:demo-export`: sucesso
- `npm run exhibitions:export`: sucesso
- `npm run channels:export`: sucesso
- `npm run museum:index`: sucesso
- `npm run museum:audit`: sucesso
- `npm run validate`: sucesso
- `npm test`: sucesso
- `npm run build`: sucesso
- `npm run smoke`: sucesso
