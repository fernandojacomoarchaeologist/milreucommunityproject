---
title: "Prompt de integração — Pacote 03"
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

Estou a integrar o **Pacote 03 — Modelo de Dados do Museu, versão 0.1.0**, no repositório do Projeto Comunitário de Milreu.

Antes de alterar qualquer ficheiro:

1. Lê integralmente:
   - `README.md` deste pacote;
   - `PACKAGE_MANIFEST.md`;
   - `INTEGRATION_CHECKLIST.md`;
   - `releases/PACKAGE_03_v0.1.0.md`;
   - todos os documentos em `docs/data-model/`;
   - todas as specs `SPEC-DATA-*`;
   - todas as rules e skills adicionadas por este pacote.
2. Confirma a presença e o estado dos Pacotes 01 e 02. Caso não estejam presentes, não assumes as suas decisões: apresenta a ausência como bloqueio de integração e pergunta como proceder.
3. Analisa o repositório e identifica schemas, modelos de dados, vocabulários, templates ou regras que já usem os mesmos caminhos ou conceitos.
4. Não sobrescrevas nada sem comparação semântica e plano de fusão.
5. Não migres os 31 registos de `data/museum-items.js` neste pacote. A migração pertence ao Pacote 04.
6. Não alteres HTML, CSS, JavaScript, imagens, integração Google Drive, guia do Design System ou conteúdos publicados.
7. Não cries base de dados, tabelas SQL, autenticação, API, Supabase ou formulários persistentes.
8. Não transformes estados `preliminary`, `review-required`, `pending-review` ou semelhantes em estados aprovados.
9. Não inventes datas, nomes, identificações, coordenadas, direitos, consentimentos, titulares, fontes, números de inventário, traduções ou níveis de certeza.
10. Mantém explicitamente os quatro idiomas: `pt-PT`, `en`, `es` e `fr`, aceitando valores nulos quando a tradução não existe.
11. Não introduzas o nível de certeza `mixed`. Os níveis permitidos são os definidos em `data/vocabularies/certainty-levels.json`.
12. Utiliza o exemplo `MM202601.preliminary.example.json` apenas como demonstração de mapeamento. Não o declares publicado e não o uses como prova de que os restantes registos têm a mesma estrutura factual.
13. Preserva a separação entre:
    - descrição objetiva;
    - narrativa comunitária;
    - contexto histórico;
    - contexto institucional;
    - proveniência;
    - fontes;
    - direitos e consentimento.
14. Verifica o copyright em todos os MDs e códigos novos ou alterados.
15. Executa:
    - `node scripts/validate-data-model.mjs`;
    - `node tests/data-model.test.mjs`.

Entrega primeiro um relatório de pré-integração com:

- dependências confirmadas;
- ficheiros novos;
- ficheiros existentes em conflito;
- diferenças de nomenclatura ou estrutura;
- proposta de criação, manutenção ou fusão;
- decisões realmente bloqueantes;
- perguntas objetivas apenas quando a integração não puder prosseguir com segurança.

Se não houver bloqueios, integra o pacote preservando os caminhos do manifesto. No final, entrega:

- ficheiros criados;
- ficheiros fundidos ou alterados;
- ficheiros mantidos sem alteração;
- schemas e vocabulários validados;
- resultados dos dois comandos de teste;
- conflitos não resolvidos;
- pendências não bloqueantes;
- confirmação de que nenhum registo do acervo foi migrado ou publicado;
- confirmação de que o release foi registado.

Não avances para o Pacote 04 sem instrução explícita.

---
