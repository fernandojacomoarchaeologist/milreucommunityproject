<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Metadados, partilha e dados estruturados

## Metadados por rota

Definir `title`, `description`, canonical, robots, locale e imagem social para cada rota indexável. Textos devem descrever conteúdo visível e publicado, sem linguagem de instrução ao Claude, promessas não entregues ou palavras-chave artificiais.

## Partilha social

- `og:title`, `og:description`, `og:url`, `og:type`, `og:locale` e imagem coerentes com a rota.
- Twitter Card equivalente, sem divergência editorial.
- Imagem social existente e autorizada; registar dimensões, MIME, bytes, crédito, direitos e alt. Não criar uma imagem nova por inferência.
- Previews não podem depender de autenticação ou execução tardia de JavaScript.

## JSON-LD

Usar apenas tipos Schema.org sustentados pelo conteúdo e documentação existentes. Identificadores devem ser estáveis e URLs absolutas. Um objeto por página ou grafo pequeno é preferível a marcação extensa sem evidência. Validar sintaxe e consistência com o texto visível. Não incluir avaliações, eventos, preços, horários, autores, parceiros ou estatuto institucional não comprovados.
