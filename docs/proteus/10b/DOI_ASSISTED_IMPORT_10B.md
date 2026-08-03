<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Importação assistida por DOI

## Fluxo

1. validar e normalizar o DOI;
2. verificar duplicidade local;
3. consultar fonte bibliográfica configurada, preferencialmente Crossref;
4. guardar resposta mínima necessária, fonte, timestamp e estado do pedido;
5. mapear para `ImportDraft`, preservando campos originais relevantes;
6. apresentar diferenças e avisos ao revisor;
7. exigir confirmação humana para criar/atualizar obra e autores;
8. avaliar direitos separadamente antes de publicar.

## Limites

- sem chave ou scraping de páginas protegidas;
- sem download automático de PDF;
- sem assumir que URL de texto integral autoriza armazenamento;
- sem criar biografia a partir de afiliação do artigo;
- sem sobrescrever campos revistos silenciosamente;
- timeouts, rate limits e indisponibilidade produzem erro recuperável;
- testes usam mocks/fixtures sintéticas, nunca dependem da rede real.

O importador pode ser implementado na superfície editorial existente ou como adaptador isolado coerente com o repositório. Não criar novo papel; reutilizar autorização editorial existente e negar por defeito.
