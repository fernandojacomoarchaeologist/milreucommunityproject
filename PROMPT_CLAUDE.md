---
title: "Prompt de integração — Pacote 04"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Prompt para o Claude

Utiliza o texto abaixo após adicionar este pacote ao repositório.

---

Estou a integrar o **Pacote 04 — Auditoria e Migração da Versão Preliminar, versão 0.1.0**, no repositório do Projeto Comunitário de Milreu.

## Antes de alterar qualquer ficheiro

1. Confirma que os Pacotes 01, 02 e 03 foram integrados. A ausência do Pacote 03 é bloqueante porque os registos dependem do seu modelo e schemas.
2. Lê integralmente:
   - `README.md`;
   - `PACKAGE_MANIFEST.md`;
   - `INTEGRATION_CHECKLIST.md`;
   - `releases/PACKAGE_04_v0.1.0.md`;
   - todos os ficheiros em `docs/migration/`;
   - as specs `SPEC-MIG-*`;
   - as rules e skills deste pacote.
3. Localiza a versão preliminar e calcula o fingerprint de `data/museum-items.js`.
4. Compara o fingerprint com o registado em `data/migration/reports/migration-summary.json`.
5. Se o fingerprint for diferente, não substituas nem regeneres automaticamente os 31 JSON. Apresenta a diferença, identifica quando a fonte mudou e pergunta se devo gerar uma nova migração.
6. Se os caminhos já existirem, apresenta comparação semântica e plano de fusão antes de escrever.

## Regras obrigatórias

- Não alteres `museum-items.js`, `main.js`, `style.css`, HTML, imagens, Drive, calendário ou configuração do protótipo.
- Não ligues a UI aos JSON migrados.
- Não marques registos como `reviewed`, `approved` ou `published`.
- Não alteres `publicationAllowed` para `true`.
- Não resolvas direitos, consentimentos, nomes, datas, fontes ou localizações por inferência.
- Não traduzas conteúdos em massa.
- Não preenchas `communityVoices` a partir de frases entre aspas sem origem e consentimento verificáveis.
- Mantém `MM202617` como `blocked`.
- Mantém os campos originais em `extensions.legacy`.
- Não corrijas as 37 relações não recíprocas automaticamente.
- Não elimines o duplicado `MM202612` nem convertas o hero com extensão incorreta neste pacote.
- Todos os MDs e códigos novos ou alterados devem conter o copyright do projeto.

## Relatório de pré-integração

Apresenta:

- dependências confirmadas;
- fingerprint encontrado e esperado;
- ficheiros novos;
- conflitos de caminho;
- divergências no legado;
- proposta de criação ou fusão;
- bloqueios reais;
- perguntas apenas quando a integração segura não puder prosseguir.

Se não houver bloqueios, integra os ficheiros conforme o manifesto e executa:

```bash
node scripts/validate-package-04.mjs
node tests/migration.test.mjs
```

Depois, valida os 31 registos com o schema `museum-memory.schema.json` do Pacote 03.

## Relatório final

Entrega:

- ficheiros criados, fundidos, mantidos e rejeitados;
- resultado dos validadores;
- contagem dos 31 registos;
- confirmação de que todos permanecem preliminares;
- confirmação de que nenhum ativo foi autorizado automaticamente;
- confirmação de que `MM202617` permanece bloqueado;
- confirmação de que o protótipo não foi alterado;
- pendências da fila de revisão;
- registo do release.

Não avances para o Pacote 05 sem instrução explícita.

---
