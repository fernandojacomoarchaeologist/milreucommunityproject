<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Fluxo editorial e auditoria

Estados: `draft`, `in_review`, `published`, `withdrawn`, `rejected`. Transições devem ser validadas; apenas registos publicados entram nas páginas públicas, sitemap e dados estruturados.

## Revisão de obra

- conferir identidade e duplicidade;
- validar autores e ordem;
- conferir metadados com a fonte;
- avaliar direitos por dimensão;
- rever slug, idioma e ligação pública;
- registar revisor, data e decisão;
- publicar apenas com requisitos mínimos completos.

## Auditoria

Guardar ator, instante, ação, entidade, estado anterior/posterior e motivo. Não guardar segredos, PDFs ou resposta externa integral quando desnecessária. A interface pública nunca expõe auditoria interna.

Se não houver autorização editorial existente compatível, implementar apenas leitura e rascunho local/contratual e registar o bloqueio. Não criar papel nem elevar privilégios no 10B.
