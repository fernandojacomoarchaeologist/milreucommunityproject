---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md"
---

# Pacote 05E — Identidade, Logótipo, Iconografia e Arquitetura de Marca

**Versão:** 0.5.0  
**Estado:** pronto para integração controlada  
**Dependências:** Pacotes 01, 02, 03, 04 e 05A–05D

## Finalidade

Encerrar o ciclo 05 do Sistema de Design, incorporando o logótipo oficial do Projeto Comunitário de Milreu, variantes raster transparentes, dark mode, iconografia inicial e regras de arquitetura de marca.

## Decisões consolidadas

- o nome público principal permanece **Projeto Comunitário de Milreu**;
- **Milreu Proteus** é a camada de dados e conhecimento, não a marca principal;
- Proteus não recebe logótipo independente nesta fase;
- o fundo texturado e o brilho do ficheiro recebido são ignorados;
- todas as cores derivadas são chapadas; gradientes são proibidos;
- o original é preservado e os derivados permanecem `draft` até revisão visual;
- não foi criada uma falsa versão vetorial.

## Executar a pré-visualização

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080/apps/brand-guide-preview/`.
