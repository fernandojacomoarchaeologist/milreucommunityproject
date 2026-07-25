---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08E"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 08E — Contributos Comunitários e Moderação

**Versão:** 0.16.0  
**Base cumulativa:** Pacote 08D.

Este pacote ativa a recolha estruturada de fotografias, testemunhos, correções, documentos, referências e questões de direitos.

## Rotas públicas

```text
#/participar/contribuir
#/participar/contribuir/acompanhar
#/participar/retirada
```

## Rotas da Área Colaborativa

```text
#/area-colaborativa/contributos
#/area-colaborativa/contributos/novo
#/area-colaborativa/contributos/:id
#/area-colaborativa/gestao/contributos
#/area-colaborativa/gestao/contributos/:id
```

## Tipos de contributo

- fotografia;
- testemunho ou memória;
- correção;
- documento;
- referência;
- direitos ou crédito;
- outro.

## Fluxo

```text
submitted
→ triage
→ under-review
→ accepted | partially-accepted | rejected
→ incorporation proposal
→ incorporated
```

Também existem:

- `needs-info`;
- `withdrawn`;
- `archived`.

## Ficheiros

Os ficheiros são guardados num bucket privado:

```text
community-contributions-private
```

O acesso ocorre por URLs temporárias assinadas. O frontend nunca recebe `service_role`.

Estados de ficheiro:

```text
upload-pending
→ scan-pending
→ accepted | rejected | deleted
```

O pacote não inclui motor antivírus. `scan-pending` indica que a verificação técnica continua pendente.

## Consentimento e direitos

Cada submissão regista:

- versão do consentimento;
- aceitação de privacidade;
- declaração de legitimidade;
- âmbito inicialmente autorizado;
- preferência de crédito;
- autorização de contacto;
- autorização de atribuição pública.

A submissão:

- não transfere automaticamente direitos;
- não garante publicação;
- não altera conteúdo canónico;
- pode receber pedido de informação;
- pode ser objeto de correção ou retirada.

## Edge Function

A entrada pública utiliza:

```text
supabase/functions/community-contribution-intake
```

A função suporta:

- submissão;
- URLs assinadas para upload;
- confirmação de upload;
- acompanhamento;
- retirada;
- URL temporária para ficheiros autorizados.

## Configuração

```bash
supabase secrets set   RATE_LIMIT_SALT="..."   ALLOWED_ORIGINS="http://localhost:4173,https://dominio-publico"
```

Opcionalmente:

```bash
supabase secrets set TURNSTILE_SECRET_KEY="..."
```

No frontend:

```bash
MILREU_TURNSTILE_SITE_KEY="..." npm run collab:config
```

A integração visual do widget Turnstile permanece condicionada à decisão de ativá-lo.

## Demonstração

```bash
npm install
npm run dev
```

Os dados demonstrativos:

- usam e-mails `.invalid`;
- são locais;
- não representam pessoas ou documentos reais;
- não criam ficheiros no Supabase.

## Validação

```bash
npm run collab:config
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

As migrations e a Edge Function devem ser testadas em Supabase local ou staging antes de qualquer uso público.
