---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08K"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Gates de entrada e saída

## Gates de entrada no piloto

| Gate | Bloqueador |
|---|---|
| RC técnica 08J ready | sim |
| staging separado e HTTPS | sim |
| migrations aplicadas/testadas | sim |
| OAuth e callbacks | sim |
| master ativo/protegido | sim |
| RLS por perfil | sim |
| storage privado e links assinados | sim |
| demo desativada | sim |
| production writes desativadas | sim |
| backup inicial | sim |
| notice do piloto revisto | sim |
| coorte explícita | sim |
| cenários obrigatórios | sim |
| canal de suporte | sim |
| revisão humana inicial de acessibilidade | sim |

## Gates de continuidade

O ciclo deve ser pausado ou bloqueado quando existir:

- incidente `sev-1`;
- exposição cruzada de dados;
- perda de dados;
- secret exposto;
- falha de retirada;
- risco grave de direitos ou privacidade;
- indisponibilidade que invalide as sessões;
- erro que torne a evidência não confiável.

## Gates de homologação de staging

1. todos os gates de entrada aprovados;
2. cobertura dos perfis definidos para o ciclo;
3. cenários obrigatórios executados;
4. falhas bloqueadoras resolvidas e repetidas;
5. zero crítico aberto;
6. zero falha de RLS/storage;
7. teclado e leitor de ecrã registados por revisão humana;
8. backup/restauração com evidência;
9. incident response ensaiado ou comprovado;
10. métricas e relatório de encerramento;
11. efeitos públicos desativados;
12. produção bloqueada;
13. confirmação literal do master.

## Estado final

```json
{
  "pilotCycle": "completed",
  "stagingHomologation": "approved",
  "productionApproval": "blocked"
}
```

A homologação de staging não remove bloqueios editoriais, de direitos, traduções, domínio ou produção.
