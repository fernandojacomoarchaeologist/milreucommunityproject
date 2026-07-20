---
title: "Design tokens — utilização"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Design tokens

## Fonte de verdade

`tokens.json` é a representação estruturada principal. `tokens.css` é a implementação Web manual desta versão. Alterações devem manter os dois ficheiros sincronizados.

## Camadas

1. **Primitivos:** cores e valores fundamentais.
2. **Semânticos:** função do valor no produto.
3. **Componentes:** valores específicos apenas quando necessários.
4. **Plataformas:** projeções para JavaScript e Flutter.

## Regras

- componentes novos devem consumir tokens semânticos;
- não inserir hexadecimais diretamente fora deste pacote;
- tijolo apenas nos usos autorizados;
- mudanças exigem release;
- projeções de plataforma não substituem a fonte estruturada;
- não incluir ficheiros de fontes no repositório.
