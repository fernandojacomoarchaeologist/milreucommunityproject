---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08A"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 08A

Integra o 08A cumulativamente sobre o 07D.3.

## Objetivo

Criar a fundação da Área Colaborativa sem transformar esta release num sistema completo.

## Preservar

- Portal;
- Museu;
- modo imersivo e slideshow;
- carrossel da Home;
- Experiência Proteus;
- laboratório multicanal;
- MM202617 visível para revisão, mas inelegível para lançamento;
- gates de publicação.

## Integrar

1. Mesclar rotas, componentes e estilos.
2. Integrar `auth/callback/`.
3. Integrar dados e configuração colaborativa.
4. Integrar migrations sem apagar migrations existentes.
5. Executar:
   - `npm run collab:config`;
   - `npm run channels:export`;
   - `npm run museum:index`;
   - `npm run museum:audit`;
   - `npm run validate`;
   - `npm test`;
   - `npm run build`;
   - `npm run smoke`.
6. Testar modo demo pendente e master.
7. Testar os módulos visíveis conforme permissões.
8. Testar callback apenas num ambiente Supabase configurado.

## Segurança

- nunca colocar `SUPABASE_SERVICE_ROLE_KEY` no frontend;
- usar apenas chave publicável no navegador;
- não guardar tokens Google de Gmail, Drive ou Calendar;
- não hardcodar e-mail do master;
- manter RLS em todas as tabelas;
- login Google não ativa automaticamente um membro.

## Master

Após o primeiro login real do responsável, usar o script administrativo com `MILREU_MASTER_EMAIL`.

## Exposições

Integrar as tabelas e a interface de fundação, mas não inventar locais ou datas.

## Resultado

Uma fundação executável e auditável, pronta para avaliação antes dos pacotes 08B–08G.
