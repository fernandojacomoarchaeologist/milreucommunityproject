---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08K"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Recursos externos e decisões em aberto

## Recursos que apenas o responsável pelo projeto pode configurar

- projeto Supabase de staging;
- projeto Supabase de produção separado;
- URL e project ref;
- Google OAuth client ID e secret;
- callbacks;
- e-mail do master;
- domínio/URL de staging;
- execução protegida de migrations;
- configuração de backup;
- contas reais da coorte.

Não colar esses valores no chat nem incluí-los no ZIP.

## Decisões humanas ainda necessárias

1. tamanho da coorte;
2. composição da coorte;
3. datas do piloto;
4. perfis que terão cobertura real;
5. responsável operacional;
6. facilitadores;
7. canal humano de suporte;
8. versão e texto do notice;
9. possibilidade ou não de capturas com dados pessoais;
10. regra de retenção específica das evidências;
11. limiares de usabilidade;
12. critérios para repetir ou encerrar o ciclo;
13. quem pode homologar além do master, se houver exigência institucional;
14. uso futuro ou não dos resultados na investigação;
15. revisão de DPO/ética quando aplicável.

## Regra de implementação

O sistema deve representar essas lacunas como:

- `pending`;
- `blocked`;
- `decision-required`;
- campos configuráveis.

Não preencher com exemplos que pareçam decisões reais.
