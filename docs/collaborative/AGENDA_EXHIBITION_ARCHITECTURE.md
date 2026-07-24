---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08D"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Arquitetura de agenda e exposições

## Entidades

```text
Exposição
├── Agendamento em local A
│   ├── eventos
│   ├── participantes
│   ├── checklist
│   └── tarefas
└── Agendamento em local B
    ├── eventos
    ├── participantes
    ├── checklist
    └── tarefas
```

`collab_exhibitions` representa o projeto expositivo.  
`collab_venues` representa um local.  
`collab_exhibition_schedule` representa a presença da exposição num local e período.  
`collab_agenda_events` representa uma atividade com data e hora.

Essa separação permite que a exposição circule sem duplicar o seu registo principal.
