---
title: "Prompt de integração — Pacote 05A"
version: "0.1.0"
status: "ready-to-use"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório e SOURCE_RIGHTS_NOTICE.md neste pacote"
---
# Prompt para o Claude

Utiliza o texto abaixo depois de adicionar o pacote à raiz do repositório.

---

Estou a integrar o **Pacote 05A — Auditoria Visual e Fonte Primária, versão 0.1.0**, no repositório do Projeto Comunitário de Milreu.

## Objetivo

Registar *Milreu: Ruínas*, de Hauschild e Teichner, como fonte visual primária e base contextual inicial para falar do sítio no portal, sem publicar o PDF, copiar o livro ou transformar o scan diretamente em identidade final.

## Antes de alterar qualquer ficheiro

1. Confirma a integração dos Pacotes 01 e 02.
2. Lê integralmente:
   - `README.md`;
   - `PACKAGE_MANIFEST.md`;
   - `INTEGRATION_CHECKLIST.md`;
   - `SOURCE_RIGHTS_NOTICE.md`;
   - `releases/PACKAGE_05A_v0.1.0.md`;
   - todos os ficheiros em `docs/design-source/`;
   - `docs/specifications/SPEC-DS-004-VISUAL-SOURCE-BOARD.md`;
   - os ficheiros de `integration/`.
3. Verifica o PDF através de `data/design-source/source-manifest.json`.
4. Procura auditorias anteriores e compara sem sobrescrever.
5. Confirma que `sources/primary/private/` não entra no build público.

## Decisões autoritativas

- O vermelho funciona como assinatura, abertura, transição e fecho.
- O vermelho não é a superfície padrão para leitura extensa.
- O preto pode preencher áreas de destaque, legenda, chamada ou contraste de maneira controlada.
- As superfícies principais de leitura permanecem claras.
- O PDF é fonte visual primária.
- O livro é base contextual inicial para conteúdo arqueológico do sítio.
- Estudos posteriores podem atualizar ou corrigir a publicação.
- Memórias comunitárias pertencem a outro domínio de fonte.

## Regras

- Não publiques o PDF nem as miniaturas.
- Não cries link de download público.
- Não assumas direitos de imagens, mapas ou desenhos.
- Não copies páginas como templates.
- Não identifiques as fontes originais por aparência.
- Não convertas os hexadecimais observados em tokens finais.
- Não cries o logótipo.
- Não apliques a identidade ao Portal ou Museu.
- Não reescrevas os 31 registos.
- Não alteres o site preliminar.
- Ao produzir conteúdo arqueológico, regista página e verifica se há investigação posterior.
- Ao encontrar uma pendência de direitos ou decisão final, pergunta antes de agir.

## Integração

1. Integra `docs/design-source/`, `data/design-source/`, `.claude/`, a spec, scripts e testes.
2. Integra `apps/visual-source-board/` como ferramenta interna.
3. Mantém o PDF em `sources/primary/private/`.
4. Funde manualmente as três adendas de `integration/`.
5. Executa:

```bash
node scripts/validate-package-05a.mjs
node tests/source-audit.test.mjs
```

6. Serve a raiz localmente e abre o quadro visual.

## Relatório esperado

Entrega:

- ficheiros criados e fundidos;
- confirmação de 36 páginas e 36 miniaturas;
- resultado do SHA-256;
- resultado dos validadores;
- confirmação de que a fonte permanece privada;
- divergências encontradas em relação ao Pacote 02;
- pendências para o Pacote 05B;
- perguntas objetivas apenas quando houver bloqueio real.

Não avances para o Pacote 05B sem instrução explícita.

---
