<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# 04 — Operação local atual vs backend/Supabase futuro

## Agora (10E funcional)

Fundação **offline e repo-interna**: núcleos puros + comandos locais + contratos + registos vazios.
Sem UI servida que exponha material em revisão, sem backend, sem Supabase, sem RLS, sem OAuth, sem
migrations, sem novos papéis/permissões. Instantes e IDs vêm do operador; o código não usa relógio
nem aleatoriedade.

## Futuro (dependente de decisão humana e fundação Supabase)

A persistência editorial segura, a composição do conselho editorial, as regras finais de
autorização, RLS e a UI de revisão dependem da futura fundação Supabase e de decisões humanas.
Estes elementos **não** são implementados nem simulados aqui.

## Estado formal

O PR funcional permanece `0.39.0 / 10D`. O fecho mecânico `0.40.0 / 10E` será um pacote separado,
apenas após merge, pós-validação e homologação humana.
