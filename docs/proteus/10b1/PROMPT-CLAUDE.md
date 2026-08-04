<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Prompt de execução — Pacote 10B.1

Implemente o Pacote 10B.1 — Piloto catalográfico controlado — seguindo integralmente este diretório.

## Regra de base

O relatório de origem dizia que o PR #46 estava aberto. Antes de editar, verifique o estado atual: o pacote só pode ser aplicado se o 10B estiver efetivamente integrado no `main`, com CI verde. Registe SHA, versão e pacote reais. Se não estiver, pare e relate. Não faça merge de PR.

## Ordem

1. Ler todos os ficheiros do pacote.
2. Executar `scripts/preflight-10b1.mjs` ou implementar verificação equivalente adequada ao repositório.
3. Mapear os contratos reais criados no 10B. Não criar um segundo modelo paralelo.
4. Adaptar `data/pilot-records.json` e `data/pilot-agents.json` aos schemas existentes, preservando todas as decisões de direitos e proveniência.
5. Implementar os seis registos como snapshot/dados editoriais versionados compatíveis com a arquitetura static-first.
6. Exibir publicamente somente registos com `public_metadata=true`. Para texto integral, usar apenas a URL pública autorizada do RUN; nunca copiar os anexos.
7. Adicionar páginas públicas/filtros conforme os componentes do 10B, com etiquetas claras de acesso, estado e última verificação.
8. Criar testes para direitos, links, conteúdo não redistribuído, fontes dinâmicas e ausência de afirmações.
9. Executar toda a cascata de validação, testes e build.
10. Atualizar versão para `v0.37.1`, `currentPackage` para `10B.1`, ledger, impacto, release e CI.
11. Abrir PR sem merge automático e relatar SHA, testes, limitações e decisões humanas pendentes.

## Proibições

- não commitar PDFs/DOCX, texto extraído, imagens, OCR ou hashes como substitutos de direitos;
- não gerar resumos novos a partir dos documentos;
- não criar claims, interpretações, citações por página ou relações CIDOC CRM — pertencem ao 10C/10C.1;
- não criar upload, storage, migration, novo papel/permissão, embeddings, chat, API ou MCP;
- não marcar ResearchGate como licença aberta;
- não publicar o manuscrito do congresso nem o Anexo A sem decisão humana;
- não transformar horários, preços ou encerramento da bilheteira em informação permanente sem data de verificação;
- não inventar DOI, ORCID, afiliação, biografia, licença ou autoria.

## Regra de interpretação

Os registos do piloto são catalográficos, não conclusões históricas. Títulos e resumos fornecidos pela fonte podem ser exibidos com proveniência, mas não devem ser convertidos em afirmações do Proteus nesta etapa.
