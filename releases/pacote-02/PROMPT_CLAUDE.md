---
title: "Prompt de integração — Pacote 02"
version: "0.1.0"
status: "ready-to-use"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Prompt para o Claude

Utiliza o texto abaixo depois de adicionar este pacote à raiz do repositório.

---

Estou a integrar o **Pacote 02 — Sistema de Design e Guia Vivo, versão 0.1.0**, no repositório do Projeto Comunitário de Milreu.

## Antes de alterar qualquer ficheiro

1. Confirma que o Pacote 01 foi integrado ou que existem documentos equivalentes.
2. Lê integralmente:
   - `README.md` deste pacote;
   - `PACKAGE_MANIFEST.md`;
   - `INTEGRATION_CHECKLIST.md`;
   - `releases/PACKAGE_02_v0.1.0.md`;
   - `CLAUDE.md`, `COPYRIGHT.md` e `RIGHTS.md` na raiz do repositório;
   - todos os ficheiros em `docs/design/`;
   - as três specs `SPEC-DS-*`;
   - `skin-migration/README.md`, `TOKEN_MAP.md` e `MIGRATION_PLAN.md`.
3. Analisa o repositório e procura qualquer design system produzido no agente anterior, incluindo pastas chamadas `design-system`, `design-system-digital`, `skin-migration`, `museu-spec`, `component-gallery` ou equivalentes.
4. Não sobrescrevas esses materiais. Apresenta primeiro uma comparação semântica entre:
   - decisões autoritativas coincidentes;
   - ficheiros complementares;
   - conflitos de token;
   - conflitos de componentes;
   - decisões mais recentes;
   - proposta de fusão.
5. Executa a skill `package-intake` e utiliza `design-system-change` quando a integração alterar materiais já existentes.

## Regras de integração

- Não alteres o site preliminar, `style.css`, `main.js`, HTML, dados, imagens ou integração Drive.
- Não ligues `skin-migration/tokens-migration.css` ao protótipo sem nova instrução explícita.
- Não inventes logótipo, símbolo, textura, ícone, fotografia, motivo romano ou composição retirada do livro.
- Não afirmes que o design é um fac-símile de Hauschild e Teichner.
- Mantém a comunidade como superfície e a instituição como moldura.
- Mantém a regra: tijolo nunca é grande fundo ou cabeçalho dominante.
- Preserva os quatro idiomas previstos: `pt-PT`, `en`, `es` e `fr`.
- Não incluas ficheiros de fontes.
- Não transformes os scaffolds de Portal e Museu em páginas finais.
- Não cries timeline, mapa, dashboard, visualizador PDF, editor, formulário ou componente Flutter neste pacote.
- Todo conteúdo de exemplo deve permanecer explicitamente demonstrativo.
- Todos os MDs e códigos devem conter o copyright do projeto.

## Pendências

A ausência de páginas digitalizadas do livro, logótipo oficial ou decisão final Spectral/Archivo não bloqueia a integração desta fundação. Regista essas pendências sem as resolver por inferência.

Esses itens tornam-se bloqueantes apenas se tentares:

- finalizar a identidade;
- criar ou redesenhar o logótipo;
- declarar fidelidade visual ao livro;
- migrar o protótipo;
- gerar painéis finais;
- produzir a aplicação Flutter.

## Relatório antes da integração

Apresenta:

- dependência do Pacote 01;
- ficheiros novos;
- ficheiros já existentes;
- materiais do agente anterior encontrados;
- conflitos;
- proposta de criação ou fusão;
- decisões realmente bloqueantes;
- perguntas objetivas apenas sobre bloqueios.

Se não houver bloqueios, integra os ficheiros conforme o manifesto, funde manualmente os conteúdos de `integration/` e executa:

```bash
node scripts/validate-design-system.mjs
```

Depois, testa o guia com um servidor local e entrega:

- ficheiros criados;
- ficheiros fundidos ou alterados;
- ficheiros mantidos sem alteração;
- resultado do validador;
- resultado da abertura do guia;
- pendências não bloqueantes;
- confirmação de que o protótipo não foi migrado;
- confirmação do registo do release.

Não avances para o Pacote 03 sem instrução explícita.

---
