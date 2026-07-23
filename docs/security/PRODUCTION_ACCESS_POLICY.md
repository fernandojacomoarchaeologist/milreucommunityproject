---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "05F"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Política de acesso a produção

## Padrão

Produção é **read-only por defeito** para Claude e para sessões locais.

## Escrita permitida

Apenas quando todos os pontos forem verdadeiros:

- alteração representada por migration no Git;
- testes concluídos;
- ticket preenchido;
- rollback documentado;
- utilizador pediu explicitamente o deployment;
- workflow manual acionado;
- ambiente GitHub `production` aprovado por reviewer;
- confirmação literal correta.

## Proibido

- SQL remoto ad hoc;
- uso de dashboard para contornar migration;
- service role no browser;
- impressão de secrets;
- alteração destrutiva sem backup;
- manipulação direta de dados reais por Claude;
- bypass dos gates em nome de urgência.

## Consultas

Preferir:

- views públicas;
- views administrativas mínimas;
- queries parametrizadas;
- resultados agregados;
- anonimização.
