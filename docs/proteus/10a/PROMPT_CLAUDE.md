<!-- © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md. -->

# Prompt de integração — 10A

Integra o Pacote 10A somente depois de confirmar que 09F foi integrado no `main`. Descobre e regista o SHA real, versão, `currentPackage`, CI e inventários de preservação. Não uses `95776ed` como base: esse é o commit anterior ao processamento de 09F.

## Missão

Inaugura a Experiência Proteus como infraestrutura pública de conhecimento sobre Milreu. Implementa apenas a fundação documental e, se coerente com a arquitetura existente, uma superfície pública mínima de apresentação/estado futuro. O resultado deve tornar as políticas auditáveis no repositório sem simular catálogo, chat, MCP ou conteúdos que ainda não existem.

## Preflight bloqueante

1. Confirmar 09F merged, SHA, versão, CI verde e working tree limpa.
2. Ler políticas existentes de privacidade, RLS, i18n, SEO, direitos de media e produção.
3. Inventariar qualquer rota ou placeholder Proteus já existente; preservar navegação e estados vazios honestos.
4. Confirmar contagens reais de módulos/permissões/migrations; não repetir números históricos como verdade atual.
5. Procurar documentos, segredos ou conteúdo protegido já presentes. Não os copiar nem expor; relatar localização e tratamento seguro.

## Implementação permitida

- Documentação normativa versionada em `docs/proteus/` ou equivalente existente.
- Contratos JSON/schema versionados, sem dados reais protegidos.
- Página pública mínima “Experiência Proteus” apenas se já houver rota/placeholder previsto, explicando propósito, fontes, confiança, direitos e estado futuro.
- Ligações públicas verificadas para recursos institucionais, sempre com fornecedor e direitos separados do Proteus.
- Testes automatizados de contratos, ausência de segredos/conteúdo integral, linguagem honesta e não indexação de estados privados.

## Proibições

Não criar ingestão, OCR, embeddings, vector store, RAG, LLM, chat, API, endpoint MCP, ferramentas MCP, OAuth, novo perfil, nova permissão ou migration. Não importar Hauschild/Teichner nem qualquer PDF. Não copiar modelos 3D, imagens ou visita virtual. Não afirmar autorização jurídica. Não ativar produção. Não publicar traduções não revistas.

## Regra de direitos

Implementa a separação entre: posse/acesso lícito; armazenamento; processamento; indexação interna; síntese pública; citação; redistribuição; treino; disponibilização a agentes. Um “sim” numa dimensão nunca implica “sim” noutra. Estado desconhecido resulta em negação por defeito para processamento e publicação.

## Regra de confiança

Toda saída futura deve distinguir facto documentado, interpretação atribuída, hipótese, memória/testemunho e desconhecido. Respostas públicas exigem fontes publicáveis, localização na fonte quando disponível, revisão e data. Divergência deve ser preservada. Ausência de evidência deve produzir recusa ou resposta limitada.

## Entrega

Executa validate/test/build/CI. Cria branch e PR sem merge automático. Atualiza para `0.36.0` / `10A` apenas com critérios cumpridos. Relata base real, ficheiros, rotas, inventários, zero migrations/permissões, eventual módulo único, decisões pendentes e prova de que nenhum documento restrito ou servidor MCP foi introduzido.
