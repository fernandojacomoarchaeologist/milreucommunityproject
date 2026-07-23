---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Checklist de integração

## Preparação

- [ ] Criar branch de integração.
- [ ] Ler as ADRs e políticas.
- [ ] Confirmar que não existem segredos no pacote.
- [ ] Inspecionar `package.json`, `.gitignore` e `.github/workflows`.
- [ ] Confirmar que o repositório permanece público.

## Ficheiros e dependências

- [ ] Copiar ficheiros sem sobrescrever decisões existentes.
- [ ] Mesclar `integration/package-json.fragment.json`.
- [ ] Fixar versões exatas.
- [ ] Atualizar lockfile.
- [ ] Mesclar `.gitignore.fragment`.
- [ ] Validar cabeçalhos de copyright.

## Infraestrutura local

- [ ] Executar `npm run infra:validate`.
- [ ] Executar `npm run infra:test`.
- [ ] Verificar `npm run env:status`.
- [ ] Verificar `npm run assets:private:status`.
- [ ] Executar migrations localmente, se Docker estiver disponível.
- [ ] Executar testes SQL.
- [ ] Confirmar que o POC pode ser removido sem afetar outros schemas.

## GitHub

- [ ] Ativar workflow de CI.
- [ ] Confirmar que workflows não imprimem segredos.
- [ ] Criar ambientes `staging` e `production`.
- [ ] Configurar required reviewer em `production`.
- [ ] Limitar branches autorizadas.
- [ ] Adicionar secrets apenas aos ambientes adequados.
- [ ] Não executar o workflow produtivo durante a integração.

## Supabase remoto

- [ ] Confirmar organização, região e projeto.
- [ ] Confirmar política de custos.
- [ ] Criar ambiente remoto apenas após autorização.
- [ ] Configurar RLS antes de expor qualquer tabela.
- [ ] Confirmar que `service_role` nunca entra no frontend.
- [ ] Testar leitura pública apenas em views aprovadas.

## Fontes privadas

- [ ] Definir localização de backup.
- [ ] Confirmar modo público sem binários.
- [ ] Confirmar modo privado com verificação de hash.
- [ ] Não introduzir PDF ou miniaturas no Git público.
- [ ] Documentar recuperação das fontes.

## Gate A visual

- [ ] Gerar índice de revisão.
- [ ] Rever identidade.
- [ ] Rever logótipo claro e escuro.
- [ ] Rever cores e tipografia.
- [ ] Rever navegação desktop, tablet e mobile.
- [ ] Rever componentes críticos.
- [ ] Registar decisões.
- [ ] Não promover a `approved`.

## Release

- [ ] Criar release de integração.
- [ ] Listar conflitos e decisões.
- [ ] Registar validações.
- [ ] Registar pendências.
- [ ] Confirmar que nenhuma escrita produtiva ocorreu.
