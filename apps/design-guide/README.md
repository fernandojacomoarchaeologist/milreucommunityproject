---
title: "Guia vivo — execução local"
version: "0.1.0"
status: "beta"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Guia vivo

## Execução

O guia não exige build. Para evitar restrições de `file://`, servir a raiz do repositório localmente.

Exemplo com Python:

```bash
python3 -m http.server 8000
```

Abrir:

```text
http://localhost:8000/apps/design-guide/
```

## Funções da versão 0.1.0

- mapa de fundamentos;
- paleta e tokens;
- tipografia;
- comparação Spectral/Archivo;
- componentes nucleares;
- demonstrações dos shells Portal e Museu;
- referência inicial de impressão;
- interface essencial em quatro idiomas;
- indicação explícita de conteúdo demonstrativo.

## Limites

- sem logótipo definitivo;
- sem fotografias reais;
- sem conteúdo do acervo;
- sem editor de tokens;
- sem publicação automática;
- sem componentes finais de dados, mapa ou biblioteca.

## Rota de fundações — Pacote 05B

O Pacote 05C deverá incorporar as fundações v0.2 no catálogo visual e substituir páginas genéricas do guia anterior por páginas de documentação visual completas.

Até lá, `apps/foundations-lab/` é ferramenta interna e não deve ser ligada ao menu público.
