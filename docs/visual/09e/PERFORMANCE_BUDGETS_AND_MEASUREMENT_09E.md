<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Budgets e medição

Medir antes e depois no mesmo build, rota, viewport, throttling e estado de cache. Executar três rondas e comparar medianas. Guardar ambiente e limitações.

Guardrails iniciais para rotas públicas representativas:

- LCP móvel ≤ 2,5 s quando o ambiente controlado permitir;
- CLS ≤ 0,10;
- nenhuma imagem raster entregue com largura muito superior ao slot;
- zero fontes declaradas com 404 ou tipo inválido;
- zero imagens sem dimensões/proporção quando participam do layout;
- regressão de bytes por rota: deve ser justificada se >5%;
- não aumentar pedidos/preloads sem benefício mensurável.

Se o baseline já exceder um guardrail e o pacote não o puder resolver com segurança, reduzir comprovadamente e registar pendência; não falsificar aprovação.
