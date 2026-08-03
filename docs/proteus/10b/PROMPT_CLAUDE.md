<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Prompt de integração — Pacote 10B

Integra o 10B partindo exclusivamente de `main@0430da5`, `v0.36.0`, `currentPackage 10A`, depois de confirmar CI verde e árvore limpa. Se o SHA remoto divergir, para e relata. Cria branch dedicada e PR sem merge automático.

## Missão

Construir a primeira Biblioteca Proteus funcional: catálogo de obras e autores, estados editoriais e de direitos, importação DOI em rascunho, revisão humana e páginas públicas iniciais. Não preencher o catálogo com conteúdo inventado. A experiência vazia, se não houver registos verificados, é resultado válido.

## Preflight bloqueante

1. Confirmar base, versão, `currentPackage`, CI e ausência de PR/alterações concorrentes.
2. Ler integralmente as políticas Proteus do 10A, contratos de direitos, privacidade/RLS, Área Colaborativa, i18n e SEO 09F.
3. Inventariar rota/placeholder Proteus, arquitetura de dados, adapters, Supabase, migrations, papéis e componentes reutilizáveis.
4. Registar contagens reais antes de alterar: rotas, módulos, migrations, papéis/permissões e testes.
5. Procurar dados bibliográficos, PDFs, DOI, autores e fixtures existentes. Não importar automaticamente; classificar origem e riscos.
6. Confirmar se existe autorização editorial adequada. Sem ela, não criar papel ou permissão: reduzir o escopo mutável e relatar.

## Implementação obrigatória

- contratos/tipos de `Work`, `Author`, relação de autoria, direitos e rascunho DOI;
- persistência alinhada à arquitetura existente; no máximo uma migration, somente se a fundação Supabase real e testes RLS existirem;
- negação por defeito e exposição pública somente de `published`;
- pesquisa/filtros básicos e fichas públicas de obras/autores;
- estados loading, vazio, erro, restrito, retirado e zero resultados;
- importação DOI assistida com preview, duplicidade, proveniência e confirmação humana; testes de rede mockados;
- auditoria editorial coerente com a infraestrutura existente;
- SEO/JSON-LD/canonical/sitemap somente para entidades publicadas;
- documentação, testes de contrato, RLS/acesso, acessibilidade e não regressão.

## Implementação condicional

Se migration/RLS for coerente, criar estrutura mínima sem dados reais e provar: anónimo lê apenas publicados; autenticado sem função editorial não altera; editor existente cria/revê; nenhum cliente pode definir privilégios. Se isso não puder ser provado no CI, não simular backend funcional: manter adapter/contratos e relatar bloqueio.

## Proibições

Não inserir PDF ou texto integral; não fazer OCR, extração, resumo automático, claims, CIDOC CRM, embeddings, vector store, RAG, chat, LLM, API pública ou MCP. Não copiar visita virtual, imagens ou modelos 3D. Não importar Hauschild/Teichner, Hauschild, Fernando Jácomo ou qualquer pessoa como fixture real sem fontes e aprovação. Não inferir licenças. Não criar novo papel/permissão. Não ativar produção nem publicar EN/ES/FR automaticamente.

## Critérios editoriais

Metadados externos são rascunhos. DOI não prova direitos. ORCID não prova que dois nomes são a mesma pessoa sem revisão. Um registo público deve preservar fonte, última verificação, estado de acesso e direitos aplicáveis. Campos desconhecidos ficam vazios/`unknown`.

## Testes mínimos

- schemas e normalização DOI/ORCID;
- deduplicação conservadora;
- transições editoriais;
- RLS/acesso quando houver persistência;
- falhas, timeout e rate limit DOI;
- nenhuma publicação automática após importação;
- nenhuma fuga de rascunhos/notas/URLs privadas;
- busca e filtros acessíveis;
- canonical/JSON-LD/sitemap apenas para publicados;
- ausência de PDFs, texto integral, embeddings, endpoints API/MCP e segredos;
- regressão das rotas públicas, Museu e Área Colaborativa.

## Entrega

Executar validação, testes, build e CI. Atualizar versão para `0.37.0` e `currentPackage 10B` somente após critérios cumpridos. Entregar PR sem merge, matriz PASS/FAIL/BLOCKED, SHA-base real, ficheiros/rotas/migration, inventários antes/depois, fontes externas utilizadas, conteúdo real incluído (esperado: zero salvo aprovação explícita), decisões humanas e rollback.
