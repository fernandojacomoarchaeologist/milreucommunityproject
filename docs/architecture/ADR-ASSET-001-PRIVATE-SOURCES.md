---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# ADR-ASSET-001 — Fontes privadas fora do Git público

## Estado

Aprovada.

## Decisão

PDFs protegidos, miniaturas derivadas e originais não autorizados não entram no repositório público.

O Git conserva:

- identificador;
- metadados;
- checksum;
- índice de páginas;
- política de acesso;
- estado de direitos.

## Modos

### Público

A ausência do binário é esperada. O build não falha.

### Privado

O binário é instalado localmente ou recuperado de armazenamento privado. O hash é verificado antes do uso.

## Backup

Manter pelo menos duas cópias independentes:

- armazenamento documental privado;
- cópia local ou segundo armazenamento.

Supabase Storage privado pode ser usado operacionalmente, mas não deve ser a única cópia.
