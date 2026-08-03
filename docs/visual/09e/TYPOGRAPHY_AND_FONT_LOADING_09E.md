<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Tipografia e carregamento

Inventariar CSS, tokens, imports, ficheiros, pesos, estilos, subconjuntos e fonte computada nas páginas-chave. Verificar Fraunces, Spectral e Archivo sem as impor por nome.

Cada `@font-face` deve declarar família, estilo, peso e formato reais. Não declarar intervalos variáveis para ficheiros estáticos. Evitar síntese com `font-synthesis` quando não houver faces correspondentes. Definir fallback legível e métrico para reduzir salto de layout.

Usar preload somente para faces comprovadamente críticas na primeira dobra; manter as demais sob carregamento normal. Testar cold cache, fonte bloqueada e ausência de JavaScript. Documentar fonte anterior, decisão e resultado computado.
