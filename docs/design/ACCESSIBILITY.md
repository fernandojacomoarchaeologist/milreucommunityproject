---
title: "Acessibilidade do sistema de design"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Acessibilidade

## Requisitos transversais

- navegação completa por teclado;
- foco visível;
- ordem de leitura coerente;
- landmarks e headings sem saltos arbitrários;
- contraste suficiente;
- texto redimensionável;
- componentes operáveis sem hover;
- alternativas textuais para imagens;
- legendas e transcrições para multimédia;
- estado não comunicado apenas por cor;
- suporte a movimento reduzido;
- idioma da página e das passagens identificado.

## Fotografias históricas

O texto alternativo deve distinguir:

- o que é objetivamente visível;
- o que foi identificado por testemunho ou fonte;
- o que permanece incerto.

Não incluir no `alt` interpretações não suportadas.

## Museu imersivo

- abrir e fechar com teclado;
- manter foco dentro do diálogo quando aplicável;
- devolver foco ao elemento de origem;
- disponibilizar título, crédito e descrição sem depender de sobreposição visual;
- permitir leitura sem ecrã inteiro.

## Idiomas

A troca de idioma deve:

- manter a posição do utilizador;
- informar fallback para português;
- não alterar identificadores permanentes;
- preservar nomes próprios;
- evitar bandeiras como único rótulo de idioma.

## Validação

Cada componente passa por:

1. inspeção semântica;
2. teclado;
3. foco;
4. contraste;
5. zoom a 200%;
6. leitor de ecrã quando possível;
7. viewport móvel;
8. movimento reduzido.
