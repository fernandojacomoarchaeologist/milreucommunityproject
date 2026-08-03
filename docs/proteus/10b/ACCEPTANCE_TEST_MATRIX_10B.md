<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Matriz de aceitação

| ID | Critério | Evidência |
|---|---|---|
| 10B-01 | Base exata `0430da5` confirmada | log/preflight |
| 10B-02 | Contratos de obra, autor, autoria e direitos válidos | testes schema |
| 10B-03 | DOI importado permanece rascunho | teste integração |
| 10B-04 | Duplicidade não causa merge automático | teste unitário |
| 10B-05 | Público lê somente `published` | teste RLS/adapter |
| 10B-06 | Nenhum papel/permissão novo | inventário diff |
| 10B-07 | No máximo uma migration, justificada | inventário |
| 10B-08 | Lista, filtros, ficha e autor acessíveis | E2E |
| 10B-09 | Estados vazio/erro/restrito/retirado honestos | E2E/snapshot |
| 10B-10 | SEO só para entidades publicadas | teste rotas |
| 10B-11 | Nenhum PDF/texto/OCR/embedding/RAG/chat/API/MCP | varredura |
| 10B-12 | Nenhum conteúdo real sem fonte/aprovação | revisão inventário |
| 10B-13 | CI não depende da rede DOI | mocks + execução offline |
| 10B-14 | Rotas preexistentes sem regressão | suíte E2E |
| 10B-15 | Versão/currentPackage apenas após aceite | diff release |

Cada linha recebe `PASS`, `FAIL` ou `BLOCKED`; não converter bloqueio em sucesso.
