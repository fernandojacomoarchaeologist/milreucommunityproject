---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Prompt de integração — Pacote 05C

Estás a integrar o **Pacote 05C — Catálogo Visual Interativo v0.3.0** no repositório do Projeto Comunitário de Milreu.

## Antes de alterar qualquer ficheiro

1. Lê integralmente:
   - `CLAUDE.md`;
   - `README.md` deste pacote;
   - `PACKAGE_MANIFEST.md`;
   - `INTEGRATION_CHECKLIST.md`;
   - documentação dos Pacotes 05A e 05B;
   - `integration/PACKAGE_02_DESIGN_GUIDE_UPGRADE.md`.
2. Verifica se existem alterações locais em `apps/design-guide/`.
3. Confirma a existência de `packages/design-tokens/v0.2/tokens.css`.
4. Se uma dependência estiver ausente, interrompe e pergunta ao utilizador. Não inventes tokens nem recries fundações.

## Objetivo

Atualizar o guia preliminar do Pacote 02 para um catálogo visual navegável, pesquisável e versionado. A estrutura de documentação pode seguir convenções comuns de design systems, mas a identidade e o conteúdo devem permanecer exclusivamente associados a Milreu.

## Regras obrigatórias

- Não copies componentes, textos, nomes ou código da referência externa Conta BOLD.
- Não publiques imagens ou páginas do livro *Milreu: Ruínas*.
- Não inventes decisões visuais ausentes nos Pacotes 05A e 05B.
- Vermelho é assinatura e abertura; não é fundo contínuo de leitura.
- Preto aquecido pode preencher destaques e exemplos controlados.
- Superfícies extensas de leitura devem permanecer claras.
- Não dupliques os tokens do Pacote 05B.
- Não marques componentes futuros como `approved`.
- Não cries o Portal, Museu, aplicação móvel ou backend.
- Preserva o histórico do guia anterior via Git; não mantenhas duas apps concorrentes no produto final.
- Pergunta quando uma alteração implicar remover trabalho posterior ao Pacote 02 ou quando houver conflito de rotas.

## Sequência

1. Compara `apps/design-guide/` existente com este pacote.
2. Integra a nova aplicação mantendo o caminho canónico `apps/design-guide/`.
3. Integra `packages/design-guide-catalog/v0.3/`.
4. Integra docs, specs, rules e skills.
5. Aplica os anexos de integração sem duplicar conteúdo.
6. Executa os validadores e testes.
7. Serve o projeto por HTTP e verifica manualmente:
   - início;
   - pesquisa;
   - navegação lateral;
   - menu mobile;
   - idiomas;
   - breadcrumbs;
   - rotas diretas;
   - estados de maturidade;
   - navegação anterior/seguinte.
8. Gera um relatório de integração com:
   - ficheiros criados;
   - ficheiros substituídos;
   - conflitos encontrados;
   - testes executados;
   - questões em aberto;
   - decisão de publicação.

## Critério de conclusão

A integração termina quando o catálogo funciona localmente e todas as verificações automáticas passam. O guia permanece `internal-preview` até revisão visual de Fernando Rodrigues de Jácomo.
