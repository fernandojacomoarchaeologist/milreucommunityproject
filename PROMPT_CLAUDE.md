---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08E"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 08E

Integra cumulativamente o 08E sobre o 08D.

## Objetivo

Ativar contributos comunitários e moderação sem publicar automaticamente conteúdo, ficheiros ou dados pessoais.

## Preservar

- Portal e Museu;
- MM202617 em revisão;
- Proteus;
- autenticação Google;
- membros;
- tarefas;
- agenda e exposições;
- RLS;
- gates de lançamento;
- separação entre público e interno.

## Integrar

1. Mesclar as três migrations 08E.
2. Integrar a Edge Function `community-contribution-intake`.
3. Integrar modelo, rotas, views, controller, estilos, testes e workflows.
4. Preservar o bucket como privado.
5. Configurar secrets apenas no ambiente Supabase.
6. Executar:

```bash
npm ci
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

7. Executar os testes SQL cumulativos.
8. Testar a Edge Function em staging.

## Regras

- visitante não consulta tabelas diretamente;
- anon não recebe permissão de insert nas tabelas;
- entrada pública passa pela Edge Function;
- ficheiros permanecem privados;
- URLs de upload e download expiram;
- service role existe apenas na Edge Function;
- notas internas não são devolvidas no acompanhamento;
- nomes de participantes não são publicados;
- contribuição aceite gera proposta, não alteração canónica;
- retirada mantém histórico de auditoria;
- não declarar ficheiro como seguro apenas por ter sido recebido.

## Testes manuais

### Público

- texto sem ficheiro;
- fotografia;
- cinco ficheiros;
- ficheiro acima do limite;
- tipo não permitido;
- honeypot;
- limite de pedidos;
- acompanhamento correto;
- acompanhamento com e-mail incorreto;
- retirada;
- código inválido.

### Membro

- submissão autenticada;
- acompanhamento;
- ficheiros próprios;
- isolamento entre membros.

### Moderação

- triagem;
- atribuição;
- pedido de informação;
- revisão de direitos;
- aceitação parcial;
- recusa;
- proposta Museu;
- proposta Proteus;
- retirada;
- ficheiro aceite e rejeitado;
- URL temporária;
- ausência de atualização canónica.

Não publicar automaticamente o projeto.
