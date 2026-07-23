---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07A"
rights: "Consultar RIGHTS.md; imagens e conteúdos mantêm créditos e condições das respetivas fontes."
---

# Pacote 07A — Base Executável, Pipeline de Imagens e Primeira Experiência Vertical

**Versão:** 0.8.0  
**Estado:** executável, static-first e pronto para integração controlada  
**Pré-condições:** Pacotes 01–06 integrados; Gate A aceite; CI verde.

Este é o primeiro pacote que entrega uma aplicação real do Projeto Comunitário de Milreu.

## O que funciona

```text
Página inicial do Portal
→ entrada no Museu
→ galeria com fotografias reais
→ detalhe da memória
→ modo imersivo
→ regresso ao Portal
```

A aplicação:

- funciona sem backend;
- não depende do Supabase para abrir;
- é compatível com GitHub Pages;
- utiliza as fotografias autorizadas do Museu;
- utiliza descrições migradas, assinaladas como preliminares;
- preserva créditos, proveniência e direitos;
- usa os tokens v0.2 e componentes do Design System;
- suporta pt-PT, en, es e fr com fallback;
- prepara a mesma estrutura canónica para Portal, Museu, totem e painel.

## Executar

```bash
npm install
npm run dev
```

Abrir o endereço apresentado no terminal, normalmente `http://localhost:4173`.

## Build

```bash
npm run validate
npm test
npm run build
npm run preview
```

O conteúdo publicável fica em `dist/`.

## Estado dos conteúdos

- 31 imagens únicas estão no repositório do pacote;
- 30 podem aparecer nesta pré-visualização;
- `MM202617` permanece bloqueado no site devido à natureza da intervenção por IA;
- todos os textos continuam `preliminary` até ao Pacote 08;
- o build inclui `noindex` para evitar indexação acidental desta versão de trabalho.

## Próximo passo

Após integração e revisão no browser, avançar para o Pacote 07B — Portal público.
