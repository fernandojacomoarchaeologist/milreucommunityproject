<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Escopo e fronteira

## Incluído

- metadados bibliográficos reais mínimos;
- agentes/autores normalizados sem biografias inventadas;
- proveniência de cada campo;
- estados de acesso e direitos granulares;
- ligações externas estáveis ou institucionais;
- páginas públicas iniciais e filtros do 10B preenchidos pelo piloto;
- data de verificação para recursos Web dinâmicos;
- revisão humana e auditoria.

## Excluído

- ingestão de ficheiros, OCR e extração;
- resumos gerados por IA;
- afirmações, passagens, páginas probatórias e divergências;
- temas/estruturas/períodos como grafo de conhecimento;
- importação em massa;
- Supabase funcional, migration ou RLS novos;
- RAG, pesquisa semântica, chat, API, IIIF ou MCP.

## Regra static-first

O 10B determinou uma arquitetura static-first. O piloto deve reutilizá-la. Não simular persistência ou segurança de backend. Os registos podem ser snapshots editoriais versionados, desde que as páginas públicas derivem exclusivamente dos campos publicáveis.
