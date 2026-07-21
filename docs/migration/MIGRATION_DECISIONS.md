---
title: "Decisões de migração"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Decisões de migração

- todos os registos entram como `preliminary`;
- o estado normal de publicação é `review-required`;
- `MM202617` entra como `blocked` devido à restrição explícita e ao caráter derivado por IA;
- `publicationAllowed` é `false` em todos os ativos;
- direitos permanecem `pending-review`;
- títulos ingleses permanecem `draft`;
- espanhol e francês permanecem `missing`;
- datas normalizadas são criadas apenas quando o texto permite uma correspondência conservadora;
- datas de revelação não são tratadas automaticamente como datas do evento retratado;
- pessoas são preservadas como rótulos agregados, sem separar nomes automaticamente;
- relações são preservadas sem forçar reciprocidade;
- o campo `communityVoices` não foi preenchido a partir de citações existentes no corpo do texto.
