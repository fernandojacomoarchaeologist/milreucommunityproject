<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Imagens responsivas

- fornecer variantes que correspondam a larguras reais, sem ampliar acima do original;
- definir `srcset` com descritores coerentes e `sizes` baseado no layout, não em palpites;
- manter fallback suportado e MIME/extensão corretos;
- declarar dimensões intrínsecas ou proporção para reservar espaço;
- `loading=lazy` e baixa prioridade apenas fora da dobra;
- candidato LCP: carregamento imediato e prioridade elevada somente após comprovação;
- não pre-carregar todos os slides ou todas as imagens do Museu;
- preservar foco semântico por breakpoint e validar crop manualmente.

Poster/cartaz com texto essencial deve ter equivalente textual acessível; `alt` não deve tentar transcrever um documento inteiro.
