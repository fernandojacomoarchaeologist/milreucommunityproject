<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Mapeamento inicial para CIDOC CRM

O mapeamento é pragmático e não declara conformidade integral. O modelo editorial permanece a fonte operacional; a camada CIDOC serve exportação e interoperabilidade.

Ponto de partida:

- afirmação/proposição: aproximação a `E13 Attribute Assignment` e/ou `E33 Linguistic Object`, conforme contexto;
- pessoa/grupo: `E21 Person` / `E74 Group`;
- lugar: `E53 Place`;
- objeto físico: `E22 Human-Made Object` ou classe mais adequada após revisão;
- evento: `E5 Event`;
- período: `E4 Period`;
- documento: `E31 Document`;
- recurso digital: `D1 Digital Object` apenas se a extensão CRMdig estiver adotada; caso contrário, declarar o perfil usado.

Cada mapeamento inclui termo local, URI CIDOC, tipo (exato, mais amplo, mais estreito, relacionado), justificação, versão do CRM e estado de revisão. Não inventar propriedades para forçar equivalência. Mapeamentos ambíguos ficam pendentes.

