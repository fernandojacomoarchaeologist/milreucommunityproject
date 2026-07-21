---
title: "Prompt de integração — Pacote 05B"
version: "0.2.0"
status: "ready-to-use"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Prompt de integração — Pacote 05B

Utiliza o texto abaixo depois de adicionar o pacote à raiz do repositório.

---

Estou a integrar o **Pacote 05B — Fundações Visuais de Produção, versão 0.2.0**, no repositório do Projeto Comunitário de Milreu.

## Objetivo

Transformar a auditoria visual do livro *Milreu: Ruínas* em fundações de produção acessíveis e multiplataforma, mantendo rastreabilidade com o Pacote 05A e compatibilidade progressiva com o Pacote 02.

## Antes de alterar ficheiros

1. Confirma a integração dos Pacotes 01, 02 e 05A.
2. Lê integralmente:
   - `README.md`;
   - `PACKAGE_MANIFEST.md`;
   - `INTEGRATION_CHECKLIST.md`;
   - `releases/PACKAGE_05B_v0.2.0.md`;
   - todos os documentos em `docs/design/foundations/`;
   - ADRs e specs;
   - todos os ficheiros em `integration/`.
3. Compara os tokens v0.1 do Pacote 02 com `packages/design-tokens/v0.2/`.
4. Inventaria alterações locais antes de fundir.

## Decisões autoritativas

- Vermelho: assinatura, abertura, transição e fecho.
- Preto aquecido: preenchimentos de destaque e contraste controlado.
- Superfícies claras: leitura extensa.
- Fraunces: títulos expressivos e aberturas.
- Spectral: corpo editorial e textos longos.
- Archivo: navegação, controlos, etiquetas, dados e metadados.
- Cores de mapas e dados são independentes da marca.
- Cor nunca é o único indicador de estado.
- Não distribuir ficheiros de fontes.
- Não copiar páginas, texturas ou defeitos do scan.

## Regras de integração

- Não publiques o laboratório.
- Não alteres o Portal ou o Museu.
- Não cries logótipo.
- Não substituas tokens v0.1 sem relatório de diferenças.
- Não inventes Pantone, CMYK definitivo ou fonte original do livro.
- Não uses vermelho como fundo de leitura prolongada.
- Não uses preto pleno quando o token `ink.950` estiver disponível.
- Não introduzas hexadecimais diretamente em novos componentes.
- Não alteres os 31 registos do museu.
- Pergunta apenas se existir conflito local real que não possa ser resolvido por merge conservador.

## Integração esperada

1. Adiciona a documentação, ADRs e specs.
2. Adiciona `packages/design-tokens/v0.2/`.
3. Mantém v0.1 durante a comparação.
4. Adiciona o laboratório como ferramenta interna.
5. Funde rules, skills e adendas.
6. Executa:

```bash
node scripts/validate-package-05b.mjs
node tests/token-schema.test.mjs
node tests/contrast.test.mjs
node tests/platform-parity.test.mjs
```

7. Serve a raiz localmente e testa o laboratório em desktop e mobile.

## Relatório esperado

Entrega:

- ficheiros criados, fundidos e preservados;
- diferenças entre tokens v0.1 e v0.2;
- resultado dos quatro validadores;
- contraste mínimo encontrado;
- confirmação de ausência de ficheiros de fontes;
- confirmação de que o laboratório é interno;
- divergências ou decisões locais preservadas;
- pendências objetivas para o Pacote 05C.

Não avances para o Pacote 05C sem instrução explícita.

---
