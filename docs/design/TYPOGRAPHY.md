---
title: "Sistema tipográfico"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Sistema tipográfico

## Famílias

### Display — Fraunces

Utilização:

- títulos de páginas;
- títulos de memórias;
- números ou datas de destaque;
- palavra-chave em itálico quando editorialmente justificado.

### Body — Spectral

Opção inicial para:

- narrativas;
- textos curatoriais;
- descrições extensas;
- leitura em painéis.

A legibilidade em ecrã deve ser validada. Archivo permanece como alternativa autorizada para corpo digital, sem alterar a tipografia dos títulos.

### Utility — Archivo

Utilização:

- metadados;
- identificadores;
- controlos;
- navegação;
- níveis de confiança;
- créditos;
- filtros e QR.

## Escala digital inicial

| Token | Finalidade |
|---|---|
| `--ds-text-xs` | metadados mínimos |
| `--ds-text-sm` | notas, legenda e utilitários |
| `--ds-text-md` | corpo compacto |
| `--ds-text-lg` | corpo confortável e introduções |
| `--ds-text-xl` | subtítulos |
| `--ds-text-2xl` | títulos de secção |
| `--ds-text-3xl` | títulos de página |
| `--ds-text-display` | abertura imersiva |

## Princípios

- largura de leitura preferencial entre 55 e 75 caracteres;
- corpo digital geralmente não inferior a 16 px;
- corpo dos painéis calibrado na dimensão física real;
- não utilizar caixa alta em parágrafos;
- manter diacríticos e grafia de cada idioma;
- prever expansão de texto em francês e espanhol;
- não depender da presença da fonte para conservar hierarquia funcional.

## Teste Spectral/Archivo

O guia vivo inclui um controlo de comparação. A decisão final deve considerar:

- leitura em telemóvel;
- leitura em ecrã de exposição;
- textos extensos;
- rendering nos browsers alvo;
- relação visual com Fraunces;
- coerência com os painéis impressos.
