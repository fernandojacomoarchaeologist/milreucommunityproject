---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "08L"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Arquitetura de integração pública

## Regra principal

O Portal e o Museu consomem apenas um snapshot público aprovado. Nenhuma vista pública deve consultar diretamente:

- perfis;
- participantes;
- feedback;
- evidências privadas;
- rascunhos;
- observações;
- decisões internas;
- storage privado.

## Pipeline

```text
origem canónica elegível
→ proposta
→ validação de referências
→ revisão editorial
→ revisão de direitos/créditos
→ revisão de privacidade
→ revisão de tradução
→ revisão de acessibilidade
→ preview em staging
→ aprovação de ativação
→ snapshot público
→ deploy ou leitura pública controlada
```

## Estratégia recomendada

Usar o padrão já consolidado de snapshots públicos:

- gerar payload determinístico;
- remover campos privados;
- validar schema;
- calcular checksum;
- guardar versão;
- permitir export para Git apenas após aprovação;
- permitir leitura pública somente do snapshot ativo;
- manter fallback quando não houver snapshot.

## Origem permitida

- memória elegível;
- coleção;
- evento público;
- oportunidade pública;
- chamada para contributos;
- percurso de participação público;
- resultado agregado aprovado;
- texto editorial próprio.

## Origem proibida sem transformação e aprovação

- perfil;
- membership;
- feedback individual;
- evidência;
- nota de facilitador;
- observação de piloto;
- incidente;
- auditoria;
- informação de contacto;
- consentimento;
- dados de disponibilidade;
- histórico individual.

## Preview

O preview deve:

- usar staging;
- incluir identificação visível de preview;
- impedir indexação;
- impedir partilha acidental de URL privada quando aplicável;
- apresentar idioma e fallback;
- mostrar créditos, direitos e datas;
- permitir revisão a 375, 768 e 1280 px;
- permitir teclado e leitor de ecrã;
- guardar aprovação humana.

## Ativação

A ativação:

- é separada da aprovação editorial;
- exige permissão específica;
- exige todos os gates;
- cria registo imutável;
- permite agendamento quando aprovado;
- nunca ativa uma proposta expirada ou suspensa;
- nunca publica diretamente dados de staging.
