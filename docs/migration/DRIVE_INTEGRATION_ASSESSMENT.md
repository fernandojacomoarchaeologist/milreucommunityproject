---
title: "Avaliação da integração com Google Drive"
version: "0.1.0"
status: "ready-for-integration"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
initiative: "Museu de Memórias de Milreu"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Integração com Google Drive

O módulo legado:

- lista imagens numa pasta pública;
- procura TXT com o mesmo identificador;
- cria valores padrão quando os campos faltam;
- combina dados Drive com `museum-items.js`;
- expõe diretamente URLs e IDs do Drive no navegador.

## Riscos

- os defaults podem parecer dados reais;
- a pasta e os ficheiros precisam de acesso público;
- não existe validação pelo schema;
- não existe workflow editorial;
- alterações no Drive podem mudar o conteúdo sem release do Git;
- não existe histórico formal de revisões.

A integração deve permanecer disponível apenas como referência até existir uma decisão sobre persistência e publicação.
