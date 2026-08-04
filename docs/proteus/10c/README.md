<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Pacote 10C — Modelo de conhecimento do Proteus

Versão alvo: `v0.38.0`  
Base obrigatória: `main@0ceda77`, `v0.37.1`, `currentPackage 10B.1`.

Este pacote implementa a estrutura para afirmações verificáveis, evidências localizadas, entidades, relações, divergências e proveniência. O mapeamento inicial para CIDOC CRM é uma camada de interoperabilidade; não substitui o vocabulário editorial legível.

## Fronteira

O 10C não extrai afirmações reais dos documentos do piloto, não ingere PDFs, não executa OCR, embeddings, RAG, chat, API ou MCP e não publica conteúdo histórico demonstrativo. A aplicação controlada às fontes reais pertence ao 10C.1.

## Execução

1. Ler `INDEX.md` e executar `node scripts/preflight-10c.mjs`.
2. Ler integralmente `PROMPT-CLAUDE.md` e os documentos em `docs/`.
3. Implementar contratos e superfícies vazias honestas na arquitetura real.
4. Executar `node scripts/validate-package.mjs` e todos os testes do repositório.
5. Abrir PR isolado, sem merge automático.

