---
title: "Mapa de dependências funcionais"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Mapa de dependências funcionais

| Função | Fonte de dados | Persistência | Destino futuro |
|---|---|---|---|
| Galeria e modal | `museum-items.js` | ficheiro | domínio do Museu/API |
| Drive | imagens + TXT públicos | Google Drive | armazenamento controlado |
| Favoritos | IDs | `localStorage` | local, opcionalmente conta futura |
| Avaliações | notas por item | `localStorage` | não usar como métrica coletiva |
| Contribuições | formulário | `mailto:` | serviço de submissão e moderação |
| Exposições | JSON/TXT/fallback | ficheiro | conteúdo validado |
| Mapa | placeholder | inexistente | base de narrativas revista |
| Crescimento | dados do cliente | `localStorage`/datas | indicadores documentados |

O Pacote 04 não altera essas dependências; apenas as documenta para o Pacote 05 e seguintes.
