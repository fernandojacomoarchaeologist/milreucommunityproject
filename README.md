---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 08D — Agenda, Locais e Exposição Itinerante

**Versão:** 0.15.0  
**Base cumulativa:** Pacote 08C.

Este pacote transforma os esqueletos de agenda e exposições em módulos funcionais da Área Colaborativa.

## Executar em demonstração

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:4173/#/area-colaborativa
```

Entrar como master ou voluntário de demonstração.

## Rotas principais

### Membros

```text
#/area-colaborativa/agenda
```

A agenda permite:

- próximas atividades;
- calendário mensal;
- percurso da exposição;
- confirmação de interesse ou participação.

### Coordenação

```text
#/area-colaborativa/gestao/locais
#/area-colaborativa/gestao/exposicoes
#/area-colaborativa/gestao/agenda/novo
```

### Público

```text
#/exposicoes
```

A página pública usa exclusivamente o snapshot aprovado em:

```text
public/data/exhibitions-public.json
```

## Funcionalidades

### Locais

- museu;
- escola;
- biblioteca;
- centro cultural;
- universidade;
- espaço público;
- sítio patrimonial;
- outro.

Dados públicos e internos são mantidos separadamente.

### Exposições

Tipos:

- fixa;
- itinerante;
- temporária;
- digital.

A exposição é criada uma vez. Cada passagem por um local é um agendamento separado.

### Itinerância

Cada período pode incluir:

- local;
- início e fim;
- montagem;
- desmontagem;
- estado;
- horário;
- contacto público;
- ligação de inscrição;
- notas públicas;
- notas internas;
- estado da instalação;
- estado da logística;
- relatórios de condição.

### Conflitos

- a mesma exposição não pode estar em dois locais durante períodos sobrepostos;
- uma ocupação simultânea do mesmo local por exposições diferentes gera aviso, não bloqueio automático;
- a decisão permanece auditável.

### Agenda

Eventos suportados:

- reunião;
- oficina;
- visita;
- conversa;
- sessão de recolha;
- montagem;
- desmontagem;
- abertura;
- ação de voluntariado;
- outro.

### Logística

- checklist por período;
- transporte;
- montagem;
- materiais;
- acessibilidade;
- comunicação;
- seguros e autorizações;
- conservação;
- geração de tarefas de montagem e desmontagem em rascunho.

## Exportação pública

Sem Supabase configurado:

```bash
npm run exhibitions:export
```

preserva o snapshot existente.

Com Supabase:

```bash
MILREU_SUPABASE_URL="..." MILREU_SUPABASE_PUBLISHABLE_KEY="..." npm run exhibitions:export
```

A exportação usa apenas a chave publicável e uma RPC que retorna campos aprovados para publicação. A `service_role` é ignorada pelo exportador.

## Validação

```bash
npm run collab:config
npm run exhibitions:export
npm run channels:export
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run smoke
```

## Limites

O 08D não inclui:

- sincronização com Google Calendar;
- notificações por e-mail ou WhatsApp;
- locais ou datas reais;
- inventário físico completo;
- gestão de empréstimos;
- arte final de impressão;
- publicação automática sem aprovação.

As migrations devem ser executadas num Supabase local ou staging antes do uso remoto.
