<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Modelo do catálogo bibliográfico

## Entidades mínimas

`Work`: obra intelectual e respetivos metadados. `Author`: identidade pública normalizada. `WorkAuthor`: autoria e ordem. `RightsRecord`: avaliação granular e datada. `ImportDraft`: captura de metadados ainda não aprovada.

## Campos essenciais da obra

- identificador interno estável e slug não derivado exclusivamente do título;
- título, subtítulo e título alternativo;
- tipo documental controlado;
- autores ordenados e papéis;
- data/ano com precisão explícita;
- publicação, volume, número, páginas, editora e local quando aplicáveis;
- idiomas;
- DOI/ISBN/ISSN/URL normalizados;
- referência de origem e data de verificação;
- resumo apenas quando fornecido legalmente pela fonte e marcado com proveniência;
- estado editorial e estado de acesso;
- datas de criação, revisão, publicação e atualização.

## Regras

- DOI único após normalização, admitindo ausência;
- duplicidade potencial gera revisão, nunca merge automático;
- valores ausentes permanecem ausentes; não preencher por plausibilidade;
- edição, tradução e manifestação não devem ser colapsadas numa única obra sem decisão documentada;
- datas incertas mantêm precisão e nota, sem fabricar dia/mês;
- exclusão lógica preserva auditoria; retirada pública não apaga necessariamente o registo interno.

O modelo deve ser compatível com futura relação a claims no 10C, sem implementar claims agora.
