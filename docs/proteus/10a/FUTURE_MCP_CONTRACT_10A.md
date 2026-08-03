<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Contrato futuro do MCP

## Arquitetura

O MCP será adaptador sobre uma API pública versionada. Nunca terá acesso direto ao banco, storage privado, PDFs, embeddings ou credenciais. O chat interno poderá usar a mesma API sem depender do MCP.

## Fase pública

Somente leitura; dados já publicados; respostas estruturadas como evidência; limites de tamanho/paginação; rate limiting; versão e `last_reviewed`; sem dados pessoais; sem ferramentas de escrita ou execução.

Recursos futuros: obras, autores, afirmações, lugares, tópicos, objetos digitais, visitas virtuais e datasets públicos.

Ferramentas candidatas: `search_milreu`, `get_work`, `get_author`, `get_claims`, `compare_interpretations`, `find_3d_objects`, `get_virtual_visit`, `build_bibliography`, `get_visit_information`, `list_open_datasets`. A lista é contrato de intenção, não implementação aprovada.

## Resposta uniforme

Todo retorno inclui: versão do contrato; estado; dados públicos mínimos; fontes; direitos; data de revisão; paginação; avisos. Erros distinguem `not_found`, `not_published`, `rights_restricted`, `insufficient_evidence`, `rate_limited` e `temporarily_unavailable` sem revelar existência sensível.

## Proteções

- consultas parametrizadas e allowlist;
- prevenção de enumeração e extração progressiva;
- limites por recurso e janela;
- sem texto integral de obra restrita;
- saneamento de conteúdo e isolamento de instruções incorporadas;
- logs minimizados e sem guardar perguntas pessoais por defeito;
- testes de citações falsas, fuga, prompt injection e autorização;
- política de desativação e versionamento incompatível.

## MCP editorial futuro

Fora do 10A e da primeira publicação. Exigirá autenticação/autorização atualizadas, consentimento institucional, escopos mínimos, RLS, auditoria e aprovação por operação. A especificação MCP vigente deve ser verificada no momento da implementação; este pacote não congela transporte ou OAuth por antecipação.
