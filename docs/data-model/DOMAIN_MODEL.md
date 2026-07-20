---
title: "Modelo de domínio do Museu"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Modelo de domínio

## Entidade central

A entidade principal é a **Memória do Museu**. Ela não representa apenas uma imagem: agrega uma relação documentada entre pessoas, comunidade, lugares, eventos, práticas, objetos e Milreu.

## Entidades relacionadas

- memória;
- ativo de media;
- pessoa ou grupo;
- lugar;
- fonte;
- evento de proveniência;
- voz ou contribuição comunitária;
- relação com outro registo;
- direitos e consentimento;
- pedido de correção, identificação ou retirada;
- revisão;
- manifesto de coleção.

## Separações obrigatórias

- conteúdo público e informação privada;
- original e derivado público;
- facto, hipótese e informação desconhecida;
- voz comunitária e contextualização institucional;
- titularidade, consentimento e autorização de publicação;
- registo vivo e versão publicada.

## Extensibilidade

O schema admite `extensions` para informação ainda não normalizada. Esse campo não deve servir para evitar a evolução do schema quando um conceito se torna recorrente.
