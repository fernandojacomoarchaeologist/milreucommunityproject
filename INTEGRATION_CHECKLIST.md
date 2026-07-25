---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08E"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Checklist de integração — 08E

## Não regressão

- [ ] Portal
- [ ] Museu
- [ ] MM202617
- [ ] Proteus
- [ ] Google Auth
- [ ] membros
- [ ] tarefas
- [ ] agenda
- [ ] exposições

## Banco

- [ ] migrations 08E
- [ ] consentimento ativo
- [ ] RLS em todas as tabelas
- [ ] bucket privado
- [ ] sem insert anon direto
- [ ] RPC pública apenas service role
- [ ] tracking limitado
- [ ] retirada
- [ ] proposta de incorporação
- [ ] teste SQL

## Edge Function

- [ ] deploy
- [ ] RATE_LIMIT_SALT
- [ ] ALLOWED_ORIGINS
- [ ] Turnstile opcional
- [ ] CORS
- [ ] rate limit
- [ ] honeypot
- [ ] upload assinado
- [ ] confirmação de upload
- [ ] download assinado
- [ ] service role apenas no servidor

## Público

- [ ] formulário
- [ ] fotografia
- [ ] testemunho
- [ ] correção
- [ ] documento
- [ ] referência
- [ ] direitos
- [ ] máximo 5 ficheiros
- [ ] máximo 25 MB
- [ ] tipos permitidos
- [ ] código de acompanhamento
- [ ] acompanhamento com código e e-mail
- [ ] pedido de retirada
- [ ] sem notas internas
- [ ] sem ficheiros públicos

## Área Colaborativa

- [ ] lista própria
- [ ] nova submissão
- [ ] detalhe próprio
- [ ] fila de moderação
- [ ] filtros
- [ ] atribuição
- [ ] triagem
- [ ] pedido de informação
- [ ] decisão
- [ ] revisão de direitos
- [ ] ficheiros
- [ ] proposta de incorporação
- [ ] retirada

## Segurança e direitos

- [ ] texto revisto pelo DPO
- [ ] versão do consentimento
- [ ] preferência de crédito
- [ ] âmbito autorizado
- [ ] declaração de legitimidade
- [ ] não transferência automática
- [ ] mecanismo de retirada
- [ ] histórico de auditoria
- [ ] antivírus ou procedimento técnico definido

## Qualidade

- [ ] `npm run validate`
- [ ] `npm test`
- [ ] `npm run build`
- [ ] `npm run smoke`
- [ ] Supabase local
- [ ] staging
- [ ] desktop
- [ ] tablet
- [ ] telemóvel
