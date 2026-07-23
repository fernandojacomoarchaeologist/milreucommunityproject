---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt de integração — Pacote 05F

Estás a integrar o **Pacote 05F — Infraestrutura, Persistência, CI e Skills de Desenvolvimento** no repositório do Projeto Comunitário de Milreu.

## Antes de agir

1. Lê integralmente:
   - `README.md`;
   - `PACKAGE_MANIFEST.md`;
   - `docs/architecture/ADR-AI-001-CLAUDE-DATABASE-ACCESS.md`;
   - `docs/security/PRODUCTION_ACCESS_POLICY.md`;
   - `docs/development/CLAUDE_OPERATING_MODES.md`;
   - `docs/architecture/RELEASE_GATES.md`.
2. Inspeciona o repositório atual.
3. Não sobrescrevas `package.json`, `.gitignore`, workflows ou documentação existentes sem comparar e fundir.
4. Se encontrares conflito que altere segurança, acesso produtivo, publicação ou direitos, interrompe e pergunta.
5. Não peças nem exibas segredos em texto aberto.

## Decisões já aprovadas

- Supabase é a infraestrutura operacional do **Milreu Proteus**.
- O repositório principal continua público.
- GitHub Pages continua responsável pela publicação estática.
- Dados operacionais ficam no Supabase.
- Conteúdos públicos aprovados são exportados para snapshots versionados no Git.
- Claude pode manipular o banco apenas dentro da matriz de acesso e dos gates deste pacote.
- Produção é read-only por defeito.
- Escrita em produção só ocorre por migration versionada e workflow manual protegido por ambiente.
- Fontes privadas não entram no Git público.
- O livro e as miniaturas permanecem local-only ou em armazenamento privado.
- O build público deve funcionar mesmo sem as fontes privadas.

## Integração obrigatória

1. Copia a documentação, rules, skills, scripts, schemas e workflows.
2. Mescla `integration/package-json.fragment.json` no `package.json` existente:
   - preserva scripts atuais;
   - fixa versões exatas das novas dependências;
   - gera ou atualiza o lockfile.
3. Mescla `.gitignore.fragment`.
4. Confirma que `.env`, credenciais e fontes privadas estão ignoradas.
5. Instala dependências de forma reproduzível.
6. Executa:
   - `npm run infra:validate`;
   - `npm run infra:test`;
   - `npm run assets:private:status`;
   - `npm run review:gate-a:index`.
7. Se Docker estiver disponível:
   - inicia o Supabase local;
   - aplica migrations;
   - executa os testes SQL;
   - termina os serviços.
8. Não liga a um projeto remoto sem confirmação expressa.
9. Não cria o projeto Supabase por conta própria sem o utilizador definir organização, região e política de custos.
10. Gera uma release de integração com:
    - ficheiros adicionados;
    - ficheiros mesclados;
    - comandos executados;
    - validações;
    - conflitos;
    - pendências;
    - próxima ação humana.

## Produção

Mesmo que existam credenciais no ambiente:

- não executes `supabase db push` diretamente;
- não uses SQL Editor remoto;
- não executes `DELETE`, `UPDATE`, `INSERT`, `ALTER`, `DROP`, `TRUNCATE` ou funções equivalentes em produção;
- prepara migration, testes, relatório de impacto e rollback;
- utiliza apenas `.github/workflows/05f-production-migration.yml`;
- exige `change_ticket`, confirmação literal e aprovação do ambiente GitHub `production`.

## Fontes privadas

Adapta o `visual-source-board` e os validadores para dois modos:

- público: manifests presentes, binários ausentes sem falhar;
- privado: binários presentes, hashes e miniaturas verificados.

Não publiques o PDF, miniaturas ou URLs privadas.

## Gate A visual

Gera o índice de revisão visual, mas não marques componentes como `approved`.
O máximo permitido antes da revisão humana é `validated-for-architecture`.

## Quando questionar

Questiona o utilizador quando faltar:

- organização ou região do Supabase;
- projeto remoto;
- política de custos;
- configuração do ambiente GitHub `production`;
- required reviewer;
- localização privada dos binários;
- decisão visual;
- permissão para ligação ou deployment remoto.

## Resultado esperado

O repositório deve terminar com:

- desenvolvimento local reproduzível;
- POC isolado e removível;
- CI mínimo funcional;
- política de produção aplicada;
- coleção de skills disponível;
- fontes privadas desacopladas do build público;
- Gate A preparado;
- nenhuma alteração produtiva executada.
