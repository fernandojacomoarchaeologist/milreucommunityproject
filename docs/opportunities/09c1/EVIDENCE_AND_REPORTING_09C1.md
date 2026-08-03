---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "09C.1"
---

# Evidências e relatório

## Evidências mínimas

- matriz requisito × implementação × teste × evidência;
- execução E2E completa com candidato e master;
- testes RLS por perfil e testes negativos;
- screenshots atuais, posteriores ao 09D, em desktop e mobile;
- vídeo curto opcional da jornada, sem dados pessoais;
- lista de ficheiros alterados;
- módulos, permissões, migrations e tabelas antes/depois;
- chaves i18n e estados de tradução preservados;
- confirmação de ausência de dados fictícios visíveis;
- resultado de build, contratos, unitários, integração, Playwright e acessibilidade.

## Linguagem do relatório

Separar expressamente:

- implementado e testado localmente;
- testado contra backend real de teste/staging;
- demonstrado apenas por fixture ou mock;
- não testado;
- bloqueado por configuração ou decisão humana;
- disponível em produção.

Não usar “jornada completa”, “operacional” ou “homologado” se uma etapa depender de link demonstrativo, operação manual em SQL, mock, snapshot vazio ou futura configuração.

Dados de teste devem ser sintéticos, isolados por prefixo e removidos com cleanup seguro. Nunca usar pessoas reais nas evidências.
