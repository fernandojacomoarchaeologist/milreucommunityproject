<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Escopo e fronteira

O 10C cria a gramática do conhecimento do Proteus. A unidade principal é uma afirmação editorialmente governada, ligada a uma ou mais evidências localizadas e a entidades controladas.

Inclui estrutura, validação, estados honestos e superfícies públicas vazias. Exclui o preenchimento com afirmações reais, ingestão documental, geração automática de resumos, respostas conversacionais e publicação sem revisão.

O modelo deve funcionar com a arquitetura static-first existente. Persistência real fica condicionada à futura fundação Supabase com RLS verificável. Se essa condição não existir, usar contratos, adaptadores e snapshots versionados sem simular backend seguro.

