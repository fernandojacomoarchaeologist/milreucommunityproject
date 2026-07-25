---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08G"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Ledger de contexto do Projeto Comunitário de Milreu

Este ficheiro é cumulativo. Não deve ser substituído por um resumo apenas do pacote mais recente.

## Identidade e objetivo

O **Projeto Comunitário de Milreu** é o programa principal de Arqueologia Pública e Comunitária em Estoi e Faro.

Objetivo:

> Resgatar a memória e o valor histórico de Milreu para a população de Estoi e também de Faro.

Princípios públicos:

1. Comunicação;
2. Mutualidade;
3. Pertinência Social e Política.

Regra interpretativa interna:

> A comunidade fala primeiro; a instituição funciona como contexto e moldura.

## Camadas

### Portal público

Navegação, contexto, metodologia, iniciativas, participação, agenda, conhecimento e acesso ao Museu.

### Museu de Memórias

Exploração visual e imersiva das memórias. Possui 31 registos visíveis no ambiente de revisão.

### Milreu Proteus

Base de conhecimento, proveniência, relações, dados e exports. Não é a marca principal.

### Área Colaborativa

Espaço autenticado para coordenação, voluntários, investigadores, revisores, tradutores, parceiros e colaboradores comunitários.

### Canais físicos

Totens e painéis permanecem dependentes do Pacote 14 e de especificações finais de impressão.

## Invariantes editoriais

- `pt-PT` é a língua-fonte.
- `en`, `es` e `fr` dependem de revisão.
- Conteúdo preliminar não é aprovado por inferência.
- Direitos, créditos, fontes, intervenções digitais e pedidos de retirada devem permanecer rastreáveis.
- Regra operacional: não publicar automaticamente.
- Não inventar contactos, domínios, datas, traduções, autorizações ou direitos.
- GitHub guarda código, documentação e snapshots públicos aprovados.
- Supabase guarda operação, rascunhos, membros, tarefas, contributos e decisões.
- `service_role` nunca entra no browser.

## MM202617

MM202617 pode permanecer visível para revisão. Deve declarar claramente que houve **retoque substantivo com inteligência artificial**.

O registo:

- não deve ser apresentado como imagem original não alterada;
- permanece inelegível para lançamento público enquanto os gates editoriais não forem concluídos;
- pode ser aprovado posteriormente apenas com direitos, crédito e divulgação adequados.

## Histórico dos pacotes

### 01 — Fundação, governança e escopo

Definiu identidade, objetivos, princípios, estados e fronteiras.

### 02 — Sistema de design e guia vivo

Definiu tokens, tipografia, grids, acessibilidade e linguagem visual.

### 03 — Modelo de dados do Museu

Definiu memória, fonte, direitos, media, relações, canais e localização.

### 04 — Auditoria e migração preliminar

Mapeou o legado e os estados de revisão.

### 05A — Auditoria visual da fonte primária

Analisou o livro privado de Hauschild e Teichner sem o publicar.

### 05B — Fundações visuais de produção

Consolidou tokens visuais.

### 05C — Catálogo visual interativo

Criou a referência de componentes e padrões.

### 05D — Componentes e padrões museológicos

Definiu comportamento do Portal e Museu.

### 05E — Identidade, logo e iconografia

Criou derivados técnicos do logótipo, sujeitos a revisão humana.

### 05F — Infraestrutura, persistência e skills

Aprovou Supabase, GitHub Pages, migrations protegidas, skills e agentes.

### 06 — Arquitetura do Portal e Museu

Definiu rotas, páginas, fluxos e matrizes.

### 07A — Base executável e imagens

Criou a aplicação estática e pipeline das 31 imagens.

### 07B — Portal público

Ativou páginas institucionais e iniciativas.

### 07C — Museu digital

Ativou pesquisa, filtros, coleções, timeline, detalhe e imersivo.

### 07D — Multicanal e MVP

Criou exports, JSON-LD, laboratório e gates de release.

### 07D.1 — Conteúdo, navegação e slideshow

Corrigiu pilares, menus, CTA e imersivo.

### 07D.2 — Imersivo e carrossel da Home

Corrigiu saída, encaixe de imagem e carrossel Museu/Proteus/Inquérito.

### 07D.3 — MM202617

Desbloqueou o registo para revisão com divulgação explícita de retoque substantivo por IA, mantendo o bloqueio de lançamento.

### 08A — Fundação da Área Colaborativa

Google Auth, perfis, permissões, master e módulos.

### 08B — Membros e perfis

Gestão de membros, funções, interesses, competências e pré-autorizações.

### 08C — Voluntariado e tarefas

Disponibilidade, tarefas, candidaturas, progresso e tempo.

### 08D — Agenda e exposição itinerante

Locais, períodos, eventos, RSVP, logística e página pública.

### 08E — Contributos comunitários

Submissão, ficheiros privados, consentimento, moderação, direitos e retirada.

### 08F — Revisão editorial e curatorial

Revisão das 31 memórias, formação, biblioteca, gates, snapshots e efeitos orgânicos nas páginas principais.

### 08G — Implantação e homologação

Ambientes local, staging e produção; Google OAuth; master configurável; preflight; RLS; storage; 24 checks e gates de produção.

## Estado funcional após 08G

Todos os 17 módulos do registo colaborativo possuem implementação ativa:

- dashboard;
- perfil;
- disponibilidade;
- tarefas;
- contributos;
- agenda;
- biblioteca;
- formação;
- revisão do Museu;
- gestão de tarefas;
- membros;
- convites;
- moderação;
- locais;
- exposições;
- gestão da revisão;
- implantação e homologação.

## Próximas fronteiras

- execução real das migrations em local e staging;
- configuração do Google OAuth;
- bootstrap do master;
- homologação por perfil;
- aplicação humana das revisões;
- traduções;
- lançamento público;
- domínio;
- contacto público;
- acessibilidade final;
- impressão física;
- notificações apenas quando justificadas.
