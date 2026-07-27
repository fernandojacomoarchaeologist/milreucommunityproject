---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08N"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Correções do carrossel principal e media

## Problemas reportados

1. tamanhos diferentes entre Museu de Memórias, Experiência Proteus e Inquérito 2026;
2. imagem do Inquérito 2026 com linha azul no topo;
3. carrossel não avança sozinho.

## Resultado esperado

### Consistência de tamanho
Os três itens do carrossel devem partilhar o mesmo enquadramento visual e ocupar o mesmo espaço útil, sem saltos de altura.

### Imagem do Inquérito 2026
A imagem deve ser recortada para:

- remover a linha azul do topo;
- preencher a área prevista;
- manter legibilidade e enquadramento adequado.

### Avanço automático
O carrossel deve:

- iniciar avanço automático;
- continuar com controlos manuais;
- pausar em contexto de interação, quando adequado;
- respeitar acessibilidade e evitar comportamento intrusivo.

## Abordagem recomendada

- padronizar ratio/conteiner dos slides;
- usar crop controlado e consistente;
- evitar distorção da imagem;
- garantir que o texto e CTA continuam legíveis.

## Acessibilidade

- navegação por teclado;
- indicadores ou controlos acessíveis;
- pausa em focus/hover quando aplicável;
- contraste preservado;
- sem mudanças bruscas de layout.
