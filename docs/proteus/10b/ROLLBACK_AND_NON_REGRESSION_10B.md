<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Rollback e não regressão

Antes da implementação, registar rotas, migrations, versão, testes e placeholder Proteus. O rollback deve remover apenas alterações do 10B e restaurar o 10A sem tocar nas Séries 08/09.

Se houver migration, fornecer `down` seguro ou procedimento explícito compatível com a política do repositório; não apagar dados preexistentes. Como o catálogo inicia vazio, rollback não autoriza comandos destrutivos amplos.

Preservar: Museu e 31 originais, i18n 09D, media 09E, SEO 09F, Área Colaborativa, autenticação, perfis/permissões e políticas 10A. Falhas nessas áreas bloqueiam o PR.
