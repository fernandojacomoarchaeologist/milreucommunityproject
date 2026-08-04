<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Prompt de execução — Pacote 10C

Trabalha no repositório do Projeto Milreu e implementa o Pacote 10C em PR isolado.

## Preflight bloqueante

Confirma exatamente: `main@0ceda77`, versão `v0.37.1`, `currentPackage 10B.1`, árvore limpa e nenhum PR conflitante. Se o SHA diferir por merges posteriores legítimos, prova que o 10B.1 está no ancestral do `main`, regista o SHA efetivo e pede confirmação antes de alterar. Não empilhes sobre branch anterior.

## Objetivo

Criar a estrutura funcional, testada e static-first para representar afirmações, evidências localizadas, entidades, relações epistémicas, revisão, proveniência e mapeamento CIDOC CRM. Preserva os contratos e decisões dos 10A, 10B e 10B.1.

## Regras absolutas

1. Não inventar afirmações, autores, páginas, citações, datas, entidades ou interpretações reais.
2. Não ler nem processar PDFs para produzir conteúdo histórico; isso pertence ao 10C.1.
3. Não expor manuscrito, Anexo A ou texto integral restrito.
4. Não implementar OCR, embeddings, RAG, chat, API ou MCP.
5. Não criar migration, papel ou permissão se a persistência/RLS não puder ser provada no CI.
6. Não transformar confiança em probabilidade automática de verdade.
7. Não apagar conflitos: fontes divergentes permanecem visíveis e citáveis.
8. Não usar CIDOC CRM como formulário editorial; implementar uma camada de mapeamento separada.
9. Tudo que chega ao público exige estado `published`, evidência válida, direitos compatíveis e revisão humana aprovada.
10. Conteúdo vazio deve ser apresentado honestamente; não usar fixtures históricas públicas.

## Implementação mínima

- contratos equivalentes aos schemas deste pacote;
- adaptadores/validadores puros e testáveis;
- snapshot público inicialmente vazio;
- rotas ou componentes para lista/ficha de afirmação e entidades apenas se coerentes com a arquitetura;
- visualização explícita de tipo epistémico, fontes, localização, revisão e divergência;
- `noindex`/ausência de JSON-LD para rascunhos, retirados e inexistentes;
- mapeamento CIDOC exportável e validado, sem afirmar conformidade CIDOC integral;
- testes unitários, integração e E2E proporcionais à implementação;
- atualização de versão para `v0.38.0` e `currentPackage 10C` apenas se todos os critérios passarem.

## Entrega

Relata preflight, decisões, ficheiros, testes, limitações e pendências. Abre PR sem merge automático. O diff deve ser apenas do 10C.

