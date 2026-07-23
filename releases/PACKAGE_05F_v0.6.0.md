---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Release — Pacote 05F v0.6.0

## Adicionado

- decisão de persistência híbrida;
- política formal de acesso de Claude ao banco;
- regras de produção read-only por defeito;
- workflow manual protegido para migrations;
- POC Supabase isolado;
- RLS, view pública e testes pgTAP;
- estratégia de snapshots públicos;
- política de fontes privadas;
- scripts de ambiente, guards e exports;
- CI geral e de banco;
- Gate A de revisão visual;
- coleção de skills de desenvolvimento;
- agentes revisores;
- schemas e matrizes legíveis por máquina.

## Segurança

- nenhuma credencial incluída;
- nenhum acesso remoto executado;
- nenhuma migration aplicada fora do POC local;
- nenhum conteúdo real inserido;
- nenhuma fonte protegida incluída;
- produção bloqueada sem gates.

## Pendências

- integrar com o repositório;
- fixar versões exatas das dependências;
- configurar ambientes GitHub;
- escolher organização, região e plano do Supabase;
- criar o projeto remoto;
- configurar backups;
- preencher checksum da fonte privada;
- executar Gate A;
- iniciar Pacote 06 apenas após o gate.
